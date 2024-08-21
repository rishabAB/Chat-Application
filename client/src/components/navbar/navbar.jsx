import {Container, Nav, Navbar, Stack} from "react-bootstrap";
import {Link} from "react-router-dom";

import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import ImageViewer from 'react-simple-image-viewer';
import {useCallback, useContext,useEffect,useState} from "react";
import {AuthContext} from "../../context/authContext";
import {ChatContext} from "../../context/chatContext";
import avatar from "../../assets/avatar.svg";
import "./navbar.scss";
import ModalContent from "../../pages/modal/modalContent";
const NavBar = () => {
    const {user,logoutUser} = useContext(AuthContext);
    const { currentChat,updateModal,isModalOpen } = useContext(ChatContext);
    const {recipientUser,imageUrl} = useFetchRecipientUser(currentChat,user);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isRecipientViewerOpen, setIsRecipientViewerOpen] = useState(false);
   
    const [isLoginStyle,setIsLoginStyle] = useState(false);
    const [isRegisterStyle,setIsRegisterStyle] = useState(false);

    const [isCssAffected,setIsCssAffected] = useState(true);

    const openModal= useCallback(()=>
    {
      updateModal(true)

    },[])

    useEffect(()=>
    {
        // console.log("window",window.location.pathname);
        if(isCssAffected && window.location.pathname == "/" || window.location.pathname == "/login")
        {
            setIsLoginStyle(true);
            setIsRegisterStyle(false);
            setIsCssAffected(false);
        }
        else if(isCssAffected && window.location.pathname == "/register")
        {
            setIsRegisterStyle(true);
            setIsLoginStyle(false);
            setIsCssAffected(false);
        }

    },[window.location,isCssAffected])
    const handleImageViewer = useCallback(()=>
    {
        setIsViewerOpen(prevIsViewerOpen => !prevIsViewerOpen);
        
    },[])

    const handleUnderlineCss = useCallback(()=>
    {
        setIsCssAffected(true);
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
           className="navbar_main">
            {isModalOpen && (<ModalContent isOpen={true} />)}
            {/* {user && <div onClick={openModal} className="modal_nav add-hover">Open Modal</div>} */}
            <Container className="navbar_main_container" >
            {user && ( <img src={userImageArray?.[0] } onClick = {handleImageViewer} className="user_img" alt="" />) }
                <h2>
                    {/* <img src="../../../public/icon.png" style={{height:"30px",width:"30px"}}/> */}
                    <Link to="/" className="link-light text-decoration-none">ChattApp</Link>
                </h2>
                {/* {user && (<span className="text-warning">Logged in as {user?.name} </span>) } */}
                <Nav>
                    <Stack direction="horizontal" gap="3">
                        {
                            user && ( <span className="added-flex"><Link onClick= {logoutUser} to="/login" className="link-light text-decoration-none add-hover">Logout</Link><div onClick={openModal} className="modal_nav add-hover">Potential Chats</div></span> )
                        }
                        {
                            !user && (<>
                            {/* <span className="add-hover"> */}
                            <Link to="/login" onClick={handleUnderlineCss} className= {`link-light text-decoration-none ${isLoginStyle ? "underline " : "add-hover"}`  }>Login</Link>
                            <span></span>
                            {/* </span> */}
                            
                        <Link to="/register" onClick={handleUnderlineCss}  className= {`link-light text-decoration-none ${isRegisterStyle ? "underline " : "add-hover"}`  }>Register</Link>
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


            {  recipientUser && (<>
            <span className="recipient">
                <span >{recipientUser.name}</span>
                <span>
                <img src={recipientUserArray?.[0] } onClick = {handleRecipientImageViewer} alt="" />
                </span>
                </span>
               </>) }
        </Navbar>
    );
}

export default NavBar;
