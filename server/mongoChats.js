const { getMessages } = require("./controllers/messageController");
const messageModel = require("./models/messageModel");
const moment = require("moment");
async function deleteMessages()
{
    const response = await messageModel.deleteMany({chatId:'668fcfd5e166e0391ab375b4'});
    console.log("response is ",response);
}
// deleteMessages();  

async function createMessages()
{
    // chatid 668fcfd5e166e0391ab375b4
    // Rishab's userid is 667d1cbaee421d882089b2c1
    for(let i=100;i<150;i++)
    {
        let response = await 
        createSingleMessage('668fcfd5e166e0391ab375b4','667d1cbaee421d882089b2c1',`${i+1}`);

    }
    console.log("All DONE");
}

 function createSingleMessage(chatId,senderId,text)
{
    return new Promise(async(resolve,reject)=>
    {
        const message = new messageModel({
            chatId,senderId,text
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

   let finalArray=[];
   let skipIndex=0;
   let timelineIndex=0;
   let test=true;
   response.forEach((message)=>
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

  console.log("final Array",finalArray);


    // console.log("response is ",response);

}

// getAllMessages();


//  createMessages();
// deleteMessages();
// getAllMessages();

// UserIds

// Rishab's userId 667d1cbaee421d882089b2c1
// Second_user's userId 6687de925a2ff2918403c62d
// Third user userId 668cbb2b56f34660a608b61d
// test active userId 6690c2c0051bca05367db8fc

// ChatIds

// Between Rishab and second_user 668fcfbee166e0391ab3759e 
// Between Rishab and third_user 668fcfd5e166e0391ab375b4
// Between Second_user and third_user 668fcfeee166e0391ab375bc
// Between Rishab and test active  6690c442051bca05367db92d

module.exports = {createMessages,deleteMessages,getAllMessages};