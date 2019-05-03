const express = require('express');
const dataRouter = express.Router();
const parser = express.json();
const { requireAuth } = require('../../middleware/jwt-auth');
const dataService = require('./dataService');

dataRouter
  .route('/')
  .get(requireAuth, async (req, res, next) => {
    try {
      if (req.user.title === 'student') {
        const data = await dataService.getStudent(req.app.get('db'), req.user.user_name);
        return res.status(200).send(data);
      }

      const data = await dataService.getCompleted(req.app.get('db'));
      res.json(data);
    }

    catch(error) {
      next(error);
    }
  });

dataRouter
  .route('/note')
  .get(requireAuth, async (req, res, next) => {
    try {

      if (req.user.title !== 'mentor') {
        return;
      }

      const notes = await dataService.getNotes(req.app.get('db'));
      res.status(200).send(notes);
    }
    catch (error) {
      next(error);
    }
  });

dataRouter
  .route('/note/:queue_id')
  .post(parser, requireAuth, async (req, res, next) => {
    try {
      if (req.user.title !== 'mentor') {
        return res.status(403).send({ error: 'only mentors can post notes' });
      }
      const postedNote = await dataService.postNote(req.app.get('db'), req.body.note, req.params.queue_id);
      res.status(200).send(postedNote);
    }
    catch (error) {
      next(error);
    }
  });

module.exports = dataRouter;