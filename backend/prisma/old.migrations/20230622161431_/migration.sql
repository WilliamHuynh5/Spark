/*
  Warnings:

  - Added the required column `tag` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL
);
INSERT INTO "new_Tag" ("id") SELECT "id" FROM "Tag";
DROP TABLE "Tag";
ALTER TABLE "new_Tag" RENAME TO "Tag";
CREATE UNIQUE INDEX "Tag_tag_key" ON "Tag"("tag");
CREATE TABLE "new_Society" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "photoURL" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Society" ("description", "id", "name", "photoURL") SELECT "description", "id", "name", "photoURL" FROM "Society";
DROP TABLE "Society";
ALTER TABLE "new_Society" RENAME TO "Society";
CREATE UNIQUE INDEX "Society_name_key" ON "Society"("name");
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicantId" INTEGER NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "photoURL" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicantId", "description", "id", "name", "photoURL") SELECT "applicantId", "description", "id", "name", "photoURL" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
