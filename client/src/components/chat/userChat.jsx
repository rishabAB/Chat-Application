import {useFetchRecipientUser} from "../../hooks/useFetchRecipient";
import {Stack} from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import {useState,useContext} from "react";
import { ChatContext } from "../../context/chatContext";

const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);
    const {onlineUsers} = useContext(ChatContext);
    
    // recipient user is the list of users with whom we can chat which are there on left side 
    // when we click our messages appear


    return (
        <Stack direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between" role="button">
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatar} alt="" height="35px" />
                </div>
                <div className="text-content">
                    <div className="name">
                        {
                        recipientUser ?. name
                    }</div>
                    <div className="text">text Message</div>

                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">12/02/2024</div>
                <div className="this-user-notifications">4</div>
                {
                    onlineUsers.some((user) => user.userId === recipientUser?._id)  ?  <div className="user-online"></div> : null
                }
               
            </div>
          
        </Stack>
    );
}

export default UserChat;
