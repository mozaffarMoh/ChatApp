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

const ChatSection = ({ setShowUserChat, isSmallScreen }: any) => {
  const userId: any = Cookies.get("userId");
  const [message, setMessage] = React.useState("");
  const [messageDetailsForm, setMessageDetailsForm] = React.useState({});
  const receiverId: any = useSelector((state: RootType) => state.id.value);
  const [data, loading, getData, , , setData]: any = useGet(
    endPoint.oneUser + receiverId
  );
  const [sendMessagePost, loadingSendMessage, successMessage]: any = usePost(
    endPoint.sendMessage,
    messageDetailsForm
  );

  React.useEffect(() => {
    setData([]);
    getData();
  }, [receiverId]);

  React.useEffect(() => {
    setMessageDetailsForm({
      message,
      sender: userId,
      receiver: receiverId,
      timestamp: getCurrentTime(),
    });
  }, [message]);

  const handleEnterKey = (e: any) => {
    if (e.key == "Enter") {
      setMessage("");
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    setMessage("");
    sendMessagePost();
  };

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
          <IoSend
            size={25}
            className="send-message-icon"
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
