const app = require("./app");
const { PORT } = require("./config");
const knex = require("knex");
const { DB_URL, API_ENDPOINT } = require("./config");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const axios = require("axios");
const helperQueue = require("../src/routes/queue/helperQueue");

const db = knex({
  client: "pg",
  connection: DB_URL
});

app.set("db", db);
app.set("socketio", io);
io.set("origins", "*:*");

let connectedClients = {};

io.on("connection", async socket => {
  console.log("Client Successfully Connected");
  socket.userName = "Anon";

  socket.on("join-room", data => {
    socket.userName = data.userName;
    connectedClients[data.userName] = socket.id;

    console.log("joining room", connectedClients[data.userName]);
    socket.join(connectedClients[data.userName]);
    io.to(connectedClients[data.userName]).emit("entered", {
      userName: socket.userName,
      room: connectedClients[data.userName]
    });
  });
  socket.on("message", data => {
    console.log("sending from", data);
    if (
      data.to &&
      (data.user === data.to.studentName || data.user === data.to.mentorName)
    ) {
      let id = connectedClients[data.to.studentName];
      let id2 = connectedClients[data.to.mentorName];
      io.to(id).emit("message", data);
      io.to(id2).emit("message", data);
    }
  });
  socket.on("delete-ticket", data => {
    io.emit("delete-ticket", data);
  });
  socket.on("notifiy", data => {
    io.emit("notifiy", data);
  });
  socket.on("disconnect", () => {
    delete connectedClients[socket.userName];
    console.log("Client disconnected");
  });
  socket.on("left", data => {
    if (data.to) {
      data.text = `${data.user} has left chat`
      let id = connectedClients[data.to.studentName];
      let id2 = connectedClients[data.to.mentorName];

      socket.to(id).broadcast.emit("message", data);
      socket.to(id2).broadcast.emit("message", data);
    }
  });
});

const getApiAndEmit = async socket => {
  try {
    const data = await helperQueue.getQueueData(db);

    socket.emit("FromAPI", data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
