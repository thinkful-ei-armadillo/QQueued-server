require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
// const usersRoute = require('./routes/users/users-routes/');
// const authRoute = require('./routes/auth/auth-routes');
const slackRouter = require('./routes/slack/slackRoute')
const { NODE_ENV } = require('./config');


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
// app.use('/api/users', usersRoute);
// app.use('/api/auth', authRoute);
app.use('/api/slack', slackRouter)


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