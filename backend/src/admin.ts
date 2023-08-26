import { prisma } from './data';
import createHTTPError from 'http-errors';
import { User, UserList } from './types';
import { validateSession } from './utils';

export const adminGetUsers = async (token: string): Promise<UserList> => {
  // Validate session
  const user = (await validateSession(token)).user;

  // Ensure user is admin
  if (!user.isAdmin)
    throw new createHTTPError.Forbidden('User is not a site admin');

  // Return the list of users
  return {
    users: await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nameFirst: true,
        nameLast: true,
        zId: true,
        isAdmin: true,
      },
    }),
  };
};

// This function is not used in the frontend API, it is instead used by the backend to "whitebox" test users
export const adminGetUserByZid = async (zId: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { zId: zId } });
  if (!user) throw new createHTTPError.BadRequest('Invalid zId');

  return {
    id: user.id,
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    zId: user.zId,
    isAdmin: user.isAdmin,
  };
};

export const adminApplicationApprove = async (
  token: string,
  applicationId: number,
): Promise<{ societyId: number }> => {
  // Validate session
  const session = await validateSession(token);

  // Make sure user is admin
  if (!session.user.isAdmin)
    throw new createHTTPError.Forbidden('User is not a site admin');

  // Verify applicationId is real and not already approved
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!application || application.status === 'approved')
    throw new createHTTPError.BadRequest('Invalid applicationId');

  // Create society
  const society = await prisma.society.create({
    data: {
      name: application.name,
      description: application.description,
      photoURL: application.photoURL,
      members: {
        create: { userId: application.applicantId, role: 'admin' }, // Applicant becomes the admin
      },
    },
  });

  // Set application to approved
  await prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status: 'approved',
    },
  });
  return { societyId: society.id };
};

export const adminApplicationDeny = async (
  token: string,
  applicationId: number,
): Promise<{}> => {
  // Validate session
  const user = (await validateSession(token)).user;

  // Make sure user is admin
  if (!user.isAdmin)
    throw new createHTTPError.Forbidden('User is not a site admin');

  // Verify applicationId is real and if it is update it
  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'denied' },
    });
  } catch (error) {
    throw new createHTTPError.BadRequest('Invalid Application ID');
  }

  return {};
};

export const adminApplicationList = async (token: string) => {
  // validate session
  const session = await validateSession(token);

  // Ensure isAdmin
  if (!session.user.isAdmin)
    throw new createHTTPError.Forbidden('User is not a site admin');

  // Get list
  const apps = await prisma.application.findMany({
    where: {},
    select: {
      id: true,
      name: true,
      description: true,
      applicantId: true,
      status: true,
    },
  });

  // Reformat the returned database select into the required query
  const ret: {}[] = [];
  apps.forEach((app) =>
    ret.push({
      applicationId: app.id,
      name: app.name,
      description: app.description,
      applicantId: app.applicantId,
      status: app.status,
    }),
  );
  return { applications: ret };
};

export const adminUserRemove = async (
  token: string,
  userId: number,
): Promise<{}> => {
  // validate session
  const admin = (await validateSession(token)).user;

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new createHTTPError.BadRequest('Invalid userId');

  // Check if the token user is a siteAdmin:
  if (!admin.isAdmin)
    throw new createHTTPError.Forbidden('Insufficient permissions');

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {};
};
