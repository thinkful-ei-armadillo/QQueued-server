CREATE TABLE "queue" (
  "id" SERIAL PRIMARY KEY,
  "description" TEXT NOT NULL,
  "user_name" TEXT REFERENCES "user"(user_name)
    ON DELETE CASCADE,
  "mentor_user_name" TEXT REFERENCES "user"(user_name)
    ON DELETE CASCADE DEFAULT NULL, 
  "dequeue" BOOLEAN NOT NULL DEFAULT FALSE,
  "completed" BOOLEAN NOT NULL DEFAULT FALSE,
  "slack_user_id" TEXT,
  "slack_handle"  TEXT,
  "next" INTEGER REFERENCES "queue"(id)
    ON DELETE SET NULL
);
