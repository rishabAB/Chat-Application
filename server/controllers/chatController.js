const chatModel=require("../models/chatModel");

const createChat = async(req,res) =>
{
    const {firstId,secondId} = req.body;
    
    try {
        const chat= await chatModel.findOne({
            members:{$all:[firstId,secondId]}
        });

        if(chat) 
        {
            return res.status(200).json(chat);
        }
        else{
            const newChat= new chatModel({
                members:[firstId,secondId]
            });
    
            const response = await newChat.save();
    
            res.status(200).json(response);

        }
           
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

const createMultipleChats = async(req,res) =>
    {
        let arrOfObjects = req.body;
        let response=[];
        
        try {
            if(arrOfObjects && arrOfObjects.length>0)
            {
                for(let elem of arrOfObjects)
                {
                    const chat= await chatModel.findOne({
                        members:{$all:[elem.userId,elem.chatId]}
                    });
                    if(chat)
                    {
                        response.push(chat);
                    }
                    else{
                        const newChat= new chatModel({
                            members:[elem.userId,elem.chatId]
                        });
                
                        const newChatResponse = await newChat.save();
                        response.push(newChatResponse);

                    }

                }
                res.status(200).json(response);

            }
               
            
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }


const findUserChats = async(req,res) =>
{
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members:{$in:[userId]}
        })
        res.status(200).json(chats);
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

const findChat = async() =>
{
    const {firstId,secondId} = req.params;
    
    try {
        const chat = await chatModel.find({
            members:{$all:[firstId,secondId]}
        })
        res.status(200).json(chat);
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }

}

module.exports= {createChat,createMultipleChats,findUserChats,findChat};