import {useEffect, useState} from "react";
import Login from "../loginPage/login";
import Register  from "../registerPage/register";
import "./introPage.scss"
const IntroPage = ({  isRegister }) => {
   
    const [isRegisterProp, setIsRegister] = useState(false);
   

    useEffect(() => {
      
        if(isRegister)
        {
            setIsRegister(true);
        }
        else{
            setIsRegister(false);

        }

    }, [isRegister])



return (<div className="register_login">
<img
    src="../../../public/chat_application_2.png"
    alt=""
   
/>
<div style={{width:"25%"}}>
{isRegisterProp ? <Register/> : <Login/> }
</div>
</div>
);
    

}
export default IntroPage;
