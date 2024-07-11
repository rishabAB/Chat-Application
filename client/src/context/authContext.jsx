import {createContext,useState,useCallback,useEffect} from "react";

export const AuthContext=createContext();

import {postRequest,baseUrl} from "../utils/services";

export const AuthContextProvider = ({children}) =>
{
    const [user,setUser] = useState(null);
   
    const [registerError,setRegisterError]= useState(null);

    const [isRegisterLoading,setIsRegisterLoading] = useState(false);

    const [registerInfo,setRegisterInfo] = useState({name :"",email:"",password:""});

    const [loginInfo,setLoginInfo] = useState({email:"",password:""});

    const [loginError,setLoginError] = useState(null);

    const [isLoginLoading,setIsLoginLoading] = useState(false);

    
    const updateRegisterInfo = useCallback((info) =>
    {
      
        setRegisterInfo(info)
    }, []);
   

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
      
    },[])

    const logoutUser = useCallback((e)=>
    {
       e.preventDefault();
        setUser(null);
        localStorage.removeItem("user")

    },[])

    const loginUser = useCallback(async (e) =>
    {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
        const response =await postRequest(`${baseUrl}/users/login`,JSON.stringify(loginInfo));
        setIsLoginLoading(false);

        if(response.error)
        {
           return setLoginError(response);
          
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