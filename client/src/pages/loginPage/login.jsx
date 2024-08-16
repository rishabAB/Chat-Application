import {Alert,Button,Form,Row,Col,Stack} from "react-bootstrap";

import {useCallback, useContext,useEffect} from "react";
import {AuthContext} from "../../context/authContext";

import CustomInput from "../../customComponents/customInput/customInput";
const Login = () => {
    const {loginUser,loginInfo,updateLoginInfo,loginError,isLoginLoading} = useContext(AuthContext);
       
       // this is not working
       const handleLoginError= useCallback(()=>
        {
           
            if(loginError?.error)
            {
               
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
                justifyContent:"center"
                }}>

                    <Col >
                        <Stack gap={3}>
                            <h2 style={{color:"white"}}>Login</h2>
                           
                            {/* <Form.Control type="email"  onChange={ (e) => updateLoginInfo({...loginInfo, email:e.target.value})} placeholder="Email"/> */}
                            {/* <Form.Control type="password" onChange={(e) => updateLoginInfo({...loginInfo, password:e.target.value})} placeholder="Password"/> */}
                            <CustomInput type = "email" regular="true" placeholder="Email" onChange={updateLoginInfo} obj = {loginInfo} propName="email"/>
                            <CustomInput type = "password" regular="true" placeholder="Password" onChange={updateLoginInfo} obj = {loginInfo} propName="password"/>
                            <Button varient="primary" type="submit" className="submit-button">
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
