const bcrypt = require('bcryptjs');
const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const errorHandling = {

  validateUserRequest(body) {
    let result = {
      isError: false,
      message: ''
    };

    for (const key of ['username', 'password']) {
      if (!body[key]) {
        result.message = `Missing '${key}' in request body`;
        result.error = true;
        return result;
      }
    }
    return result;
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!regex.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  }
  
};

module.exports = errorHandling;