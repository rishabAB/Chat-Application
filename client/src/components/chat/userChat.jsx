import {useFetchRecipientUser} from "../../hooks/useFetchRecipient";
import {Stack} from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import {useState,useContext, useEffect,useCallback,useRef} from "react";
import { ChatContext } from "../../context/chatContext";
import moment from "moment";

import sound from "../../assets/sound.wav";



const UserChat = ({chat, user}) => {
    const {recipientUser} = useFetchRecipientUser(chat, user);
    const {onlineUsers,notification,currentChat,removeNotification} = useContext(ChatContext);
   
    // console.log("playSound",playSound);
    // recipient user is the list of users with whom we can chat which are there on left side 
    // when we click our messages appear
    const [showNotification,setShowNotification] = useState([]);
    const [myAudio,setMyAudio] = useState(null);

   console.log("userchat notification is ",notification); 
   const buttonref = useRef(null);
   const audioRef = useRef(null);

// AUDIO POOL TO AVOID AUDIO LAGGING

const audioPool = useRef([]);
const poolSize = 10; // Adjust pool size as needed

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

  const playAudio = useCallback(() => {
    const audio = getAudioInstance();
    if (audio) {
      audio.play().catch((error) => console.error('Error playing audio:', error));
    } else {
      console.warn('No available audio instances');
    }
  }, [getAudioInstance]);

// -------------------------


//    const playAudio = useCallback(()=>
//     {
//         console.log("Play AUDIO");
       
       
//         audio.play().catch((Ex)=>
//         console.error(Ex));
//     },[])

    // useEffect(() => {
    //     if (showNotification && showNotification.length>0 && buttonref.current) {
    //       buttonref.current.click();
    //     }
    //   }, [showNotification]);
    // useEffect(()=>
    // {
    //     console.log("audio one");
    //     const audio = new Audio(sound);
    //     setMyAudio(sound);
    // },[])

    // useEffect(() => {
    //     // Assuming you want to trigger the audio playback on component mount
    //     if (showNotification && showNotification.length>0 && buttonref.current) {
    //         buttonref.current.click();
    //     }
    //   }, [showNotification]);


    // useEffect(() => {
    //     // Assuming you want to trigger the audio playback on component mount
    //     // if (showNotification && showNotification.length>0 ) {
    //         buttonref.current.click();
    //     // }
    //   },[]);

    //   useEffect(() => {
    //     // Assuming you want to trigger the audio playback on component mount
    //     if (showNotification && showNotification.length>0 ) {
    //         // audioRef.current.mute=true;
    //         console.log(window.navigator);
    //         // window.addEventListener('click',()=>
    //         // {
    //         //     audioRef.current.play();

    //         // })
    //         // console.log(audioRef);
    //         // document.addEventListener('click',()=>
    //         // {
    //         //     console.log("THIS IS CLICK");
    //         //     audioRef.current.onPlay=true;

    //         // })
    //        if(notification && notification.length >0 )
    //         audioRef.current.play();
    //     }
    //   }, [notification]);
   
  

    // Here please note in the naming convention in notification get oppsite right in notification.senderId 
    // becomes the recipientid and the recipientid becomes the senderid that's why in html we are comparing like that
    useEffect(()=>
    {
        console.log("notification length is ",notification?.length)
       
       if(notification && notification.length>0)
       {
        // audioRef.current.play();
        playAudio();
        notification.forEach((notify)=>
        {
            if(recipientUser?._id === notify.senderId)
            {
                if(currentChat?._id === notify.chatId)
                    {
                        console.log("Case where chat is already opened")
                        removeNotification(notify);
                        // audioRef.current.play();
                        setShowNotification([]);
                    }
                    else{
                      
                        setShowNotification([{...notify,count:notify.count}]);
                        // audioRef.current.play();
                        // playAudio();
                        // console.log("buttonref",buttonref?.current);
                        // buttonref.current.click();
                    }
                    // audioRef.current.play();

            }
        })
       }
     
        else{
          
            setShowNotification([]);
        }
 
      
    },[notification,recipientUser,currentChat])




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
                {/* <button onClick={playAudio} ref={buttonref} style={{display:"none"}}>Play </button> */}
                {/* <audio ref={audioRef}></audio> */}
                <audio ref={audioRef} src={myAudio}   ></audio>
             

                <div className="me-2">
                    <img src={avatar} alt="" height="35px" />
                </div>
                <div className="text-content">
                    <div className="name">
                        {
                        recipientUser ?. name
                    }</div>
                  
                    {showNotification?.map((notify,index)=> notify.senderId === recipientUser?._id ? (<div className="text">{notify.text}</div>) : null)}
                    {/* <audio controls>
                     <source src="../../assets/notification-sound" type="audio/mp3"/>
  
                      </audio> */}

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
          
        </Stack>
    );
}

export default UserChat;
