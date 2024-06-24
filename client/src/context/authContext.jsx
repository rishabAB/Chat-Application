import {createContext,useState,useCallback,useEffect} from "react";

export const AuthContext=createContext();

import {postRequest,baseUrl} from "../utils/services";

export const AuthContextProvider = ({children}) =>
{
    const [user,setUser] = useState(null);

    const [registerError,setRegisterError]= useState(null);

    const [isRegisterLoading,setIsRegisterLoading] = useState(false);

    const [registerInfo,setRegisterInfo] = useState({name :"",email:"",password:""});
    
    const updateRegisterInfo = useCallback((info) =>
    {
        setRegisterInfo(info)
    }, [])

    const registerUser = useCallback(async(e) =>
    {  
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
        const response =await postRequest(`${baseUrl}/users/register`,JSON.stringify(registerInfo));
        setIsRegisterLoading(false);

        if(response.error)
        {
            return setRegisterError(response);
        }
       
        localStorage.setItem("User",JSON.stringify(response));
        setUser(response);
        

    },[registerInfo])

    useEffect( () =>
    {
        const user=localStorage.getItem("user");
        setUser(JSON.parse(user));

    },[])

    const logoutUser = useCallback(()=>
    {
        console.log("Israechig");
        setUser(null);
        localStorage.removeItem("user")

    },[])
   
    return (
    <AuthContext.Provider value={{user,registerInfo,updateRegisterInfo,registerUser,registerError,isRegisterLoading,logoutUser}}>
        {children}
    </AuthContext.Provider>)
}