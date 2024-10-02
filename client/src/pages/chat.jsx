import React, { useContext, useCallback, useRef, useEffect } from "react";
import { Stack } from "react-bootstrap";
import { ChatContext } from "../context/chatContext";
import { AuthContext } from "../context/authContext";
import UserChat from "../components/chat/userChat";

import ChatBox from "../components/chat/chatBox";
import Loader from "../customComponents/loader/loader"
const Chat = () => {
  const { user } = useContext(AuthContext);

  const {
    userChats,
    isUserChatLoading,
    isUserNew,
    isChatBoxOpened,
    responsizeFrame1,
    updateModal,
  } = useContext(ChatContext);

  const pRef = useRef(null);

  // ---------------
  const textEffect = useCallback(
    (animationName, txt) => {
      console.time("myTimer");
      if (pRef && pRef.current) {
        var text = txt,
          chars = text.length,
          newText = "",
          animation = animationName,
          i;

        for (i = 0; i < chars; i += 1) {
          newText += "<i>" + text.charAt(i) + "</i>";
        }

        pRef.current.innerHTML = newText;

        var wrappedChars = document.getElementsByTagName("i"),
          wrappedCharsLen = wrappedChars.length,
          j = 0;

        function addEffect() {
          setTimeout(function () {
            wrappedChars[j].className = animation;
            j += 1;
            if (j < wrappedCharsLen) {
              addEffect();
            } 
            else {
                setTimeout(()=>
                {
                    updateModal(true);
                },5000)

                console.timeEnd("myTimer");
            }
          }, 100);
        }

        addEffect();
       
      }
    },
    [pRef?.current]
  );

  // if( potentialChats.length>=1 && userChats?.length == 0 )
  // {
  //     textEffect('rishab');

  // }

  useEffect(() => {
    if (isUserNew) textEffect("rishab", "Welcome to Rishab's Talkapp");
  }, [pRef?.current]);

  const test1 = useRef();
  useEffect(() => {
    if (test1 && test1.current) {
      const t = `calc(${window.outerHeight - (window.outerHeight - window.innerHeight)}px - 3.4rem)`;
      const height = t;
      test1.current.style.height = height;
    }
  }, [test1.current]);

  // ------------
  return (
    <div>
      {
        // userChats?.length >= 1 ?
        isUserNew ? (
          <>
            {/* WILL SHOW ANIMATION TEXT OR SOMETHING */}
            <div>
              <p className="p_tag" ref={pRef}></p>
              {/* <button className="pos_abs">Recipient Chats</button> */}
            </div>

            {/* <div  style={{display:"none !important"}} ref={test_ref}></div> */}
          </>
        ) : (
          <>
            {/* <button onClick={openModal}>New Chats</button>
                        {isModalOpen && (<ModalContent isOpen={true} />)} */}
            <Stack
              direction="horizontal"
              className="align-items-start loading-chats"
            >
              <div ref={test1}
                className={`messages-box flex-grow-0 ${isChatBoxOpened && responsizeFrame1 ? "display-none" : ""} `}
              >
                {isUserChatLoading && <p><Loader showLoader={true}/></p>}
                {userChats?.map((chat, index) => {
                  return (
                    <div key={index}>
                      <UserChat chat={chat} user={user} />
                    </div>
                  );
                })}
              </div>
              {(responsizeFrame1 && isChatBoxOpened) || !responsizeFrame1 ? (
                
                <ChatBox />
              ) : (
                ""
              )}
            </Stack>
          </>
        )
      }
    </div>
  );
};

export default Chat;
