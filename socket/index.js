const {Server} =require("socket.io");

const io=new Server({cors:["http://localhost:5173/"]});


let onlineUsers=[];

let notifications=[];

io.on("connection",(socket)=>
{
console.log("new socket connection",socket.id);
 // on is used to receive an event which is addNewuser 
 // emit is used to emit an event
socket.on("addNewUser",(userId)=>
{
    // here in the below line we are chekcing that userid exists in onlineusers array or not if not only 
    //then add it in onlineusers 
    const response=onlineUsers.some((user)=> user.userId === userId) 
    if(!response && userId)
    {
        onlineUsers.push({userId,socketId:socket.id})
        io.emit("showOnlineUsers",onlineUsers);
    }

    
})

io.emit("showOnlineUsers",onlineUsers);

socket.on("sendMessage",(message)=>
{ 
    // this line is basiclaly to check if message has to be recieved by a user 
    // whether this user is online or not and if it is online then send message
   const user=onlineUsers.find(user => user.userId === message.recipientId);

   if(user)
   {
    io.to(user.socketId).emit("sendToClient",message);
    // This event will be fired to a specifi socket id this syntax io.to is used to send private message 
   }

    
})

socket.on("disconnect",()=>
{
    onlineUsers = onlineUsers.filter(user => user.socketId != socket.id); 
    // here I think when user gets online his socket id also changes so if the user's socket id 
   // does not match with the current socket id it means user is offline 
    io.emit("showOnlineUsers",onlineUsers);
})

socket.on("saveNotification",(message)=>
{
    // console.log("message is ",message);
    notifications.push(message);

    console.log("notifications",notifications);
    
    io.emit("sendNotification",notifications);
})


})

io.listen(3000,()=>console.log("Socket is running on port 3000"));