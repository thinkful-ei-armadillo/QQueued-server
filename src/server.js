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

io.on("connection", async socket => {
  console.log("Client Successfully Connected");
  socket.userName = 'Anon'

  socket.on('change-username', data => {
    socket.userName = data.userName
    io.emit('entered', socket.userName)
  })
 
  socket.on('message', data => {
    io.emit('message', data)
  })

  socket.on('notifiy', data => {
    io.emit('notifiy', data)
  })
  socket.on("disconnect", () => console.log("Client disconnected"));
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

