import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import ImageViewer from "react-simple-image-viewer";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/chatContext";

import "./navbar.scss";
import ModalContent from "../../pages/modal/modalContent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  const { user, logoutUser,updateRegisterInfo,updateLoginInfo,isLoginLoading,isRegisterLoading } = useContext(AuthContext);
  const {
    currentChat,
    updateModal,
    isModalOpen,
    isChatBoxOpened,
    responsizeFrame1,
    updateChatBox,
    potentialChats,
    isUserChatLoading
  } = useContext(ChatContext);
  
  const { recipientUser, imageUrl } = useFetchRecipientUser(currentChat, user);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isRecipientViewerOpen, setIsRecipientViewerOpen] = useState(false);

  const [isLoginStyle, setIsLoginStyle] = useState(false);
  const [isRegisterStyle, setIsRegisterStyle] = useState(false);

  const [isCssAffected, setIsCssAffected] = useState(true);

  const openModal = useCallback(() => {
    updateModal(true);
  }, []);
  

  useEffect(() => {
    if (
      (isCssAffected && window.location.pathname == "/") ||
      window.location.pathname == "/login"
    ) {
      setIsLoginStyle(true);
      setIsRegisterStyle(false);
      setIsCssAffected(false);
      updateRegisterInfo({
        name: "",
        email: "",
        password: "",
        profile: "",
        gender: "",
      });
    } else if (isCssAffected && window.location.pathname == "/register") {
      setIsRegisterStyle(true);
      setIsLoginStyle(false);
      setIsCssAffected(false);
      updateLoginInfo({email:"",password:""})
    }
  }, [window.location.pathname, isCssAffected]);
  const handleImageViewer = useCallback(() => {
    setIsViewerOpen((prevIsViewerOpen) => !prevIsViewerOpen);
  }, []);

  const handleUnderlineCss = useCallback(() => {
    setIsCssAffected(true);
  }, []);

  const handleRecipientImageViewer = useCallback(() => {
    setIsRecipientViewerOpen(
      (prevIsRecipientViewerOpen) => !prevIsRecipientViewerOpen
    );
  }, []);

  let [userImageArray, setUserImageArray] = useState(null);
  let [recipientUserArray, setRecipientUserArray] = useState(null);
  const loadImage = useCallback(async () => {
    if (typeof user == "string") {
      let ObjUser = JSON.parse(user);
      setUserImageArray([ObjUser?.imageUrl]);
    } else {
      setUserImageArray([user?.imageUrl]);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadImage();
  }, [user]);

  const loadRecipientImage = useCallback(async () => {
    setRecipientUserArray([imageUrl]);
  }, [imageUrl]);

  useEffect(() => {
    if (imageUrl) loadRecipientImage();
  }, [imageUrl]);

  return isUserChatLoading || (isLoginLoading || isRegisterLoading) ? null : ( <Navbar
    className={`navbar_main ${
      isChatBoxOpened && responsizeFrame1 ? "content-center" : ""
    }`}
  >
    {isModalOpen && <ModalContent isOpen={true} />}
    {/* {user && <div onClick={openModal} className="modal_nav add-hover">Open Modal</div>} */}
    <Container
      className={`navbar_main_container ${
        isChatBoxOpened && responsizeFrame1 ? "display-none" : ""
      }`}
    >
      {user && (
        <img
          src={userImageArray?.[0]}
          onClick={handleImageViewer}
          className="user_img"
          alt=""
        />
      )}
        <Link to="/" className="link-light text-decoration-none navbar_main_container-app-title">
          Talkapp
        </Link>
      {/* {user && (<span className="text-warning">Logged in as {user?.name} </span>) } */}
      <Nav>
        <Stack direction="horizontal" gap="3">
          {user && (
            <span className="added-flex">
              <Link
                onClick={logoutUser}
                to="/login"
                className="link-light text-decoration-none add-hover"
              >
                Logout
              </Link>
              {potentialChats?.length > 0 ? (
                <div
                  onClick={openModal}
                  className={`modal_nav ${
                    isModalOpen ? "underline " : "add-hover"
                  }`}
                >
                  Potential Chats
                </div>
              ) : (
                ""
              )}
            </span>
          )}
          {!user && (
            <>
              {/* <span className="add-hover"> */}
              <Link
                to="/login"
                onClick={handleUnderlineCss}
                className={`link-light text-decoration-none ${
                  isLoginStyle ? "underline " : "add-hover"
                }`}
              >
                Login
              </Link>
              <span></span>
              {/* </span> */}

              <Link
                to="/register"
                onClick={handleUnderlineCss}
                className={`link-light text-decoration-none ${
                  isRegisterStyle ? "underline " : "add-hover"
                }`}
              >
                Register
              </Link>
            </>
          )}
        </Stack>
      </Nav>
    </Container>
    {isViewerOpen && (
      <ImageViewer
        src={userImageArray}
        disableScroll={false}
        closeOnClickOutside={true}
        onClose={handleImageViewer}
      />
    )}

    {isRecipientViewerOpen && (
      <ImageViewer
        src={recipientUserArray}
        disableScroll={false}
        closeOnClickOutside={true}
        onClose={handleRecipientImageViewer}
      />
    )}

    {recipientUser && (
      <>
        <span
          className={`recipient ${
            !isChatBoxOpened && responsizeFrame1 ? "display-none  " : ""
          } ${
            isChatBoxOpened && responsizeFrame1 ? "right-margin-unset" : ""
          }`}
        >
          {isChatBoxOpened && responsizeFrame1 ? (
            <span>
              {" "}
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="fa-arrow"
                onClick={updateChatBox}
              />
            </span>
          ) : (
            ""
          )}
          <span>{recipientUser.name}</span>
          <span>
            <img
              src={recipientUserArray?.[0]}
              onClick={handleRecipientImageViewer}
              alt=""
            />
          </span>
        </span>
      </>
    )}
  </Navbar>);
 
};

export default NavBar;
