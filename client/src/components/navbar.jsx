import {Container, Nav, Navbar, Stack} from "react-bootstrap";
import {Link} from "react-router-dom";

import { useFetchRecipientUser } from "../hooks/useFetchRecipient";

import {useContext} from "react";
import {AuthContext} from "../context/authContext";
import {ChatContext} from "../context/chatContext";
const NavBar = () => {
    const {user,logoutUser} = useContext(AuthContext);
    const { currentChat } = useContext(ChatContext);
    const {recipientUser} = useFetchRecipientUser(currentChat,user);
    console.log("user",user?.profile);
    return (
        <Navbar 
            style={
                {height: "3.75rem",padding:"0 4%",backgroundColor: "rgb(12 69 125)"}
        }>
            <Container style={{gap:"2rem",justifyContent:"flex-start",marginLeft:"1%"}}>
                <h2>
                    <Link to="/" className="link-light text-decoration-none">ChattApp</Link>
                </h2>
                {/* {user && (<span className="text-warning">Logged in as {user?.name} </span>) } */}
                {user && ( <img src={user?.profile} style={{height:"50px",width:"50px",borderRadius:"50%"}} alt="" />) }
                <Nav>
                    <Stack direction="horizontal" gap="3">
                        {
                            user && ( <Link onClick= {logoutUser} to="/login" className="link-light text-decoration-none">Logout</Link> )
                        }
                        {
                            !user && (<>
                             <Link to="/login" className="link-light text-decoration-none">Login</Link>
                        <Link to="/register" className="link-light text-decoration-none">Register</Link>
                        </>)

                        }

                    </Stack>
                   
                </Nav>
            </Container>
            {  recipientUser && (<span style = {{marginRight:"24%"}}>{recipientUser.name}</span>) }
        </Navbar>
    );
}

export default NavBar;
