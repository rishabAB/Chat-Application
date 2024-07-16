import {useFetchRecipientUser} from "../../hooks/useFetchRecipient";
import {Stack} from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import {useState,useContext, useEffect,useCallback} from "react";
import { ChatContext } from "../../context/chatContext";


const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);
    const {onlineUsers,notification,currentChat,removeNotification} = useContext(ChatContext);
    
    // recipient user is the list of users with whom we can chat which are there on left side 
    // when we click our messages appear
    const [showNotification,setShowNotification] = useState([]);

   console.log("userchat notification is ",notification);
  

    // Here please note in the naming convention in notification get oppsite right in notification.senderId 
    // becomes the recipientid and the recipientid becomes the senderid that's why in html we are comparing like that
    useEffect(()=>
    {
        console.log(notification);

       if(notification && notification.length>0)
       {
        notification.forEach((notify)=>
        {
            if(recipientUser?._id === notify.senderId)
            {
                if(currentChat?._id === notify.chatId)
                    {
                        console.log("Case where chat is already opened")
                        removeNotification(notify);
                        setShowNotification([]);
                    }
                    else{
                      
                        setShowNotification([{...notify,count:notification.length}]);
                    }

            }
        })
       }
     
        else{
          
            setShowNotification([]);
        }
 
      
    },[notification,recipientUser,currentChat])


   useEffect(() => {
    console.log("Updated showNotification: ", showNotification);
  }, [showNotification]);

    // useEffect(()=>
    // {
    //     if(currentChat?.members && showNotification && showNotification.length>0)
    //     {
    //             const test = showNotification.filter((elem)=>!((elem.senderId === currentChat?.members[1] 
    //                 && elem.recipientId === currentChat?.members[0] ) 
    //                 || (elem.recipientId === currentChat?.members[1] 
    //                     && elem.senderId === currentChat?.members[0] )))
                       
                
    //             setShowNotification(test);
    //             // here we'll emit an emit saying that remove that notification
    
    //     }

    // },[currentChat])


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
                  
                    {showNotification?.map((notify,index)=> notify.senderId === recipientUser?._id ? (<div className="text">{notify.text}</div>) : null)}
                   

                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">12/02/2024</div>
                {showNotification && showNotification?.map((notify,index)=> notify.senderId === recipientUser?._id ? (
             <div className="this-user-notifications">{notify.count}</div>
                ) : null)}

                {
                    onlineUsers.some((user) => user.userId === recipientUser?._id)  ?  <div className="user-online"></div> : null
                }
               
            </div>
          
        </Stack>
    );
}

export default UserChat;
