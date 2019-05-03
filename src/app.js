require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const slackRouter = require('./routes/slack/slackRoute');
const queueRouter = require('./routes/queue/queueRoute');
const usersRouter = require('./routes/users/users-routes');
const authRouter = require('./routes/auth/auth-routes');
const dataRouter = require('./routes/data/dataRoute');
const studentRouter = require('./routes/student/studentRoute');

const { NODE_ENV } = require('./config');


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/student', studentRouter);
app.use('/api/queue', queueRouter);
app.use('/api/data', dataRouter);
app.use('/api/slack', slackRouter);



app.use(function errorHandler(error, req, res, next) {
  let response;
 
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
  
});

module.exports = app;