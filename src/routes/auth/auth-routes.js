const express = require('express');
const AuthService = require('./auth-service');
const { requireAuth } = require('../../middleware/jwt-auth');
const { validateAuthRequest } = require('../../helper/errorHandling');

const authRouter = express.Router();
const parser = express.json();

authRouter
  .route('/')
  .post(parser, (req, res, next) => {
    const { username, password } = req.body;
 
    const { error, isError } = validateAuthRequest(req.body);
    const loginUser = { username, password };
    const db = req.app.get('db');

    if (isError) {
      return res.status(400).send({ error });
    } else {
      AuthService
        .getUser(db, username)
        .then(user => {
          !user
            ? res.status(400).send({ error: 'Incorrect username or password' })
            : user;  return user;
        })
        .then(user => { 
          !AuthService.comparePasswords(loginUser.password, user.password)
            ? res.status(400).send({ error: 'Incorrect username or password' })
            : user; return user;
        })
        .then(user => {
          const sub = user.username;
          const payload = {
            id: user.id,
            name: user.name
          };
          res.send({ authToken: AuthService.createJwt(sub, payload) });
        })
        .catch(next);
    }
  })
  .put(requireAuth, (req, res) => {
    const sub = req.user.username;
    const payload = {
      id: req.user.id,
      name: req.user.name
    };
    res.send({ authToken: AuthService.createJwt(sub, payload) });
  });

module.exports = authRouter;