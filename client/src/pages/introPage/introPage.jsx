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


  return (
    <div className="register_login">
      <div className="register_login_img_div">
        
        <img src="../../../public/3394897.jpg" alt="" />
       
      </div>

      <div style={{ width: "27%", maxWidth: "358px" }}>
        {isRegisterProp ? <Register /> : <Login />}
      </div>
    </div>
  );
};
export default IntroPage;
