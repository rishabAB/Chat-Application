import { useContext, useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/chatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";

import EmojiPicker from "react-input-emoji";
// import { InfiniteLoader, List } from 'react-virtualized';

const ChatBox = () => {

  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading, sendTextMessage, newMessage, moreMessagesAvailable, getPartialMessages } = useContext(ChatContext);


  // scroll part
  const divRef = useRef(null);

  const checkScroll = useRef(null);
  const [offset, setOffset] = useState(2);


  // ---------


  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  // Here recipient User is the person whom with we are showing the conversation

  const [textMessage, setTextMessage] = useState("");

  const [test, setTest] = useState(1);
  // default value for test
  const [isFetching, setIsFetching] = useState(false);
  useLayoutEffect(() => {
console.log("messages",messages);
    if (currentChat && messages && messages.length > 0) {
      if ((test == 1) || (test !== messages[0].chatId)) {
        console.log("SCROLL Got affected", divRef?.current)
        setTest(messages[0].chatId);
        setOffset(2);
        divRef?.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
      }
      else if (isPartialLoading) {
        checkScroll.current.scrollTop = checkScroll.current.scrollHeight - currentScrollPosition;
      }


    }


  }, [messages]);

  const [currentScrollPosition, setCurrentScrollPosition] = useState(null);
  const [isPartialLoading, setIspartialLoading] = useState(false);


  const onWheelCaptureHandler = useCallback(async () => {

    if (checkScroll?.current?.scrollTop < 1000 && moreMessagesAvailable && !isFetching) {
      console.log("OnWheelCapture");

      setIsFetching(true);
      setCurrentScrollPosition(checkScroll.current.scrollHeight - checkScroll.current.scrollTop);

      await getPartialMessages(50, offset, currentChat._id);
      setOffset((prev) => prev + 1);
      setIsFetching(false);
      setIspartialLoading(true);


    }

  })


  useEffect(() => {

    if (newMessage) {
      console.log("NEW MESSAGE SCORLL AFFECTED");
      divRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    }

  }, [newMessage]);

  useEffect(() => {
    setTextMessage("");
  }, [recipientUser]);



  if (isMessagesLoading) {
    return (<Stack gap={4} className="chat-box" style={{ textAlign: "center", width: "100%", "justifyContent": "center" }}>Loading Chats...</Stack>)
  }
  const sendMessage = (event) => {

    if (event.key === "Enter") {
      sendTextMessage(textMessage, user, currentChat._id, sendTextMessage);
      setTextMessage("");

    }
    else if (!event.key && event.type === "click") {
      sendTextMessage(textMessage, user, currentChat._id, sendTextMessage);
      setTextMessage("");

    }


  };

  if (!recipientUser) {
    return (<Stack gap={4} className="chat-box" style={{ textAlign: "center", width: "100%", "justifyContent": "center"}}>No conversation selected yet ...</Stack>)
  }
  return (<Stack gap={4} className="chat-box" >
    <div className="chat-header">
      <strong>{recipientUser.name}</strong>
    </div>
    <Stack gap={3} className="messages" ref={checkScroll} onScroll={onWheelCaptureHandler}  >
    {messages?.length == 0  &&  <h5 style={{textAlign:"center",paddingBottom: "1rem","fontFamily":"system-ui","color":"#5087cfc4" }}>Start a Conversation</h5> }
    {messages?.length>0 && !moreMessagesAvailable && <h5 style={{textAlign:"center",paddingBottom: "1rem","fontFamily":"system-ui","color":"#5087cfc4" }}>Beggining of the conversation</h5> }
      {messages && messages.map((msg, index) => {
        return (

          <Stack key={index} className={`${msg?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
            <span>{msg.text}</span>
            <span className="message-footer">{moment(msg.createdAt).format("LLL")}</span>
            <div ref={divRef}></div>
          </Stack>
        )
      })}
    </Stack>
    <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0" onKeyUp={(e) => sendMessage(e)} >
      <EmojiPicker value={textMessage} onChange={setTextMessage} class="emoji-picker" fontFamily="nunito" borderColor="rgba(72,112,223,0.2)" />
      <button className="send-btn" onClick={sendMessage}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
        </svg>
      </button>
    </Stack>
  </Stack>)

}
export default ChatBox;