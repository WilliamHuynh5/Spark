-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "nameFirst" TEXT NOT NULL,
    "nameLast" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "zId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("email", "id", "isAdmin", "nameFirst", "nameLast", "password", "zId") SELECT "email", "id", "isAdmin", "nameFirst", "nameLast", "password", "zId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_zId_key" ON "User"("zId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
