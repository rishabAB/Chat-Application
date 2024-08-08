const { getMessages } = require("./controllers/messageController");
const messageModel = require("./models/messageModel");
const moment = require("moment");
async function deleteMessages()
{
    const response = await messageModel.deleteMany({chatId:'66b0689b29ac622b5a0b14e1'});
    console.log("response is ",response);
}
    // deleteMessages();  

async function createMessages(chatId,senderId)
{
    // chatid 668fcfd5e166e0391ab375b4
    // Rishab's userid is 667d1cbaee421d882089b2c1
    for(let i=0;i<151;i++)
    {
        if(i>=0 && i<=25)
        {
            // 27th july
            const date = new Date();
            date.setDate(date.getDate() - 6);

            await createSingleMessage(chatId,senderId,`${i+1}`,date,date);
        }
        else if(i>25 && i<=50)
        {
             // 28th july
             const date = new Date();
             date.setDate(date.getDate() - 5);
             await createSingleMessage(chatId,senderId,`${i+1}`,date,date);

        }
        else if(i>50 && i<=75)
        {
            // 29th july
            const date = new Date();
            date.setDate(date.getDate() - 4);
            await createSingleMessage(chatId,senderId,`${i+1}`,date,date);

        }
        else if(i>75 && i<=100)
        {
            // 30th july
            const date = new Date();
            date.setDate(date.getDate() - 3);
            await createSingleMessage(chatId,senderId,`${i+1}`,date,date);

        }
        else if(i>100 && i<=125)
        {
             // 31st July
             const date = new Date();
             date.setDate(date.getDate() - 2);
             await createSingleMessage(chatId,senderId,`${i+1}`,date,date);
        }
        else if(i>125 && i<=150)
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
    // createMessages("66b0689b29ac622b5a0b14e1","66b065a429ac622b5a0b149c");

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
//    console.log( messageTimeline);

//    let finalArray=[];
//    let skipIndex=0;
//    let timelineIndex=0;
//    let test=true;
//    response.forEach((message)=>
//   {
//     if(test || skipIndex === 0)
//     {
//         finalArray.push(messageTimeline.at(timelineIndex));
//     skipIndex = messageTimeline.at(timelineIndex).count;
//     timelineIndex++;
//     finalArray.push(message);
//     test = false;
//     skipIndex--;

//     }
//     else{
//         finalArray.push(message);
//         skipIndex--;
//         if(skipIndex == 0)
//         {
//             test=true;
//         }
//     }
    


        
//   })

//   console.log("final Array",finalArray);


    // console.log("response is ",response);

}



module.exports = {createMessages,deleteMessages,getAllMessages};