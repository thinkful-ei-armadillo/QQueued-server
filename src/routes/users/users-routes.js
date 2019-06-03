const express = require('express');
const usersRouter = express.Router();
const parser = express.json();
const UserService = require('./users-service');
const AuthService = require('../auth/auth-service');
const { requireAuth } = require('../../middleware/jwt-auth');
const { validatePassword, validateUserRequest } = require('../../helper/errorHandling');

usersRouter
  .route('/')
  .get((req, res, next) => {
    UserService
      .getUsers(req.app.get('db'))
      .then(users => {
        !users
          ? res.status(400).send({ error: 'Can not get users from the database' })
          : res.status(200).send(users);
      })
      .catch(next);
  })
  .post(parser, (req, res, next) => {
    const { password, user_name, title, full_name } = req.body;
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
            user_name,
            full_name,
            password: hash,
            title
          };
        })
        .then(async (newUser) => {
          await UserService.validateUserName(db, newUser.user_name)
            ? res.status(400).send({ error: 'Username already taken' })
            : UserService.insertUser(db, newUser);
          return newUser;
        })
        .then(user => {
          const sub = user.user_name;
          const payload = {
            user_id: user.id,
            name: user.full_name,
            title: user.title
          };
          res.send({ authToken: AuthService.createJwt(sub, payload) });
        })
        .catch(next);
    }
  });

module.exports = usersRouter;