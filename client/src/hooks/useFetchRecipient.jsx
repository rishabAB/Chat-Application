import {useContext, useEffect,useState} from "react";
import {getRequest, baseUrl} from "../utils/services";
import {ChatContext} from "../context/chatContext";

export const useFetchRecipientUser = (chat,user) =>
{
    const [recipientUser,setRecipientUser] = useState(null);
    const [error,setError] = useState(false);
    const {currentChat} = useContext(ChatContext);

    const recipientId = chat?.members.find((id) => id !==user?._id);

    useEffect(()=>
    {
        const getUser = async() =>
        {
            
            if(!recipientId) return null;

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            if(response.error)
            {
                return setError(true);
            }
            else{
                setError(false);
                setRecipientUser(response);
            }

        }
        getUser();

    },[recipientId])

    return {recipientUser}
}