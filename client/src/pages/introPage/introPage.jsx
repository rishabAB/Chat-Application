import React, { useEffect, useState, useContext } from "react";
import Login from "../loginPage/login";
import Register from "../registerPage/register";
import "./introPage.scss";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/authContext";
import { FullLoader } from "../../customComponents/fullLoader/fullLoader.jsx";
const IntroPage = ({ isRegister }) => {
  const [isRegisterProp, setIsRegister] = useState(false);
  const { isLoginLoading, isRegisterLoading } = useContext(AuthContext);
  useEffect(() => {
    if (isRegister) {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [isRegister]);

  return isLoginLoading || isRegisterLoading ? (
    <FullLoader showLoader={isLoginLoading} />
  ) : (
    <div className="register_login">
      <div className="register_login_img_div">
        <img src="./3394897.jpg" alt="" />
      </div>

      <div>{isRegisterProp ? <Register /> : <Login />}</div>
    </div>
  );
};
export default IntroPage;

IntroPage.propTypes = {
  isRegister: PropTypes.bool,
};
