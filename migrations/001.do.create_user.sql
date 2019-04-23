CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "name" TEXT NOT NULL
  "password" TEXT NOT NULL,
);