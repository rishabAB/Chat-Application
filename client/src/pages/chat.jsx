import {useContext,useState,useCallback} from "react";
import {Container, Stack} from "react-bootstrap";
import {ChatContext} from "../context/chatContext";
import {AuthContext} from "../context/authContext";
import UserChat from "../components/chat/userChat";
import PotentialChats from "../components/chat/potentialChats";
import ChatBox from "../components/chat/chatBox";
import Modal from 'react-modal';

import ModalContent from "./modal/modalContent";
const Chat = () => {
    const {user} = useContext(AuthContext);

    const {userChats, isUserChatLoading, isUserChatError,updateCurrentChat,isModalOpen,updateModal} = useContext(ChatContext);

    const openModal= useCallback(()=>
    {
      updateModal(true)

    },[])
    return (
        <div>
           {

            userChats ?. length < 1 ? (
        <>
          <button onClick={openModal}>Open modal</button>
          {isModalOpen && ( <ModalContent isOpen={true} />) }
         
         </>
           
        ) : (
                <Stack direction="horizontal"  className="align-items-start" style={{justifyContent: 'space-between',gap:'4.5rem',height: "95vh"}}>
                    <div className="messages-box flex-grow-0 pe-3">
                        {
                        isUserChatLoading && <p>Loading Chats...</p>
                        }
                        {
                        userChats ?. map((chat, index) => {
                            return (
                                <div key={index} onClick={()=> updateCurrentChat(chat)}>
                                    <UserChat chat ={chat}
                                        user={user}/>
                                </div>
                            )
                        })
                    }
                     </div>
                    <ChatBox/>

                </Stack>
            )
        }</div>
    );
}

export default Chat;
