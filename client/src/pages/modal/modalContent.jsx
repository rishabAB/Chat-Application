import "./modalContent.scss";
import React,{useContext,useState,useEffect} from "react";
import Modal from 'react-modal';
import PotentialChats from "../../components/chat/potentialChats";
import {ChatContext} from "../../context/chatContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
const ModalContent = () =>
{
  
    const {isModalOpen,updateModal} = useContext(ChatContext);
    
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          background:"black",
          color:"white",
          border:"unset",
          borderRadius:"30px",
          border: "2px solid rgb(12, 69, 125)"
        },
      };

     

      function openModal() {
        // setIsOpen(true);
        updateModal(true);
      }
    
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
      }
    
      function closeModal() {
        updateModal(false);
        // setIsOpen(false);
      }

      return(<Modal
        isOpen={isModalOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <span className="inline-flex">
        <h2>Potential Chats</h2> <FontAwesomeIcon icon={faXmark} className="fa-icon" onClick={closeModal}/>
        </span>
         
         <h4>Please select a chat to start a conversation</h4>
         <PotentialChats/>
      
        
        
       
      </Modal>)
   
}
export default ModalContent;