import { prisma } from './data';
import { configDotenv } from 'dotenv';
import createHTTPError from 'http-errors';
import ical from 'ical-generator';
import fs from 'fs';

configDotenv();
/**
 * Attempts to find a session associated with the provided string
 * @param token
 * @returns Session Prisma Object if found
 * @throws 401 'Invalid Token'
 */
export const validateSession = async (token: string) => {
  const session = await prisma.session.findUnique({
    where: { id: token },
    include: {
      user: true,
    },
  });
  if (!session) throw new createHTTPError.Unauthorized('Invalid token');
  return session;
};

export const validateSocietyName = async (
  societyName: string,
  societyId?: number,
): Promise<boolean> => {
  // Allow society to not change their name
  if (
    societyId !== undefined &&
    (await prisma.society.findFirst({
      where: { name: societyName, id: societyId },
    }))
  )
    return true;

  if (
    !societyName ||
    societyName.length > 100 ||
    societyName.length < 1 ||
    !/^[a-zA-Z0-9 ]+$/.test(societyName) ||
    (await prisma.society.findUnique({ where: { name: societyName } }))
  )
    throw new createHTTPError.BadRequest('Invalid society name');

  return true;
};

/**
 *
 * Need to regenerate individual ical when:
 *  - When account is created
 *  - Attending event
 *  - Unattending event
 *
 * FOR ALL ATTENDEES:
 *  - Details change
 *  - Event deleted
 *
 * @param userId
 * @returns
 */
export const generateICal = async (userId: number): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      attending: {
        select: {
          event: {
            include: {
              society: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const calendar = ical({ name: `${user.zId}'s Events` });
  user.attending
    .map((event) => event.event)
    .forEach((event) => {
      const startTime = event.time;

      // For now we are setting each hour to be 1 hour
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      calendar.createEvent({
        start: startTime,
        end: endTime,
        summary: event.name,
        description: `${event.society.name}:\n ${event.description}`,
        location: event.location,
      });
    });

  /* This line is ignored, due to the nature of no blackbox testing available */
  /* istanbul ignore next */
  if (!fs.existsSync('./cals')) fs.mkdirSync('./cals');
  calendar.saveSync(`./cals/${user.zId}.ics`);
  return;
};

/**
 * Returns the the path to a user's ics file, based on their zId
 * @param zId
 * @returns
 */
export const webcalPath = (zId: string) => {
  return `/calendar/${zId}.ics`;
};
