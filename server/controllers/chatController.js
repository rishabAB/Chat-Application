const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const moment = require("moment");
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
  console.time("api_time");
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
      let latestMessageTime = await convertDateToTimeline(
        latestChats[index]._doc.createdAt
      );
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

    console.timeEnd("api_time");
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

function getDayString(date, locale = "en-US") {
  const options = { weekday: "long" };
  return new Date(date).toLocaleDateString(locale, options);
}

const convertDateToTimeline = async (messageDate) => {
  return new Promise((resolve, reject) => {
    let date = "";
    let currentDate = new Date();

    if (
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth()
    ) {
      date = "Today";
    } else if (
      messageDate.getDate() === currentDate.getDate() - 1 &&
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth()
    ) {
      date = "Yesterday";
    } else if (
      messageDate.getDate() === currentDate.getDate() - 2 &&
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth()
    ) {
      date = getDayString(messageDate);
    } else if (
      messageDate.getDate() === currentDate.getDate() - 3 &&
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth()
    ) {
      date = getDayString(messageDate);
    } else if (
      messageDate.getDate() === currentDate.getDate() - 4 &&
      messageDate.getFullYear() === currentDate.getFullYear() &&
      messageDate.getMonth() === currentDate.getMonth()
    ) {
      date = getDayString(messageDate);
    } else if (!date) {
      date = moment(messageDate).format("ll");
    }

    resolve(date);
  });
};

module.exports = { createChat, createMultipleChats, findUserChats, findChat };
