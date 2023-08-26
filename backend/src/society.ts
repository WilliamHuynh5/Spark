import { prisma } from './data';
import createHTTPError from 'http-errors';
import { SocMember, Society, Events, SocMembers, Societies } from './types';
import { validateSession, validateSocietyName } from './utils';

export const societyApply = async (
  token: string,
  societyName: string,
  description: string
): Promise<{ applicationId: number }> => {
  // Validate session
  const user = (await validateSession(token)).user;

  // Validate societyname
  await validateSocietyName(societyName);

  // Create application
  const application = await prisma.application.create({
    data: {
      name: societyName,
      description: description,
      applicant: { connect: { id: user.id } },
    },
  });

  // return id
  return { applicationId: application.id };
};

export const societyJoin = async (
  token: string,
  societyId: number
): Promise<{}> => {
  // Check if the session exists
  const session = await prisma.session.findUnique({
    where: { id: token },
  });
  if (!session) throw new createHTTPError.Unauthorized('Invalid token');

  // Check if the society exists
  const society = await prisma.society.findUnique({
    where: { id: societyId },
  });
  if (!society) throw new createHTTPError.BadRequest('Invalid societyId');

  // Upsert will insert if it doesn't exist (unique: userId & societyId), otherwise it does nothing as it already exists
  await prisma.societyMember.upsert({
    where: {
      userId_societyId: { userId: session.userId, societyId: societyId },
    },
    update: {},
    create: {
      userId: session.userId,
      societyId: societyId,
    },
  });

  return {};
};

export const societyView = async (societyId: number): Promise<Society> => {
  // Make sure society exists
  const society = await prisma.society.findUnique({
    where: { id: societyId },
  });
  if (!society) throw new createHTTPError.BadRequest('Invalid societyId');

  return {
    societyId: society.id,
    societyName: society.name,
    description: society.description,
    photoURL: society.photoURL,
  };
};

export const societyEdit = async (
  token: string,
  societyId: number,
  societyName: string,
  description: string
) => {
  // Validated session
  const user = (await validateSession(token)).user;

  // Validate SocietyId
  if (!(await prisma.society.findUnique({ where: { id: societyId } })))
    throw new createHTTPError.BadRequest('Society does not exist');

  // Check permission level within society (and site)
  const societyMember = await prisma.societyMember.findUnique({
    where: {
      userId_societyId: {
        userId: user.id,
        societyId: societyId,
      },
    },
  });

  if (!user.isAdmin)
    if (!societyMember || societyMember.role !== 'admin')
      throw new createHTTPError.Forbidden('Insufficient permisisons');

  // Validate societyname
  await validateSocietyName(societyName, societyId);

  // Update the society's details
  await prisma.society.update({
    where: { id: societyId },
    data: {
      name: societyName,
      description,
    },
  });

  return {};
};

export const societyMembers = async (
  societyId: number
): Promise<SocMembers> => {
  // Anyone can list members of a society
  const members = await prisma.societyMember.findMany({
    where: {
      societyId: societyId,
    },
    include: {
      user: {
        select: {
          id: true,
          zId: true,
          nameFirst: true,
          nameLast: true,
        },
      },
    },
  });

  // Update the DB's select to match the required interface
  const societyMembers: SocMember[] = [];
  for (const member of members) {
    societyMembers.push({
      userId: member.userId,
      zId: member.user.zId,
      nameFirst: member.user.nameFirst,
      nameLast: member.user.nameLast,
      role: member.role,
    });
  }
  return { members: societyMembers };
};

export const societyEvents = async (societyId: number): Promise<Events> => {
  // Anyone can list the events of a society
  const time = new Date();

  await prisma.society
    .findUniqueOrThrow({
      where: {
        id: societyId,
      },
    })
    .catch((err) => {
      console.log(err);
      throw new createHTTPError.BadRequest('Invalid SocietyId');
    });

  // Grab all events of a society that are "upcoming"
  // User story, we only want to display upcoming events on a society page as they old events are displayed on other
  // pages using different routes.
  const events = (
    await prisma.event.findMany({
      where: {
        societyId: societyId,
        time: { gte: time },
      },
      orderBy: [
        { time: 'asc' },
        { name: 'asc' },
        { description: 'asc' },
        { id: 'asc' },
      ],
    })
  ).map((event) => {
    return {
      eventId: event.id,
      name: event.name,
      description: event.description,
      time: event.time,
      location: event.location,
      societyId: societyId,
    };
  });
  return { events };
};

export const societyList = async (
  searchString?: string,
  paginationStart?: number,
  paginationEnd?: number
): Promise<Societies> => {
  // no need to validate permissions

  // Default empty query condition
  let filters = [];

  // Add the optional searchString condition to the query
  if (searchString) {
    filters.push({
      OR: [
        { name: { contains: searchString } },
        { description: { contains: searchString } },
      ],
    });
  }

  // Query the DB for the events that match the given conditions
  const socs = await prisma.society.findMany({
    where: { AND: filters },
    select: {
      id: true,
      name: true,
      description: true,
      photoURL: true,
    },
    orderBy: [{ name: 'asc' }, { description: 'asc' }, { id: 'asc' }],
  });

  // Map the societies to the correct required interface
  let retSocs = socs.map((x) => {
    return <Society>{
      societyId: x.id,
      societyName: x.name,
      ...x,
    };
  });

  // Grab a subarray for pagination
  if (paginationStart >= 0 && paginationEnd >= 0) {
    retSocs = retSocs.slice(paginationStart, paginationEnd);
  }

  return { societies: retSocs };
};

export const societyDelete = async (
  token: string,
  societyId: number
): Promise<{}> => {
  // Validate session
  const user = (await validateSession(token)).user;

  // Validate SocietyId
  const society = await prisma.society.findUnique({
    where: { id: societyId },
  });
  if (!society) throw new createHTTPError.BadRequest('Invalid societyId');

  // Check if the user is a siteAdmin
  if (!user.isAdmin)
    throw new createHTTPError.Forbidden('Insufficient permissions');

  // Delete the society
  await prisma.society.delete({
    where: {
      id: societyId,
    },
  });

  return {};
};
