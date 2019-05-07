const app = require('./app');
const { PORT } = require('./config');
const knex = require('knex');
const { DB_URL, NODE_ENV } = require('./config');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  pingTimeout: 60000,
});
const axios = require('axios');
const helperQueue = require('../src/routes/queue/helperQueue');

const db = knex({
  client: 'pg',
  connection: DB_URL
});

app.set('db', db);
app.set('socketio', io);
io.set('origins', '*:*');

let connectedClients = {};

io.on('connection', async socket => {
  console.log('Client Successfully Connected');
  socket.userName = 'Anon';

  socket.on('join-room', data => {
    socket.userName = data.userName;
    connectedClients[`${data.list.mentorName}-${data.list.studentName}`] = `${
      data.list.mentorName
    }-${data.list.studentName}`;

    console.log(
      'joining room',
      connectedClients[`${data.list.mentorName}-${data.list.studentName}`]
    );
    socket.join(
      connectedClients[`${data.list.mentorName}-${data.list.studentName}`]
    );
    io.to(
      connectedClients[`${data.list.mentorName}-${data.list.studentName}`]
    ).emit('entered', {
      userName: socket.userName,
      room: connectedClients[data.userName]
    });
  });
  socket.on('message', data => {
    console.log('sending from', data.user);
    if (
      data.to &&
      (data.user === data.to.studentName || data.user === data.to.mentorName)
    ) {
      let id = connectedClients[`${data.to.mentorName}-${data.to.studentName}`];
      io.to(id).emit('message', data);
    }
  });
  socket.on('delete-ticket', data => {
    io.emit('delete-ticket', data);
  });
  socket.on('notifiy', data => {
    io.emit('notifiy', data);
  });
  socket.on('disconnect', () => {
    delete connectedClients[socket.userName];
    console.log('Client disconnected');
  });
  socket.on('left', data => {
    if (data.to) {
      data.text = `${data.user} has left chat`;
      data.time = new Date().toLocaleTimeString();
      let id = connectedClients[`${data.to.mentorName}-${data.to.studentName}`];
      socket.to(id).broadcast.emit('message', data);
    }
  });
  socket.on('helpStudent', data=> {
    io.emit('helpStudent',data)
  })
  socket.on('isTyping', data => {
    if (
      data.to &&
      (data.user === data.to.studentName || data.user === data.to.mentorName)
    ) {
      let id = connectedClients[`${data.to.mentorName}-${data.to.studentName}`];
      socket.to(id).broadcast.emit('isTyping', data);
    }
  })
});

const getApiAndEmit = async socket => {
  try {
    const data = await helperQueue.getQueueData(db);

    socket.emit('FromAPI', data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

http.listen(PORT, () => {
  if (NODE_ENV === 'production') {
    console.log(`Server listening to heroku:${PORT}`);
  } else {
    console.log(`Server listening at http://localhost:${PORT}`);
  }
});
