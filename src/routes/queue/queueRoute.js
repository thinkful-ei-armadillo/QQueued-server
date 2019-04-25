const express = require('express');
const QueueService = require('./queueService');
const {requireAuth} = require('../../middleware/jwt-auth');
const parser = express.json();

const queueRouter = express.Router();

// queueRouter
//   .use(requireAuth);

queueRouter
  .route('/')
  // .all(requireAuth)
  .get( async (req, res, next) => {
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

  })
  .post(parser, async (req,res,next)=>{
    try{
     const pointer = await QueueService.getPointers(req.app.get('db'));
     const {user_name} = req.user;
     const {description} = req.body;
     let newQueueData = {description, user_name };

     await QueueService.enqueue(req.app.get('db'), newQueueData)
       .then(res => newQueueData = res)

     await QueueService.updateQueue(req.app.get('db'), pointer.tail, newQueueData.id)
     await QueueService.updateTailPointer(req.app.get('db'), newQueueData.id)
     res.json('you\'ve been added')
    }catch (error) {
      next(error);
    }
  })

module.exports = queueRouter;