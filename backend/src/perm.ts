import { prisma } from './data';
import createHTTPError from 'http-errors';
import { validateSession } from './utils';

const ADMIN = 1;
const MODERATOR = 2;
const MEMBER = 3;

export const permSiteAllocate = async (
  token: string,
  userId: number,
  permLevel: number
): Promise<{}> => {
  // Check if the session exists
  const session = await prisma.session.findUnique({
    where: { id: token },
  });
  if (!session) throw new createHTTPError.Unauthorized('Invalid token');

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new createHTTPError.BadRequest('Invalid userId');

  // Check if the permLevel is 1 or 2
  if (!(permLevel === 1 || permLevel === 2))
    throw new createHTTPError.BadRequest('Invalid permLevel');

  // Check if the Admin is actually a siteAdmin
  const admin = await prisma.user.findUnique({
    where: { id: session.userId },
  });
  if (!admin?.isAdmin)
    throw new createHTTPError.Forbidden('User is not a site admin');

  // Update the user's permLevel
  await prisma.user.update({
    data: {
      isAdmin: permLevel === 1,
    },
    where: {
      id: userId,
    },
  });

  return {};
};

// This function converts the number from the API to a string that matches the database
const societyPermConverter = (permLevel: number): string => {
  switch (permLevel) {
    case ADMIN:
      return 'admin';
    case MODERATOR:
      return 'moderator';
    default:
      return 'member';
  }
};

// This function converts the string from the database to a number that matches the API
const societyPermReverter = (permLevel: string): number => {
  switch (permLevel) {
    case 'admin':
      return ADMIN;
    case 'moderator':
      return MODERATOR;
    default:
      // 'member' case
      return MEMBER;
  }
};

export const permSocietyAllocate = async (
  token: string,
  userId: number,
  societyId: number,
  permLevel: number
): Promise<{}> => {
  // Check if the session exists
  const sessionUser = (await validateSession(token)).user;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new createHTTPError.BadRequest('Invalid userId');

  // Check if the society exists
  const society = await prisma.society.findUnique({
    where: { id: societyId },
  });
  if (!society) throw new createHTTPError.BadRequest('Invalid societyId');

  // Check if the permLevel is 1 or 2 or 3
  if (!(permLevel === 1 || permLevel === 2 || permLevel === 3))
    throw new createHTTPError.BadRequest('Invalid permLevel');

  // Check if user is a member of the society
  const societyMember = await prisma.societyMember.findUnique({
    where: {
      userId_societyId: {
        userId: userId,
        societyId: societyId,
      },
    },
  });

  if (!societyMember)
    throw new createHTTPError.BadRequest('User is not a member of the society');

  // Check if the sessionUser is a siteAdmin
  if (!sessionUser.isAdmin) {
    // Check if the session user is a member of the society
    const sessionSocietyMember = await prisma.societyMember.findUnique({
      where: {
        userId_societyId: {
          userId: sessionUser.id,
          societyId: societyId,
        },
      },
    });

    if (!sessionSocietyMember)
      throw new createHTTPError.Forbidden(
        'Token user is not a member of the society'
      );

    const userPermLevel = societyPermReverter(societyMember.role);
    const tokenPermLevel = societyPermReverter(sessionSocietyMember.role);

    // Check if the Token User has permissions over the user
    if (tokenPermLevel > userPermLevel)
      throw new createHTTPError.Forbidden(
        'Token user does not have permission to manage this user'
      );

    // Check if the Token User can promote to this level of permLevel
    if (tokenPermLevel > permLevel)
      throw new createHTTPError.Forbidden(
        'Token user does not have permission to manage this permLevel'
      );
  }

  // Update the societyMember's role
  await prisma.societyMember.update({
    data: {
      role: societyPermConverter(permLevel),
    },
    where: {
      userId_societyId: {
        userId: userId,
        societyId: societyId,
      },
    },
  });

  return {};
};
