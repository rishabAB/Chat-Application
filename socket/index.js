const {Server} =require("socket.io");

const io=new Server({cors:["http://localhost:5173/"]});


let onlineUsers=[];

let notifications=[];

async function notificationLogic(array)
{
   return new Promise((fulfill,reject) =>
{
    let deepCopy = [...array];
   // Here instead of sending all the message array for a particular recipient user we are just sending the latest 
   // msg and the msg count between a sender and recipient

          // Here we the senderId and the recipientId are the same then we can just send the last msg and count 

           // here we are reversing an array to get the latest message 
           let reverse_array=[];

        reverse_array= deepCopy.reverse();

           let final_array=[];
           
           reverse_array.forEach((elem)=>
           {
               if(final_array && final_array.length>0)
               {
                   let existsOrNot= final_array.find((user)=> user.senderId === elem.senderId && user.recipientId === elem.recipientId)

                   if(!existsOrNot)
                   {
                       final_array.push(elem);
                   }

               }
               else{
                   final_array.push(elem);
               }
           })

           fulfill(final_array);

})
      
}

io.on("connection",(socket)=>
{
console.log("new socket connection",socket.id);
 // on is used to receive an event which is addNewuser 
 // emit is used to emit an event



socket.on("addNewUser",async(userId)=>
{
    // here in the below line we are chekcing that userid exists in onlineusers array or not if not only 
    //then add it in onlineusers 
    const response=onlineUsers.some((user)=> user.userId === userId) 
    console.log("userid is ",userId);
    if(!response && userId)
    {
        onlineUsers.push({userId,socketId:socket.id})
        io.emit("showOnlineUsers",onlineUsers);

        // notification part 
        let userMessages = notifications.filter((elem)=> elem.recipientId ===  userId);
        
        

        if(userMessages && userMessages.length>0)
        {
            let user= onlineUsers.find((user)=> user.userId === userMessages[0].recipientId);
            let array =await notificationLogic(userMessages);
            io.to(user.socketId).emit("sendNotification",array);
        }
       

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

socket.on("saveNotification",async(message)=>
{
    // console.log("message is ",message);

    // COUNT LOGIC
    const senderId = message.senderId;
    const recipientId = message.recipientId;
    let count=1;
    notifications.forEach((notify)=>
    {
        if(notify.senderId === senderId && notify.recipientId === recipientId)
        {
            count++;
        }
    })
    
    notifications.push({...message,count});

    // ----------

    // Here check if the recipeitn user is online or not if online then emit otherwise don't do anything 
    // for the time being

    // check if this user is online or not 

    let isUserOnline = onlineUsers.filter((user)=> user.userId === message.recipientId);

    if(isUserOnline && isUserOnline.length>0)
    {
        let userMessages = notifications.filter((elem)=> elem.recipientId ===  message.recipientId);

        // New logic
        // let final_array=[];

        // let reverse_userMessages=userMessages.reverse();
        // reverse_userMessages.forEach((elem)=>
        // {
        //     if(final_array && final_array.length>0)
        //     {
        //         let test = final_array.find((user)=> user.senderId === elem.senderId);
        //         if(!test)
        //         {
        //             final_array.push(elem);
        //         }

        //     }
        //     else{
        //         final_array.push(elem);
        //     }
        // })

        let final_array = await notificationLogic(userMessages);



        // -------
        
        // Here we are sending the last message and the correct total msg count inorder to optimize the client side
        //  let message_Array=userMessages.slice(-1);
        //  console.log("test",...message_Array);

         const updated_Array = final_array.map(item => ({
            ...item,
            notificationTone: true
          }));
        io.to(isUserOnline[0].socketId).emit("sendNotification",updated_Array);
        
    }
    else{
        // user is offline

    }
})

socket.on("removeNotification",async(message)=>
{
    const removeNotification = notifications.filter((notify) => notify.senderId !== message.senderId);
    notifications=removeNotification;

    console.log("updated notification",notifications);
    // In this line we check wthere is online or not 
    const user=onlineUsers.find(user => user.userId === message.recipientId);
    if(user && user.socketId)
    {
        // This is the logic that the messages that we have in notifications is it for the same recipient user or not
        let my_array=[];
        notifications.forEach((notify)=>
        {
            if( notify.recipientId ===  message.recipientId)
            {
                my_array.push(notify);

            }
        })
        let array;
        if(my_array && my_array.length>0)
        {
            array =await notificationLogic(notifications);

        } 
        // (array && array.length>0) ?  io.to(user.socketId).emit("sendNotification",array) :  io.to(user.socketId).emit("sendNotification",my_array)

            if(array && array.length>0)
            {
                io.to(user.socketId).emit("sendNotification",array)
            }
            else{
                io.to(user.socketId).emit("sendNotification",my_array)

            }
       
    }
   

})


})

io.listen(3000,()=>console.log("Socket is running on port 3000"));