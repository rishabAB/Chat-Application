const messageModel = require("./models/messageModel");

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

async function getAllMessages()
{
    const response= await messageModel.find(({chatId:"668fcfbee166e0391ab3759e"}));
    console.log("response is ",response);

}
//  createMessages();
// deleteMessages();
// getAllMessages();

// UserIds

// Rishab's userId 667d1cbaee421d882089b2c1
// Second_user's userId 6687de925a2ff2918403c62d
// Third user userId 668cbb2b56f34660a608b61d

// ChatIds

// Between Rishab and second_user 668fcfbee166e0391ab3759e 
// Between Rishab and third_user 668fcfd5e166e0391ab375b4
// Between Second_user and third_user 668fcfeee166e0391ab375bc

module.exports = {createMessages,deleteMessages,getAllMessages};