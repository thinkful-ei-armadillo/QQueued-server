const express = require('express');
const AuthService = require('./auth-service');
const { requireAuth } = require('../../middleware/jwt-auth');
const { validateAuthRequest } = require('../../helper/errorHandling');

const authRouter = express.Router();
const parser = express.json();

authRouter
  .route('/')
  .post(parser, (req, res, next) => {
    
    const { user_name, password } = req.body;
    const { error, isError } = validateAuthRequest(req.body);
    const db = req.app.get('db');

    if (isError) {
      return res.status(400).send({ error });
    } else {
      AuthService
        .getUser(db, user_name)
        .then(user =>  {
          if (!user) {
            return res.status(400).send({ error: 'Incorrect username or password' });
          }
          return user;
        })
        .then( async user => {
          const check  = await AuthService.comparePasswords(password, user.password)
          if (!check) {
            return res.status(400).send({ error: 'Incorrect username or password' });
          }
          return user;
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
  })
  .put(requireAuth, (req, res, next) => {
    try{
      const sub = req.user.user_name;
      const payload = {
        user_id: req.user.id,
        name: req.user.full_name,
        title: req.user.title
      };
      res.send({ authToken: AuthService.createJwt(sub, payload) });
    } catch (error) {
      next(error);
    }
  });

module.exports = authRouter;