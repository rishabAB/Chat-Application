const express=require("express");

const router=express.Router();

const {createChat,findUserChats,findChat} = require("../controllers/chatController");

router.post("/createChat",createChat);

router.get("/findUserChats:/userId",findUserChats);

router.get("/find/:firstId/:secondId",findChat);

module.exports=router;