import {Alert,Button,Form,Row,Col,Stack} from "react-bootstrap";

import {useCallback, useContext,useEffect} from "react";
import {AuthContext} from "../context/authContext";
const Login = () => {
    const {loginUser,loginInfo,updateLoginInfo,loginError,isLoginLoading} = useContext(AuthContext);
        console.log("loginError",loginError);
       // this is not working
       const handleLoginError= useCallback(()=>
        {
            console.log("THIS IS USE CALLBACK");
            if(loginError?.error)
            {
                console.log("inside if condition");
                updateLoginInfo({email:"",password:""})

            }

        },[loginError])

        useEffect(() => {
            handleLoginError(); // Call the callback function explicitly when loginError changes
          }, [loginError]);

    return (
        <>
            <Form onSubmit={loginUser}>
                <Row style={{
                    height:"100vh",
                justifyContent:"center",
                paddingTop:"10%"
                }}>

                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Login</h2>
                           
                            <Form.Control type="email"  onChange={ (e) => updateLoginInfo({...loginInfo, email:e.target.value})} placeholder="Email"/>
                            <Form.Control type="password" onChange={(e) => updateLoginInfo({...loginInfo, password:e.target.value})} placeholder="Password"/>
                            <Button varient="primary" type="submit">
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
