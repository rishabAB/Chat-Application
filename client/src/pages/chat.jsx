import {useContext,useState,useCallback,useRef, useEffect} from "react";
import {Container, Stack} from "react-bootstrap";
import {ChatContext} from "../context/chatContext";
import {AuthContext} from "../context/authContext";
import UserChat from "../components/chat/userChat";
import PotentialChats from "../components/chat/potentialChats";
import ChatBox from "../components/chat/chatBox";

import ModalContent from "./modal/modalContent";
const Chat = () => {
    const {user} = useContext(AuthContext);

    const {userChats, isUserChatLoading,updateCurrentChat,updateModal,potentialChats} = useContext(ChatContext);

    const openModal= useCallback(()=>
    {
      updateModal(true)

    },[])

    const pRef=useRef(null);
    const test_ref =useRef(null);

    // ---------------
    const textEffect = useCallback((animationName)=>
    {
        if(pRef && pRef.current)
        {
            var text = "This is Rishab's ChattApp",
            chars = text.length,
            newText = '',
            animation = animationName,
            char,
            i;
    
        for (i = 0; i < chars; i += 1) {
            newText += '<i>' + text.charAt(i) + '</i>';
        }
    
        pRef.current.innerHTML = newText;
    
        var wrappedChars = document.getElementsByTagName('i'),
            wrappedCharsLen = wrappedChars.length,
            j = 0;
         

        function addEffect () {
            // if(j == wrappedCharsLen-1)
            // {
            //     clearTimeout();
            // }
            setTimeout(function () {
                wrappedChars[j].className = animation;
                j += 1;
                if(j < wrappedCharsLen) {
                    
                    addEffect();
                    // j++;
                }
            }, 100)
        }
    
        addEffect();

        }
      

    },[pRef?.current]) 

    // if( potentialChats.length>=1 && userChats?.length == 0 )
    // {
    //     textEffect('rishab');

    // }
   
    useEffect(()=>
    {
        textEffect('rishab');

    },[pRef?.current])

      


    // ------------
    return (
        <div>
            {

                // userChats?.length >= 1 ?
                potentialChats.length>=1 && userChats?.length == 0 ?
                 (
                    <>
                    {/* WILL SHOW ANIMATION TEXT OR SOMETHING */}
                    <div>
                    <p   className="p_tag" ref={pRef}>
                    </p>
                    <button className="pos_abs">Recipient Chats</button>
                    </div>
                  
                   
                    {/* <div  style={{display:"none !important"}} ref={test_ref}></div> */}

                    </>

                ) : (
                    <>  
                    {/* <button onClick={openModal}>New Chats</button>
                        {isModalOpen && (<ModalContent isOpen={true} />)} */}
                        <Stack direction="horizontal" className="align-items-start" style={{ justifyContent: 'space-between', gap: '4.5rem', height: "95vh" }}>
                        <div className="messages-box flex-grow-0">
                            {
                                isUserChatLoading && <p>Loading Chats...</p>
                            }
                            {
                                userChats?.map((chat, index) => {
                                    return (
                                        <div key={index} onClick={() => updateCurrentChat(chat)}>
                                            <UserChat chat={chat}
                                                user={user} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <ChatBox />

                    </Stack></>
                   
                )
            }</div>
    );
}

export default Chat;
