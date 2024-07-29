import {Container, Nav, Navbar, Stack} from "react-bootstrap";
import {Link} from "react-router-dom";

import { useFetchRecipientUser } from "../hooks/useFetchRecipient";

import {useContext} from "react";
import {AuthContext} from "../context/authContext";
import {ChatContext} from "../context/chatContext";
const NavBar = () => {
    const {user,logoutUser} = useContext(AuthContext);
    // console.log('user',user);
    const { currentChat } = useContext(ChatContext);
    // console.log("current Chat",currentChat)
    const {recipientUser} = useFetchRecipientUser(currentChat,user);
    console.log("recipientUser",recipientUser);
    return (
        <Navbar bg="dark"
            style={
                {height: "3.75rem"}
        }>
            <Container style={{gap:"2rem",justifyContent:"flex-start",marginleft:"3%"}}>
                <h2>
                    <Link to="/" className="link-light text-decoration-none">ChattApp</Link>
                </h2>
                {user && (<span className="text-warning">Logged in as {user?.name} </span>) }
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
