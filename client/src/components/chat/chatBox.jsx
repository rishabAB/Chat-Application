import {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  React,
} from "react";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/chatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";

import EmojiPicker from "react-input-emoji";

import "./chat.scss";
import Loader from "../../customComponents/loader/loader";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
    newMessage,
    moreMessagesAvailable,
    getPartialMessages,
    isChatBoxOpened,
    responsizeFrame1,
    wrapEmojis,
  } = useContext(ChatContext);

  const emojiRegex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  // scroll part
  const divRef = useRef(null);

  const checkScroll = useRef(null);

  const offsetRef = useRef(2);

  const emojiButton = document.querySelector(".react-input-emoji--button");

  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  // Here recipient User is the person whom with we are showing the conversation

  const [textMessage, setTextMessage] = useState("");

  const [test, setTest] = useState(1);
  // default value for test

  const isFetchingRef = useRef(false);
  // ------------

  let isOnlyEmoji = false;

  const oneTimeRecipient = useRef(true);

  // ----------
  useEffect(() => {
    if (
      currentChat &&
      messages &&
      messages.length > 0 &&
      messages[0].items?.length > 0
    ) {
      if (test == 1 || test !== messages[0]?.items[0].chatId) {
        setTest(messages[0]?.items[0].chatId);

        offsetRef.current = 2;

        divRef?.current?.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });

        // We are changing below value in a timeout because in the above line we are changing
        // the scroll posiiton to bottom first so it needs to reflect first in order make thigns happen
        setTimeout(function () {
          setIsScrollButton(false);
        }, 100);
      } else if (isPartialLoading) {
        checkScroll.current.scrollTop =
          checkScroll.current.scrollHeight - currentScrollPosition;
        delay(2000).then(onWheelCaptureHandler());
      }
    }
  }, [messages]);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const [currentScrollPosition, setCurrentScrollPosition] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isPartialLoading, setIspartialLoading] = useState(true);

  // The below code is for scroll bar to set it below when component mounts (reloads)
  const [isScrollAllowed, setIsScrollAllowed] = useState(true);
  useEffect(() => {
    if (isScrollAllowed && divRef?.current) {
      divRef.current.scrollIntoView({ behavior: "instant", block: "nearest" });

      setIsScrollAllowed(false);
    }
  });
  const [bottomScrollHeight, setBottomScrollHeight] = useState(null);

  // ------------------------------------------------------

  useEffect(() => {
    if (checkScroll?.current?.scrollTop == 0 && moreMessagesAvailable) {
      checkScroll.current.style.pointerEvents = "none";
      delay(1000).then(() => {
        onWheelCaptureHandler();
      });
    }
  }, [checkScroll?.current?.scrollTop]);

  const [isScrollButton, setIsScrollButton] = useState(false);

  const onWheelCaptureHandler = useCallback(async () => {
    setBottomScrollHeight(
      checkScroll?.current?.scrollHeight -
        checkScroll?.current?.clientHeight -
        checkScroll?.current?.scrollTop
    );

    if (
      checkScroll?.current?.scrollTop < 1000 &&
      moreMessagesAvailable &&
      !isFetchingRef.current
    ) {
      isFetchingRef.current = true;
      checkScroll.current.style.pointerEvents = "none";
      setCurrentScrollPosition(
        checkScroll.current.scrollHeight - checkScroll.current.scrollTop
      );

      await getPartialMessages(50, offsetRef.current, currentChat._id);
      offsetRef.current += 1;

      isFetchingRef.current = false;
      checkScroll.current.style.pointerEvents = "auto";
    } else if (checkScroll?.current) {
      if (bottomScrollHeight > 300) {
        setIsScrollButton(true);
      } else if (bottomScrollHeight <= 300) {
        setIsScrollButton(false);
      }
    }
  });

  const goToBottom = useCallback(async () => {
    divRef?.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    await delay(400);
    setIsScrollButton(false);
  }, []);

  useEffect(() => {
    if (newMessage) {
      divRef?.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [newMessage]);

  /** Removing disabled on emoji when input is on Focus */
  const inputOnFocus = () => {
    if (emojiButton) {
      emojiButton.disabled = false;
      emojiButton.style.cursor = "pointer";
    }
  };

  /** By default Emoji button should be disabled it will get enabled when user will focus on input tag where
   * we write our message */



  useEffect(() => {
    setTextMessage("");
    if (emojiButton) {
      emojiButton.disabled = true;
      emojiButton.style.cursor = "not-allowed";
    }
  }, [recipientUser]);

  const sendMessage = (value) => {
    if (textMessage.length == 2 && emojiRegex.test(textMessage)) {
      isOnlyEmoji = true;
    } else {
      isOnlyEmoji = false;
    }
    let str = value.replaceAll("</br>", "\n");

    sendTextMessage(str, user, currentChat._id, isOnlyEmoji);
    setTextMessage("");
  };

  const dynamicHeight = useRef();
  useEffect(() => {
    if (dynamicHeight && dynamicHeight.current) {
      const t = `calc(${window.outerHeight - (window.outerHeight - window.innerHeight)}px - 3.4rem)`;
      const height = t;

      dynamicHeight.current.style.height = height;
    }
  }, [dynamicHeight.current]);

  if (isMessagesLoading) {
    oneTimeRecipient.current = false;
    return (
      <Stack gap={4} className="chat-box alignment_center">
        {/* Loading Chats... */}
        <Loader showLoader={true} responsizeFrame1={responsizeFrame1} />
      </Stack>
    );
  } else if (!recipientUser && oneTimeRecipient.current) {
    return (
      <Stack
        gap={4}
        className={`chat-box alignment_center font-size ${
          isChatBoxOpened && responsizeFrame1 ? "full-width" : ""
        }`}
      >
        No conversation selected yet ...
      </Stack>
    );
  }

  return (
    <Stack
      ref={dynamicHeight}
      className={`chat-box ${
        isChatBoxOpened && responsizeFrame1 ? "full-width" : ""
      }`}
    >
      <Stack
        gap={3}
        className="messages"
        ref={checkScroll}
        onScroll={onWheelCaptureHandler}
      >
        {messages?.length == 0 && <h5>Start a Conversation</h5>}
        {messages?.length > 0 && !moreMessagesAvailable && (
          <h5>Beggining of the conversation</h5>
        )}
        {messages &&
          messages.map(({ date, items }, messageIndex) => {
            return (
              <div
                key={messageIndex}
                direction="vertical"
                className="messages_flex"
              >
                <div className="flex justify-center mb-3  pos_sticky">
                  <span className="text-sm border px-2 rounded-full bg-white border-gray-300">
                    {date}
                  </span>
                </div>

                {items &&
                  items.map((msg, index) =>
                    msg?.isOnlyEmoji ? (
                      <Stack
                        ref={index === items.length - 1 ? divRef : null}
                        key={index}
                      >
                        <span
                          className={`text only-emoji ${
                            msg?.senderId === user?._id
                              ? " self align-self-end "
                              : " align-self-start"
                          }`}
                        >
                          {msg?.text}{" "}
                        </span>
                        <span
                          className={` message only-time flex-grow-0 ${
                            msg?.senderId === user?._id
                              ? " self align-self-end "
                              : " align-self-start"
                          }`}
                        >
                          {moment(msg.createdAt).format("LT")}
                        </span>
                      </Stack>
                    ) : (
                      <Stack
                        ref={index === items.length - 1 ? divRef : null}
                        key={index}
                        className={`message flex-grow-0 ${
                          msg?.senderId === user?._id
                            ? " self align-self-end "
                            : " align-self-start"
                        }`}
                      >
                        <span className="text">{wrapEmojis(msg?.text)} </span>
                        <span className="message-footer">
                          {moment(msg.createdAt).format("LT")}
                        </span>
                      </Stack>
                    )
                  )}
              </div>
            );
          })}
      </Stack>

      <Stack direction="vertical" className="flex-end">
        {isScrollButton && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="30"
            fill="currentColor"
            onClick={goToBottom}
            className={`bi bi-chevron-double-down svg-icon ${
              isChatBoxOpened && responsizeFrame1 ? "resize-svg-icon" : ""
            } `}
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
            <path
              fillRule="evenodd"
              d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
            />
          </svg>
        )}

        <div className="chat-input flex-grow-0">
          <EmojiPicker
            key={recipientUser}
            value={textMessage}
            onChange={setTextMessage}
            className="emoji-picker"
            fontFamily="nunito"
            keepOpened={true}
            onFocus={inputOnFocus}
            shouldReturn={true}
            borderColor="rgba(72,112,223,0.2)"
            onEnter={(e) => sendMessage(e)}
          />
          <button className="send-btn" onClick={sendMessage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send-fill"
              viewBox="0 0 16 16"
            >
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
            </svg>
          </button>
        </div>
      </Stack>
    </Stack>
  );
};
export default ChatBox;
