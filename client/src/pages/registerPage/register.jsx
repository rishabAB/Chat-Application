import {
    Alert,
    Button,
    Form,
    Row,
    Col,
    Stack
} from "react-bootstrap";
import {useContext} from "react";
import {AuthContext} from "../../context/authContext";
import CustomInput from "../../customComponents/customInput/customInput";
import ProfilePicture from "../../customComponents/profilePicture/profilePicture";
import "./register.scss";
const Register = () => {
    const {
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading
    } = useContext(AuthContext);

    return (
        <>
            <Form onSubmit={registerUser}>
                <div className="form_main_div">

                    <Col>
                        <Stack gap={3}>
                            <h2>Register</h2>

                            <CustomInput type="text" regular="true" placeholder="Name:*"
                                onChange={updateRegisterInfo}
                                obj={registerInfo}
                                propName="name"/>

                            <CustomInput type="email" regular="true" placeholder="Email:*"
                                onChange={updateRegisterInfo}
                                obj={registerInfo}
                                propName="email"/>

                            <CustomInput type="password" regular="true" placeholder="Password:*"
                                onChange={updateRegisterInfo}
                                obj={registerInfo}
                                propName="password"/>

                            <div className="gender">
                                <Form.Label>Gender*:</Form.Label>
                                <Form.Check className="cursor"
                                    onChange={
                                        () => updateRegisterInfo({
                                            ...registerInfo,
                                            gender: "male"
                                        })
                                    }
                                    type='radio'
                                    name="gender"
                                    label={`Male`}></Form.Check>

                                <Form.Check className="cursor"
                                    onChange={
                                        () => updateRegisterInfo({
                                            ...registerInfo,
                                            gender: "female"
                                        })
                                    }
                                    type='radio'
                                    name="gender"
                                    label={`Female`}></Form.Check>
                            </div>
                            {/* <div > */}
                                <Form.Label className="picture_label">Profile picture:</Form.Label>

                                <ProfilePicture placeholder="Profile Picture"
                                    onChange={updateRegisterInfo}
                                    obj={registerInfo}
                                    propName="profile"/>
                            {/* </div> */}


                            <Button className="submit-button" varient="primary" type="submit">
                                {
                                isRegisterLoading ? "Creating your account" : "Register"
                            } </Button>
                            {
                            registerError ?. error && <Alert varient="danger">
                                <p>{
                                    registerError ?. message
                                }</p>
                            </Alert>
                        } </Stack>
                    </Col>
                </div>
            </Form>

        </>
    );
}

export default Register;
