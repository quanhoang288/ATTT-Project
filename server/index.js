const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  }
});

// Set static folder
app.use(express.static(path.resolve(__dirname, '../client/public')))


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(cors({
  origin: '*'
}));


// connect to database
mongoose.connect(
  // process.env.MONGO_URI,
  'mongodb://localhost/chat-db',
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err) => {
    if (err) {
      console.log('Error connecting to database: ' + err);
    } else {
      console.log('MongoDB Connection succeeded');
    }
  }
);


// routes 
const authRoute = require('./routes/auth.router');
const userRoute = require('./routes/user.router');
const messageRoute = require('./routes/message.router');
const conversationRoute = require('./routes/conversation.router');
const keyRoute = require('./routes/key.router');

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/messages', messageRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/keys', keyRoute);





const PORT = 2000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


let users = [];

const addUser = (userId, socketId) => {
  !users.some(user => user.userId === userId) && 
    users.push({userId, socketId});
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
  return users.find(user => user.userId === userId);
}

io.on("connection", function (socket) {
    console.log("Made socket connection");
    
    // when connect 
    io.emit("welcome", "Welcome new user");
    
    
    // take userId and socketId from a user 
    socket.on('addUser', userId => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    })

    socket.on('sendEncryptedMessage', ({senderId, receiverId, message}) => {
      console.log('sending encrypted message...')
      const receiver = getUser(receiverId);
      if (receiver) {
        console.log('found user online');
        io.to(receiver.socketId).emit('getEncryptedMessage', {
          senderId: senderId,
          message: message
        });
      }
    });

    // send and get message
    socket.on('sendMessage', ({senderId, receiverId, text}) => {
      console.log('sending message...');
      console.log('Receiver id: ' + receiverId);
      console.log(users);
      const receiver = getUser(receiverId);
      console.log(receiver);
      if (receiver) {
        console.log('user online');
        io.to(receiver.socketId).emit('getMessage', {
          senderId,
          text
        });
      }


    })

    // on user disconnect
    socket.on('disconnect', () => {
      removeUser(socket.id);
      io.emit("getUsers", users);
    })
});

