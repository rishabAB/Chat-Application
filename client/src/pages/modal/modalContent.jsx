import "./modalContent.scss";
import React, { useContext } from "react";
import Modal from "react-modal";
import PotentialChats from "../../components/chat/potentialChats";
import { ChatContext } from "../../context/chatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const ModalContent = () => {
  const { isModalOpen, updateModal } = useContext(ChatContext);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      background: "black",
      color: "white",
      borderRadius: "30px",
      border: "2px solid rgb(12, 69, 125)",
    },
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    updateModal(false);
    // setIsOpen(false);
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <span className="inline-flex">
        <div>Potential Chats</div>{" "}
        <FontAwesomeIcon
          icon={faXmark}
          className="fa-icon"
          onClick={closeModal}
        />
      </span>

      <div className="startConvo">Please select a chat to start a conversation</div>
      <PotentialChats />
    </Modal>
  );
};
export default ModalContent;
