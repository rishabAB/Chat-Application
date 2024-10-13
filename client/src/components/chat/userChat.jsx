import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import React, { useState, useContext, useEffect, useCallback } from "react";
import { ChatContext } from "../../context/chatContext";
import ImageViewer from "react-simple-image-viewer";
import "./chat.scss";
import PropTypes from "prop-types";
import moment from "moment";

const UserChat = ({ chat, user }) => {
  const { recipientUser, imageUrl } = useFetchRecipientUser(chat, user);
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
  const [showNotification, setShowNotification] = useState([]);

  const [showLatestMessage,setShowLatestMessage] = useState(false);

  const handleImageViewer = useCallback(() => {
    setIsViewerOpen((prevIsViewerOpen) => !prevIsViewerOpen);
  }, []);
  
  // -------------------------

  // Here please note in the naming convention in notification get oppsite right in notification.senderId
  // becomes the recipientid and the recipientid becomes the senderid that's why in html we are comparing like that
  useEffect(() => {
    
    if (notification && notification.length > 0) {
      notification.forEach((notify) => {
        if (recipientUser?._id === notify.senderId) {
          if (currentChat?._id === notify.chatId) {
            console.log("Case where chat is already opened");
          
            if(responsizeFrame1)
            {
              if(isChatBoxOpened)
                {
                  setShowLatestMessage(true);
                  removeNotification(notify);
                  setShowNotification([]);
                  chat.latestMessage= notify.text; 
                  chat.latestMessageTime=moment(notify.createdAt).format('ll'); 
                }
                else{
                  setShowLatestMessage(false);
                  setShowNotification([{ ...notify, count: notify.count }]);
                }
            }
            else{
              removeNotification(notify);
              setShowNotification([]);
              chat.latestMessage= notify.text; 
              chat.latestMessageTime=moment(notify.createdAt).format('ll'); 
              // Here Also lastMessage should come
              setShowLatestMessage(true);
            }
          } else {
            setShowNotification([{ ...notify, count: notify.count }]);
            setShowLatestMessage(false);
          }
        }
      });
    } else {
      setShowNotification([]);
      setShowLatestMessage(true);
      // Here Also lastMessage should come
    }
  }, [notification, recipientUser, currentChat,responsizeFrame1,isChatBoxOpened]);

  let [userImageArray, setUserImageArray] = useState();
  const loadImage = useCallback(async () => {
    // imageObjectUrl= await bufferToUrl(user?.profile)
    setUserImageArray([imageUrl]);
  }, [imageUrl]);

  useEffect(() => {
    if (imageUrl) loadImage();
  }, [imageUrl]);

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
            {showNotification?.map((notify, index) =>
              notify.senderId === recipientUser?._id ? (
                <>
                  <div key={index} className="text">
                    {wrapEmojis(notify.text)}
                  </div>
                  <div key={index} className="this-user-notifications">
                    {notify.count}
                  </div>
                </>
              ) : null
            )}
          </div>
          {showLatestMessage && chat?.latestMessage ? (
            <div className="flex-space-between">
              <div className="text">{(chat?.latestMessage)}</div>
              <div className="text">
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
