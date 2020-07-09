const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.send('Hey there...!!!');
});

let chatRoomUserList = [];
let userActivities = [];
let messageList = [];
io.sockets.on('connection', function(socket) {
    console.log("Got connection "+socket);

    socket.on('username', function(username) {
        socket.username = username;
        chatRoomUserList.push(username);
        console.log("User joined "+ username)
        userActivities.push('🟢 <i>' + socket.username + ' joined the chat</i>');
        io.emit('is_online', userActivities);
        io.emit('active_users',chatRoomUserList);
        io.emit('chat_message', messageList);
    });

    socket.on('disconnect', function(username) {
        console.log("Got diconnected " + username)
        chatRoomUserList = chatRoomUserList.filter(user => user !==socket.username);
        userActivities.push('🔴 <i>' + socket.username + ' left the chat</i>');
        io.emit('is_online', userActivities);
        io.emit('active_users',chatRoomUserList);
    })

    socket.on('chat_message', function(message) {
        messageList.push('<strong>' + socket.username + '</strong>: ' + message)
        io.emit('chat_message', messageList);
    });

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});