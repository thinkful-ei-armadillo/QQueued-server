const express = require('express');
const usersRouter = express.Router();
const parser = express.json();
const UserService = require('./usersService');
const path = require('path');
const {validatePassword, validateUserRequest} = require('../../helper/errorHandling');

usersRouter
  .route('/')
  .post(parser, (req, res, next) => {
    const { password, username } = req.body;
    const db = req.app.get('db');
    

    const { isError, error } = validateUserRequest(req.body);
    const passwordError = validatePassword(password);
    const userNameExists = UserService.validateUserName(db, username);
  
    // error handling
    isError
      ? res.status(400).send(error)
      : passwordError
        ? res.status(400).send({ error: passwordError })
        : userNameExists
          ? res.status(400).send({ error: 'Username already taken' })
          
        // api response
          : UserService
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