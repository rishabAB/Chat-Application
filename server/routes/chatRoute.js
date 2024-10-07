const express = require("express");

const router = express.Router();

const {
  createChat,
  createMultipleChats,
  findUserChats,
  findChat,
} = require("../controllers/chatController");

router.post("/createChat", createChat);

router.post("/createMultipleChats", createMultipleChats);

router.get("/findUserChats/:userId", findUserChats);

router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
