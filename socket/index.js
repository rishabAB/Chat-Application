const { Server } = require("socket.io");

const io = new Server({
  cors: ["https://chat-application-client-va28.onrender.com/"],
});
// https://chat-application-client-va28.onrender.com/
// http://localhost:5173/

let onlineUsers = [];

let tabNotification = [];

let notifications = [];

async function updateTabNotifications(recipientId, action, count = 0) {
  return new Promise((resolve, reject) => {
    if (action == "add") {
      let tempCount = 1;
      const elem = tabNotification.find(
        (elem) => elem.recipientId == recipientId
      );
      if (elem) {
        tempCount = elem.count + 1;
        const index = tabNotification.findIndex(
          (elem) => elem.recipientId == recipientId
        );
        tabNotification.splice(index, 1);
        tabNotification.push({ recipientId: recipientId, count: tempCount });
      } else {
        tabNotification.push({ recipientId: recipientId, count: tempCount });
      }
      resolve(tempCount);
    } else if (action == "remove") {
      const elem = tabNotification.find(
        (elem) => elem.recipientId == recipientId
      );
      let tempCount = elem.count - count;
      tempCount > 0 ? tempCount : 0;
      if (elem) {
        const index = tabNotification.findIndex(
          (elem) => elem.recipientId == recipientId
        );
        tabNotification.splice(index, 1);
        tabNotification.push({ recipientId, count: tempCount });
      }
      resolve(tempCount);
    } else {
      const elem = tabNotification.find(
        (elem) => elem.recipientId == recipientId
      );
      resolve(elem.count ? elem.count : 0);
    }
  });
}

async function notificationLogic(array) {
  return new Promise((fulfill, reject) => {
    let deepCopy = [...array];
    // Here instead of sending all the message array for a particular recipient user we are just sending the latest
    // msg and the msg count between a sender and recipient

    // Here we the senderId and the recipientId are the same then we can just send the last msg and count

    // here we are reversing an array to get the latest message
    let reverse_array = [];

    reverse_array = deepCopy.reverse();

    let final_array = [];

    reverse_array.forEach((elem) => {
      if (final_array && final_array.length > 0) {
        let existsOrNot = final_array.find(
          (user) =>
            user.senderId === elem.senderId &&
            user.recipientId === elem.recipientId
        );

        if (!existsOrNot) {
          final_array.push(elem);
        }
      } else {
        final_array.push(elem);
      }
    });

    fulfill(final_array);
  });
}

io.on("connection", (socket) => {
  console.log("new socket connection", socket.id);
  // on is used to receive an event which is addNewuser
  // emit is used to emit an event

  socket.on("addNewUser", async (userId) => {
    // here in the below line we are chekcing that userid exists in onlineusers array or not if not only
    //then add it in onlineusers
    const response = onlineUsers.some((user) => user.userId === userId);

    if (!response && userId) {
      onlineUsers.push({ userId, socketId: socket.id });
      io.emit("showOnlineUsers", onlineUsers);

      // notification part
      let userMessages = notifications.filter(
        (elem) => elem.recipientId === userId
      );

      if (userMessages && userMessages.length > 0) {
        let user = onlineUsers.find(
          (user) => user.userId === userMessages[0].recipientId
        );
        let array = await notificationLogic(userMessages);
        const tabNotificationCount = await updateTabNotifications(
          user.userId,
          "get"
        );
        io.to(user.socketId).emit("sendNotification", {
          array,
          tabNotificationCount,
        });
      }
    }
  });

  io.emit("showOnlineUsers", onlineUsers);

  socket.on("sendMessage", (message) => {
    // this line is basiclaly to check if message has to be recieved by a user
    // whether this user is online or not and if it is online then send message
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      const messageWithTimeline = [{ date: "Today", count: 1 }, message];
      io.to(user.socketId).emit("sendToClient", messageWithTimeline);
      // This event will be fired to a specific socket id this syntax io.to is used to send private message
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId != socket.id);
    // here I think when user gets online his socket id also changes so if the user's socket id
    // does not match with the current socket id it means user is offline
    io.emit("showOnlineUsers", onlineUsers);
  });

  socket.on("saveNotification", async (message) => {
    // COUNT LOGIC
    const senderId = message.senderId;
    const recipientId = message.recipientId;
    let count = 1;
    notifications.forEach((notify) => {
      if (notify.senderId === senderId && notify.recipientId === recipientId) {
        count++;
      }
    });
    const tabNotificationCount = await updateTabNotifications(
      message.recipientId,
      "add"
    );

    notifications.push({ ...message, count });

    // ----------

    // Here check if the recipeitn user is online or not if online then emit otherwise don't do anything
    // for the time being

    // check if this user is online or not

    let isUserOnline = onlineUsers.filter(
      (user) => user.userId === message.recipientId
    );

    if (isUserOnline && isUserOnline.length > 0) {
      let userMessages = notifications.filter(
        (elem) => elem.recipientId === message.recipientId
      );

      let final_array = await notificationLogic(userMessages);

      const array = final_array.map((item) => ({
        ...item,
        notificationTone: true,
      }));

      io.to(isUserOnline[0].socketId).emit("sendNotification", {
        array,
        tabNotificationCount,
      });
    } else {
      // user is offline
    }
  });

  socket.on("removeNotification", async (message) => {
    const removeNotification = notifications.filter(
      (notify) => notify.senderId !== message.senderId
    );
    notifications = removeNotification;

    const tabNotificationCount = await updateTabNotifications(
      message.recipientId,
      "remove",
      message.count
    );
    // In this line we check wthere is online or not
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    if (user && user.socketId) {
      // This is the logic that the messages that we have in notifications is it for the same recipient user or not
      let updatedNotification = [];
      notifications.forEach((notify) => {
        if (notify.recipientId === message.recipientId) {
          updatedNotification.push(notify);
        }
      });
      let array;

      if (updatedNotification && updatedNotification.length > 0) {
        array = await notificationLogic(notifications);
      }
      if (array?.length > 0) {
        let obj = array[0];
        array[0] = { ...obj, removeNotification: true };
      } else if (updatedNotification?.length > 0) {
        let obj = updatedNotification[0];
        updatedNotification[0] = { ...obj, removeNotification: true };
      }

      if (array && array.length > 0) {
        io.to(user.socketId).emit("sendNotification", {
          array,
          tabNotificationCount,
        });
      } else {
        array = updatedNotification;
        io.to(user.socketId).emit("sendNotification", {
          array,
          tabNotificationCount,
        });
      }
    }
  });
});

io.listen(3000, () => console.log("Socket is running on port 3000"));
