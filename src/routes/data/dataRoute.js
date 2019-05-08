const express = require('express');
const dataRouter = express.Router();
const parser = express.json();
const { requireAuth } = require('../../middleware/jwt-auth');
const dataService = require('./dataService');

dataRouter
  .route('/')
  .get(requireAuth, async (req, res, next) => {
    try {
      const {user_name, title } = req.user;
      const db = req.app.get('db');
      if (title === 'student') {
        const data = await dataService.getStudentData(db, user_name);
        return res.status(200).send(data);
      }

      const data = await dataService.getData(db);

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
      const {title} = req.user;
      if (title !== 'mentor') {
        return res.send({notes: []});
      }

      const notes = await dataService.getNotes(req.app.get('db'));
      res.status(200).send(notes);
    }
    catch (error) {
      next(error);
    }
  });

dataRouter
  .route('/note/:noteId')
  .post(parser, requireAuth, async (req, res, next) => {
    try {
      const {noteId} = req.params;
      const { title, user_name } = req.user;
      const {note} = req.body
      const db = req.app.get('db');
      const noteItem = await dataService.getByNoteId(req.app.get('db'), noteId);
      let noteToDatabase;
      
      if(title){
        if (user_name === noteItem.mentor_user_name)
          noteToDatabase = {mentor_notes: note}
        else if (user_name === noteItem.user_name)
          noteToDatabase = {student_notes: note}
        else
        res.status(404).json({error: `only original mentor/student can edit notes`})
      } else
        res.status(404).json({error: 'you do not have permission to edit notes'})
      
      await dataService.updateNote(db, noteId, noteToDatabase)
        .then(() => res.status(204).end())
     
    }
    catch (error) {
      next(error);
    }
  });

module.exports = dataRouter;