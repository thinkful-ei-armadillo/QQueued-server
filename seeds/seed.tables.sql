BEGIN;
TRUNCATE
  "queue",
  "user";

INSERT INTO "user"("id", "username", "title", "name", "password")
VALUES
  (
    1,
    'admin',
    'mentor',
    'Dunder Mifflin Admin',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (
    2,
    'student1',
    'student',
    'Matthew',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (
    3,
    'student2',
    'student',
    'Hunter',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (
    4,
    'student3',
    'student',
    'Jonathan',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (
    5,
    'student4',
    'student',
    'Robin',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (
    6,
    'professX',
    'mentor',
    'Xavier',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
    (
    7,
    'Queen D',
    'mentor',
    'Daenerys Targaryen',
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

  INSERT INTO "queue"("id", "desc", "user_id", "mentor_id", "dequeue", "completed")
  VALUES
    (1, 'help me i dont know what im doing', 2, 7, TRUE, FALSE),
    (2, 'help me i dont know what im doing', 3, 6, TRUE, FALSE),
    (3, 'help me i dont know what im doing', 4, NULL, FALSE, FALSE),
    (4, 'help me i dont know what im doing', 5, NULL, FALSE, FALSE),
    (5, 'help me i dont know what im doing', 6, NULL, FALSE, FALSE);
    
COMMIT;