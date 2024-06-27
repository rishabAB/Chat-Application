const express=require("express");

const router=express.Router();

const {createMessage,getMessages} = require("../controllers/messageController");

router.post("/createMessage",createMessage);

router.get("/:chatId",getMessages);


module.exports=router;