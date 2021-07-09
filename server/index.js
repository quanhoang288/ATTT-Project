const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
require('dotenv').config();


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

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/messages', messageRoute);
app.use('/api/conversations', conversationRoute);




const PORT = 2000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Run when client connects
const activeUsers = new Set();
io.on("connection", function (socket) {
    console.log("Made socket connection");
  
    socket.on("new user", function (data) {
      socket.userId = data;
      activeUsers.add(data);
      io.emit("new user", [...activeUsers]);
    });
  
    socket.on("disconnect", () => {
      activeUsers.delete(socket.userId);
      io.emit("user disconnected", socket.userId);
    });
  
    socket.on("chat message", function (data) {
      io.emit("chat message", data);
    });
    
    socket.on("typing", function (data) {
      socket.broadcast.emit("typing", data);
    });
});

