/*
  Warnings:

  - The primary key for the `Form` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Form` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "eventId" INTEGER NOT NULL,
    "zId" TEXT NOT NULL,
    "nameFirst" TEXT NOT NULL,
    "nameLast" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "zId", "email"),
    CONSTRAINT "Form_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Form" ("email", "eventId", "nameFirst", "nameLast", "zId") SELECT "email", "eventId", "nameFirst", "nameLast", "zId" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
