import {useContext} from "react";
import {Container, Stack} from "react-bootstrap";
import {ChatContext} from "../context/chatContext";
import {AuthContext} from "../context/authContext";
import UserChat from "../components/chat/userChat";
import PotentialChats from "../components/chat/potentialChats";
import ChatBox from "../components/chat/chatBox";
const Chat = () => {
    const {user} = useContext(AuthContext);

    const {userChats, isUserChatLoading, isUserChatError,updateCurrentChat} = useContext(ChatContext);
   
    
    return (
        <div>
            <PotentialChats/>{
            userChats ?. length < 1 ? null : (
                <Stack direction="horizontal"  className="align-items-start" style={{justifyContent: 'space-between',gap:'4.5rem'}}>
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
