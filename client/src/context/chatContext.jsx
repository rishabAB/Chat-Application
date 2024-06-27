import {createContext, useState,useEffect} from "react";
import {getRequest, postRequest, baseUrl} from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null);
   

    const [isUserChatLoading, setIsUserChatLoading] = useState(false);

    const [isUserChatError, setIsUserChatError] = useState(null);

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

    return (<ChatContext.Provider value={
    {
        userChats,
        isUserChatLoading, 
        isUserChatError
    }
    }> {children}</ChatContext.Provider>)
}
