import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import "./ChatSection.scss";
import UserDetails from "../UserDetails/UserDetails";
import ChatMessages from "../ChatMessages/ChatMessages";
import { TextField } from "@mui/material";

const ChatSection = ({ setShowUserChat, isSmallScreen }: any) => {
  return (
    <div className="chat-section flexStartColumnItemsCenter">
      <div className="user-section">
        <UserDetails
          name="Feras"
          email="ferawwwess@gmail.com"
          isInChatSection={true}
        />
        {isSmallScreen && (
          <FaArrowAltCircleLeft
            size={35}
            className="back-icon"
            onClick={() => setShowUserChat(false)}
          />
        )}
        <ChatMessages />
        <div className="message-input-field">
          <TextField
            variant="outlined"
            className="message-input"
            placeholder="Type your message here"
          />
          <IoSend size={25} className="send-message-icon" />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
