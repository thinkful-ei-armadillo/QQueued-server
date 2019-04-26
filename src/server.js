const app = require('./app');
const { PORT } = require('./config');
const knex = require('knex');
const { DB_URL, API_ENDPOINT } = require('./config');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const axios = require("axios");

const db = knex({
  client: 'pg',
  connection: DB_URL
});

app.set('db', db);

io.set("origins", "*:*");
let interval;

io.on("connection", async socket => {
 
  console.log("Client Successfully Connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);

  socket.on("disconnect", () => console.log("Client disconnected"));
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      API_ENDPOINT
    ); 
    socket.emit("FromAPI", res.data); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

http.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});