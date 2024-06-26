import {createContext,useState,useCallback,useEffect} from "react";

export const AuthContext=createContext();

import {postRequest,baseUrl} from "../utils/services";

export const AuthContextProvider = ({children}) =>
{
    const [user,setUser] = useState(null);
    console.log("children ",children);

    const [registerError,setRegisterError]= useState(null);

    const [isRegisterLoading,setIsRegisterLoading] = useState(false);

    const [registerInfo,setRegisterInfo] = useState({name :"",email:"",password:""});

    const [loginInfo,setLoginInfo] = useState({email:"",password:""});

    const [loginError,setLoginError] = useState(null);

    const [isLoginLoading,setIsLoginLoading] = useState(false);
    
    const updateRegisterInfo = useCallback((info) =>
    {
        // console.log("info",info);
        setRegisterInfo(info)
    }, []);
    console.log("loginInfo",loginInfo);

    console.log("Register",registerInfo);

    const updateLoginInfo = useCallback((info) =>
    {
        setLoginInfo(info);
    }, []);
  
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
       
        localStorage.setItem("user",JSON.stringify(response));
        setUser(response);
        

    },[registerInfo])

    useEffect( () =>
    {
      
        const user=localStorage.getItem("user");
        setUser(JSON.parse(user));
        console.log("THIS IS USE EFFECT AUTH CONTEXT",JSON.parse(user));

    },[])

    const logoutUser = useCallback((e)=>
    {
       e.preventDefault();
        setUser(null);
        localStorage.removeItem("user")

    },[])

    const loginUser = useCallback(async (e) =>
    {
        console.log("THIS IS LOGIN USER");
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
        const response =await postRequest(`${baseUrl}/users/login`,JSON.stringify(loginInfo));
        setIsLoginLoading(false);

        if(response.error)
        {
           return setLoginError(response.error);
        }
        localStorage.setItem("user",JSON.stringify(response));
        setUser(response);

    },[loginInfo]);

 
   
    return (
    <AuthContext.Provider value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginInfo,
        loginError,
        updateLoginInfo,
        isLoginLoading
        }}>
        {children}
    </AuthContext.Provider>)
}