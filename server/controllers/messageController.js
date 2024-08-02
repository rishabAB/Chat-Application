const messageModel = require("../models/messageModel");

const NodeCache = require('node-cache');
const myCache = new NodeCache();
const moment = require("moment");

const createMessage = async(req,res) =>
{
    const {chatId,senderId,text} = req.body;

    const message = new messageModel({
        chatId,senderId,text
    });
    try {
        const response = await message.save();
        if(myCache.has(chatId))
        {
            let array = myCache.get(chatId);
            myCache.set(chatId,[...array,message]);
        }
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
    // console.log("offset",req.query?.offset);
    console.time();
   
    let returnObject={messages:null,moreMessagesAvailable:false};

    if(!limit || limit == 0)
    {
        limit=50;
        offset=0;
    }

    try {
        let messages;
        const exists = myCache.has(currentChatId);
        if(exists)
        {
            messages = myCache.get(currentChatId);

        }
        else{
            messages = await messageModel.find({ chatId:currentChatId });
            myCache.set(currentChatId, messages);
           
        }   
        messages = await getMessageTimeLine(messages);
        returnObject.messages=messages;
        // returnObject.messages = await getMessageTimeLine(returnObject.messages);

        if(messages?.length > limit)
        {
            
            // New Logic
            if(offset === 0)
            {
                offset =1;
            }
            let startIndex = messages.length-(limit*offset);
            
            let endIndex = messages.length - (limit*(offset-1));

           

            if(startIndex <limit)
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
            console.log(startIndex,endIndex);
                 
        }
        // get it Done
        
        console.timeEnd();
     
        // console.log("returnObject.messages",returnObject.messages);
        res.status(200).json(returnObject);
        
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
    
}

function checkIfExists(messageTimeline,date)
{
    let response = messageTimeline.find((item) => item.date === date);
    return response ? true : false;

}

function getMessageTimeLine(messages)
{
    return new Promise((fulfill,reject)=>
    {
        try{
            let messageTimeline =[];
            let currentDate =  moment(new Date()).format("LL");
            let prevDate;
            let count =1;
          
        console.log("messages",messages)
            messages.forEach((message)=>
            {
                let msg = message._doc.createdAt;
                let date = moment(msg).format("LL");
                if(messageTimeline.length === 0)
                {
                    // messageTimeline.push({date,count:1});
                    prevDate= date;
                }
                else{
                    if(prevDate === date)
                    {
                    //    let object = messageTimeline.find((item) => item.date === date);
                        
                    //    let index = messageTimeline.findIndex(item => item.date === date);
        
                    //    messageTimeline.splice(index,1)
                       
                    //    object.count +=1;
                    //    messageTimeline.push(object);
                    count++;
                    }
                    else if(prevDate !== date){
                        const date=prevDate;
                        messageTimeline.push({date,count});
                        prevDate = date;
                        count=1;
                    }
        
                }
            })
    
            if(messages?.length>0)
            {
                const date= prevDate;
                messageTimeline.push({date,count});
            }
            // console.log("message timeline",messageTimeline);
    
            // fulfill(messageTimeline);
    
            let finalArray=[];
            let skipIndex=0;
            let timelineIndex=0;
            let test=true;
            messages.forEach((message)=>
           {
             if(test || skipIndex === 0)
             {
                 finalArray.push(messageTimeline.at(timelineIndex));
             skipIndex = messageTimeline.at(timelineIndex).count;
             timelineIndex++;
             finalArray.push(message);
             test = false;
             skipIndex--;
         
             }
             else{
                 finalArray.push(message);
                 skipIndex--;
                 if(skipIndex == 0)
                 {
                    test=true;
                 }
             }
             
         
         
                 
           })
    
        //    console.log("final Array",finalArray);
    
           fulfill(finalArray);

        }
        catch(error)
        {
            console.error("An error occured in MessageTimeline",error);
        }
        
       
    })
   
   
}

module.exports ={createMessage,getMessages,partialMessages}