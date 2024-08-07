import {createContext,useState,useCallback,useEffect} from "react";

export const AuthContext=createContext();

import {postRequest,baseUrl} from "../utils/services";

import avatar from "../assets/avatar.svg";

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
        console.log("info",info);
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
        if(response?.profile)
        {
            response.imageUrl = await bufferToUrl(response?.profile,response?.imageType);
        }
        else{
            response.imageUrl = avatar;
        }
        localStorage.setItem("user",JSON.stringify(response));
        setUser(response);
        

    },[registerInfo])


    const getImageUrl = useCallback((user)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            try{
               
            if(user?.profile)
                {
                    user.imageUrl = await bufferToUrl(user?.profile,user?.imageType)
                }
            else{
                    user.imageUrl = avatar;
                }
                delete user.profile;
                resolve( user);

            }
            catch(error)
            {
                console.error(error);
                reject(error);
            }
            

        })
      

    },[])

    useEffect(() =>
    {
   
        const user=localStorage.getItem("user");
        // console.log("user",user);
       getImageUrl(JSON.parse(user)).then((userWithUrl)=>
    {
        setUser(userWithUrl);

    })
       
    },[])

    const logoutUser = useCallback((e)=>
    {
       e.preventDefault();
        setUser(null);
        localStorage.removeItem("user")

    },[])

    const bufferToUrl = (bufferArray,imageType) => {
        return new Promise((resolve,reject)=>
        {
            const byteArray = new Uint8Array(bufferArray.data);
            const blob = new Blob([byteArray], { type: `image/${imageType}` }); // or "image/jpeg"
            const imageUrl = URL.createObjectURL(blob);
            resolve(imageUrl);
    
        })
       
    };

    // useEffect(()=>
    // {
    //     if(user)
    //     {

    //     }

    // },[user])

    const loginUser = useCallback(async (e) =>
    {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
        const response =await postRequest(`${baseUrl}/users/login`,JSON.stringify(loginInfo));
        setIsLoginLoading(false);

        if(response?.profile)
        {
            response.imageUrl = await bufferToUrl(response?.profile,response?.imageType)
        }
        else{
            response.imageUrl = avatar;
        }

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