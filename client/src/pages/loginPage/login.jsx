import {Alert,Button,Form,Row,Col,Stack} from "react-bootstrap";

import {useCallback, useContext,useEffect,useRef,useState} from "react";
import {AuthContext} from "../../context/authContext";
import "./login.scss";
import CustomInput from "../../customComponents/customInput/customInput";

// import { ToastContainer, toast } from 'react-toastify';

 import Toaster from "../toaster/toaster";
 import { toast } from 'react-toastify';
//   toast.configure();
const Login = () => {
    const {loginUser,loginInfo,updateLoginInfo,loginError,isLoginLoading} = useContext(AuthContext);
   
    const [showToaster, setShowToaster] = useState(false);
    const toasterType= useRef();
    const toasterMessage= useRef();

      const test = useCallback(()=>
      {
        // loginUser(loginInfo);
        console.log("Reaching Hereee");
        toast.success('This is a success message!');
        if (!loginInfo.email) {
            toasterType.current="warning";
            toasterMessage.current="Please Enter your email";
            setShowToaster(true);
        } 
        else if(!loginInfo.password)
        {
            toasterType.current="warning";
            toasterMessage.current="Please Enter your password";
            setShowToaster(true);

        }
        else {
            setShowToaster(false);
            // Proceed with login or other actions
        }

      },[]) 

       // this is not working
       const handleLoginError= useCallback(()=>
        {
           
            if(loginError?.error)
            {
                updateLoginInfo({email:"",password:""})
            }

        },[loginError])

        // useEffect(() => {
        //     handleLoginError(); // Call the callback function explicitly when loginError changes
        //   }, [loginError]);

    return (
        <>
            {/* <Form  onSubmit={loginUser}> */}
            <Form >
            {/* {showToaster && <Toaster type={toasterType.current} message={toasterMessage.current} />} */}
                <Row className="login_main_elem">
                    <Col >
                        <Stack gap={3}>
                            <h2>Login</h2>
                           
                            <CustomInput type = "email" regular="true" placeholder="Email" onChange={updateLoginInfo} obj = {loginInfo} propName="email"/>
                            <CustomInput type = "password" regular="true" placeholder="Password" onChange={updateLoginInfo} obj = {loginInfo} propName="password"/>
                            {/* <div onClick={showToastMessage}>Notify!</div> */}
                            {/* <ToastContainer  /> */}
                            {/* <Toaster success={true} message="success"/> */}
                           
                            {/* <Button varient="primary"  type= "submit"className="submit-button" >
                                Login
                            </Button> */}
                              <Button varient="primary" onClick = {test} className="submit-button" >
                                Login
                            </Button>
                            
                            {
                                loginError && (  <Alert varient="danger">
                                    <p>{loginError.message}</p>
                                </Alert>)
                            }
                          
                        </Stack>
                    </Col>
                </Row>
            </Form>

        </>
    );
}

export default Login;
