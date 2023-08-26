/*
  Warnings:

  - You are about to drop the column `zid` on the `User` table. All the data in the column will be lost.
  - Added the required column `description` to the `Society` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Society` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoURL` to the `Society` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicantId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoURL" TEXT NOT NULL,
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "TagsOnSocieties" (
    "tagId" INTEGER NOT NULL,
    "societyId" INTEGER NOT NULL,

    PRIMARY KEY ("tagId", "societyId"),
    CONSTRAINT "TagsOnSocieties_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TagsOnSocieties_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Society" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoURL" TEXT NOT NULL
);
INSERT INTO "new_Society" ("id") SELECT "id" FROM "Society";
DROP TABLE "Society";
ALTER TABLE "new_Society" RENAME TO "Society";
CREATE UNIQUE INDEX "Society_name_key" ON "Society"("name");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nameFirst" TEXT NOT NULL,
    "nameLast" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "zId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("email", "id", "isAdmin", "nameFirst", "nameLast", "password") SELECT "email", "id", "isAdmin", "nameFirst", "nameLast", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_zId_key" ON "User"("zId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");
