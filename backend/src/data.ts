import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import childProcess from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const prismaModels = Object.freeze([
  // Need to update this when adding new models to schema
  'User',
  'Session',
  'Society',
  'SocietyMember',
  'Application',
  'Event',
  'UserAttending',
  'UserAttended',
  'ResetCode',
  'Form',
]);

const pause = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const loadPrisma = (): PrismaClient => {
  if (!fs.existsSync('./prisma/dev.db')) {
    childProcess.execSync('npx --yes prisma migrate dev --name init');
  }
  return new PrismaClient();
};

// This function is used by the backend testing to clear the database inbetween each test iteration
export const clear = async (): Promise<{}> => {
  for (const modelName of prismaModels) {
    try {
      await prisma[modelName].deleteMany();
    } catch (error) {
      await pause(100);
      await prisma[modelName].deleteMany();
      continue;
    }
  }
  return {};
};

export const prisma: PrismaClient = loadPrisma();
