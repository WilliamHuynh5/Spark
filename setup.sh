#! /bin/bash

# Setup backend .env
echo "DATABASE_URL=\"file:./prisma.db\"" > ./backend/.env

# Install packages
cd ./backend && npm ci
cd ../frontend && npm ci

