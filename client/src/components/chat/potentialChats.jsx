import React,{ useCallback, useContext, useState, useRef } from "react";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/authContext";
import "./chat.scss";
import toasts from "../../customComponents/toaster/toaster";
const PotentialChats = () => {
  const { potentialChats, createChat, createMultipleChats,updateModal } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [isMultipleChats, setIsMultipleChats] = useState(false);

  const [isBtnDisabled,setIsBtnDisabled] = useState(true);
  const chatIds = useRef([]);

  const selectMultipleChats = useCallback(() => {
    setIsMultipleChats((prev) => !prev);
  }, [isMultipleChats]);

  const addChatId = useCallback(
    (chatId) => {
     
      let index = chatIds.current.findIndex((elem) => elem.chatId == chatId);
      if (index != -1) {
        chatIds.current.splice(index, 1);
      } else {
        chatIds.current.push({ userId: user._id, chatId });
      }
      chatIds?.current?.length > 1 ?  setIsBtnDisabled(false) :  setIsBtnDisabled(true);
    },
    [user]
  );

function closeModal()
{
  updateModal(false);
}


  const createChats = useCallback(() => {
    if (chatIds.current.length == 0) {
      toasts.warning("Please select atleast one user");
    } else if (chatIds.current.length > 5) {
      toasts.warning("You cannot select more than 5 users at a time");
    } else {
      createMultipleChats(chatIds.current);
      closeModal();
    }
  }, [chatIds]);
  // potential chats are those that appear when chat hasn't started db is empty
  // as in chat and message collection
  return (
    <>
      {potentialChats?.length > 1 && (
        <button onClick={selectMultipleChats} className="btnn addHover">
          Select Multiple
        </button>
      )}
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <>
                <span className="single-user">
                  {isMultipleChats && (
                    <span>
                      <input type="checkbox" name={u._id} onClick={() => addChatId(u._id)} />
                    </span>
                  )}
                  <span
                    key={index}
                    onClick={() => createChat(user._id, u._id)}
                  >
                    {u.name}
                  </span>
                </span>
              </>
            );
          })}
      </div>
      {isMultipleChats && (
        <div className="multiple-chats">
          <button onClick={createChats}  disabled={isBtnDisabled}  className={`btnn ${isBtnDisabled ? "disable-button" : "addHover"}`}>
            Continue
          </button>
        </div>
      )}
    </>
  );
};
export default PotentialChats;
