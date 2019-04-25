const express = require('express');
const QueueService = require('./queueService');
const {requireAuth} = require('../../middleware/jwt-auth');

const queueRouter = express.Router();

queueRouter
  .use(requireAuth);

queueRouter
  .get('/', async (req, res, next) => {
    try{
      const pointer = await QueueService.getPointers(req.app.get('db'));
      const list = await QueueService.getAll(req.app.get('db'));
      const queueList = list.filter(listItem => listItem.id >= pointer.head);
      const currentlyBeingHelped = list.filter(list => list.dequeue === true && list.completed === false);

      res.json({
        queueList,
        currentlyBeingHelped
      });
      next();
    } catch (error) {
      next(error);
    }

  });

module.exports = queueRouter;