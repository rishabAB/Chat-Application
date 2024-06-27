import {useContext} from "react";
import {Container,Stack} from "react-bootstrap";
import {ChatContext} from "../context/chatContext";

const Chat = () => {
    const { userChats,
        isUserChatLoading, 
        isUserChatError} = useContext(ChatContext);

    console.log("userChats",userChats);
    return (  <Container>{userChats?.length<1 ? null : (
    <Stack direction="horizontal">
        <Stack className="flex-grow-0">List</Stack>
        <p>Chatbox</p>

    </Stack>
    )
    }</Container>
    );
}
 
export default Chat;