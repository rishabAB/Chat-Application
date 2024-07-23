const messageModel = require("../models/messageModel");


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
    
            res.status(200).json(response);
             
           }

            
        }   
      
        
     catch (error) {
        console.error(error);
        res.status(500).json(error);
        
    }
   
}

const getMessages = async(req,res) =>
{
    const {chatId} = req.params;

    try {
        const messages = await messageModel.find({chatId})
        let moreMessagesAvailable = false;
        let returnObject={messages:messages,moreMessagesAvailable};
        // Here we are reversing the array of messages in order to fix scrollbar issues
        if(messages?.length>0)
        {
            if(messages.length > 50)
            {
                returnObject.moreMessagesAvailable=true;
            }

        }
        res.status(200).json(returnObject );
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }

}

const partialMessages = async(req,res)=>
{
    const {currentChatId} = req.params;
    let limit= req.query?.limit;
    let offset = req.query?.offset;
    var filteredMessages;
    let numberOfRecords;
    console.log("offset",req.query?.offset);
   
    let returnObject={messages:null,moreMessagesAvailable:false};

    if(!limit || limit == 0)
    {
        limit=50;
        offset=0;
    }

    try {
        const messages = await messageModel.find({ chatId:currentChatId });

        returnObject.messages=messages;

        if(messages?.length > 50)
        {
            // Old login where we are fetching all the data 
            // like 50 records then 100 then 150 all the records 
            
            // Now we'll fetch only new records in 50-50 batches only 50 batches according to index
            // Old Logic 

            // numberOfRecords =(limit*offset);
            // filteredMessages = (numberOfRecords === 0) ? messages.slice(messages.length-50,messages.length) :  messages.slice(messages.length-numberOfRecords,messages.length);
            // if(filteredMessages.length < messages?.length)
            //     {
            //         returnObject.moreMessagesAvailable=true;
            //     }
            //     returnObject.messages=filteredMessages;
            
            
            // New Logic
            if(offset === 0)
            {
                offset =1;
            }
            let startIndex = messages.length-(limit*offset);
            
            let endIndex = messages.length - (limit*(offset-1));

           

            if(startIndex <50)
            {
              startIndex =0;
            }
          
            filteredMessages = messages.slice(startIndex ,endIndex)
          
            returnObject.moreMessagesAvailable=true;
            returnObject.messages=filteredMessages;
            
            if(limit*offset >= messages.length || startIndex === 0)
            {
                returnObject.moreMessagesAvailable=false;
            }
           
            
           
        }
      
        res.status(200).json(returnObject);
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
    
}

module.exports ={createMessage,getMessages,partialMessages}