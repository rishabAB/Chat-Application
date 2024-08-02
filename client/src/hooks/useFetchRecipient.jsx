import {useContext, useEffect,useState,useCallback} from "react";
import {getRequest, baseUrl} from "../utils/services";
import {ChatContext} from "../context/chatContext";

export const useFetchRecipientUser = (chat,user) =>
{
    const [recipientUser,setRecipientUser] = useState(null);
    const [error,setError] = useState(false);
    const {currentChat} = useContext(ChatContext);

    const recipientId = chat?.members.find((id) => id !==user?._id);
   
 // Here recipient User is the person whom with we are showing the conversation
    useEffect(()=>
    {
        const getUser = async() =>
        {
            
            if(!recipientId || !user) 
                {
                    setRecipientUser(null);
                    return;
                }

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            if(response?.error)
            {
                return setError(true);
            }
            else{
                setError(false);
                setRecipientUser(response);
            }

        }
        getUser();

    },[recipientId,user])

     // ----Images Part-------
  const bufferToUrl = (bufferArray,imageType) => {
    return new Promise((resolve,reject)=>
    {
        const byteArray = new Uint8Array(bufferArray.data);
        const blob = new Blob([byteArray], { type: `image/${imageType}` }); // or "image/jpeg"
        const imageUrl = URL.createObjectURL(blob);
        console.log("url ",imageUrl)
        resolve(imageUrl);

    })
   
};
let [imageUrl,setImageUrl] = useState(null);
   
    let imageObjectUrl;
const loadImage = useCallback(async()=>
    {
        imageObjectUrl= await bufferToUrl(recipientUser?.profile,recipientUser?.imageType) 
        setImageUrl(imageObjectUrl);
        // setRecipientUser({...recipientUser,imageObjectUrl});
        // console.log("recipientuser",recipientUser);

    },[recipientUser])
    // console.log("useFetch recipient",imageUrl);
    // console.log("recipientUser",recipientUser);

useEffect(()=>
    {
        if(recipientUser)
        {
            if(recipientUser?.profile)
            loadImage();
            else{
                // setImageArray([avatar]);
                setImageUrl(avatar);
                // setRecipientUser({...recipientUser,avatar});
             }
        }
       

    },[recipientUser])

 

    //------------ 

    return {
        recipientUser,imageUrl
      };
}