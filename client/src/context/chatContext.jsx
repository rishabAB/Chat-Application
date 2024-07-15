import {createContext, useState,useEffect, useCallback,useRef} from "react";
import {getRequest, postRequest, baseUrl} from "../utils/services";
import {io} from "socket.io-client";

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


    // Send Message

    useEffect(()=>
        {
            
            if(socket ==  null) return;
            // here we are finding the recipient user to id of user2 which has to recieve message (using current chat)
            const recipientId = currentChat?.members?.find((id)=> id!==user._id);

            socket.emit("sendMessage",{...newMessage,recipientId})

           
        },[newMessage])

    // Receive Message

    useEffect(()=>
        {
            if(socket ==  null) return;

            socket.on("sendToClient",(res)=>
            {
                if(currentChat?._id !== res.chatId)
                return;
               
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
        console.log("messages",messages);
        setMessages((prev) => [...prev,response]);
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
    
        },[currentChat])

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
        onlineUsers
    }
    }> {children}</ChatContext.Provider>)
}
