const express = require('express');
const usersRouter = express.Router();
const parser = express.json();
const UserService = require('./usersService');
const path = require('path');
const { validateUserRequest, validatePassword } = require('../../helper/errorHandling');

usersRouter
  .route('/')
  .post(parser, (req, res, next) => {
    const { password, username } = req.body;
    const db = req.app.get('db');
    const { isError, message } = validateUserRequest(req.body);
    const passwordError = validatePassword(password);
    const userNameExists = UserService.validateUserName(db, username);
    
    // error handling
    if (isError) {
      return res.status(400).json({ error: message });
    }
    
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }
    
    if (userNameExists) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    // api response
    UserService
      .hashPassword(password)
      .then(hash => {
        return {
          username,
          password: hash
        };
      })
      .then(newUser => {
        return UserService.insertUser(db, newUser);
      })
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(UserService.serializeUser(user));
      })
      .catch(next);
  });

module.exports = usersRouter;