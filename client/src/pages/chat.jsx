import {useContext,useState,useCallback,useRef, useEffect} from "react";
import {Container, Stack} from "react-bootstrap";
import {ChatContext} from "../context/chatContext";
import {AuthContext} from "../context/authContext";
import UserChat from "../components/chat/userChat";

import ChatBox from "../components/chat/chatBox";

import ModalContent from "./modal/modalContent";
const Chat = () => {
    const {user} = useContext(AuthContext);

    const {userChats, isUserChatLoading,updateCurrentChat,updateModal,isUserNew} = useContext(ChatContext);

    const openModal= useCallback(()=>
    {
      updateModal(true)

    },[])

    const pRef=useRef(null);
    const test_ref =useRef(null);

    // ---------------
    const textEffect = useCallback((animationName,txt)=>
    {
        if(pRef && pRef.current)
        {
            var text = txt,
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
           
            setTimeout(function () {
                wrappedChars[j].className = animation;
                j += 1;
                if(j < wrappedCharsLen) {
                    
                    addEffect();
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
        if(isUserNew)
        textEffect('rishab',"Welcome to Rishab's ChattApp");
       

    },[pRef?.current])

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useEffect(() => {
      console.log("Check width", windowWidth);
    }, [windowWidth]);

      


    // ------------
    return (
        <div>
            {

                // userChats?.length >= 1 ?
                isUserNew ?
                 (
                    <>
                    {/* WILL SHOW ANIMATION TEXT OR SOMETHING */}
                    <div>
                    <p   className="p_tag" ref={pRef}>
                    </p>
                    {/* <button className="pos_abs">Recipient Chats</button> */}
                    </div>
                  
                   
                    {/* <div  style={{display:"none !important"}} ref={test_ref}></div> */}

                    </>

                ) : (
                    <>  
                    {/* <button onClick={openModal}>New Chats</button>
                        {isModalOpen && (<ModalContent isOpen={true} />)} */}
                        <Stack direction="horizontal" className="align-items-start loading-chats">
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
