import {createContext, useState,useEffect, useCallback} from "react";
import {getRequest, postRequest, baseUrl} from "../utils/services";

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
        setMessages((prev) => [...prev,response]);
        

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
        sendTextMessage
    }
    }> {children}</ChatContext.Provider>)
}
