import { useEffect, useState } from "react";
import Login from "../loginPage/login";
import Register from "../registerPage/register";
import "./introPage.scss";
const IntroPage = ({ isRegister }) => {
  const [isRegisterProp, setIsRegister] = useState(false);

  useEffect(() => {
    if (isRegister) {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [isRegister]);

  const dots = Array.from({ length: 5 }, (_, index) => (
    <div className="dot" key={index}></div>
));

  return (
    <div className="register_login">
      <div className="register_login_img_div">
        
        <img src="../../../public/final_img_1.jpg" alt="" />
      
        <div className="dots">
            {dots}
        </div>
        <img src="../../../public/final_img_2.png" />
      
       
       
      </div>

      <div style={{ width: "27%", maxWidth: "358px" }}>
        {isRegisterProp ? <Register /> : <Login />}
      </div>
    </div>
  );
};
export default IntroPage;
