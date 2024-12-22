import { Button, Form, Col, Stack } from "react-bootstrap";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "../../context/authContext";
import CustomInput from "../../customComponents/customInput/customInput";
import ProfilePicture from "../../customComponents/profilePicture/profilePicture";
import "./register.scss";
import toasts from "../../customComponents/toaster/toaster";
import { useKeyPress } from "../../utils/helpers";
const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
    clearError,
  } = useContext(AuthContext);

  const email_regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const password_regex =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const maleRadioRef = useRef(null);
  const femaleRadioRef = useRef(null);

  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  useEffect(() => {
    if (
      registerInfo.name &&
      registerInfo.email &&
      registerInfo.password &&
      registerInfo.gender
    ) {
      setIsBtnDisabled(false);
    } else {
      setIsBtnDisabled(true);
    }
  }, [registerInfo, isBtnDisabled]);

  const onSubmitRegister = useCallback(
    (e) => {
      if (!isBtnDisabled) {
        if (!registerInfo.name) {
          toasts.warning("Please Enter your name");
        } else if (registerInfo.name.length < 3) {
          toasts.warning("Name must be of atleast 3 letters");
        } else if (!registerInfo.email) {
          toasts.warning("Please Enter your email");
        } else if (!registerInfo.email.match(email_regex)) {
          toasts.warning("Please Enter a valid email address");
        } else if (!registerInfo.password) {
          toasts.warning("Please Enter your password");
        } else if (!registerInfo.password.match(password_regex)) {
          toasts.warning(
            "Password must be of atleast 8 letters,should contain one special character,one uppercase,lowercase and a number"
          );
        } else if (!registerInfo.gender) {
          toasts.warning("Please fill your gender");
        } else if (!isRegisterLoading) {
          setIsBtnDisabled(true);
          registerUser(e);
          setIsBtnDisabled(false);
        }
      }
    },
    [registerInfo, isBtnDisabled, isRegisterLoading]
  );

  useEffect(() => {
    if (registerError?.error) {
      toasts.error(registerError.message);
      updateRegisterInfo({
        name: "",
        email: "",
        password: "",
        gender: "",
        profile: "",
      });
      maleRadioRef.current.checked = false;
      femaleRadioRef.current.checked = false;
      clearError();
    }
  }, [registerError]);

  useKeyPress("Enter", onSubmitRegister, [onSubmitRegister]);
  return (
    <>
      <Form>
        <div className="form_main_div">
          <Col>
            <Stack gap={3}>
              <h2>Register</h2>
              <CustomInput
                type="text"
                regular="true"
                placeholder="Name:*"
                onChange={updateRegisterInfo}
                obj={registerInfo}
                onErrorObj={registerError}
                maxLength={12}
                propName="name"
              />
              <CustomInput
                type="email"
                regular="true"
                placeholder="Email:*"
                onChange={updateRegisterInfo}
                obj={registerInfo}
                maxLength={40}
                onErrorObj={registerError}
                propName="email"
              />
              <CustomInput
                type="password"
                regular="true"
                placeholder="Password:*"
                onChange={updateRegisterInfo}
                obj={registerInfo}
                maxLength={25}
                onErrorObj={registerError}
                propName="password"
              />
              <div className="gender">
                <Form.Label>Gender*:</Form.Label>
                <Form.Check
                  className="cursor gender_male"
                  ref={maleRadioRef}
                  onChange={() =>
                    updateRegisterInfo({
                      ...registerInfo,
                      gender: "male",
                    })
                  }
                  type="radio"
                  name="gender"
                  label={`Male`}
                ></Form.Check>

                <Form.Check
                  className="cursor"
                  ref={femaleRadioRef}
                  onChange={() =>
                    updateRegisterInfo({
                      ...registerInfo,
                      gender: "female",
                    })
                  }
                  type="radio"
                  name="gender"
                  label={`Female`}
                ></Form.Check>
              </div>
              <ProfilePicture
                placeholder="Profile Picture"
                onChange={updateRegisterInfo}
                onErrorObj={registerError}
                obj={registerInfo}
                propName="profile"
              />
              <Button
                className={`submit-button ${isRegisterLoading || isBtnDisabled ? "disable-button" : null}`}
                disabled={isRegisterLoading || isBtnDisabled}
                varient="primary"
                onKeyDown={(e) =>
                  e.key == "Enter" ? onSubmitRegister(e) : null
                }
                onClick={(e) => onSubmitRegister(e)}
              >
                {isRegisterLoading ? "Creating your account" : "Register"}{" "}
              </Button>
            </Stack>
          </Col>
        </div>
      </Form>
    </>
  );
};

export default Register;
