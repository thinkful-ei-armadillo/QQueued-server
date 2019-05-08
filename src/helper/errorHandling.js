const regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const errorHandling = {

  validateUserRequest(body) {
    let result = {
      isError: false,
      error: ''
    };

    for (const key of ['user_name', 'password', 'title', 'full_name']) {
      if (!body[key]) {
        result.error = `Missing '${key}' in request body`;
        result.isError = true;
        return result;
      }
    }
    return result;
  },

  validateAuthRequest(body) {
    let result = {
      isError: false,
      error: ''
    };

    for (const key of ['user_name', 'password']) {
      if (!body[key]) {
        result.isError = true;
        result.error = `Missing ${key} in request body`;
        return result;
      }

      if (body.key === null) {
        result.isError = true;
        result.error = `Missing a value for "${key}"`;
        return result;
      }
    }
    return result;
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!regex.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  }
  
};

module.exports = errorHandling;