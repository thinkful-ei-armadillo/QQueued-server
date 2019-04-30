const express = require('express');
const slackRouter = express.Router();
const parser = express.json();
const slackService = require('./slackService');
require('dotenv').config();
const config = require('../../config');
const axios = require('axios');
const helperQueue = require('../queue/helperQueue');
const bodyParser = require('body-parser');

slackRouter
  .route('/')
  .post(bodyParser.urlencoded({ extended: true }), async (req, res, next) => {
    try {
      const { user_id, user_name, text } = req.body;
      const io = req.app.get('socketio');
      if (!text)
        return res.status(400).json({
          error: 'Missing description in request'
        });

      let newQueueData = {
        description: text,
        user_name,
        slack_user_id: user_id
      };

      const data = await helperQueue.addToQueue(
        req.app.get('db'),
        newQueueData
      );
      io.on('line', data => {
        console.log(data); // something to do with the scope of socket io
      });
      io.emit('new-ticket', data);
      const resp = `Hello ${user_name}, help is on the way!`;
      const { queueList } = await helperQueue.getQueueData(req.app.get('db'));

      res.status(200).json({
        response_type: 'in_channel',
        text: resp,
        attachments: [
          {
            text: `  You are currently, #${queueList.length} in line.`
          }
        ]
      });
    } catch (error) {
      next(error);
    }
  });
slackRouter.route('/message').post(parser, async (req, res, next) => {
  const { user, text } = req.body;

  let con = {
    headers: {
      Authorization: `Bearer ${config.SLACK_TOKEN}`
    }
  };
  const data = await axios
    .post(`${config.SLACK_ENDPOINT}/im.open`, { user: user }, con)
    .then(data => data.data)
    .catch(err => next(err));

  const message = await axios
    .post(
      `${config.SLACK_ENDPOINT}/chat.postMessage`,
      { channel: data.channel.id, text: text },
      con
    )
    .then(data => data.data)
    .catch(err => next(err));

  res.json(message);
});

slackRouter.route('/events').post(parser, async (req, res, next) => {
  // const { challenge } = req.body
  const { event } = req.body;

  // res.status(200).json({
  //   challenge: challenge
  // })
  res.status(200).end();
  const { queueList } = await helperQueue.getQueueData(req.app.get('db'));

  let con = {
    headers: {
      Authorization: `Bearer ${config.SLACK_TOKEN}`
    }
  };
  if (event.bot_id !== 'BHT4QNKGA' && event.text === 'queue') {
    const student = queueList.find(ele => {
      return ele.slack_user_id === event.user && ele.dequeue === false;
    });
    const number = queueList.indexOf(student);
    const text = `You can currently *#${number + 1}* in the queue.`;
    await axios
      .post(
        `${config.SLACK_ENDPOINT}/chat.postMessage`,
        { channel: event.channel, text: text, 'mrkdwn': true  },
        con
      )
      .then(data => data.data)
      .catch(err => next(err));
  }

  if (event.bot_id !== 'BHT4QNKGA' && event.text === 'tickets') {
    let temp = '';
    const tickets = queueList.filter((i, j) => {
      if (i.slack_user_id === event.user) {
        temp+=`${j+1}) *${i.description}* \n`
      }
    });
    await axios
      .post(
        `${config.SLACK_ENDPOINT}/chat.postMessage`,
        { channel: event.channel, text: temp, 'mrkdwn': true },
        con
      )
      .then(data => data.data)
      .catch(err => next(err));
  }
});


module.exports = slackRouter;

/*
 This the response we get from slack when users send a help ticket.

  token: 'wR78HWvgKZBnhdTlAgndM3BL',
  team_id: 'THS07P24B',
  team_domain: 'test-k877722',
  channel_id: 'DJ5JSMW0N',
  channel_name: 'directmessage',
  user_id: 'UJ3CMD8UV',
  user_name: 'matth3wn',
  command: '/help-me',
  text: 'react',
  response_url:
   'https://hooks.slack.com/commands/THS07P24B/615952970724/TAqOj3aj0pqHNNlfetS2ldpZ',
  trigger_id: '605100389874.604007784147.c77ed8e54ac737e10dafa77e7858485c'

*/
