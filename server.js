const express = require('express');
const path = require('path');
const socket = require('socket.io');

const messagesLog = [];
const usersLog = [];
const bannedUsers = ['john', 'tom'];

const app = express();

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
const io = socket(server);

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'))
});

io.on('connection', (socket) => {
  //console.log('connect', socket.id);
  socket.on('login', (user) => {
    if(bannedUsers.includes(user)){
      socket.emit('banned', true);
    } else {
      socket.emit('banned', false);
      usersLog.push({name: user , id: socket.id});
      socket.broadcast.emit('message', ({
        author: 'Chat Bot',
        content: `${user} has joined the conversation!` }));
    };
  });

  socket.on('message', (message) => { 
    console.log('Oh, I\'ve got something from ' + socket.id);
    messagesLog.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    const index = usersLog.findIndex(user => user.id === socket.id);
    const user = usersLog[index];
    if(index > 0){
      usersLog.splice(index , 1);
      socket.broadcast.emit('message', ({
        author: 'Chat Bot',
        content: `${user.name} has left the conversation... :(`,
      }));
    };      
  });
});