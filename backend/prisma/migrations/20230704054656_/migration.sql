-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "societyId" INTEGER NOT NULL,
    CONSTRAINT "Event_societyId_fkey" FOREIGN KEY ("societyId") REFERENCES "Society" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserAttending" (
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "eventId"),
    CONSTRAINT "UserAttending_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAttending_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserAttended" (
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "eventId"),
    CONSTRAINT "UserAttended_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserAttended_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResetCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ResetCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
