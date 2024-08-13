import {Alert,Button,Form,Row,Col,Stack} from "react-bootstrap";
import {useContext} from "react";
import {AuthContext} from "../context/authContext";

const Register = () => {
    const {user,registerInfo,updateRegisterInfo,registerUser,registerError,isRegisterLoading} = useContext(AuthContext);
    return (
        <>
            <Form onSubmit = {registerUser}>
            <div style={{
                    height:"85vh",
                justifyContent:"center",
                alignItems:"center",
                display:"flex"
                }}>

                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Register</h2>
                          
                            <Form.Control type="text" placeholder="Name" onChange={
                                (e) => updateRegisterInfo({...registerInfo,name:e.target.value}) }/>
                            <Form.Control type="email" placeholder="Email" onChange={
                                (e) => updateRegisterInfo({...registerInfo,email:e.target.value}) }/>
                            <Form.Control type="password" placeholder="Password" onChange={
                                (e) => updateRegisterInfo({...registerInfo,password:e.target.value}) }/>
                                <div >
                                <div className="gender">
                                <Form.Label>Gender:</Form.Label>
                                 <Form.Check  className="cursor" onChange={
                                () => updateRegisterInfo({...registerInfo,gender:"male"}) }
                                 type='radio' name="gender"
                               label={`Male`}></Form.Check>

                                <Form.Check  className="cursor"   onChange={
                                () => updateRegisterInfo({...registerInfo,gender:"female"}) }
                                 type='radio' name="gender"
                               label={`Female`}></Form.Check>
                                </div>
                                <div style={{display:"flex",flexDirection:"column",fontSize:"1.1rem"}}>
                                <Form.Label>Profile picture:</Form.Label>
                                 <Form.Control  type="file" className="customFileInput"  accept=".jpg, .jpeg, .png"  onChange={
                                (e) => updateRegisterInfo({...registerInfo,profile:e.target?.files?.[0]}) }/>
                                </div>
                                </div>
                                
                            <Button varient="primary" type="submit">
                                {isRegisterLoading ? "Creating your account" : "Register"}
                            </Button>
                            {
                                registerError?.error &&  <Alert varient="danger">
                                <p>{registerError?.message}</p>
                            </Alert>
                            }
                        
                        </Stack>
                    </Col>
                </div>
            </Form>

        </>
    );
}

export default Register;
