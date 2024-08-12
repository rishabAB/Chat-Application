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

    const messageRef = useRef([]);

    const [messageTimeline,setMessageTimeline] = useState(null);

    const [TextMessageError,setTextMessageError] = useState(null);

    const [newMessage,setNewMessage] = useState(null);
  
    const newMessageRef = useRef(newMessage);

    const [notification,setNotification] = useState([]);

    const [serverResponse,setServerResponse] = useState(null);

    const [moreMessagesAvailable,setMoreMessagesAvailable] = useState(false);

    const sendToClientTriggered = useRef(false);

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

    const checkTimeline = useCallback((parameter)=>
        {
            return new Promise((resolve,reject)=>
                {
                     if(parameter)
                     {
                        let deepCopy = [...parameter];
                        deepCopy.reverse();
        
                        let res =deepCopy.find((elem) => {
                            if(elem?.date == "Today")
                            {
                                return elem;
                            }
                        })
                        resolve(res ? true : false);
                     }
                    
                })
    
        },[messages,messageRef.current])

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


    // Send Message

    useEffect(()=>
        {
            console.log("messages",messages);
       
           checkTimeline(messages).then(function(result)
        {
           
            if(!result)
            {
                // setMessages((prev) => [...prev,{date:"Today"}]);
                // messageRef.current = [...messages,{date:"Today"}];
                console.log("messageRef.current",messageRef.current);
            }

            if(newMessageRef?.current)
            {
               
                if(!result)
                {
                    // it won't have today
                    
                    messageRef.current = [...messages,{date:"Today",items:[newMessageRef?.current]}];
                    setMessages((prev) => [...prev,{date:"Today",items:[newMessageRef?.current]}]);
                   
                }
                else{
                     let arr =[];
                    for(let message of messages)
                        {
                            if(message?.date == "Today")
                            {
                                 arr=message.items ? message.items : [];
                                arr.push(newMessageRef?.current);
                                break;
                                
                            }
                        }

                        let index = messages.findIndex((elem) => elem.date == "Today");
                        messages.splice(index,1);

                        messageRef.current = [...messages,{date:"Today",items:arr}];
                        setMessages((prev) => [...prev,{date:"Today",items:arr}])
                       
                       
                    
                }
              
                // This setMessages is for someone who is seing the msg
            }
          
        })
       
           
            
            if(socket ==  null) return;
            // here we are finding the recipient user to id of user2 which has to recieve message (using current chat)
            const recipientId = currentChat?.members?.find((id)=> id!==user._id);

            socket.emit("sendMessage",{...newMessage,recipientId})

             // Notification Part
           

            socket.emit("saveNotification",{...serverResponse,recipientId});


        // --------------

           
        },[newMessage])


        const setSocketTimelineMessage = useCallback((socketRes)=>
        {
            console.log(" messageRef.current=messages;", messageRef.current);
            if(sendToClientTriggered?.current)
            {
                // console.log("messageRef.current",messageRef[0].current)
                checkTimeline(messageRef.current).then(function(result)
                {
                    let arr=[];
                    if(!result)
                    {
                        // Today is not there at present
                        // messageRef.current = [...messageRef.current,...socketRes];
                        // setMessages( (prev) =>[...prev,...socketRes]);
                        arr.push(socketRes[1]);
 
                        messageRef.current = [...messageRef.current,{date:"Today",items:arr}];
                        setMessages((prev) => [...prev,{date:"Today",items:arr}]);
                       
                    }
                    else{
                        
                        // Today is already there 
                        // messageRef.current = [...messageRef.current,socketRes[1]];
                        // setMessages((prev) => [...prev,socketRes[1]]);

                        for(let message of messageRef.current)
                            {
                                if(message?.date == "Today")
                                {
                                     arr=message.items ? message.items : [];
                                    arr.push(socketRes[1]);
                                    break;
                                    
                                }
                            }
                           
                            let index =messages.findIndex((elem) => elem.date == "Today");
                            messages.splice(index,1);
    
                            messageRef.current = [...messageRef.current,{date:"Today",items:arr}];
                            setMessages((prev) => [...prev,{date:"Today",items:arr}])
                       
                    }
                    sendToClientTriggered.current=false;
                  
                })

            }

        },[messages,messageRef.current])

        useEffect(()=>
        {
            if(!socket) return;

            socket.on("sendNotification",(message)=>
            {
                if(currentChat && message && message.length>0 && message[0]?.notificationTone)
                {
                    playAudio();
                    console.log("PLAY AUDIO");
                }
                setNotification(message);
               
            })

        },[socket,currentChat,notification])
       

    // Receive Message

    useEffect(()=>
        {
            if(socket ==  null) return;
           
            console.log("messages array",messages);
            socket.on("sendToClient",(res)=>
            {
                // In this if condition if it doesn't match 
                // if means user is online but that conversation is not opened so this is the case where we
                //should show the notification
                if(currentChat?._id !== res?.[1]?.chatId) 
                {
                    return;

                    //we should emit an event saying to socket that save the response
                }

                sendToClientTriggered.current = true;
                setSocketTimelineMessage(res)

              
              
                // setMessages((prev)=> [...prev,res]);
            // This if condition will help us to stop from updating the wrong chat 

            })

            return ()=>
            {
                socket.off("sendToClient");
            }
           

        },[socket,currentChat,messages])
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

  
    // function checkTimeline(messages)
    // {
       
    // }


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
       
        // setMessages( (prev) =>[...prev,response]);
        // This setMessages is for someone who is seing the msg

       
        

    },[])

    useEffect( () =>
        {
            const getMessages = async() =>
            {
               
                  setIsMessagesLoading(true);
                  setMessagesError(null);
                  
                    const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
    
                    setIsMessagesLoading(false);
    
                    if(response?.error)
                    {
                        return setMessagesError(response)
                    }
                    setMessages(response?.messages);
                    setMoreMessagesAvailable(response?.moreMessagesAvailable)
                
            }
           if(currentChat)
            getPartialMessages(0,0,currentChat?._id);

    
        },[currentChat])

        const removeNotification= useCallback((notify)=>
        {
            socket.emit("removeNotification",notify);

        })

        const [partialMessagesError,setPartialMessagesError] = useState(null);

    const getPartialMessages = useCallback(async(limit,offset,currentChatId)=>
    {
        return new Promise(async(fulfill,reject)=>
        {
            const response = await getRequest(`${baseUrl}/messages/partialMessages/${currentChatId}?limit=${limit}&offset=${offset}`);

            if(response?.error)
            {
                return setPartialMessagesError(response)
            }
            console.log("response",response);
            setMessageTimeline(response?.messageTimeline);
            setMessages((prev) =>{
                if(prev?.length>0 && prev[0]?.items[0].chatId == currentChatId)
                {
                    // return ([...prev,...response?.messages])
                    messageRef.current=([...response?.messages,...prev]);
                    return ([...response?.messages,...prev])
                }
                else{
                    messageRef.current = (response?.messages);
                    return (response?.messages);

                }
            })
            // messageRef.current=messages;
            // setMessages(response?.messages);
            fulfill({isActionSuccess:true});
            setMoreMessagesAvailable(response?.moreMessagesAvailable)

        })
        

    },[])
        

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
        // setUserChats((prev)=>[...prev,response]);
        setUserChats((prev) => {
           return  prev ? [...prev,response] : [response];
            // if(prev)
            // {
            //     return [...prev,response];
            // }
            // else{
            //     return [response];
            // }
        })

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
        removeNotification,
        newMessage,
        moreMessagesAvailable,
        getPartialMessages,
        messageTimeline
    }
    }> {children}</ChatContext.Provider>)
}
