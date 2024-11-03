/* eslint-disable no-unused-vars */
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import React, { useState, useContext, useEffect, useCallback } from "react";
import { ChatContext } from "../../context/chatContext";
import ImageViewer from "react-simple-image-viewer";
import "./chat.scss";
import PropTypes from "prop-types";
import moment from "moment";

const UserChat = ({ chat, user }) => {
  const { recipientUser, imageUrl ,recipientNotification} = useFetchRecipientUser(chat, user);
  const {
    onlineUsers,
    notification,
    currentChat,
    removeNotification,
    updateCurrentChat,
    wrapEmojis,
    responsizeFrame1,
    isChatBoxOpened,
  } = useContext(ChatContext);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // recipient user is the list of users with whom we can chat which are there on left side
  // when we click our messages appear
  const [showNotification, setShowNotification] = useState();

  const [showLatestMessage,setShowLatestMessage] = useState(true);

  const handleImageViewer = useCallback(() => {
    setIsViewerOpen((prevIsViewerOpen) => !prevIsViewerOpen);
  }, []);
  
  // -------------------------

  // Here please note in the naming convention in notification get oppsite right in notification.senderId
  // becomes the recipientid and the recipientid becomes the senderid that's why in html we are comparing like that
  // useEffect(() => {
    
  //   if (notification && notification.length > 0) {
  //     notification.forEach(async(notify) => {
  //       if (recipientUser?._id === notify.senderId) {
  //         if (currentChat?._id === notify.chatId) {
  //           console.log("Case where chat is already opened");
          
  //           if(responsizeFrame1)
  //           {
  //             if(isChatBoxOpened)
  //               {
  //                 setShowLatestMessage(true);
  //                 removeNotification(notify);
  //                 setShowNotification([]);
  //                 chat.latestMessage= notify.text; 
  //                 chat.latestMessageTime=await convertDateToTimeline(notify.createdAt);
  //               }
  //               else{
  //                 setShowLatestMessage(false);
  //                 setShowNotification([{ ...notify, count: notify.count }]);
  //               }
  //           }
  //           else{
  //             removeNotification(notify);
  //             setShowNotification([]);
  //             chat.latestMessage= notify.text; 
  //             chat.latestMessageTime=await convertDateToTimeline(notify.createdAt);
  //             // Here Also lastMessage should come
  //             setShowLatestMessage(true);
  //           }
  //         } else {
  //           setShowNotification([{ ...notify, count: notify.count }]);
  //           setShowLatestMessage(false);
  //         }
  //       }
  //     });
  //   } else {
  //     setShowNotification([]);
  //     setShowLatestMessage(true);
  //     // Here Also lastMessage should come
  //   }
  // }, [notification, recipientUser, currentChat,responsizeFrame1,isChatBoxOpened]);
  

  useEffect(()=>
  {
    if(recipientNotification)
    {
            
        if(currentChat?._id == recipientNotification?.chatId)
          {
            console.log("Case where chat is already opened");
            removeNotification(recipientNotification);
            setShowNotification(null);
            convertDateToTimeline(recipientNotification.createdAt).then(function(result) 
            {
              chat.latestMessageTime = result;
              chat.latestMessage= recipientNotification.text; 
              setShowLatestMessage(true);
            })                    
          }
          else{
            setShowNotification({...recipientNotification,count:recipientNotification.count});
            setShowLatestMessage(false);
            console.log("Some Other chat is opened");
          }
    }
    else{
      setShowNotification();
      setShowLatestMessage(true);
    }
  },[recipientNotification,currentChat,recipientUser])

  let [userImageArray, setUserImageArray] = useState();
  const loadImage = useCallback(async () => {
    // imageObjectUrl= await bufferToUrl(user?.profile)
    setUserImageArray([imageUrl]);
  }, [imageUrl]);

  useEffect(() => {
    if (imageUrl) loadImage();
  }, [imageUrl]);


  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function getDayString(date, locale = "en-US") {
    const options = { weekday: "long" };
    return new Date(date).toLocaleDateString(locale, options);
  }
  

  const convertDateToTimeline = async (msg) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      let date = "";
      let currentDate = new Date();
      let messageDate = new Date(msg);
      
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

  //------------

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center justify-content-between"
      role="button"
    >
      <div className="d-flex align-items-center full-width full-height">
        <div className="me-2">
          <img
            src={userImageArray?.[0]}
            onClick={handleImageViewer}
            className="user-img"
            alt=""
          />
        </div>
        <div className="text-content" onClick={() => updateCurrentChat(chat)}>
          <div className="name">{recipientUser?.name}</div>

          <div className="flex-space-between">
            {showNotification ? (
                <>
                  <div  className="text">
                    {wrapEmojis(showNotification?.text)}
                  </div>
                  <div  className="this-user-notifications">
                    {showNotification?.count}
                  </div>
                </>
              ) : null
            }
          </div>
          {showLatestMessage ? (
            <div className="flex-space-between ">
              <div className="text ellipsis ">{(chat?.latestMessage)}</div>
              <div className="text ">
              {chat?.latestMessageTime}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {onlineUsers.some((user) => user.userId === recipientUser?._id) ? (
        <div className="user-online"></div>
      ) : null}

      {isViewerOpen && (
        <ImageViewer
          src={userImageArray}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={handleImageViewer}
        />
      )}
    </Stack>
  );
};

UserChat.propTypes = {
  chat: PropTypes.object,
  user: PropTypes.object,
};

export default UserChat;
