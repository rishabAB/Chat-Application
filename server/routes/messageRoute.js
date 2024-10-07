const express = require("express");

const router = express.Router();

const {
  createMessage,
  getMessages,
  partialMessages,
} = require("../controllers/messageController");

router.post("/createMessage", createMessage);

router.get("/:chatId", getMessages);

router.get("/partialMessages/:currentChatId", partialMessages);

module.exports = router;
