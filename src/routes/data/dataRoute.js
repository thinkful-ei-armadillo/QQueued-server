const express = require('express');
const dataRouter = express.Router();
const { requireAuth } = require('../../middleware/jwt-auth');
const dataService = require('./dataService');

dataRouter
  .route('/')
  .get(requireAuth, async (req, res, next) => {
    try {
      const db = req.app.get('db');
      if (req.user.title !== 'mentor') {
        return res.status(403).send({ error: 'only mentors have access' });
      }

      const data = await dataService.getData(db);

      res.json(data);

    }

    catch(error) {
      next(error);
    }
  });

module.exports = dataRouter;