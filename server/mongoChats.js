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
//  createMessages();
// deleteMessages();

module.exports = {createMessages,deleteMessages};