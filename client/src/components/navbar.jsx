import {Container, Nav, Navbar, Stack} from "react-bootstrap";
import {Link} from "react-router-dom";

import { useFetchRecipientUser } from "../hooks/useFetchRecipient";
import ImageViewer from 'react-simple-image-viewer';
import {useCallback, useContext,useEffect,useState} from "react";
import {AuthContext} from "../context/authContext";
import {ChatContext} from "../context/chatContext";
import avatar from "../assets/avatar.svg";
const NavBar = () => {
    const {user,logoutUser} = useContext(AuthContext);
    const { currentChat } = useContext(ChatContext);
    const {recipientUser,imageUrl} = useFetchRecipientUser(currentChat,user);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isRecipientViewerOpen, setIsRecipientViewerOpen] = useState(false);
   
   
    const handleImageViewer = useCallback(()=>
    {
        setIsViewerOpen(prevIsViewerOpen => !prevIsViewerOpen);
        
    },[])

    const handleRecipientImageViewer = useCallback(()=>
        {
            setIsRecipientViewerOpen(prevIsRecipientViewerOpen => !prevIsRecipientViewerOpen);
            
        },[])
      
        let [userImageArray,setUserImageArray] = useState(null);
        let [recipientUserArray,setRecipientUserArray] = useState(null);
        const loadImage = useCallback(async()=>
            {
                if(typeof user == "string")
                {
                    let ObjUser=JSON.parse(user);
                    setUserImageArray([ObjUser?.imageUrl]);

                }
                else{
                    setUserImageArray([user?.imageUrl]);
                }
               
        
            },[user])

            useEffect(()=>
            {
                if(user)
                loadImage();

            },[user])

            const loadRecipientImage = useCallback(async()=>
                {
                    setRecipientUserArray([imageUrl]);
            
                },[imageUrl])
    
                useEffect(()=>
                {
                    if(imageUrl)
                    loadRecipientImage();
    
                },[imageUrl])
               
           
    return (
        <Navbar 
            style={
                {height: "3.75rem",padding:"0 4%",backgroundColor: "rgb(12 69 125)"}
        }>
            <Container style={{gap:"2rem",justifyContent:"flex-start",marginLeft:"1%"}}>
            {user && ( <img src={userImageArray?.[0] } onClick = {handleImageViewer}style={{height:"50px",width:"50px",borderRadius:"50%",cursor:"pointer",zIndex:"4"}} alt="" />) }
                <h2>
                    <Link to="/" className="link-light text-decoration-none">ChattApp</Link>
                </h2>
                {/* {user && (<span className="text-warning">Logged in as {user?.name} </span>) } */}
                <Nav>
                    <Stack direction="horizontal" gap="3">
                        {
                            user && ( <Link onClick= {logoutUser} to="/login" className="link-light text-decoration-none">Logout</Link> )
                        }
                        {
                            !user && (<>
                            {/* <span className="add-hover"> */}
                            <Link to="/login" className="link-light text-decoration-none add-hover">Login</Link>
                            <span></span>
                            {/* </span> */}
                            
                        <Link to="/register" className="link-light text-decoration-none add-hover">Register</Link>
                        </>)

                        }

                    </Stack>
                   
                </Nav>
            </Container>
            {isViewerOpen && (
                 <ImageViewer
          src={userImageArray} 
          disableScroll={ false }
          closeOnClickOutside={ true }
          onClose={handleImageViewer}
          
        />
       
      )}

     {isRecipientViewerOpen && (
                 <ImageViewer 
          src={recipientUserArray} 
          disableScroll={ false }
          closeOnClickOutside={ true }
          onClose={handleRecipientImageViewer}
          
        />
       
      )}


            {  recipientUser && (<><span style={{display:"flex",marginRight:"21%",gap:"1.2rem",alignItems:"center"}}><span >{recipientUser.name}</span><span>
                <img src={recipientUserArray?.[0] } onClick = {handleRecipientImageViewer}style={{height:"50px",width:"50px",borderRadius:"50%",cursor:"pointer"}} alt="" /></span></span>
               </>) }
        </Navbar>
    );
}

export default NavBar;
