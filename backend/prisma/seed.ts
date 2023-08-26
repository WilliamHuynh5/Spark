import { PrismaClient } from '@prisma/client';
import { authRegister } from '../src/auth';
import {
  societyApply,
  societyEvents,
  societyJoin,
  societyList,
  societyView,
} from '../src/society';
import { adminApplicationApprove, adminApplicationDeny } from '../src/admin';
import { UserRegister } from '../src/types';
import { createEvent } from '../src/event';
import { permSocietyAllocate } from '../src/perm';
import { profileView } from '../src/profile';
const prisma = new PrismaClient();

/* This file is used to seed the database, not a user story or sprint functionality, but very useful for developer testing */
async function main() {
  // ------------------------------------------------------------------------
  // First user overall is the site admin.
  // Second user overall is the applicant and admin of all societies created.
  // ------------------------------------------------------------------------
  const BASE_USERS = 3; // Must be >= 1. Note: Does not include admin + socadmin + socmmod user.
  const SOCIETIES = 10;
  const SITE_ADMIN_IS_SOC_ADMIN = false;
  const EVENTS_PER_SOC = 15;
  const socAdminIndex = SITE_ADMIN_IS_SOC_ADMIN ? 0 : 1;

  // Register 1 admin + BASE_USERS
  const users = [
    {
      email: 'admin@test.io',
      nameFirst: 'site',
      nameLast: 'admin',
      password: 'password',
      zId: 'z0000000',
    },
    {
      email: 'socadmin@test.io',
      nameFirst: 'soc',
      nameLast: 'admin',
      password: 'password',
      zId: 'z5111111',
    },
    {
      email: 'socmod@test.io',
      nameFirst: 'soc',
      nameLast: 'mod',
      password: 'password',
      zId: `z5222222`,
    },
  ];

  for (let n = 0; n < BASE_USERS; n++) {
    const email = `user${n}@test.io`;
    users.push({
      email,
      nameFirst: 'user',
      nameLast: 'name',
      password: 'password',
      zId: `z5${n.toString().padStart(6, '0')}`,
    });
  }

  // Create Specific Society Moderator

  let tokens = [];
  for (const user of users) {
    tokens.push((await authRegister(user as UserRegister)).token);
  }
  console.log(`\n==============\n`);
  console.log(`Tokens:`);
  console.log(tokens);
  console.log(`\n==============\n`);

  const socNames = [
    'CSESoc',
    'Comp Club',
    'SecSoc',
    'Tea and Coffee Society',
    'MechSoc',
    'EngineersWithoutBorders',
    'Thing Soc',
    'That Soc',
    'DocSoc',
    'SockSoc',
    'SocketSoc',
  ];
  // Normal User 1 applies to create 2 societies
  const approveApps = [];
  for (let n = 0; n < SOCIETIES; n++) {
    approveApps.push({
      token: tokens[socAdminIndex],
      societyName: socNames[n],
      description: `${socNames[n]} is the best society!!!`,
    });
  }

  // Normal user 3 applies to create 2 societies
  const denyApps = [];
  for (let n = 0; n < SOCIETIES; n++) {
    denyApps.push({
      token: tokens[2],
      societyName: `Another Valid Society Name ${n}`,
      description: 'Another Valid Society Description!',
    });
  }

  const apprAppIds = [];
  for (const app of approveApps) {
    apprAppIds.push(
      (await societyApply(app.token, app.societyName, app.description))
        .applicationId,
    );
  }

  const denyAppIds = [];
  for (const app of denyApps) {
    denyAppIds.push(
      (await societyApply(app.token, app.societyName, app.description))
        .applicationId,
    );
  }

  // Admin approves both applications
  const societyIds = [];
  for (const appId of apprAppIds) {
    societyIds.push(
      (await adminApplicationApprove(tokens[0], appId)).societyId,
    );
  }

  for (const appId of denyAppIds) {
    await adminApplicationDeny(tokens[0], appId);
  }

  // Verify both societies were created
  console.log('Societies:');
  console.log(await societyList());

  const socModId = (await profileView(tokens[2])).userId;

  // User[2] SocMod joins alls socs and soc admin promotes them becomes a moderator
  for (const societyId of societyIds) {
    await societyJoin(tokens[2], societyId);
    await permSocietyAllocate(tokens[socAdminIndex], socModId, societyId, 2);
  }

  // Create Events in Societies
  const eventIds = [];
  for (const societyId of societyIds) {
    let uniq = 0;
    for (let i = 0; i < EVENTS_PER_SOC; i++) {
      eventIds.push(
        (
          await createEvent(
            tokens[socAdminIndex],
            societyId,
            `Event ${uniq}`,
            `${(await societyView(societyId)).societyName}'s Event Description`,
            new Date(Date.now() + (i + 1) * 100 * 60 * 60 * 1000),
            'Top Secret Location',
          )
        ).eventId,
      );
      uniq++;
    }
  }
  for (const societyId of societyIds)
    console.log(await societyEvents(societyId));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
