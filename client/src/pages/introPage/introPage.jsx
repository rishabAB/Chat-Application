import React, { useEffect, useState } from "react";
import Login from "../loginPage/login";
import Register from "../registerPage/register";
import "./introPage.scss";
import PropTypes from "prop-types";
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
        <img src="./3394897.jpg" alt="" />
        {/* <img src="../../assets/3394897.jpg" alt="" /> */}
      </div>

      <div>{isRegisterProp ? <Register /> : <Login />}</div>
    </div>
  );
};
export default IntroPage;

IntroPage.propTypes = {
  isRegister: PropTypes.bool,
};
