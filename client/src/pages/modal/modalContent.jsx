import "./modalContent.scss";
import {useContext,useState,useEffect} from "react";
import Modal from 'react-modal';
import PotentialChats from "../../components/chat/potentialChats";
import {ChatContext} from "../../context/chatContext";
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
         <h2>Potential Chats</h2>
         <PotentialChats/>
      
        
        <button onClick={closeModal}>close</button>
       
      </Modal>)
   
}
export default ModalContent;