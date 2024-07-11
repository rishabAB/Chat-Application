const messageModel = require("../models/messageModel");
const chatModel = require("../models/chatModel");

const io = require('socket.io-client');

const socket=new io("http://localhost:3000");

const createMessage = async(req,res) =>
{
    const {chatId,senderId,text} = req.body;

    const message = new messageModel({
        chatId,senderId,text
    });
    try {
        const response = await message.save();
        if(response._doc._id)
        {
            const chatDataResponse = await chatModel.findOne({
                _id: chatId
            });
            
            const obj=chatDataResponse?._doc?.members;
            let receiverId=null;

           for(let o in obj)
           {
            if(obj[o]!=senderId)
            {
                receiverId=obj[o];
                break;
            }
           }

           if(!receiverId)
           {
            res.status(400).json({error:"An unknown error occurred"});
           }
           else{
          
             function callSocket()
             {
                return new Promise((resolve,reject)=>
                {
                  
                    socket.emit("sendMessage",{senderId,receiverId,text,chatId,msgId:response._doc._id})
                    resolve();
                })
            
             } 

             callSocket().then(()=>
                {
                    
                    res.status(200).json(response);
                })

             
           }

            
        }   
      
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
        
    }
   
}

const getMessages = async(req,res) =>
{
    const {chatId} = req.params;

    try {
        const messages = await messageModel.find({chatId});
        res.status(200).json(messages);
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }

}

module.exports ={createMessage,getMessages}