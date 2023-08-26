import createHttpError from 'http-errors';
import { prisma } from './data';
import { ProfileSocieties, Society, UserProfile } from './types';
import { validateSession, webcalPath } from './utils';

export const profileView = async (token: string): Promise<UserProfile> => {
  // Validate session
  const user = (await validateSession(token)).user;

  // Find the societies this user is an admin for:
  const adminSocieties: number[] = (
    await prisma.societyMember.findMany({
      where: {
        userId: user.id,
        role: 'admin',
      },
      select: {
        societyId: true,
      },
    })
  ).map((obj) => obj.societyId);

  // Find the societies this user is a moderator for:
  const modSocieties = (
    await prisma.societyMember.findMany({
      where: {
        userId: user.id,
        role: 'moderator',
      },
      select: {
        societyId: true,
      },
    })
  ).map((obj) => obj.societyId);

  return {
    userId: user.id,
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    zId: user.zId,
    adminSocieties,
    modSocieties,
    isSiteAdmin: user.isAdmin,
    webcal: webcalPath(user.zId),
  };
};

export const profileEdit = async (
  token: string,
  nameFirst: string,
  nameLast: string,
  email: string
) => {
  // validate session
  const user = (await validateSession(token)).user;

  // Make sure email doesn't already exist
  await prisma.user
    .update({
      where: { id: user.id },
      data: { nameFirst, nameLast, email },
    })
    .catch((err) => {
      console.log(err);
      throw new createHttpError.BadRequest('Invalid email address');
    });

  // This will return the edited profile
  return await profileView(token);
};

export const profileEvents = async (token: string) => {
  // Validate session
  const user = (await validateSession(token)).user;

  return {
    // Get all events the user is attending
    attending: (
      await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          attending: {
            select: {
              event: true,
            },
          },
        },
      })
    ).attending.map((a) => {
      const { id, ...ret } = { ...a.event, eventId: a.event.id };
      return ret;
    }),

    // Get all events the user it attending
    attended: (
      await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          attended: {
            select: {
              event: true,
            },
          },
        },
      })
    ).attended.map((a) => {
      const { id, ...ret } = { ...a.event, eventId: a.event.id };
      return ret;
    }),
  };
};

export const profileSocieties = async (
  token: string
): Promise<ProfileSocieties> => {
  // Validate session
  const user = (await validateSession(token)).user;

  // Find all the societies a User has joined
  return {
    societies: (
      await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          societies: {
            select: {
              society: true,
            },
          },
        },
      })
    ).societies.map((s) => {
      const { id, name, ...ret } = {
        ...s.society,
        societyId: s.society.id,
        societyName: s.society.name,
      };
      return ret;
    }),
  };
};
