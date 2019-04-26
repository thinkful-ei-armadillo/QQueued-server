const express = require('express');
const QueueService = require('./queueService');
const {requireAuth} = require('../../middleware/jwt-auth');
const parser = express.json();

const queueRouter = express.Router();

queueRouter
  .route('/')
  .all(requireAuth)
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
      let newQueueData = { description, user_name };

      if(!description)
        return res.status(400).json({
          error: `Missing description in request body`
        })
  
      await QueueService.enqueue(req.app.get('db'), newQueueData)
       .then(res => newQueueData = res)

      if (pointer.head === null)
        await QueueService.updateBothPointers(req.app.get('db'), newQueueData.id)
      else {
        await QueueService.updateTailPointer(req.app.get('db'), newQueueData.id);
        await QueueService.updateQueue(req.app.get('db'), pointer.tail, newQueueData.id);
      } 
      res.json({
        studentName: req.user.name
      })

    } catch (error) {
      next(error);
    }
  })
  .patch(parser, async (req,res,next)=>{
    try {
      const { title, user_name }  = req.user;

      if(title !== 'mentor'){
        return res.status(400).json({
          error: `Sorry Only mentors can update queue`
        });
      }

      const pointer = await QueueService.getPointers(req.app.get('db'));
      if(pointer.head === null)
        return res.json('no students in queue')
      const current = await QueueService.getById(req.app.get('db'), pointer.head);
      const currentDequeueUpdate = {mentor_user_name: user_name, dequeue: true, next: null}
      
      await QueueService.updateHeadPointer(req.app.get('db'), current.next);
      await QueueService.dequeue(req.app.get('db'), pointer.head, currentDequeueUpdate);
      if(current.next === null){
        await QueueService.updateTailPointer(req.app.get('db'), current.next);
      }

      res.json('student off queue')
 
    } catch (error){
      next(error);
    }
  })

module.exports = queueRouter;