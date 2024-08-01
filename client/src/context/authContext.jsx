import {createContext,useState,useCallback,useEffect} from "react";

export const AuthContext=createContext();

import {postRequest,baseUrl} from "../utils/services";

export const AuthContextProvider = ({children}) =>
{
    const [user,setUser] = useState(null);
   
    const [registerError,setRegisterError]= useState(null);

    const [isRegisterLoading,setIsRegisterLoading] = useState(false);

    const [registerInfo,setRegisterInfo] = useState({name :"",email:"",password:"",profile:"",gender:""});

    const [loginInfo,setLoginInfo] = useState({email:"",password:""});

    const [loginError,setLoginError] = useState(null);

    const [isLoginLoading,setIsLoginLoading] = useState(false);

    function readFileDataAsBase64(file) {
        // const file = e.target.files[0];
    
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
    
            reader.onload = (event) => {
                resolve(event.target.result);
            };
    
            reader.onerror = (err) => {
                reject(err);
            };
    
            reader.readAsDataURL(file);
        });
    }

    function readFileDataAsUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
    
            reader.onload = (event) => {
                // Create a URL for the file
                const fileUrl = URL.createObjectURL(file);
                resolve(fileUrl);
            };
    
            reader.onerror = (err) => {
                reject(err);
            };
    
            reader.readAsArrayBuffer(file); // or readAsDataURL(file), either will trigger onload
        });
    }
    
    const updateRegisterInfo = useCallback(async(info) =>
    {
        console.log("ingo ",info);
        if(info?.profile && info?.profile?.name)
        {
            let res = await  readFileDataAsBase64(info.profile);
            info.profile = res;   
        }
        setRegisterInfo(info);
        
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