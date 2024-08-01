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
    const {recipientUser} = useFetchRecipientUser(currentChat,user);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    let [imageArray,setImageArray] = useState([]);
   
    let imageObjectUrl;
    
    
    const handleImageViewer = useCallback(()=>
    {
        setIsViewerOpen(prevIsViewerOpen => !prevIsViewerOpen);
        
    },[])
      
        const Base64ToUrl = (base64String) => {
            return new Promise((resolve,reject)=>
            {
                const base64Data = base64String.replace(/^data:image\/(png|jpeg);base64,/, "");
                const byteCharacters = atob(base64Data);
    
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "image/jpeg" }); // or "image/jpeg"
                const imageUrl = URL.createObjectURL(blob);
                resolve(imageUrl);

            })
           
        };

        const bufferToUrl = (bufferArray) => {
            return new Promise((resolve,reject)=>
            {
                const byteArray = new Uint8Array(bufferArray.data);
                const blob = new Blob([byteArray], { type: "image/jpeg" }); // or "image/jpeg"
                const imageUrl = URL.createObjectURL(blob);
                console.log("url ",imageUrl)
                resolve(imageUrl);

            })
           
        };

        const loadImage = useCallback(async()=>
            {
                imageObjectUrl= await bufferToUrl(user?.profile) 
                setImageArray([imageObjectUrl]);
        
            },[user])

        useEffect(()=>
            {
                if(user)
                {
                    if(user?.profile)
                    loadImage();
                    else{
                        setImageArray([avatar]);
                     }
                }
               

            },[user])
 
           
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
                {user && ( <img src={imageArray?.[0] } onClick = {handleImageViewer}style={{height:"50px",width:"50px",borderRadius:"50%",cursor:"pointer"}} alt="" />) }
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
            {isViewerOpen && (
                 <ImageViewer
          src={imageArray} 
          disableScroll={ false }
          closeOnClickOutside={ true }
          onClose={handleImageViewer}
          
        />
       
        
       
      )}
            {  recipientUser && (<span style = {{marginRight:"24%"}}>{recipientUser.name}</span>) }
        </Navbar>
    );
}

export default NavBar;
