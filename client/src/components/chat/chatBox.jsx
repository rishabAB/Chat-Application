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
  const offsetRef = useRef(2);


  // ---------


  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  // Here recipient User is the person whom with we are showing the conversation
 
  const [textMessage, setTextMessage] = useState("");

  const [test, setTest] = useState(1);
  // default value for test
  // const [isFetching, setIsFetching] = useState(false);

  const isFetchingRef = useRef(false);

  useEffect(() => {
console.log("messages",messages);
    if (currentChat && messages && messages.length > 0) {
      if ((test == 1) || (test !== messages[1].chatId )) {
       
        setTest(messages[1]?.chatId);
        setOffset(2);
        offsetRef.current= 2;
     
          // console.log("Scroll getting affected",divRef?.current?.style);
          // divRef?.current?.style?.padding="0.75rem";
          divRef?.current?.scrollIntoView({ behavior: 'instant', block: 'nearest' });
          // console.log("divRef.current.clientHeight",checkScroll?.current?.clientHeight)

          // divRef.current.marginTop = divRef.current.clientHeight;
          // We are changing below value in a timeout because in the above line we are changing
          // the scroll posiiton to bottom first so it needs to reflect first in order make thigns happen
        setTimeout(function()
        {
          setIsScrollButton(false);

        },100)
        
      
      }
      else if (isPartialLoading) {
        checkScroll.current.scrollTop = checkScroll.current.scrollHeight - currentScrollPosition;
        delay(2000).then( 
          onWheelCaptureHandler()
        );
       
      }


    }


  }, [messages]);

  useEffect(()=>
  {
    if(divRef?.current)
    {
      console.log("cdivRef?.current?.style)",divRef?.current?.style?.padding);
      divRef.current.style.padding="unset !important";
      // checkScroll.current.scrollTop = checkScroll.current.clientHeight;

    }

  },[divRef?.current])

  function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  const [currentScrollPosition, setCurrentScrollPosition] = useState(null);
  const [isPartialLoading, setIspartialLoading] = useState(true);

  // The below code is for scroll bar to set it below when component mounts (reloads)
  const [isScrollAllowed,setIsScrollAllowed] = useState(true);
  useEffect(()=>
  {
    if(isScrollAllowed &&  divRef?.current)
    {
      divRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest' });
      setIsScrollAllowed(false);

    }

  })
  const [bottomScrollHeight,setBottomScrollHeight] = useState(null);
 
  // ------------------------------------------------------
  function doSomething()
  {
    console.log("hey");
  }
  useEffect(()=>
  {
    
    if(checkScroll?.current?.scrollTop == 0 && moreMessagesAvailable)
    {
      console.log("Scoroll top 0");
      checkScroll.current.style.pointerEvents = 'none';
      delay(1000).then(
        ()=> {
          onWheelCaptureHandler();

        }   
      );

    }

    // checkScroll?.current?.addEventListener('mousedown', (e)=>
    //   {
    //     console.log("e is ",e);
    //   });
    // onWheelCaptureHandler();  

   

  },[checkScroll?.current?.scrollTop])

  
 const [isScrollButton,setIsScrollButton] = useState(false);
  const onWheelCaptureHandler = useCallback(async () => {
   
    setBottomScrollHeight(checkScroll?.current?.scrollHeight - checkScroll?.current?.clientHeight - checkScroll?.current?.scrollTop);
    // console.log("TRIGGERING",checkScroll)

    if (checkScroll?.current?.scrollTop < 1000 && moreMessagesAvailable && !isFetchingRef.current) {
      console.log("OnWheelCapture",checkScroll?.current?.scrollTop);
      console.log("offset ",offsetRef.current);

      isFetchingRef.current=true;
      // checkScroll.current('mousedown', checkScroll.current);
      // console.log(checkScroll.current.removeEventListener);
      // checkScroll.current.addEventListener('mousedown', doSomething);
      // document.removeEventListener('mousedown', checkScroll.current);
      // checkScroll?.current?.removeEventListener("onmousedown",doSomething);
      checkScroll.current.style.pointerEvents = 'none';
      setCurrentScrollPosition(checkScroll.current.scrollHeight - checkScroll.current.scrollTop);

      await getPartialMessages(50, offsetRef.current, currentChat._id);
       setOffset((prev) => prev + 1);
     
       offsetRef.current+=1;
     await delay(800);
    
     isFetchingRef.current=false;
     checkScroll.current.style.pointerEvents = 'auto';
    //  await delay(1000).then(()=> checkScroll.current.style.pointerEvents = 'auto');

    }
    else if(checkScroll?.current)
    {
      if(bottomScrollHeight > 300)
      {
        setIsScrollButton(true);
      }
      else if(bottomScrollHeight <=300)
      {
        setIsScrollButton(false);
      }

    }

  })


const goToBottom = useCallback(async()=>
{
  divRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  await delay(900);
  setIsScrollButton(false);
 

},[])

  useEffect(() => {

    if (newMessage) {
      console.log("NEW MESSAGE SCORLL AFFECTED");
      divRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    }

  }, [newMessage]);
  const messageBar = useRef(null);

 
  const [minMessageBarHeight,setMinMessageBarHeight] = useState(null);
  useEffect(()=>
  {
    if(messageBar?.current)
    {
      const currentHeight = messageBar?.current?.clientHeight;
      const newHeight = currentHeight + 20;
      // messageBar.current=newHeight;
      setMinMessageBarHeight(newHeight);
    }

  },[messageBar?.current])

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
    {/* <div className="chat-header">
      <strong>{recipientUser.name}</strong>
    </div> */}
    <Stack gap={3} className="messages" ref={checkScroll} onScroll={onWheelCaptureHandler} style={{alignSelf:"unset !important"}}  >
    {messages?.length == 0  &&  <h5 style={{textAlign:"center",paddingBottom: "1rem","fontFamily":"system-ui","color":"#5087cfc4","cursor":"unset !important" }}>Start a Conversation</h5> }
    {messages?.length>0 && !moreMessagesAvailable && <h5 style={{textAlign:"center",paddingBottom: "1rem","fontFamily":"system-ui","color":"#5087cfc4","cursor":"unset !important" }}>Beggining of the conversation</h5> }
      {messages && messages.map((msg, index) => {
        return (
          <Stack direction="vertical" style={{alignSelf:"unset !important",display:"contents"}}>

             <div className = {`${msg?.date ? "timeline" : null}`}>
              {msg?.date}
             </div>
        { !msg.date  &&  (<Stack key={index} className={`${msg?.senderId === user?._id  ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
            <span>{msg.text} </span>
            <span className="message-footer">{moment(msg.createdAt).format("LLL")}</span>
            <div ref={ index === messages.length-1 ? divRef : null}></div>
          </Stack>) }

         </Stack>
         
        
        )
      })}
    
      
     
    </Stack>
    <Stack direction="vertical" style={{"justifyContent": "flex-end","minHeight":`${minMessageBarHeight}px`}} ref={messageBar} >
    {isScrollButton && 
    // <button style = {{backgroundColor:"unset",border:"unset"}} > 
      <svg xmlns="http://www.w3.org/2000/svg"  style={{position: "relative",
        
    backgroundColor: "#175f9f",bottom:"6em",margin:"auto",cursor:"pointer"}} width="30" height="20" fill="currentColor" onClick={goToBottom} className="bi bi-chevron-double-down" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
  <path fillRule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
</svg>
// </button>
}
   
    <div direction="horizontal"  className="chat-input flex-grow-0" onKeyUp={(e) => sendMessage(e)} >
      <EmojiPicker value={textMessage} onChange={setTextMessage} class="emoji-picker" fontFamily="nunito" borderColor="rgba(72,112,223,0.2)" />
      <button className="send-btn" onClick={sendMessage}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
        </svg>
      </button>
    </div>
    </Stack>
  </Stack>)

}
export default ChatBox;