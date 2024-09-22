const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) {
      return res.status(200).json(chat);
    } else {
      const newChat = new chatModel({
        members: [firstId, secondId],
      });

      const response = await newChat.save();

      res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const createMultipleChats = async (req, res) => {
  let arrOfObjects = req.body;
  let response = [];

  try {
    if (arrOfObjects && arrOfObjects.length > 0) {
      for (let elem of arrOfObjects) {
        const chat = await chatModel.findOne({
          members: { $all: [elem.userId, elem.chatId] },
        });
        if (chat) {
          response.push(chat);
        } else {
          const newChat = new chatModel({
            members: [elem.userId, elem.chatId],
          });

          const newChatResponse = await newChat.save();
          response.push(newChatResponse);
        }
      }
      res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    let finalResponse = [];
    let latestChats = [];
    for (let item of chats) {
      let id = item._doc._id;
      const messages = await messageModel
        .find({ chatId: id })
        .sort({ createdAt: -1 });
      if (messages && messages.length) {
        latestChats.push(messages[0]);
      }
    }

    latestChats.sort((a, b) => b._doc.createdAt - a._doc.createdAt);
    // Now just reorder

    let index = 0;
    while (index < latestChats.length) {
      let chatId = latestChats[index]._doc.chatId;
      let latestMessage = latestChats[index]._doc.text;
      let latestMessageTime = latestChats[index]._doc.createdAt;
      const chat = await chatModel.find({
        _id: chatId,
      });

      finalResponse.push(...chat);
      let elem = finalResponse[index]._doc;
      let test = {
        ...elem,
        latestMessage: latestMessage,
        latestMessageTime: latestMessageTime,
      };
      finalResponse[index]._doc = test;

      index++;
    }

    index = 0;
    while (index < chats.length) {
      const id = chats[index]._doc._id;

      const checkIfExists = finalResponse.find(
        (elem) => elem._doc._id == id.toString()
      );

      if (!checkIfExists) {
        finalResponse.push(chats[index]);
      }

      index++;
    }

    res.status(200).json(finalResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const findChat = async () => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

module.exports = { createChat, createMultipleChats, findUserChats, findChat };
