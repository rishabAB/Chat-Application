const messageModel = require("../models/messageModel");

const NodeCache = require("node-cache");
const myCache = new NodeCache();
const moment = require("moment");

const createMessage = async (req, res) => {
  const { chatId, senderId, text, isOnlyEmoji } = req.body;

  const message = new messageModel({
    chatId,
    senderId,
    text,
    isOnlyEmoji,
  });
  try {
    const response = await message.save();
    if (myCache.has(chatId)) {
      let array = myCache.get(chatId);
      myCache.set(chatId, [...array, message]);
    }
    if (response._doc._id) {
      res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    let moreMessagesAvailable = false;
    let returnObject = { messages: messages, moreMessagesAvailable };

    if (messages?.length > 0) {
      if (messages.length > 50) {
        returnObject.moreMessagesAvailable = true;
      }
    }
    res.status(200).json(returnObject);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const partialMessages = async (req, res) => {
  const { currentChatId } = req.params;
  // myCache.flushAll();
  let limit = req.query?.limit;
  let offset = req.query?.offset;

  let returnObject = { messages: null, moreMessagesAvailable: false };

  if (!limit || limit == 0) {
    limit = 50;
    offset = 0;
  }

  try {
    let messages;
    const exists = myCache.has(currentChatId);

    messages = await messageModel.find({ chatId: currentChatId });
    let completeResponse = await getMessageTimeLine(messages);

    returnObject.messages = completeResponse;
    res.status(200).json(returnObject);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

function getDayString(date, locale = "en-US") {
  const options = { weekday: "long" };
  return new Date(date).toLocaleDateString(locale, options);
}

// Dates part
const today = new Date();
today.setHours(0, 0, 0, 0);
async function checkForDays(givenDate) {
  return new Promise((resolve, reject) => {
    // Set the given date to midnight
    givenDate.setHours(0, 0, 0, 0);

    // Get today's date and set time to midnight

    // Get yesterday's date by subtracting one day from today
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const twoDays = new Date(today);
    twoDays.setDate(today.getDate() - 2);

    const threeDays = new Date(today);
    threeDays.setDate(today.getDate() - 3);

    const fourDays = new Date(today);
    fourDays.setDate(today.getDate() - 4);

    if (today.getTime() === givenDate.getTime()) {
      resolve("Today");
    } else if (givenDate.getTime() === yesterday.getTime()) {
      resolve("Yesterday");
    } else if (
      givenDate.getTime() === twoDays.getTime() ||
      givenDate.getTime() === threeDays.getTime() ||
      givenDate.getTime() === fourDays.getTime()
    ) {
      resolve(getDayString(givenDate));
    } else {
      resolve(givenDate);
    }
  });
}
// --------

function getMessageTimeLine(messages) {
  return new Promise(async (fulfill, reject) => {
    try {
      let messageTimeline = [];
      let currentDate = moment(new Date()).format("Do MMMM, YYYY");
      const date_format = new Date(currentDate);
      let prevDate;

      let isFirst = true;
      let items = [];
      let finalArray = [];
      let testCount = 0;
      let index = 0;

      if (messages.length == 1) {
        let msg = messages[0]._doc.createdAt;
        let currentMsgDate = moment(msg).format("Do MMMM, YYYY");
        let currentDateFormat = new Date(currentMsgDate);

        const dateObject = moment(currentMsgDate, "Do MMMM, YYYY").toDate();

        let date = await checkForDays(dateObject);
        if (typeof date == "object") {
          date = moment(date).format("Do MMMM, YYYY");
        }
        messageTimeline.push(date);
        items.push(messages[0]);
        finalArray.push({ date: date, items: items });
      } else {
        for (let message of messages) {
          let msg = message._doc.createdAt;
          let currentMsgDate = moment(msg).format("Do MMMM, YYYY");

          if (isFirst) {
            prevDate = currentMsgDate;
            isFirst = false;
          } else {
            if (prevDate === currentMsgDate) {
              if (index == messages.length - 1) {
                const dateObject = moment(prevDate, "Do MMMM, YYYY").toDate();

                let date = await checkForDays(dateObject);
                if (typeof date == "object") {
                  date = moment(date).format("Do MMMM, YYYY");
                }
                messageTimeline.push(date);
              }
            } else if (prevDate != currentMsgDate) {
              const dateObject = moment(prevDate, "Do MMMM, YYYY").toDate();

              let date = await checkForDays(dateObject);
              if (typeof date == "object") {
                date = moment(date).format("Do MMMM, YYYY");
              }

              messageTimeline.push(date);
              finalArray.push({
                date: messageTimeline[testCount++],
                items: items,
              });

              prevDate = currentMsgDate;

              items = [];
            }
          }
          items.push(message);
          index++;
        }
      }

      if (items.length > 0 && messages?.length > 1) {
        const dateObject = moment(prevDate, "Do MMMM, YYYY").toDate();

        let date = await checkForDays(dateObject);
        if (typeof date == "object") {
          date = moment(date).format("Do MMMM, YYYY");
        }

        finalArray.push({ date: date, items: items });
      }

      fulfill(finalArray);
    } catch (error) {
      console.error("An error occured in MessageTimeline", error);
    }
  });
}

module.exports = { createMessage, getMessages, partialMessages };
