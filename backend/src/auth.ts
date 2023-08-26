import { prisma } from './data';
import createHTTPError from 'http-errors';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { generateICal, validateSession } from './utils';
interface Token {
  token: string;
}

export interface UserRegister {
  email: string;
  nameFirst: string;
  nameLast: string;
  password: string;
  zId: string;
}

export const authRegister = async (userReg: UserRegister): Promise<Token> => {
  // Check name only alphabets
  const nameRegex = new RegExp('^[a-zA-Z ]+$');

  if (!nameRegex.test(userReg.nameFirst))
    throw new createHTTPError.BadRequest('Invalid first name');
  if (!nameRegex.test(userReg.nameLast))
    throw new createHTTPError.BadRequest('Invalid last name');

  // Check zId is valid format
  if (!/^z[0-9]{7}$/.test(userReg.zId))
    throw new createHTTPError.BadRequest(
      `zId format is incorrect ${userReg.zId}`,
    );

  // Names should be put toLower
  userReg.nameFirst = userReg.nameFirst.toLowerCase();
  userReg.nameLast = userReg.nameLast.toLowerCase();
  // Check unique email and zid
  if (await prisma.user.findUnique({ where: { zId: userReg.zId } }))
    throw new createHTTPError.BadRequest('Invalid zId');

  // Emails should all be put toLower first
  userReg.email = userReg.email.toLowerCase();
  if (
    !validator.isEmail(userReg.email) ||
    (await prisma.user.findUnique({ where: { email: userReg.email } }))
  )
    throw new createHTTPError.BadRequest('Invalid Email');

  // Handle first user is admin case
  const firstUser = !(await prisma.user.findFirst());

  // Not going to bother checking if the email is able to recieve mail
  // Add user to database. Also creates a session
  const user = await prisma.user.create({
    data: {
      ...userReg, // This expands the existing object to its properties, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals
      password: await bcrypt.hash(userReg.password, await bcrypt.genSalt()), // Here to overwrite unhashed value
      isAdmin: firstUser,
      activeSessions: {
        create: {}, // This will populate it with a session (I hope)
      },
    },
    include: {
      // Include specifies what the output should include, so we can avoid expensive operations to get useless data
      activeSessions: {
        select: {
          id: true,
        },
      },
    },
  });

  // Create ical
  generateICal(user.id);

  return { token: user.activeSessions[0].id };
};

export const authLogin = async (email: string, password: string) => {
  // validate credentials
  const user = await prisma.user.findUnique({ where: { email: email } });

  // Need to then compare passwords
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new createHTTPError.BadRequest('Invalid Credentials');
  const session = await prisma.session.create({
    data: {
      userId: user.id,
    },
  });

  return { token: session.id };
};

export const authLogout = async (token: string) => {
  // validate token
  await validateSession(token);

  // Remove the user's token from current sessions
  await prisma.session.delete({
    where: {
      id: token,
    },
  });
  return {};
};
