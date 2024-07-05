import {useContext} from "react";
import {Container, Stack} from "react-bootstrap";
import {ChatContext} from "../context/chatContext";
import {AuthContext} from "../context/authContext";
import UserChat from "../components/chat/userChat";
const Chat = () => {
    const {user} = useContext(AuthContext);

    const {userChats, isUserChatLoading, isUserChatError} = useContext(ChatContext);

    console.log("userChats", userChats);


    return (
        <Container>{
            userChats ?. length < 1 ? null : (
                <Stack direction="horizontal" gap ={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3">
                        {
                        isUserChatLoading && <p>Loading Chats...</p>
                    }
                        {
                        userChats ?. map((chat, index) => {
                            return (
                                <div key={index}>
                                    <UserChat chat ={chat}
                                        user={user}/>
                                </div>
                            )
                        })
                    } </Stack>
                    <p>Chatbox</p>

                </Stack>
            )
        }</Container>
    );
}

export default Chat;
