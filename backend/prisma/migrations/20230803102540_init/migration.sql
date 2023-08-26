/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagsOnSocieties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `tags` on the `Application` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tag_tag_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TagsOnSocieties";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "applicantId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "photoURL" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicantId", "description", "id", "name", "photoURL", "status") SELECT "applicantId", "description", "id", "name", "photoURL", "status" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
