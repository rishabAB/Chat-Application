import {Alert,Button,Form,Row,Col,Stack} from "react-bootstrap";

import {useContext} from "react";
import {AuthContext} from "../context/authContext";
const Login = () => {
    const {loginUser,loginInfo,updateLoginInfo,loginError,isLoginLoading} = useContext(AuthContext);


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
