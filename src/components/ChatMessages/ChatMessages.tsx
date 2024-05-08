import { Avatar } from "@mui/material";
import "./ChatMessages.scss";

const ChatMessages = () => {
  const array = ["ltr", "ltr", "rtl", "rtl", "ltr"];
  return (
    <div className="chat-messages">
      {array.map((item, index) => {
        return (
          <div className="message-content-container flexStart" dir={item} key={index}>
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
