CREATE TABLE "pointers" (
  "id" SERIAL PRIMARY KEY,
  "head" INTEGER REFERENCES "queue"(id)
    ON DELETE SET NULL,
  "tail" INTEGER REFERENCES "queue"(id)
    ON DELETE SET NULL
);