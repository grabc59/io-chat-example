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

// original get route
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });


io.sockets.on('connection', function(socket) {

  // new connection
  connections.push(socket);
  // informational logs
  console.log('Connected: %s sockets connected', connections.length);
  console.log(connections.length);

  // disconnect
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
    io.sockets.emit('new user notification', socket.username);
  });

  function updateUsernames() {
    io.sockets.emit('get users', users);
  }

  // 'someone is typing notification'
  // client sends 'user is typing', with their username, to the server. The server will send 'someone is typing' and forward the received username to all clients in the chat
  socket.on('user is typing', function (data) {
    io.sockets.emit('someone is typing', data);
  });
  socket.on('user is not typing', function(data) {
    io.sockets.emit('somone is not typing', data);
  })

});
