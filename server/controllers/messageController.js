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

function deleteTodaysDate(messages)
{
    console.log("new Date().getDate()",new Date());
    let currentDate = new Date();
    let c=1;
    messages.forEach((msg)=>
    {
        date = msg?.date;
        items = msg.items;
       
        if(date === "Today" ) 
        {
            let index = messages.findIndex(unit => unit.date == "Today");
            messages.splice(index,1);
            while(index<messages.length)
            {
                messages.splice(index,1);
                // index++;
            }
        }
        else if(!date)
        {
            let index = messages.findIndex(unit => unit.date == undefined);
            messages.splice(index,1);
            // while(index<messages.length)
            // {
                messages.splice(index,1);
                // index++;
            // }

        }
    })

}

const partialMessages = async(req,res)=>
{
    const {currentChatId} = req.params;
    // myCache.flushAll();
    let limit= req.query?.limit;
    let offset = req.query?.offset;
    var filteredMessages;
    let numberOfRecords;
    // console.log("offset",req.query?.offset);
    // console.time();
   
    let returnObject={messages:null,moreMessagesAvailable:false};

    if(!limit || limit == 0)
    {
        limit=50;
        offset=0;
    }

    try {
        let messages;
        let messageTimeline;
        const exists = myCache.has(currentChatId);
        // if(exists)
        // {
        //     messages = myCache.get(currentChatId);

        // }
        // else{
            messages = await messageModel.find({ chatId:currentChatId });
            let completeResponse =await testingGetMessageTimeLine(messages)
          
            // myCache.set(currentChatId, messages);
           
        // }   
    //    TESTING FOR TIMELINE
    // messages = response?.finalArray;
    // let response=[];
    // if(offset ==0)
    // {
    //     // response.push(completeResponse[0]);
    //     response.push(completeResponse[1]);
    //     response.push(completeResponse[2]);
    //     // completeResponse[3].date="Tuesday";
    //     response.push(completeResponse[3]);
    //     // completeResponse[4].date="Yesterday";
    //     response.push(completeResponse[4]);

    // }
    // else{
       

    // }
    // // messageTimeline = response?.messageTimeline;
    // if(offset == 0)
    // {
    //     returnObject.moreMessagesAvailable=true;
    // }
    returnObject.messages=completeResponse;
    //  deleteTodaysDate(returnObject.messages);
    res.status(200).json(returnObject);

    // -----------------------
        // returnObject.messages=messages;
        // returnObject.messageTimeline=messageTimeline;
        // returnObject.messages = await getMessageTimeLine(returnObject.messages);

        // if(messages?.length > limit)
        // {
            
        //     // New Logic
        //     if(offset === 0)
        //     {
        //         offset =1;
        //     }
        //     let startIndex = messages.length-(limit*offset);
            
        //     let endIndex = messages.length - (limit*(offset-1));

           

        //     if(startIndex <limit)
        //     {
        //       startIndex =0;
        //     }
          
        //     filteredMessages = messages.slice(startIndex ,endIndex)
          
        //     returnObject.moreMessagesAvailable=true;
        //     returnObject.messages=filteredMessages;
            
        //     if(limit*offset >= messages.length || startIndex === 0)
        //     {
        //         returnObject.moreMessagesAvailable=false;
        //     }
        //     console.log(startIndex,endIndex);
                 
        // }
        // get it Done
        
        // console.timeEnd();
     
        // console.log("returnObject.messages",returnObject.messages);
        //  deleteTodaysDate(returnObject.messages);
        // res.status(200).json(returnObject);
        
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
function getDayString(date, locale = 'en-US') {
    const options = { weekday: 'long' };
    return new Date(date).toLocaleDateString(locale, options);
  }

function getMessageTimeLine(messages)
{
    return new Promise((fulfill,reject)=>
    {
        try{
            let messageTimeline =[];
            let currentDate =  moment(new Date()).format("LL");
            const date_format = new Date(currentDate);
            let prevDate;
            let count =1;
            let isFirst = true;
          
        // console.log("messages",messages)
            messages.forEach((message)=>
            {
                let msg = message._doc.createdAt;
                let date = moment(msg).format("LL");
                if(isFirst)
                {
                    // messageTimeline.push({date,count:1});
                    prevDate= date;
                    isFirst=false;
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
                        {
                            let date=prevDate;
                            // let date_format = new date
                            let currentDateFormat = new Date(date);
                            // console.log(currentDateFormat.getDate());
                            if(currentDateFormat.getDate() === date_format.getDate() -1 && currentDateFormat.getFullYear() === date_format.getFullYear() && currentDateFormat.getMonth() === date_format.getMonth())
                            {
                                date="Yesterday";
                            }
                            else if(currentDateFormat.getDate() === date_format.getDate() -2 && currentDateFormat.getFullYear() === date_format.getFullYear() && currentDateFormat.getMonth() === date_format.getMonth())
                                {
                                    // console.log("currentDateFormat",getDayString(currentDateFormat));
                                    date=getDayString(currentDateFormat);
                                }
                            else if(currentDateFormat.getDate() === date_format.getDate() -3 && currentDateFormat.getFullYear() === date_format.getFullYear() && currentDateFormat.getMonth() === date_format.getMonth())
                                {
                                    // console.log("currentDateFormat",getDayString(currentDateFormat));
                                    date=getDayString(currentDateFormat);
                                }
                            else if(currentDateFormat.getDate() === date_format.getDate() -4 && currentDateFormat.getFullYear() === date_format.getFullYear() && currentDateFormat.getMonth() === date_format.getMonth())
                                {
                                    // console.log("currentDateFormat",getDayString(currentDateFormat));
                                    date=getDayString(currentDateFormat);
                                }
    
                            messageTimeline.push({date,count});
                        }
                       
                        prevDate = date;
                        count=1;
                    }
        
                }
            })
    
            if(messages?.length>0)
            {
                let date= prevDate;
                let currentDateFormat = new Date(date);
                if(date === currentDate)
                {
                    date="Today";
                }
               else if(currentDateFormat.getDate() === date_format.getDate() -1 && currentDateFormat.getFullYear() === date_format.getFullYear() && currentDateFormat.getMonth() === date_format.getMonth())
                    {
                        date="Yesterday";
                    }
                else if(currentDateFormat.getDate() === date_format.getDate() -2 && currentDateFormat.getFullYear() === date_format.getFullYear() && currentDateFormat.getMonth() === date_format.getMonth())
                    {
                            // console.log("currentDateFormat",getDayString(currentDateFormat));
                        date=getDayString(currentDateFormat);
                    }
                else if(currentDateFormat.getDate() === date_format.getDate() -3 && currentDateFormat.getFullYear() === date_format.getFullYear() && currentDateFormat.getMonth() === date_format.getMonth())
                    {
                            // console.log("currentDateFormat",getDayString(currentDateFormat));
                        date=getDayString(currentDateFormat);
                    }
                else if(currentDateFormat.getDate() === date_format.getDate() -4 && currentDateFormat.getFullYear() === date_format.getFullYear() && currentDateFormat.getMonth() === date_format.getMonth())
                    {
                            // console.log("currentDateFormat",getDayString(currentDateFormat));
                        date=getDayString(currentDateFormat);
                    }
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
    
           fulfill({finalArray,messageTimeline});

        }
        catch(error)
        {
            console.error("An error occured in MessageTimeline",error);
        }
        
       
    })
   
   
}

// Dates part
const today = new Date();
today.setHours(0, 0, 0, 0);
async function checkForDays(givenDate) {
    return new Promise((resolve,reject)=>
    {
    // Set the given date to midnight
    givenDate.setHours(0, 0, 0, 0);

    // Get today's date and set time to midnight
  

    // Get yesterday's date by subtracting one day from today
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const twoDays = new Date(today);
    twoDays.setDate(today.getDate() - 2);

    const threeDays = new Date(today);
    threeDays.setDate(today.getDate() - 3);

    const fourDays = new Date(today);
    fourDays.setDate(today.getDate() - 4);


    if(today.getTime() === givenDate.getTime())
    {
        resolve("Today");
    }
    else if(givenDate.getTime() === yesterday.getTime())
    {
        resolve ("Yesterday");
    }
    else if((givenDate.getTime() === twoDays.getTime()) || (givenDate.getTime() === threeDays.getTime()) || (givenDate.getTime() === fourDays.getTime()))
    {
        resolve (getDayString(givenDate));
    }
    else{
        resolve (givenDate);
    }


    })
   
}
// --------

function testingGetMessageTimeLine(messages)
{
    return new Promise(async(fulfill,reject)=>
    {
        try{
            let messageTimeline =[];
            let currentDate =  moment(new Date()).format("Do MMMM, YYYY");
            const date_format = new Date(currentDate);
            let prevDate;
            
            let isFirst = true;
            let items=[];
            let finalArray =[];
            let testCount=0;
            let index=0;

            if(messages.length == 1)
            {
                let msg = messages[0]._doc.createdAt;
                let currentMsgDate = moment(msg).format("Do MMMM, YYYY");
                let currentDateFormat = new Date(currentMsgDate);

                const dateObject = moment(currentDateFormat, 'Do MMMM, YYYY').toDate();
                
                let date = await checkForDays(dateObject);
                if(typeof date == "object")
                {
                   date= moment(date).format("Do MMMM, YYYY");
                }
                messageTimeline.push(date);
                items.push(messages);

            }
            else{
                for(let message of messages)
                {
                    let msg = message._doc.createdAt;
                    let currentMsgDate = moment(msg).format("Do MMMM, YYYY");
                  
                    if(isFirst)
                    {   
                        prevDate= currentMsgDate;
                        isFirst=false;
                      
                    }
                    else{
    
                        if(prevDate === currentMsgDate)
                        {
                            if(index == messages.length-1)
                            {
                                //  let currentDateFormat = prevDate;

                                const dateObject = moment(prevDate, 'Do MMMM, YYYY').toDate();

                                let date = await checkForDays(dateObject);
                                if(typeof date == "object")
                                {
                                   date= moment(date).format("Do MMMM, YYYY");
                                }
                                messageTimeline.push(date);
                            }
                       
                        }
                        else if(prevDate != currentMsgDate)
                        {
                                
                        const dateObject = moment(prevDate, 'Do MMMM, YYYY').toDate();
                        // let currentDateFormat = new Date(dateObject);
                        let date = await checkForDays(dateObject);
                        if(typeof date == "object")
                        {
                           date= moment(date).format("Do MMMM, YYYY");
                        }
                              
                        messageTimeline.push(date);
                        finalArray.push({date:messageTimeline[testCount++],items:items});
                                       
                        prevDate = currentMsgDate;
                       
                        items=[];
    
                        }
            
                    }
                    items.push(message);
                    index++;
    
                }

            }
          
         
            if(items.length>0)
            {
                finalArray.push({date:messageTimeline[testCount++],items:items});
            }
    
           
            fulfill(finalArray);
      
        }
        catch(error)
        {
            console.error("An error occured in MessageTimeline",error);
        }
        
       
    })
   
   
}

module.exports ={createMessage,getMessages,partialMessages}