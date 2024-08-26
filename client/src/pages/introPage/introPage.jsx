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
    src="../../../public/test8.png"
    alt=""
   
/>
<div style={{width:"27%",maxWidth:"358px"}}>
{isRegisterProp ? <Register/> : <Login/> }
</div>
</div>
);
    

}
export default IntroPage;
