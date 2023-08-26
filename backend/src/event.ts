import createHTTPError from 'http-errors';
import { prisma } from './data';
import { generateICal, validateSession } from './utils';
import { Event, Events } from './types';
import isEmail from 'validator/lib/isEmail';
import fs from 'fs';

export const createEvent = async (
  token: string,
  societyId: number,
  name: string,
  description: string,
  time: Date,
  location: string,
) => {
  // Validate token
  const user = (await validateSession(token)).user;

  // Check that society exists
  const society = await prisma.society
    .findUniqueOrThrow({
      where: { id: societyId },
      include: {
        members: true,
      },
    })
    .catch(() => {
      throw new createHTTPError.BadRequest('Society does not exist');
    });

  // Make sure the user had perms within society
  if (
    !society.members.find(
      (member) =>
        member.userId === user.id &&
        (member.role === 'admin' || member.role === 'moderator'),
    )
  )
    throw new createHTTPError.Forbidden('Insufficient permissions');

  // Create the event
  const event = await prisma.event.create({
    data: {
      societyId: societyId,
      name,
      description,
      time,
      location,
    },
  });

  return { eventId: event.id };
};

export const editEvent = async (
  token: string,
  eventId: number,
  name: string,
  description: string,
  time: Date,
  location: string,
): Promise<{}> => {
  // Validate token
  const user = (await validateSession(token)).user;

  // Check that the event exists
  const event = await prisma.event
    .findUniqueOrThrow({
      where: { id: eventId },
    })
    .catch(() => {
      throw new createHTTPError.BadRequest('Invalid eventId');
    });

  // Check that the user has permission to delete an event
  const society = await prisma.society.findUnique({
    where: { id: event.societyId },
    include: {
      members: true,
    },
  });

  if (
    !society.members.find(
      (member) =>
        member.userId === user.id &&
        (member.role === 'admin' || member.role === 'moderator'),
    )
  )
    throw new createHTTPError.Forbidden('Insufficient permissions');

  // Update the event and select all the Users who elected to attend that event
  const attendees = (
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name: name,
        description: description,
        time: time,
        location: location,
      },
      select: {
        attending: true,
      },
    })
  ).attending.map((user) => user.userId);

  // Regenerate the ical for all users
  attendees.forEach((id) => generateICal(id));

  return {};
};

export const deleteEvent = async (
  token: string,
  eventId: number,
): Promise<{}> => {
  // Validate token
  const user = (await validateSession(token)).user;

  // Check that the event exists
  const event = await prisma.event
    .findUniqueOrThrow({
      where: { id: eventId },
      include: {
        attending: true,
      },
    })
    .catch(() => {
      throw new createHTTPError.BadRequest('Invalid eventId');
    });

  // Check that the user has permission to delete an event
  const society = await prisma.society.findUnique({
    where: { id: event.societyId },
    include: {
      members: true,
    },
  });

  if (
    !(
      user.isAdmin ||
      society.members.find(
        (member) =>
          member.userId === user.id &&
          (member.role === 'admin' || member.role === 'moderator'),
      )
    )
  )
    throw new createHTTPError.Forbidden('Insufficient permissions');

  //select all the Users who elected to attend that event
  const attendees: number[] = event.attending.map((u) => u.userId);

  // Delete the event
  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  // Regenerate the ical for all attending Users
  attendees.forEach((uId) => generateICal(uId));

  return {};
};

export const getEvent = async (eventId: number): Promise<Event> => {
  // Select the event given the eventId
  const event = await prisma.event
    .findUniqueOrThrow({
      where: { id: eventId },
      select: {
        name: true,
        description: true,
        time: true,
        location: true,
        societyId: true,
      },
    })
    .catch((err) => {
      throw new createHTTPError.BadRequest('eventId is invalid');
    });

  return {
    eventId,
    ...event,
  };
};

export const attendEvent = async (
  token: string,
  eventId: number,
): Promise<{}> => {
  // Validate token
  const user = (await validateSession(token)).user;

  // Check if the event exists
  const event = await prisma.event
    .findUniqueOrThrow({
      where: { id: eventId },
    })
    .catch((err) => {
      throw new createHTTPError.BadRequest('eventId is invalid');
    });

  // Upsert will insert if it doesn't exist (unique: userId & eventId), otherwise it does nothing as it already exists
  await prisma.userAttending.upsert({
    where: {
      userId_eventId: { userId: user.id, eventId: eventId },
    },
    update: {},
    create: {
      userId: user.id,
      eventId: eventId,
    },
  });

  // Regenerate ical
  generateICal(user.id);

  return {};
};

export const unattendEvent = async (
  token: string,
  eventId: number,
): Promise<{}> => {
  // Validate token
  const user = (await validateSession(token)).user;

  // Check if the event exists
  const event = await prisma.event
    .findUniqueOrThrow({
      where: { id: eventId },
    })
    .catch((err) => {
      console.log(err);
      throw new createHTTPError.BadRequest('eventId is invalid');
    });

  // Check if the user is attending
  await prisma.userAttending
    .findUniqueOrThrow({
      where: { userId_eventId: { userId: user.id, eventId: eventId } },
    })
    .catch((err) => {
      throw new createHTTPError.BadRequest('User is not attending');
    });

  // Delete the attending election by the user
  await prisma.userAttending.delete({
    where: {
      userId_eventId: { userId: user.id, eventId: eventId },
    },
  });

  // Regenerate ical
  generateICal(user.id);

  return {};
};

export const eventStatus = async (
  token: string,
  eventId: number,
): Promise<{ attending: boolean }> => {
  // Validate token
  const user = (await validateSession(token)).user;

  // Check if the event exists
  const event = await prisma.event
    .findUniqueOrThrow({
      where: { id: eventId },
    })
    .catch((err) => {
      throw new createHTTPError.BadRequest('eventId is invalid');
    });

  // Grab the User's attending model
  const userAttending = await prisma.userAttending.findUnique({
    where: {
      userId_eventId: { userId: user.id, eventId: eventId },
    },
  });

  return { attending: !!userAttending };
};

export const getEvents = async (
  searchString?: string,
  timeStart?: string,
  timeEnd?: string,
  paginationStart?: number,
  paginationEnd?: number,
): Promise<Events> => {
  // Default empty query condition
  let filters = [];
  // Add the optional searchString condition to the query
  if (searchString) {
    filters.push({
      OR: [
        { name: { contains: searchString } },
        { description: { contains: searchString } },
        { location: { contains: searchString } },
      ],
    });
  }

  // Add the optional timeStart/timeEnd condition to the query
  if (timeStart) {
    filters.push({ time: { gte: new Date(timeStart) } });
  }
  if (timeEnd) {
    filters.push({ time: { lte: new Date(timeEnd) } });
  }

  // Query the DB for the events that match the given conditions
  const dbEvents = await prisma.event.findMany({
    where: { AND: filters },
    orderBy: [
      { time: 'asc' },
      { name: 'asc' },
      { description: 'asc' },
      { id: 'asc' },
    ],
  });

  // Map the events to the correct required interface
  let retEvents = dbEvents.map((x) => {
    return <Event>{
      eventId: x.id,
      ...x,
    };
  });

  // Grab a subarray for pagination
  console.log(retEvents);
  if (paginationStart >= 0 && paginationEnd >= 0) {
    retEvents = retEvents.slice(paginationStart, paginationEnd);
  }
  return { events: retEvents };
};

export const fillForm = async (
  eventId: number,
  nameFirst: string,
  nameLast: string,
  zId: string,
  email: string,
): Promise<{}> => {
  if (!isEmail(email)) throw new createHTTPError.BadRequest('Invalid email');

  // Validate eventId and record the attendance
  await prisma.form.upsert({
    where: { eventId_zId_email: { email, zId, eventId } },
    create: {
      eventId,
      zId,
      nameFirst,
      nameLast,
      email,
    },
    update: {},
  });

  // Check if zid matches a user, and record it
  // No need to await
  await prisma.user
    .update({
      where: {
        zId,
      },
      data: {
        attended: {
          create: {
            eventId: eventId,
          },
        },
      },
    })
    .catch((err) => {}); // We don't care about this error as it will occur when there is no user with the zId
  return {};
};

export const generateCSV = async (token: string, eventId: number) => {
  // Validate token
  const user = (await validateSession(token)).user;

  // Validate eventId
  const event = await prisma.event
    .findUniqueOrThrow({
      where: {
        id: eventId,
      },
      include: {
        society: {
          include: {
            members: true,
          },
        },
      },
    })
    .catch((err) => {
      console.log(err);
      throw new createHTTPError.BadRequest('EventId is invalid');
    });

  // Validate user permissions
  if (
    !user.isAdmin &&
    !event.society.members.find(
      (member) =>
        member.userId === user.id &&
        (member.role === 'admin' || member.role === 'moderator'),
    )
  )
    throw new createHTTPError.Forbidden('Invalid permissions');
  // Get all form data
  const forms = (
    await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        forms: true,
      },
    })
  ).forms;

  // Transform all data to CSV and save on backend
  /* This line is ignored, due to the nature of no blackbox testing available */
  /* istanbul ignore next */
  if (!fs.existsSync('./attendance')) fs.mkdirSync('./attendance');

  fs.writeFileSync(
    `./attendance/event-${eventId}.csv`,
    forms
      .map((e) => `${e.zId},${e.email},${e.nameFirst},${e.nameLast}`)
      .join('\n'),
  );
  return {};
};
