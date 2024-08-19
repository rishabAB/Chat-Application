import {useFetchRecipientUser} from "../../hooks/useFetchRecipient";
import {Stack} from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import {useState,useContext, useEffect,useCallback,useRef} from "react";
import { ChatContext } from "../../context/chatContext";
import moment from "moment";

import sound from "../../assets/sound.wav";
import ImageViewer from 'react-simple-image-viewer';
import "./chat.scss";

const UserChat = ({chat, user}) => {
    const {recipientUser,imageUrl} = useFetchRecipientUser(chat, user);
    const {onlineUsers,notification,currentChat,removeNotification} = useContext(ChatContext);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
   
    // recipient user is the list of users with whom we can chat which are there on left side 
    // when we click our messages appear
    const [showNotification,setShowNotification] = useState([]);
    const [myAudio,setMyAudio] = useState(null);

     const buttonref = useRef(null);
   const audioRef = useRef(null);
// AUDIO POOL TO AVOID AUDIO LAGGING

const audioPool = useRef([]);
const poolSize = 100; // Adjust pool size as needed

useEffect(() => {
  // Initialize the audio pool
  for (let i = 0; i < poolSize; i++) {
    const audio = new Audio(sound);
    audioPool.current.push(audio);
  }
}, []);

const getAudioInstance = useCallback(() => {
    for (let audio of audioPool.current) {
      if (audio.paused) {
        return audio;
      }
    }
    return null;
  }, []);

  const handleImageViewer = useCallback(()=>
    {
        setIsViewerOpen(prevIsViewerOpen => !prevIsViewerOpen);
        
    },[])

 

  const playAudio = useCallback(() => {
    const audio = getAudioInstance();
    if (audio) {
      audio.play().catch((error) => console.error('Error playing audio:', error));
    } else {
      console.warn('No available audio instances');
    }
  }, [getAudioInstance]);

// -------------------------

    // Here please note in the naming convention in notification get oppsite right in notification.senderId 
    // becomes the recipientid and the recipientid becomes the senderid that's why in html we are comparing like that
    useEffect(()=>
    {
        console.log("notification length is ",notification?.length)
       
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
                      
                        setShowNotification([{...notify,count:notify.count}]);
                    }
                   
            }
        })
       }
     
        else{
          
            setShowNotification([]);
        }
 
      
    },[notification,recipientUser,currentChat])


       // ----Images Part-------
//   const bufferToUrl = (bufferArray,imageType) => {
//     return new Promise((resolve,reject)=>
//     {
//         const byteArray = new Uint8Array(bufferArray.data);
//         const blob = new Blob([byteArray], { type: `image/${imageType}` }); // or "image/jpeg"
//         const imageUrl = URL.createObjectURL(blob);
//         console.log("url ",imageUrl)
//         resolve(imageUrl);

//     })
   
// };
// let [imageArray,setImageArray] = useState([]);
   
//     let imageObjectUrl;
// const loadImage = useCallback(async()=>
//     {
//         imageObjectUrl= await bufferToUrl(recipientUser?.profile,recipientUser?.imageType) 
//         setImageArray([imageObjectUrl]);
     
//     },[recipientUser])

// useEffect(()=>
//     {
//         if(recipientUser)
//         {
//             if(recipientUser?.profile)
//             loadImage();
//             else{
//                 setImageArray([avatar]);
              
//              }
//         }
       

//     },[recipientUser])

let [userImageArray,setUserImageArray] = useState();
const loadImage = useCallback(async()=>
    {
        // imageObjectUrl= await bufferToUrl(user?.profile) 
        setUserImageArray([imageUrl]);

    },[imageUrl])

    useEffect(()=>
    {
        if(imageUrl)
        loadImage();

    },[imageUrl])

 

    //------------ 



    return (
        <Stack direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between" role="button">
            <div className="d-flex" style={{alignItems:"center"}}>
              
                <div className="me-2">
                <img src={userImageArray?.[0] } onClick = {handleImageViewer}style={{height:"50px",width:"50px",borderRadius:"50%",cursor:"pointer",alignItems:" center"}} alt="" />
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
                {/* <div className="date">{moment(msg.createdAt).format("LLL")}</div> */}
                {showNotification && showNotification?.map((notify,index)=> notify.senderId === recipientUser?._id ? (
            <div className="date">{moment(notify.createdAt).calendar()}</div>
                ) : null)}

                {showNotification && showNotification?.map((notify,index)=> notify.senderId === recipientUser?._id ? (
             <div className="this-user-notifications">{notify.count}</div>
                ) : null)}

                {
                    onlineUsers.some((user) => user.userId === recipientUser?._id)  ?  <div className="user-online"></div> : null
                }
               
            </div>

            {isViewerOpen && (
                 <ImageViewer
          src={userImageArray} 
          disableScroll={ false }
          closeOnClickOutside={ true }
          onClose={handleImageViewer}
            
        />)}
          
        </Stack>
    );
}

export default UserChat;
