
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const { genarateMessage, genarateMessageLocation } = require('./utils/message');


const { Users } = require('./utils/users');
var users = new Users();
console.log(__dirname + '/../public');
const publicPath = path.join(__dirname + '/../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {

    socket.emit('emitEmail', genarateMessage('admin', 'wellcome to the chat app'));
    socket.on('join', (join) => {

        var { name, room } = join.params;
        socket.join(room)
        users.addUser(socket.id,name,room);
        io.to(room).emit('usersInRoom',{
            usersInRoom:users.getLisOfUsersInRoom(room)
            
        })
        // console.log(usersInRoom)
        socket.emit('emitEmail', genarateMessage('admin', `wellcome to the ${room} app`));
        socket.broadcast.to(room).emit('emitEmail', genarateMessage('admin', `${name} join room`));
    })

    socket.on("disconnect", () => {
       
      var user = users.removeUser(socket.id)
   
        if(user){
            io.to(user[0].room).emit('usersInRoom',{
                
                // aaaa
                usersInRoom :users.getLisOfUsersInRoom(user[0].room)
            })
            io.to(user[0].room).emit('emitEmail',genarateMessage('Admin',`${user[0].name} has left the room`))
        }
  
    })
    socket.on('toEmail', (email, callBack) => {
        console.log('to email ', email)

        io.emit('emitEmail', genarateMessage(
            email.from, email.text, email.createAt
        ))
        callBack('Send to server success')
    })
    socket.on('createLocation', (message) => {
        io.emit('newLocationMessage', genarateMessageLocation(message.from, message.latitude, message.longitude))
    })
})

server.listen(port, () => {
    console.log(`serve listen on ${port}`);

})

