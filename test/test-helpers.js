const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const testHelpers = {
  createUsers() {
    return [
      {
        id: 1,
        user_name: "admin",
        title: "mentor",
        full_name: "Dunder Mifflin Admin",
        password: "Password123$"
      },
      {
        id: 2,
        user_name: "Jon",
        title: "student",
        full_name: "Jon Foo",
        password: "Somepassword123$"
      },
      {
        id: 3,
        user_name: "Fred",
        title: "student",
        full_name: "Fred Bar",
        password: "Thispassword123$"
      },
      {
        id: 4,
        user_name: "Bob",
        title: "student",
        full_name: "Bob Burger",
        password: "Mypassword123$"
      }
    ];
  },

  createQueue() {
    return [
      {
        id: 1,
        description: "test desc 1",
        user_name: "Fred",
        mentor_user_name: "admin",
        dequeue: true,
        completed: true,
        slack_user_id: "UJ3CMD8UV",
        slack_handle: null,
        next: null
      },
      {
        id: 2,
        description: "test desc 2",
        user_name: "Jon",
        mentor_user_name: "admin",
        dequeue: true,
        completed: false,
        slack_user_id: null,
        slack_handle: null,
        next: null
      },
      {
        id: 3,
        description: "test desc 3",
        user_name: "Fred",
        mentor_user_name: null,
        dequeue: true,
        completed: false,
        slack_user_id: "UJ3CMD8UV",
        slack_handle: null,
        next: 4
      },
      {
        id: 4,
        description: "test desc 3",
        user_name: "Bob",
        mentor_user_name: "admin",
        dequeue: true,
        completed: true,
        slack_user_id: "UJ3CMD8UV",
        slack_handle: null,
        next: null
      }
    ];
  },

  createPointers() {
    return {
      id: 1,
      head: 3,
      tail: 4
    };
  },

  createFixtures() {
    const testUsers = this.createUsers();
    const testPosts = this.createQueue();
    const testPointers = this.createPointers();
    return { testUsers, testPosts, testPointers };
  },

  cleanTables(db) {
    return db.transaction(trx =>
      trx
        .raw(
          `TRUNCATE
          user,
          queue,
          pointers
          `
        )
        .then(() =>
          Promise.all([
            trx.raw(`ALTER SEQENCE user_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQENCE queue_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQENCE pointers_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('user_id_seq', 0)`),
            trx.raw(`SELECT setval('queue_id_seq', 0)`),
            trx.raw(`SELECT setval('pointers_id_seq', 0)`)
          ])
        )
    );
  },

  seedUser(db, users) {
    const userArr = users.map(u => ({
      ...u,
      password: bcrypt.hashSync(u.password, 1)
    }));
    return db
      .into("user")
      .insert(userArr)
      .then(() =>
        db.raw(`SELECT setval('user_id_seq', ?)`, [user[user.length - 1].id])
      );
  },

  seedPointers(db, pointers) {
    return db
      .into("pointers")
      .insert(pointers)
      .then(() =>
        db.raw(`SELECT setval('user_id_seq', ?)`, [
          pointers[pointers.length - 1].id
        ])
      );
  },

  seedQueue(db, queue) {
    return db
      .into("queue")
      .insert(queue)
      .then(() =>
        db.raw(`SELECT setval('user_id_seq', ?)`, [queue[queue.length - 1].id])
      );
  },

  makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const authToken = jwt.sign({ id: user.id, title: user.title }, secret, {
      subject: user.user_name,
      algorithm: "HS256"
    });
    return `Bearer ${authToken}`;
  }
};

module.exports = testHelpers;