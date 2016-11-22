'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var morgan = require('morgan');
app.use(morgan('short'));

var users = [];
var connections = [];

server.listen(process.env.port || 3000);
console.log('server running at http://localhost:3000');

app.use(express.static(__dirname));

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });


io.sockets.on('connection', function(socket) {
  connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    console.log(connections.length);

  //disconnect
  socket.on('disconnect', function(data) {
    if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('disconnected: %s sockets connected', connections.length);
  });

  //send message
  socket.on('send message', function(data) {
    console.log(data);
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  // new user
  socket.on('new user', function(data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();

  });

  function updateUsernames() {
    io.sockets.emit('get users', users);
  }

});
