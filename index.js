var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/register.html");
});

app.get("/chat", (req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));

var clients = [];

io.on("connection", client => {
  client.on("join", user => {
    client.emit("user-status", user, "SELF_CONNECT");
    client.broadcast.emit("user-status", user, "CONNECT");

    if (clients.indexOf(user) > -1) {
        client.emit("redirect", "/");
    }
    clients.push(user);
  });

  client.on("disconnect", user => {
    client.emit("user-status", user, "DISCONNECT");
    client.broadcast.emit("user-status", user, "DISCONNECT");

    var i = clients.indexOf(user);
    if (i != 1)
        clients.splice(i, 1);
  })

  client.on("messages", (data, sender) => {
    client.emit("message-list", data, sender, true);
    client.broadcast.emit("message-list", data, sender, false);
  });
});

server.listen(8080);