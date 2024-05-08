import { Avatar } from "@mui/material";
import "./ChatMessages.scss";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";

const ChatMessages = () => {
  const array = ["ltr", "ltr", "rtl", "rtl", "ltr"];
  return (
    <div className="chat-messages">
      {array.map((item, index) => {
        return (
          <div
            className="message-content-container flexStart"
            dir={item}
            key={index}
          >
            {item === "rtl" ? (
              <IoMdArrowDropright className="right-indicator" />
            ) : (
              <IoMdArrowDropleft className="left-indicator" />
            )}
            <Avatar />
            <div className="message-content flexCenter">
              <p>This is test message</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
