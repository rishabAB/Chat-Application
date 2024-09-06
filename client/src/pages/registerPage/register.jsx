import {
    Alert,
    Button,
    Form,
    Row,
    Col,
    Stack
} from "react-bootstrap";
import {useCallback, useContext, useEffect,useRef} from "react";
import {AuthContext} from "../../context/authContext";
import CustomInput from "../../customComponents/customInput/customInput";
import ProfilePicture from "../../customComponents/profilePicture/profilePicture";
import "./register.scss";
import toasts from "../toaster/toaster";
const Register = () => {
    const {
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading
    } = useContext(AuthContext);

    const email_regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  
    const password_regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    const maleRadioRef = useRef(null);
    const femaleRadioRef = useRef(null);

    const onSubmitRegister = useCallback((e)=>
    {
        
        if(!registerInfo.name)
        {
            toasts.warning("Please Enter your name")
        }
        else if(registerInfo.name.length < 3)
        {
            toasts.warning("Name must be of atleast 3 letters")
        }
        else if(!registerInfo.email)
        {
            toasts.warning("Please Enter your email")
        }
        else if(!registerInfo.email.match(email_regex))
        {
            toasts.warning("Please Enter a valid email address");
        }
        else if(!registerInfo.password)
        {
            toasts.warning("Please Enter your password");
        }
        else if(!registerInfo.password.match(password_regex))
        {
            toasts.warning("Password must be of atleast 8 letters,should contain one special character,one uppercase,lowercase and a number")
        }
        else if(!registerInfo.gender)
        {
            toasts.warning("Please fill your gender");
        }
        else{
            registerUser(e);  
        }

    },[registerInfo])

    useEffect(()=>
    {
        if(registerError?.error)
        {
            toasts.error(registerError.message);
            updateRegisterInfo({name :"",email:"",password:"",gender:"",profile:""});
            maleRadioRef.current.checked=false;
            femaleRadioRef.current.checked=false;
           
        }

    },[registerError])

    return (
        <>
        <Form>
            {/* <Form onSubmit={registerUser}> */}
                <div className="form_main_div">

                    <Col>
                        <Stack gap={3}>
                            <h2>Register</h2>

                            <CustomInput type="text" regular="true" placeholder="Name:*"
                                onChange={updateRegisterInfo}
                                obj={registerInfo} onErrorObj={registerError} maxLength={12}
                                propName="name"/>

                            <CustomInput type="email" regular="true" placeholder="Email:*"
                                onChange={updateRegisterInfo} 
                                obj={registerInfo} onErrorObj={registerError}
                                propName="email"/>

                            <CustomInput type="password" regular="true" placeholder="Password:*"
                                onChange={updateRegisterInfo}
                                obj={registerInfo} onErrorObj={registerError}
                                propName="password"/>

                            <div className="gender">
                                <Form.Label>Gender*:</Form.Label>
                                <Form.Check className="cursor gender_male" ref={maleRadioRef}
                                    onChange={
                                        () => updateRegisterInfo({
                                            ...registerInfo,
                                            gender: "male"
                                        })
                                    }
                                    type='radio' 
                                    name="gender"
                                    label={`Male`}></Form.Check>

                                <Form.Check className="cursor" ref={femaleRadioRef}
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
                                {/* <Form.Label className="picture_label">Profile picture:</Form.Label> */}

                                <ProfilePicture placeholder="Profile Picture"
                                    onChange={updateRegisterInfo} onErrorObj={registerError}
                                    obj={registerInfo}
                                    propName="profile"/>
                            {/* </div> */}


                            <Button className="submit-button" varient="primary" onKeyDown = {(e) => e.key=="Enter" ? onSubmitRegister(e) : null} onClick={(e) => onSubmitRegister(e)}>
                                {
                                isRegisterLoading ? "Creating your account" : "Register"
                            } </Button>
                            {
                            // registerError ?. error && <Alert varient="danger">
                            //     <p>{
                            //         registerError ?. message
                            //     }</p>
                            // </Alert>
                        } </Stack>
                    </Col>
                </div>
            </Form>

        </>
    );
}

export default Register;
