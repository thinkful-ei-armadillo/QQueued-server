const express = require('express');
const usersRouter = express.Router();
const parser = express.json();
const UserService = require('./usersService');
const path = require('path');
const {validatePassword, validateUserRequest} = require('../../helper/errorHandling');

usersRouter
  .route('/')
  .post(parser, (req, res, next) => {
    const { password, username, title, name } = req.body;
    const db = req.app.get('db');
    const { isError, error } = validateUserRequest(req.body);

    if (isError) {
      return res.status(400).send(error);
    } else {
      UserService
        .hashPassword(password)
        .then(hash => {
          const passwordError = validatePassword(password);
          if (passwordError) {
            return res.status(400).send({ error: passwordError });
          }
          
          return {
            username,
            name,
            password: hash,
            title
          };
        })
        .then(async (newUser) => {
          await UserService.validateUserName(db, newUser.username)
            ? res.status(400).send({ error: 'Username already taken' })
            : UserService.insertUser(db, newUser);
        })
        .then(user => {
          return res
            .status(201)
            .json(user);
        })
        .catch(next);
    }
  });

module.exports = usersRouter;