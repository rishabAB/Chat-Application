import {Alert,Button,Form,Row,Col,Stack} from "react-bootstrap";

import {useCallback, useContext,useEffect,useRef,useState} from "react";
import {AuthContext} from "../../context/authContext";
import "./login.scss";
import CustomInput from "../../customComponents/customInput/customInput";


import toasts from "../toaster/toaster";

const Login = () => {
    const {loginUser,loginInfo,updateLoginInfo,loginError,isLoginLoading} = useContext(AuthContext);

    const email_regex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const password_regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
   
      const onSubmitLogin = useCallback((e)=>
      {
        
        if (!loginInfo.email) {
           
            toasts.warning("Please Enter your email");  
        } 
        else if(!loginInfo.email.match(email_regex))
        {
            toasts.warning("Please Enter a valid email address");
        }
        else if(!loginInfo.password)
        {
            toasts.warning("Please Enter your password");
        }
        else if(!loginInfo.password.match(password_regex))
        {
            toasts.warning("Password must be of atleast 8 letters,should contain one special character,one uppercase,lowercase and a number")
        }
        else {
            loginUser(e);
            // Proceed with login or other actions
        }

      },[loginInfo]) 
     
        useEffect(()=>
        {
            if(loginError?.error)
            {
                toasts.error(loginError.message);
                updateLoginInfo({email:"",password:""})
            }

        },[loginError])

       

    return (
        <>
            {/* <Form  onSubmit={loginUser}> */}
            <Form >
            {/* {showToaster && <Toaster type={toasterType.current} message={toasterMessage.current} />} */}
                <Row className="login_main_elem">
                    <Col >
                        <Stack gap={3}>
                            <h2>Login</h2>
                           
                            <CustomInput type = "email" regular="true" placeholder="Email" onErrorObj = {loginError} onChange={updateLoginInfo} obj = {loginInfo} propName="email"/>
                            <CustomInput type = "password" regular="true" placeholder="Password" onErrorObj = {loginError} onEnter ={onSubmitLogin} onChange={updateLoginInfo} obj = {loginInfo} propName="password"/>
                           
                            {/* <Button varient="primary"  type= "submit"className="submit-button" >
                                Login
                            </Button> */}
                              <Button varient="primary" onKeyDown = {(e) => e.key=="Enter" ? onSubmitLogin(e) : null} onClick = {(e) =>onSubmitLogin(e)} className="submit-button" >
                                Login
                            </Button>
                            
                            {/* {
                                loginError && (  <Alert varient="danger">
                                    <p>{loginError.message}</p>
                                </Alert>)
                            } */}
                          
                        </Stack>
                    </Col>
                </Row>
            </Form>

        </>
    );
}

export default Login;
