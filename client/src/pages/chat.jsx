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
        <Container>
            <PotentialChats/>{
            userChats ?. length < 1 ? null : (
                <Stack direction="horizontal" gap ={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3">
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
                    } </Stack>
                    <ChatBox/>

                </Stack>
            )
        }</Container>
    );
}

export default Chat;
