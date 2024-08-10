const { getMessages } = require("./controllers/messageController");
const messageModel = require("./models/messageModel");
const moment = require("moment");
async function deleteMessages()
{
    const response = await messageModel.deleteMany({chatId:'66b0689b29ac622b5a0b14e1'});
    console.log("response is ",response);
}
//   deleteMessages();  

async function createMessages(chatId,senderId)
{
    // chatid 668fcfd5e166e0391ab375b4
    // Rishab's userid is 667d1cbaee421d882089b2c1
    for(let i=0;i<101;i++)
    {
        if(i>=0 && i<=7)
        {
            // 27th july
            const date = new Date();
            date.setDate(date.getDate() - 6);

            await createSingleMessage(chatId,senderId,`${i+1}`,date,date);
        }
        else if(i>7 && i<=13)
        {
             // 28th july
             const date = new Date();
             date.setDate(date.getDate() - 5);
             await createSingleMessage(chatId,senderId,`${i+1}`,date,date);

        }
        else if(i>13 && i<=20)
        {
            // 29th july
            const date = new Date();
            date.setDate(date.getDate() - 4);
            await createSingleMessage(chatId,senderId,`${i+1}`,date,date);

        }
        else if(i>20 && i<=27)
        {
            // 30th july
            const date = new Date();
            date.setDate(date.getDate() - 3);
            await createSingleMessage(chatId,senderId,`${i+1}`,date,date);

        }
        else if(i>27 && i<=33)
        {
             // 31st July
             const date = new Date();
             date.setDate(date.getDate() - 2);
             await createSingleMessage(chatId,senderId,`${i+1}`,date,date);
        }
        else if(i>33 && i<=41)
        {
            // 1nd August
            const date = new Date();
            date.setDate(date.getDate() - 1);
            await createSingleMessage(chatId,senderId,`${i+1}`,date,date);

        }
        // else if(i>150 && i<=175)
        // { 
        //     // 2rd August
        //     const date = new Date();
        //     await createSingleMessage(chatId,senderId,`${i+1}`,date,date);

        // }
       
    }
    console.log("All DONE");
    
}
    //    createMessages("66b0689b29ac622b5a0b14e1","66b065a429ac622b5a0b149c");

 function createSingleMessage(chatId,senderId,text,createdAt,updatedAt)
{
    return new Promise(async(resolve,reject)=>
    {
        const message = new messageModel({
            chatId,senderId,text,createdAt,updatedAt
        });
        const response =await message.save();
        resolve(response);

    })
   
}

function checkIfExists(messageTimeline,date)
{
    let response = messageTimeline.find((item) => item.date === date);
    return response ? true : false;

}

async function getAllMessages()
{
    const response= await messageModel.find(({chatId:"6690c442051bca05367db92d"}));
    let messageTimeline =[];
    // let date =response[0]._doc.createdAt.getDate();
    // let month = response[0]._doc.createdAt.getMonth() +1 ;
    // let year = response[0]._doc.createdAt.getFullYear();
    // console.log(date,month,year);
    let date = moment(response[0]._doc.createdAt).format("LL");

    response.forEach((message)=>
    {
        let msg = message._doc.createdAt;
        let date = moment(msg).format("LL");
        if(messageTimeline.length === 0)
        {
            messageTimeline.push({date,count:1});
        }
        else{
            if(checkIfExists(messageTimeline,date))
            {
               
               let object = messageTimeline.find((item) => item.date === date);

               let index = messageTimeline.findIndex(item => item.date === date);

               messageTimeline.splice(index,1)
               
               object.count +=1;
               messageTimeline.push(object);
            }
            else{
                // append
                // console.log("else part");
                messageTimeline.push({date,count:1});

            }

        }

    })

   
    

}

async function isYesterday(date) {
    const givenDate = new Date(date); // Convert input to Date object

    // Set the given date to midnight
    givenDate.setHours(0, 0, 0, 0);

    // Get today's date and set time to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get yesterday's date by subtracting one day from today
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Compare the given date with yesterday's date
    return givenDate.getTime() === yesterday.getTime();
}

// Example usage
const dateToCheck = "2024-08-09";
const today= new Date();
const yesterday = new Date(new Date());
yesterday.setDate(today.getDate() - 2);// Example date string (YYYY-MM-DD)
//  console.log(isYesterday(yesterday)) // Outputs: true or false



module.exports = {createMessages,deleteMessages,getAllMessages};