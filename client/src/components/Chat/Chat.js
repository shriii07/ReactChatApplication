import React,{ useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
let socket;
const ENDPOINT = 'localhost:5000';

const Chat= ({location}) =>{
    const[name,setName]=useState('');
    const[room,setRoom]=useState('');
    const[message,setMessage]=useState('');
    const[messages,setMessages]=useState('');
    useEffect(()=>{
        const {name ,room}=queryString.parse(location.search);
        socket=io(ENDPOINT);
        setName(name);
        setRoom(room);
socket.emit("join",{name,room},({error})=>{
    alert(error);
});
 },[location.search]);
 useEffect(()=>{
socket.on("message",(message)=>{
    setMessages([...messages,message]);
})
 },[messages]);

 const sendMessage=(event)=>{
     event.preventDefault();
     if(message)
     {
         socket.emit("sendMessage",message,()=>setMessage(''));
     }
 }
    return(
       <div className="outerContainer">
<div className="container">
    <InfoBar room={room}></InfoBar>
    <Messages message={messages} name={name}/>
{  /* <input value={mesage} onChange={(event)=>setMessage(event.target.value)} onKeyPress={event => event.key==="Enter" ? sendMessage(event) : null}/>*/}
<Input value={message} setMessage={setMessage} sendMessage={sendMessage}/>
</div>


       </div>

    )
}


export default Chat