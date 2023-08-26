## Installation

```
cd backend

echo "DATABASE_URL=\"file:./prisma.db\"" > .env

npm ci
```

The port the server is listening on can be changed in `src/server.ts`.

If any changes are made the the Prisma schema, `npx primsa generate` must be run to generate the new TS types.

## Running the server

Run the server with a seeded database:

```
npm run start-seeded
```

Run the server without a seed (empty database):

```
npm run start
```

The default URL for the backend server is `http://localhost:3000/`.

## Seeding database

You can seed the database for testing purposes.

The database is automatically seeded when the database is reset via

`npm run db-reset`

or

`npx prisma migrate`

Note: It can also be manually seeded without resetting using `npx prisma db seed`, however the behaviour of the data when this is executed has not been tested, so the above two options are preferred.

(see: https://www.prisma.io/docs/guides/migrate/seed-database)

### Seeding customisation

The seeding script can be customised, using the constants at the top of the main function in `prisma/seed.ts`. Read `prisma/seed.ts` for more info.

### Defaults

Base admin login details are `admin@test.io:password`.

Default society admin for all societies is `user1@test.io`.

All user accounts are accessible via `user{n}@test.io:password`.

## Emails

If the `NODE_ENV` environment variable is set to `"production"`, you will need to provide `SMTP_EMAIL` and `SMTP_PASSWORD` to log in to the SMTP server specified by `SMTP_HOST` and `SMTP_PORT` environment variables.

Otherwise, a test account is created when the server is run via `npm run demo`. Each email that is sent will be viewable via a URL in the console.
