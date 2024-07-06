import {useFetchRecipientUser} from "../../hooks/useFetchRecipient";
import {Stack} from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import {useState} from "react";

const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);
  

    console.log("dsjd", recipientUser);

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
                <div className="user-online"></div>
            </div>
          
        </Stack>
    );
}

export default UserChat;
