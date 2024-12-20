/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { getRequest, postRequest, baseUrl } from "../utils/services";
import { io } from "socket.io-client";
import sound from "../assets/sound.wav";
import toasts from "../customComponents/toaster/toaster";
import PropTypes from "prop-types";


export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  
  const [userChats, setUserChats] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);

  const [isUserChatError, setIsUserChatError] = useState(null);

  const [currentChat, setCurrentChat] = useState(null);

  const currentChatRef = useRef(currentChat);

  
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

// eslint-disable-next-line no-unused-vars
  const [messagesError, setMessagesError] = useState(null);

  const [messages, setMessages] = useState(null);

  const messageRef = useRef([]);

  const [messageTimeline, setMessageTimeline] = useState(null);

// eslint-disable-next-line no-unused-vars
  const [TextMessageError, setTextMessageError] = useState(null);

  const [newMessage, setNewMessage] = useState(null);

  const newMessageRef = useRef(newMessage);

  const [notification, setNotification] = useState([]);

  const [serverResponse, setServerResponse] = useState(null);

  const [moreMessagesAvailable, setMoreMessagesAvailable] = useState(false);

  const sendToClientTriggered = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Socket part
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [isUserNew, setIsUserNew] = useState(null);

  const [tabNotificationCount,setTabNotificationCount] = useState(0);

  const [isChatBoxOpened, setIsChatBoxOpened] = useState(false);

  // Forming a connection with socket
  useEffect(() => {
    // const socketOptions = {
    //   extraHeaders: {
    //     "ngrok-skip-browser-warning": "69420",
    //   },
    // };

    //   const newSocket = io("https://5c09-2409-40d1-1a-ab3d-22af-5c32-e87d-bd4d.ngrok-free.app", socketOptions);
    const newSocket = io("https://chat-application-socket-hi4k.onrender.com");
    // http://localhost:3000
    // https://chat-application-socket-hi4k.onrender.com"
    
    setSocket(newSocket);

    return () => {
      console.log("hey socket disconnect");
      newSocket.disconnect(); // Here we are trigger the disconnect event
    };
  }, [user]);

  // User has logged out so by using socket

  const wrapEmojis = (text) => {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const parts = text.split(emojiRegex);

    return parts.map((part, index) =>
      emojiRegex.test(part) ? (
        <span key={index} className="emoji">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  useEffect(() => {
    if (socket == null) return;
    socket.emit("addNewUser", user?._id);

    socket.on("showOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("showOnlineUsers");
    };
  }, [socket]);

  const checkTimeline = useCallback(
    (parameter) => {
      return new Promise((resolve) => {
        if (parameter) {
          let deepCopy = [...parameter];
          deepCopy.reverse();

          let res = deepCopy.find((elem) => {
            if (elem?.date == "Today") {
              return elem;
            }
          });
          resolve(res ? true : false);
        }
      });
    },
    [messages, messageRef.current]
  );

  // Tab Notification 
  useEffect(()=>
    {
      const elem = document.querySelector("#tab-title");
      if(tabNotificationCount!= 0)
      {  
        let innerText = `Talkapp (${tabNotificationCount})`;
        elem.innerText = innerText;
      }
      else{  
        console.log("Notify count 0");
        elem.innerText="Talkapp";
      }
     
    },[tabNotificationCount])

    // handle logout 
    useEffect(() => {
      if (!user) {
        setMessages(null);
      }
    }, [user]);


  // AUDIO POOL TO AVOID AUDIO LAGGING

  const audioPool = useRef([]);
  const poolSize = 100; // Adjust pool size as needed

  useEffect(() => {
    // Initialize the audio pool
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(sound);
      audioPool.current.push(audio);
    }
  }, []);

  const getAudioInstance = useCallback(() => {
    for (let audio of audioPool.current) {
      if (audio.paused) {
        return audio;
      }
    }
    return null;
  }, []);

  const playAudio = useCallback(async () => {
    const audio = getAudioInstance();
    if (audio) {
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    } else {
      console.warn("No available audio instances");
    }
  }, [getAudioInstance]);

  // Send Message

  useEffect(() => {
    console.log("messages", messages);

    checkTimeline(messages).then(function (result) {

      if (newMessageRef?.current) {
        if (!result) {
          // it won't have today

          messageRef.current = [
            ...messages,
            { date: "Today", items: [newMessageRef?.current] },
          ];
          setMessages((prev) => [
            ...prev,
            { date: "Today", items: [newMessageRef?.current] },
          ]);
        } else {
          let arr = [];
          for (let message of messages) {
            if (message?.date == "Today") {
              arr = message.items ? message.items : [];
              arr.push(newMessageRef?.current);
              break;
            }
          }

          let index = messages.findIndex((elem) => elem.date == "Today");
          messages.splice(index, 1);

          messageRef.current = [...messages, { date: "Today", items: arr }];
          setMessages((prev) => [...prev, { date: "Today", items: arr }]);
        }

        // This setMessages is for someone who is seing the msg
      }
    });

    if (socket == null) return;
    // here we are finding the recipient user to id of user2 which has to recieve message (using current chat)
    const recipientId = currentChat?.members?.find((id) => id !== user._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });

    // Notification Part

    socket.emit("saveNotification", { ...serverResponse, recipientId });

    // --------------
  }, [newMessage]);

  const setSocketTimelineMessage = useCallback(
    (socketRes) => {
      if (sendToClientTriggered?.current) {
      
        checkTimeline(messageRef.current).then(function (result) {
          let arr = [];
          if (!result) {
            // Today is not there at present
            // messageRef.current = [...messageRef.current,...socketRes];
            // setMessages( (prev) =>[...prev,...socketRes]);
            arr.push(socketRes[1]);

            messageRef.current = [
              ...messageRef.current,
              { date: "Today", items: arr },
            ];
            setMessages((prev) => [...prev, { date: "Today", items: arr }]);
          } else {
            // Today is already there
            // messageRef.current = [...messageRef.current,socketRes[1]];
            // setMessages((prev) => [...prev,socketRes[1]]);

            for (let message of messageRef.current) {
              if (message?.date == "Today") {
                arr = message.items ? message.items : [];
                arr.push(socketRes[1]);
                break;
              }
            }

            let index = messages.findIndex((elem) => elem.date == "Today");
            messages.splice(index, 1);

            messageRef.current = [
              ...messageRef.current,
              { date: "Today", items: arr },
            ];
            setMessages((prev) => [...prev, { date: "Today", items: arr }]);
          }
          sendToClientTriggered.current = false;
        });
      }
    },
    [messages, messageRef.current]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("sendNotification", (message) => {
      if(message?.tabNotificationCount || message?.tabNotificationCount == 0)
        {
         setTabNotificationCount(message?.tabNotificationCount);
        }
      if (
        currentChatRef.current &&
        message &&
        message.array.length > 0 &&
        message.array[0]?.notificationTone
      ) {
        playAudio();
        console.log("PLAY AUDIO");
      }
      

      if(userChats && message.array?.length>0 &&  !message.array[0]?.removeNotification)
      {
      
        let arr=userChats;
        let elem= arr.find((unit) => unit?._id == message.array[0].chatId);
        let index = arr.findIndex((unit) => unit?._id == message.array[0].chatId);
        arr.splice(index,1);
        arr.unshift(elem);
        setUserChats(arr);
        
      }
      setNotification(message.array);
    });
  }, [socket, currentChatRef,userChats]);

  // Receive Message

  useEffect(() => {
    if (socket == null) return;

    socket.on("sendToClient", (res) => {
      // In this if condition if it doesn't match
      // if means user is online but that conversation is not opened so this is the case where we
      //should show the notification
      if (currentChat?._id !== res?.[1]?.chatId) {
        return;

        //we should emit an event saying to socket that save the response
      }

      sendToClientTriggered.current = true;
      setSocketTimelineMessage(res);

      // setMessages((prev)=> [...prev,res]);
      // This if condition will help us to stop from updating the wrong chat
    });

    return () => {
      socket.off("sendToClient");
    };
  }, [socket, currentChat, messages]);
  // Here we are adding currentChat as a dependency beacause of that case if user1 sends message
  // to user2 and user2 is online but user2 hasn't opened the conversation so when'it will get
  // opned currentChat changes probably thats the reason
  // ------------------------
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        toasts.error("An unknown error occured please try again");
        return console.error("Error fetching users", response.error);
      } else {
        const pChats = response.filter((unit) => {
          let isChatCreated = false;
          if (user?._id === unit._id) return false;
          if (userChats) {
            isChatCreated = userChats?.some((chat) => {
              return (
                chat.members[0] === unit._id || chat.members[1] === unit._id
              );
            });
          }
          return !isChatCreated;
        });

        setPotentialChats(pChats);
      }
    };

    getUsers();
  }, [userChats]);

  useEffect(() => {
    if (potentialChats?.length > 0 && userChats?.length == 0) {
      setIsUserNew(true);
    } else {
      setIsUserNew(false);
    }
  }, [potentialChats, userChats,user]);

  const setFullLoader = useCallback((value) => 
  {
    setIsUserChatLoading(value);
  })

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        console.time("FINDUSERCHATS");
        setFullLoader(true);
        setIsUserChatError(null);

        const response = await getRequest(
          `${baseUrl}/chats/findUserChats/${user?._id}`
        );
        console.log("response",response);

        //  setIsUserChatLoading(false);

        if (response.error) {
          toasts.error("An unknown error occured please try again");
          return setIsUserChatError(response);
        }
        setUserChats(response);
        console.timeEnd("FINDUSERCHATS");
      }
      else{
        setIsUserNew(null); 
        setCurrentChat(null);       
      }
    };

    getUserChats();
  }, [user]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, isOnlyEmoji) => {
      if (!textMessage) return console.log("You must type something");

      // Here the user who is sending message will come at the top
      let arr= userChats;
      let elem= arr.find((elem) => elem._id == currentChatId);
      elem.latestMessage=textMessage;
      elem.latestMessageTime ="Today";
      let index = arr.findIndex((elem) => elem._id == currentChatId);
      arr.splice(index,1);
      arr.unshift(elem);
      setUserChats(arr);

      const response = await postRequest(
        `${baseUrl}/messages/createMessage`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
          isOnlyEmoji,
        })
      );

      if (response.error) {
        toasts.error("An unknown error occured please try again");
        return setTextMessageError(response);
      }
      setNewMessage(response);
      newMessageRef.current = response;
      setServerResponse(response);

      // setMessages( (prev) =>[...prev,response]);
      // This setMessages is for someone who is seing the msg
    },
    [userChats]
  );

  useEffect(() => {
    // const getMessages = async () => {
    //   setIsMessagesLoading(true);
    //   setMessagesError(null);

    //   const response = await getRequest(
    //     `${baseUrl}/messages/${currentChat?._id}`
    //   );

    //   setIsMessagesLoading(false);

    //   if (response?.error) {
    //     return setMessagesError(response);
    //   }
    //   setMessages(response?.messages);
    //   setMoreMessagesAvailable(response?.moreMessagesAvailable);
    // };
    if (currentChat) {
      getPartialMessages(0, 0, currentChat?._id);
    }
  }, [currentChat]);

  const removeNotification = useCallback((notify) => {
    socket.emit("removeNotification", notify);
  });

  // const [partialMessagesError, setPartialMessagesError] = useState(null);

  const getPartialMessages = useCallback(
     (limit, offset, currentChatId) => {
    
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (fulfill, reject) => {
        try {
           setIsMessagesLoading(true);
           console.time("FETCH MESSAGES");
          const response = await getRequest(
            `${baseUrl}/messages/partialMessages/${currentChatId}?limit=${limit}&offset=${offset}`
          );
 
          setMessageTimeline(response?.messageTimeline);
          setMessages((prev) => {
            if (prev?.length > 0 && prev[0]?.items[0].chatId == currentChatId) {
              // return ([...prev,...response?.messages])
              // eslint-disable-next-line no-unsafe-optional-chaining
              messageRef.current = [...response?.messages, ...prev];
              // eslint-disable-next-line no-unsafe-optional-chaining
              return [...response?.messages, ...prev];
            } else {
              messageRef.current = response?.messages;
              return response?.messages;
            }
          });
        
           console.timeEnd("FETCH MESSAGES");
          fulfill({ isActionSuccess: true });
          setMoreMessagesAvailable(response?.moreMessagesAvailable);
        } catch (ex) {
          console.error(ex);
         
          reject(ex);
        }
        finally{
          setIsMessagesLoading(false);
        }
      });
    },
    [isMessagesLoading]
  );

 
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
    setIsChatBoxOpened(true);
    currentChatRef.current = chat;
  }, []);

  const updateChatBox = useCallback(() => {
    setIsChatBoxOpened(false);
    setCurrentChat(null);
    setMessages(null)
  }, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // const [windowheight,setWindowheight] = useState(window.outerHeight);
  const [responsizeFrame1, setResponsiveFrame1] = useState(false);

  // useEffect(()=>
  // {
  //     const handleResize = () => {
  //         setWindowheight(window.outerHeight);
  //       };
  //     console.log("windowheight",windowheight);

  //     window.addEventListener('resize', handleResize);

  // },[windowheight])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    
    if (windowWidth < 1000) {
      setResponsiveFrame1(true);
    } else {
      setResponsiveFrame1(false);
    }
  }, [windowWidth]);

  // --Modal

  const updateModal = useCallback((change) => {
    setIsModalOpen(change);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
   
    const response = await postRequest(
      `${baseUrl}/chats/createChat/`,
      JSON.stringify({ firstId, secondId })
    );

    if (response.error) {
      toasts.error("An unknown error occured please try again");
      return console.error("An error occurred", response.error);
    }
    // setUserChats((prev)=>[...prev,response]);
    updateModal(false);
    setUserChats((prev) => {
      return prev ? [...prev, response] : [response];
      // if(prev)
      // {
      //     return [...prev,response];
      // }
      // else{
      //     return [response];
      // }
    });
  }, []);

  const createMultipleChats = useCallback(async (arrOfObjects) => {
    const response = await postRequest(
      `${baseUrl}/chats/createMultipleChats/`,
      JSON.stringify(arrOfObjects)
    );

    if (response.error) {
      toasts.error("An unknown error occured please try again");
      return console.error("An error occurred", response.error);
    }
    else{
      toasts.success("Chats Created Successfully");
    }
    // setUserChats((prev)=>[...prev,response]);
    setUserChats((prev) => {
      return prev ? [...prev, ...response] : [...response];
      // if(prev)
      // {
      //     return [...prev,response];
      // }
      // else{
      //     return [response];
      // }
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        isUserChatError,
        potentialChats,
        createChat,
        createMultipleChats,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notification,
        removeNotification,
        newMessage,
        moreMessagesAvailable,
        getPartialMessages,
        messageTimeline,
        isModalOpen,
        updateModal,
        isUserNew,
        isChatBoxOpened,
        responsizeFrame1,
        updateChatBox,
        wrapEmojis,
        setFullLoader,
      }}
    >
      {" "}
      {children}
    </ChatContext.Provider>
  );
};

ChatContextProvider.propTypes = {
  children: PropTypes.object,
  user: PropTypes.object,
};
