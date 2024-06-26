import {Alert,Button,Form,Row,Col,Stack} from "react-bootstrap";

import {useContext} from "react";
import {AuthContext} from "../context/authContext";
const Login = () => {
    const {loginUser,loginInfo,updateLoginInfo,loginError,isLoginLoading} = useContext(AuthContext);

    const test_user= (value1,value2) =>
    {
        console.log("Test value is ",value1);
        console.log("test value 2 ",value2);

    }
    console.log("logininfo in login.jsx",loginInfo);
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
                           
                            <Form.Control type="email"  onChange={ (e) => test_user(loginInfo, e.target.value)} placeholder="Email"/>
                            <Form.Control type="password" onChange={(e) => test_user(loginInfo, e.target.value)} placeholder="Password"/>
                            <Button varient="primary" type="submit">
                                Login
                            </Button>
                            <Alert varient="danger">
                                <p>An error occurred</p>
                            </Alert>
                        </Stack>
                    </Col>
                </Row>
            </Form>

        </>
    );
}

export default Login;
