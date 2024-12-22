import { Button, Form, Row, Col, Stack } from "react-bootstrap";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import CustomInput from "../../customComponents/customInput/customInput";
import Loader from "../../customComponents/loader/loader";
import toasts from "../../customComponents/toaster/toaster";
import { useKeyPress } from "../../utils/helpers";
const Login = () => {
  const {
    loginUser,
    loginInfo,
    updateLoginInfo,
    loginError,
    isLoginLoading,
    clearError,
  } = useContext(AuthContext);

  const email_regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const password_regex =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  useEffect(() => {
    if (loginInfo.email && loginInfo.password) {
      setIsBtnDisabled(false);
    } else {
      setIsBtnDisabled(true);
    }
  }, [loginInfo]);

  const onSubmitLogin = useCallback(
    (e) => {
      if (!isBtnDisabled) {
        if (!loginInfo.email) {
          toasts.warning("Please Enter your email");
        } else if (!loginInfo.email.match(email_regex)) {
          toasts.warning("Please Enter a valid email address");
        } else if (!loginInfo.password) {
          toasts.warning("Please Enter your password");
        } else if (!loginInfo.password.match(password_regex)) {
          toasts.warning(
            "Password must be of atleast 8 letters,should contain one special character,one uppercase,lowercase and a number"
          );
        } else if (!isLoginLoading) {
          loginUser(e);
        }
      }
    },
    [loginInfo, isLoginLoading, isBtnDisabled]
  );

  useEffect(() => {
    if (loginError?.error) {
      toasts.error(loginError.message);
      updateLoginInfo({ email: "", password: "" });
      clearError();
    }
  }, [loginError]);

  useKeyPress("Enter", onSubmitLogin, [onSubmitLogin]);
  return (
    <>
      {
        <p>
          <Loader showLoader={isLoginLoading} />
        </p>
      }
      <Form>
        <Row className="login_main_elem">
          <Col>
            <Stack gap={3}>
              <h2>Login</h2>

              <CustomInput
                type="email"
                regular="true"
                placeholder="Email"
                maxLength={40}
                onErrorObj={loginError}
                onChange={updateLoginInfo}
                obj={loginInfo}
                propName="email"
              />
              <CustomInput
                type="password"
                regular="true"
                placeholder="Password"
                maxLength={25}
                onErrorObj={loginError}
                onChange={updateLoginInfo}
                obj={loginInfo}
                propName="password"
              />

              <Button
                varient="primary"
                disabled={isLoginLoading || isBtnDisabled}
                onClick={(e) => onSubmitLogin(e)}
                className={`submit-button ${isLoginLoading || isBtnDisabled ? "disable-button" : null}`}
              >
                Login
              </Button>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
