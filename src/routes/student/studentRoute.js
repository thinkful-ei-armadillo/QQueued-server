const express = require('express');
const { requireAuth } = require('../../middleware/jwt-auth');
const studentService = require('./studentService');
const parser = express.json();
const studentRouter = express.Router();

studentRouter
  .route('/edit/:id')
  .patch(parser, requireAuth, async (req, res, next) => {
    try {
      const updatedData = await studentService.updateDescription(
        req.app.get('db'),
        req.params.id,
        req.body.description
      );
      res.send(updatedData);
    } catch (error) {
      next(error);
    }
  });

module.exports = studentRouter;