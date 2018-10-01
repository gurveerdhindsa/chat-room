var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));

var clients = 0;

io.on("connection", client => {

  client.on("join", user => {
    clients++;
    console.log("Client connected. Total clients: ", clients);
    client.emit("user-status", user, "SELF_CONNECT");
    client.broadcast.emit("user-status", user, "CONNECT");
  });

  client.on("disconnect", user => {
    clients--;
    console.log("Client disconnected. Total clients: ", clients);
    client.emit("user-status", user, "DISCONNECT");
    client.broadcast.emit("user-status", user, "DISCONNECT");
  })

  client.on("messages", (data, sender) => {
    client.emit("message-list", data, sender, true);
    client.broadcast.emit("message-list", data, sender, false);
  });
});

server.listen(8080);