import {createContext, useState,useEffect, useCallback,useRef} from "react";
import {getRequest, postRequest, baseUrl} from "../utils/services";
import {io} from "socket.io-client";
import sound from "../assets/sound.wav";
export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    
    const [userChats, setUserChats] = useState(null);
    const [potentialChats,setPotentialChats] = useState([]);
   
    
    const [isUserChatLoading, setIsUserChatLoading] = useState(false);

    const [isUserChatError, setIsUserChatError] = useState(null);

    const [currentChat,setCurrentChat] = useState(null);

    const [isMessagesLoading,setIsMessagesLoading] = useState(null);

    const [messagesError,setMessagesError] = useState(null);

    const [messages,setMessages]= useState(null);

    const [TextMessageError,setTextMessageError] = useState(null);

    const [newMessage,setNewMessage] = useState(null);
  
    const [isFound,setIsFound] = useState(false);

    const newMessageRef = useRef(newMessage);

    const [notification,setNotification] = useState([]);

    const [serverResponse,setServerResponse] = useState(null);

    // Socket part
    const[socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    // Forming a connection with socket
    useEffect(()=>
    {
        const newSocket= io("http://localhost:3000")
        setSocket(newSocket);
        

        return(()=>
        {
            console.log("hey socket disconnect");
            newSocket.disconnect();  // Here we are trigger the disconnect event 
        })

    },[user]);

    // User has logged out so by using socket

  
    useEffect(()=>
    {
        console.log("HEY USE EFFECT");
        if(socket ==  null) return;
        socket.emit("addNewUser",user?._id)

        socket.on("showOnlineUsers",(res) => {
          
            setOnlineUsers(res);
        })
        return () =>
        {
            socket.off("showOnlineUsers");
        }
       
    },[socket])

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

  const playAudio = useCallback(() => {
    const audio = getAudioInstance();
    if (audio) {
      audio.play().catch((error) => console.error('Error playing audio:', error));
    } else {
      console.warn('No available audio instances');
    }
  }, [getAudioInstance]);

// -------------------------

    // useEffect(()=>
    // {
    //     if(!socket) return;

    //     socket.emit("getNotification",(message)=>
    //     {

    //     })


    // },[socket])

    // useEffect(()=>
        // {
            // const showNotification = useCallback((serverResponse)=>
            // {
            //     console.log("Server Response",serverResponse);
            //     // setNotification(serverResponse);
    
            // },[])
            
        // },[])

        // const playAudio = useCallback(()=>
        //     {
        //         const audio = new Audio(sound);
        //         audio.muted=true;
               
        //         audio.play().catch((Ex)=>
        //         console.error(Ex));
        //     })


    // Send Message

    useEffect(()=>
        {
            
            if(socket ==  null) return;
            // here we are finding the recipient user to id of user2 which has to recieve message (using current chat)
            const recipientId = currentChat?.members?.find((id)=> id!==user._id);

            socket.emit("sendMessage",{...newMessage,recipientId})

             // Notification Part
           

            socket.emit("saveNotification",{...serverResponse,recipientId});


        // --------------

           
        },[newMessage])

        useEffect(()=>
        {
            if(!socket) return;

            socket.on("sendNotification",(message)=>
            {
                console.log("USE EFFECT WITHOUT DEPENDENCIES",message);
                if(currentChat && message && message.length>0 && message[0]?.notificationTone)
                {
                    playAudio();
                    console.log("PLAY AUDIO");
                }
                setNotification(message);
                // playAudio();
            })

        },[socket,currentChat,notification])
        // if(!socket) return;

        // socket.on("sendNotification",(message)=>
        // {
        //     console.log("sendNotification",message);
        //     setNotification(message)
        // })

    // Receive Message

    useEffect(()=>
        {
            if(socket ==  null) return;

            socket.on("sendToClient",(res)=>
            {
                // console.log("res is ??",res);
                // In this if condition if it doesn't match 
                // if means user is online but that conversation is not opened so this is the case where we
                //should show the notification
                if(currentChat?._id !== res.chatId) 
                {
                    // showNotification(res);
                    return;

                //     if(socket == null)
                //     return;

                //     socket.emit("saveNotification",res);

                //    socket.on("sendNotification",(message)=>
                // {
                //     setNotification(message)

                // })
                    // return;
                    //we should emit an event saying to socket that save the response

                }
                
               
                setMessages((prev)=> [...prev,res]);
            // This if condition will help us to stop from updating the wrong chat 

            })

            return ()=>
            {
                socket.off("sendToClient");
            }
           

        },[socket,currentChat])
    // Here we are adding currentChat as a dependency beacause of that case if user1 sends message
    // to user2 and user2 is online but user2 hasn't opened the conversation so when'it will get 
    // opned currentChat changes probably thats the reason
    // ------------------------
    useEffect(() =>
    {
        const getUsers = async() =>
        {
            const response = await getRequest(`${baseUrl}/users`);

            if(response.error)
            {
                return console.error("Error fetching users",response.error);
            }
            else{
                const pChats=response.filter((unit) => {
                    let isChatCreated = false;
                    if(user?._id === unit._id) return false
                    if(userChats)
                    {
                        isChatCreated=userChats?.some((chat)=>
                        {
                            return (chat.members[0] === unit._id || chat.members[1] === unit._id)
                        })
                    }
                    return !isChatCreated; 

                })

                setPotentialChats(pChats);
            }

        }

        getUsers();

    },[userChats])
   
    useEffect( () =>
    {
        const getUserChats = async() =>
        {
            if(user?._id)
            {
                setIsUserChatLoading(true);
                setIsUserChatError(null);
              
                const response = await getRequest(`${baseUrl}/chats/findUserChats/${user?._id}`);

                setIsUserChatLoading(false);

                if(response.error)
                {
                    return setIsUserChatError(response)
                }
                setUserChats(response);
            }

        }

        getUserChats();

    },[user])


    const sendTextMessage = useCallback(async(textMessage,sender,currentChatId)=>
    {
        if(!textMessage) return console.log("You must type something");

        const response= await postRequest(`${baseUrl}/messages/createMessage`,JSON.stringify({chatId:currentChatId,senderId:sender._id,text:textMessage}));

        if(response.error)
        {
            return setTextMessageError(response);
        }
        setNewMessage(response);
        newMessageRef.current=response;
        setServerResponse(response);
       
        setMessages( (prev) =>[response,...prev,]);
        // this setMessages is for someone who is seing the msg

       
        

    },[])

    useEffect( () =>
        {
            const getMessages = async() =>
            {
               
                  setIsMessagesLoading(true);
                  setMessagesError(null);
                  
                    const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
    
                    setIsMessagesLoading(false);
    
                    if(response.error)
                    {
                        return setMessagesError(response)
                    }
                    setMessages(response);
                
            }
    
            getMessages();

            // Notification part remove notification if any 

            // if(currentChat?.members && notification && notification.length>0)
            // {
            //     const notificationToDelete = notification.find((notify)=> notify.senderId === currentChat?.members[0] || notify.senderId === currentChat?.members[1] );
            //     if(notificationToDelete)
            //     {
            //         socket.emit("removeNotification",notificationToDelete);

            //         // socket.on("sendNotification",(message)=>
            //         //     {
            //         //         console.log("sendNotification",message);
            //         //         setNotification(message)
            //         //     })
            //     }
            // }
    
        },[currentChat])

        const removeNotification= useCallback((notify)=>
        {
            socket.emit("removeNotification",notify);

        })
        

    const updateCurrentChat = useCallback((chat)=>
    {
        
        setCurrentChat(chat);

    },[])

    const createChat = useCallback(async(firstId,secondId) =>
    {

        const response = await postRequest(`${baseUrl}/chats/createChat/`,JSON.stringify({firstId,secondId}));

        if(response.error)
        {
            return console.error("An error occurred",response.error);
        }
        setUserChats((prev)=>[...prev,response]);

    },[])

    return (<ChatContext.Provider value={
    {
        userChats,
        isUserChatLoading, 
        isUserChatError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notification,
        removeNotification
    }
    }> {children}</ChatContext.Provider>)
}
