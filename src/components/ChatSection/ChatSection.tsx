import { FaArrowAltCircleLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import "./ChatSection.scss";
import UserDetails from "../UserDetails/UserDetails";
import ChatMessages from "../ChatMessages/ChatMessages";
import { IconButton, TextField, Tooltip, Zoom } from "@mui/material";
import { endPoint } from "../../api/endPoint";
import Cookies from "js-cookie";
import useGet from "../../api/useGet";
import { useSelector } from "react-redux";
import { RootType } from "../../store";
import React from "react";
import usePost from "../../api/usePost";
import getCurrentTime from "../../assets/constants/getCurrentTime";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { Howl } from "howler";
import sendMessageSoundFile from "../../assets/sounds/sendMessage.mp3";
import receiveMessageSoundFile from "../../assets/sounds/receiveMessage.mp3";
import { io } from "socket.io-client";

const ChatSection = ({ setShowUserChat, isSmallScreen }: any) => {
  const userId: any = Cookies.get("userId");
  const emojiRef: any = React.useRef(null);
  const [message, setMessage] = React.useState("");
  const [showEmojis, setShowEmojis] = React.useState(false);
  const [messageDetailsForm, setMessageDetailsForm] = React.useState({});
  const [isMessageReceived, setIsMessageReceived] = React.useState({});
  const receiverId: any = useSelector((state: RootType) => state.id.value);
  const [data, loading, getData, , , setData]: any = useGet(
    endPoint.oneUser + receiverId
  );
  const [sendMessagePost, loadingSendMessage, successMessage]: any = usePost(
    endPoint.sendMessage,
    messageDetailsForm
  );
  const sendMessageSound = new Howl({
    src: [sendMessageSoundFile],
  });
  const receiveMessageSound = new Howl({
    src: [receiveMessageSoundFile],
  });

  React.useEffect(() => {
    const socket = io("https://test-node-js-ze6q.onrender.com");
    const handleReceiveMessage = (messageReceiverID: string) => {
      if (userId == messageReceiverID) {
        setIsMessageReceived(true);
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.disconnect();
    };
  }, []);

  /* refresh messages when receiverId changed */
  React.useEffect(() => {
    setData([]);
    getData();
  }, [receiverId]);

  /* set the message details inside form */
  React.useEffect(() => {
    setMessageDetailsForm({
      message,
      sender: userId,
      receiver: receiverId,
      timestamp: getCurrentTime(),
    });
  }, [message]);

  /* Send message when enter key */
  const handleEnterKey = (e: any) => {
    if (e.key == "Enter") {
      setMessage("");
      handleSendMessage();
    }
  };

  /* Handle send message */
  const handleSendMessage = () => {
    if (message) {
      const socket = io("https://test-node-js-ze6q.onrender.com");
      socket.emit("sendMessage", receiverId);
      sendMessageSound.play();
      setMessage("");
      sendMessagePost();
    }
  };

  /* Select emoji */
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev: any) => prev + emoji.emoji);
  };

  /* Hide emojies if click outside */
  React.useEffect(() => {
    const hideEmojiesWhenClickOutside = (e: any) => {
      if (emojiRef && !emojiRef.current?.contains(e.target)) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", hideEmojiesWhenClickOutside);
    return () => {
      document.removeEventListener("mousedown", hideEmojiesWhenClickOutside);
    };
  }, []);

  return (
    <div className="chat-section flexStartColumnItemsCenter">
      <div className="user-section">
        <UserDetails isInChatSection={true} myData={data} loading={loading} />
        {isSmallScreen && (
          <Tooltip
            title="Back"
            arrow
            TransitionComponent={Zoom}
            placement="left"
          >
            <IconButton className="back-icon-button">
              <FaArrowAltCircleLeft
                size={35}
                className="back-icon"
                onClick={() => setShowUserChat(false)}
              />
            </IconButton>
          </Tooltip>
        )}
        <ChatMessages
          receiverId={receiverId}
          userId={userId}
          loadingSendMessage={loadingSendMessage}
          successMessage={successMessage}
          isMessageReceived={isMessageReceived}
          setIsMessageReceived={setIsMessageReceived}
          receiveMessageSound={receiveMessageSound}
        />
        <div className="message-input-field">
          <TextField
            variant="outlined"
            className="message-input"
            placeholder="Type your message here"
            onChange={(e: any) => setMessage(e.target.value)}
            value={message}
            onKeyDown={handleEnterKey}
          />
          <div
            onClick={() => setShowEmojis(!showEmojis)}
            className="emoji-icon"
          >
            {!showEmojis ? (
              <BsEmojiSmile size={25} color="#2db8db" />
            ) : (
              <BsEmojiSmileFill size={25} color="#2db8ff" />
            )}
          </div>

          {showEmojis && (
            <div className="emojis-field" ref={emojiRef}>
              <EmojiPicker
                lazyLoadEmojis
                onEmojiClick={(emoji: any) => handleEmojiSelect(emoji)}
              />
            </div>
          )}
          <IoSend
            size={25}
            className={`send-message-icon ${message ? "send-active" : ""}`}
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
