const {Server} =require("socket.io");

const io=new Server({cors:"http://localhost:5173/"});

let onlineUsers=[];

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
    }
    


console.log("online users",onlineUsers);

})

io.emit("showOnlineUsers",onlineUsers);



})

io.listen(3000,()=>console.log("Socket is running on port 3000"));