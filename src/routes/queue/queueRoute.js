const express = require('express');
const QueueService = require('./queueService');
const {requireAuth} = require('../../middleware/jwt-auth');

const queueRouter = express.Router();

queueRouter
  .use(requireAuth);

queueRouter
  .get('/', async (req, res, next) => {
    // const list = await QueueService.getAll(req.app.get('db'));
    // console.log('list', list)

  })

module.exports = queueRouter;