const express=require("express");
const app=express();
const socketio=require("socket.io");
const server=require("http").createServer(app);
const io=socketio(server);
const{addUser,removeUser,getUser,getUsersnRoom} =require("./User.js");
io.on("connection",(socket)=>{
console.log("User connected");
socket.on("join",({name,room},callback) => {
    console.log(name, room);
    const{error,user}=addUser({id:socket.id,name,room});

    if(error)
    {
        return callback({error:"Error"});
    }
    socket.emit("message",{user:"admin",text:`${user.name} Welcome to the room ${user.room}`});
    socket.broadcast.to(user.room).emit("message",{user:"admin",text:`${user.name} has joined the room`});
    socket.join(user.room);
});
socket.on("sendMessage",(message,callback)=>{
const user=getUser(socket.id);
io.to(user.room).emit("message",{user:user.name,text:message});
callback();
});
socket.on("disconnect",()=>{
    const user=removeUser(socket.id);
    if(user)
    {
        io.broadcast.to(user.room).emit("message",{user:"admin",text:`${user.name} has left the room`})
    }
    console.log("User disconnected");
});
});
server.listen(5000);