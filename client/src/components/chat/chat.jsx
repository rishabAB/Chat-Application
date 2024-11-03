import React, { useContext, useCallback, useRef, useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import {ChatContext} from "../../context/chatContext"
import { AuthContext } from "../../context/authContext";
import UserChat from "./userChat";
import {useNavigate} from "react-router-dom"

import ChatBox from "./chatBox.jsx";
import Loader from "../../customComponents/loader/loader";
const Chat = () => {
  const { user } = useContext(AuthContext);
  const [showAnimation,setShowAnimation] = useState(false);
 
  const navigate = useNavigate();
  const {
    userChats,
    isUserChatLoading,
    isUserNew,
    isChatBoxOpened,
    responsizeFrame1,
  } = useContext(ChatContext);

  useEffect(() => {
    if (user) {
      navigate(`/${user._id}`);
    }
  }, [user]);


  const animationRef = useRef(null);
  const textEffect = useCallback((animationName, txt) => {
      console.log("animationName",animationName);
        var text = txt,
          chars = text.length,
          newText = "",
          animation = animationName,
          i;

        for (i = 0; i < chars; i += 1) {
          newText += "<i>" + text.charAt(i) + "</i>";
        }

        console.log("animation.current",animationRef.current);
        animationRef.current.innerHTML = newText;

        var wrappedChars = document.getElementsByTagName("i"),
          wrappedCharsLen = wrappedChars.length,
          j = 0;

        function addEffect() {
          setTimeout(function () {
            wrappedChars[j].className = animation;
            j += 1;
            if (j < wrappedCharsLen) {
              addEffect();
            } else {
              setShowAnimation(false);
              setTimeout(() => {
                const elem = document.querySelector("#displayText");
                if(elem)
                {
                  elem.innerText="Please click on Potential Chats button"
                }
                // updateModal(true);
              }, 5000);

           }
          }, 100);
        }

        addEffect();
      
    },
    [animationRef?.current]
  );


  useEffect(() => {
    if (isUserNew && animationRef?.current && showAnimation == false)
    {
      setShowAnimation(true);
      textEffect("rishab", "Welcome to Rishab's Talkapp");
    } 
  }, [animationRef?.current,isUserNew]);

  const dynamicHeight = useRef();
  useEffect(() => {
    if (dynamicHeight && dynamicHeight.current) {
      const t = `calc(${window.outerHeight - (window.outerHeight - window.innerHeight)}px - 3.4rem)`;
      const height = t;
      dynamicHeight.current.style.height = height;
    }
  }, [dynamicHeight.current]);

  return (
    <div>
      {
        isUserNew ? (
          <>
            <div>
              <p className="displayAnimation" ref={animationRef}></p>
              <p id="displayText"></p>
            </div>

          </>
        ) : (
          <>
            <Stack
              direction="horizontal"
              className="align-items-start loading-chats"
            >
              <div
                ref={dynamicHeight}
                className={`messages-box flex-grow-0 ${isChatBoxOpened && responsizeFrame1 ? "display-none" : ""} `}
              >
                {isUserChatLoading && (
                  <p>
                    <Loader showLoader={true} />
                  </p>
                )}
                {userChats?.map((chat, index) => {
                  return (
                    <div key={index}>
                      <UserChat chat={chat} user={user}  />
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
