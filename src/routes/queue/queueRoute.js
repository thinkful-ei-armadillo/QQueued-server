const express = require('express');
const QueueService = require('./queueService');
const { requireAuth } = require('../../middleware/jwt-auth');
const parser = express.json();
const helperQueue = require('./helperQueue');

const queueRouter = express.Router();

queueRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const {
        queueList,
        currentlyBeingHelped,
        hasBeenHelpedList
      } = await helperQueue.getQueueData(req.app.get('db'));
      res.json({
        queueList,
        currentlyBeingHelped,
        hasBeenHelpedList
      });
    } catch (error) {
      next(error);
    }
  })
  .post(requireAuth, parser, async (req, res, next) => {
    try {
      const { user_name } = req.user;
      const { description } = req.body;
      let newQueueData = { description, user_name };

      let io = req.app.get('socketio');
      
      if (!description) {
        return res.status(400).json({
          error: `Missing description in request body`
        });
      }
      
      
      const data = await helperQueue.addToQueue(req.app.get('db'), newQueueData);

      io.emit('new-ticket', data);

      const top = await QueueService.getPointers(req.app.get('db'));
      const tail = await QueueService.getById(req.app.get('db'), top.tail);
      const studentData = { user_name, question: description, queue_id: tail.id };

      await QueueService
        .addStudentData(req.app.get('db'), studentData);


      
      res.json({
        studentName: req.user.full_name,
        description: description
      });
    } catch (error) {
      next(error);
    }
  })
  .patch(requireAuth, async (req, res, next) => {
    try {
      const { title, user_name } = req.user;
      let io = req.app.get('socketio');
      if (title !== 'mentor')
        return res.status(400).json({
          error: `Sorry Only mentors can update queue`
        });

      const pointer = await QueueService.getPointers(req.app.get('db'));
      if (pointer.head === null) return res.status(204);
      const current = await QueueService.getById(
        req.app.get('db'),
        pointer.head
      );

      await QueueService.updateStudentData(req.app.get('db'), current.id, req.user.full_name);

      const currentDequeueUpdate = {
        mentor_user_name: user_name,
        dequeue: true,
        next: null
      };

      await QueueService.updateHeadPointer(req.app.get('db'), current.next);
      const helped = await QueueService.dequeue(
        req.app.get('db'),
        pointer.head,
        currentDequeueUpdate
      );
      io.emit('dequeue', helped)
      if (current.next === null) {
        await QueueService.updateTailPointer(req.app.get('db'), current.next);
      }

      res.status(204).json({message: 'done'});
      next();
    } catch (error) {
      next(error);
    }
  });

queueRouter
  .route('/:sessionId')
  .all(requireAuth)
  .patch(async (req, res, next) => {
    try {
      const { title, full_name } = req.user;

      if (title !== 'mentor')
        return res.status(400).json({
          error: `Sorry Only mentors can update queue`
        });

      const sessionToCompleteId = req.params.sessionId;
      const currentSession = await QueueService.getById(
        req.app.get('db'),
        sessionToCompleteId
      );

      if (currentSession.mentorName !== full_name)
        return res.status(400).json({
          error: `Sorry only mentor that work with ${
            currentSession.studentName
          } can complete session`
        });

      const completeSession = { completed: true };
      await QueueService.updateSessionToComplete(
        req.app.get('db'),
        currentSession.id,
        completeSession
      );

      res.send({ message: 'Complete' });
    } catch (error) {
      next(error);
    }
  });

module.exports = queueRouter;
