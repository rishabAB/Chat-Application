import {useContext,useState} from "react";
import {Container, Stack} from "react-bootstrap";
import {ChatContext} from "../context/chatContext";
import {AuthContext} from "../context/authContext";
import UserChat from "../components/chat/userChat";
import PotentialChats from "../components/chat/potentialChats";
import ChatBox from "../components/chat/chatBox";
import Modal from 'react-modal';
const Chat = () => {
    const {user} = useContext(AuthContext);

    const {userChats, isUserChatLoading, isUserChatError,updateCurrentChat} = useContext(ChatContext);

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
        },
      };

      const [modalIsOpen, setIsOpen] = useState(false);   

      function openModal() {
        setIsOpen(true);
      }
    
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
      }
    
      function closeModal() {
        setIsOpen(false);
      }
   
    console.log("userChats",userChats);
    return (
        <div>
           {
            userChats ?. length < 1 ? (
                <>
                 <button onClick={openModal}>Open modal</button>
            <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
             <h2>Potential Chats</h2>
             <PotentialChats/>
          
            
            <button onClick={closeModal}>close</button>
           
          </Modal></>
           
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
