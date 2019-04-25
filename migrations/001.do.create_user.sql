CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "user_name" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL
);