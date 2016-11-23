'use strict';
$(function() {
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $messageHistory = $('#messageHistory');
    var $messageArea = $('#messageArea');
    var $userFormArea = $('#userFormArea');
    var $userForm = $('#userForm');
    var $users = $('#users');
    var $username = $('#username');
    var $myUserName = '';


    $userForm.submit(function(e) {
        e.preventDefault();
        $myUserName = $username.val();
        socket.emit('new user', $username.val(), function(data) {
            if (data) {
                $userFormArea.hide();
                $messageArea.show();
            }
        });
        $username.val('');
    });

    socket.on('new user notification', function(data) {
        $messageHistory.append('<div class="well"><strong>' + data + '</strong> has joined the chat');
    })

    $messageForm.submit(function(e) {
      e.preventDefault();
      socket.emit('send message', $message.val());
      $message.val('');
    });

    socket.on('new message', function(data) {
        $messageHistory.append('<div class="well"><strong>' + data.user + '</strong>:' + data.msg + '</div>')
    })

    socket.on('get users', function(data){
      var html = '';
      for (var i = 0; i < data.length; i++) {

        if (data[i] === $myUserName) {
          html += '<li class="list-group-item active">' + data[i] + '</li>';
        } else {
          html += '<li class="list-group-item">' + data[i] + '</li>';
        }
      }
      $users.html(html);
    })



});
