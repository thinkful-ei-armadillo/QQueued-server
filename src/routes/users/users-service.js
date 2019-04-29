const bcrypt = require('bcryptjs');

const usersService = {

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  getUsers(db) {
    return db
      .select('*')
      .from('user');
  },

  validateUserName(db, user_name) {
    return db('user')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('user')
      .returning('*')
      .then(([user]) => user );
  },

  serializeUser(user) {
    return {
      id: user.id,
      full_name: user.name,
      user_name: user.user_name
    };
  }
};

module.exports = usersService;