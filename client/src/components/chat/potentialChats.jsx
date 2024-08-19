import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";
import {AuthContext} from "../../context/authContext";
import "./chat.scss";
const PotentialChats = () =>
{
    const {potentialChats,createChat,onlineUsers} = useContext(ChatContext);
    const {user} = useContext(AuthContext);
    // potential chats are those that appear when chat hasn't started db is empty 
    // as in chat and message collection
    return (
    <div className="all-users">
        {
            potentialChats && potentialChats.map((u,index)=>
            {
                return (
                <div className="single-user" key={index} onClick={()=> createChat(user._id,u._id)}>
                    {u.name}
                    <span className={
                        onlineUsers?.some((user)=> user?.userId === u?._id) ? 
                        "user-online" : ""
                        }></span>
                </div>
                )
            })
        }
    </div>
    )

}
export default PotentialChats;