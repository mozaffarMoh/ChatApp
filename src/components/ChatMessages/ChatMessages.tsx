import { Avatar, CircularProgress } from "@mui/material";
import "./ChatMessages.scss";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import useGet from "../../api/useGet";
import { endPoint } from "../../api/endPoint";
import React from "react";
import EditMessage from "../EditMessage/EditMessage";

const ChatMessages = ({
  receiverId,
  userId,
  loadingSendMessage,
  successMessage,
  isMessageReceived,
  setIsMessageReceived,
  receiveMessageSound,
}: any) => {
  const messageBoxRef: any = React.useRef(null);
  const [showEditMessage, setShowEditMessage] = React.useState(false);
  const [isMessageEdited, setIsMessageEdited] = React.useState(false);
  const [currentMessageID, setCurrentMessageID] = React.useState("");
  const [data, loading, getData, success]: any = useGet(
    endPoint.allMessages + `/${userId}/${receiverId}`
  );

  React.useEffect(() => {
    if (isMessageReceived) {
      receiveMessageSound.play();
      getData();
      setIsMessageReceived(false);
    }
  }, [isMessageReceived]);

  /* get data when receiverId value change */
  React.useEffect(() => {
    getData();
  }, [receiverId]);

  /* get data when message edites success */
  React.useEffect(() => {
    if (isMessageEdited) {
      getData();
      setIsMessageEdited(false);
    }
  }, [isMessageEdited]);

  React.useEffect(() => {
    if (successMessage) {
      getData();
    }
  }, [successMessage]);

  React.useEffect(() => {
    if (success && messageBoxRef.current) {
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [success, loadingSendMessage]);

  const handleShowEditMessage = (isSender: Boolean, messageID: string) => {
    if (isSender) {
      !showEditMessage && setShowEditMessage(true);
      setCurrentMessageID(messageID);
    }
  };

  return (
    <div className="chat-messages" ref={messageBoxRef}>
      {data &&
        data.map((item: any, index: number) => {
          let isSender = item?.sender == userId;
          return (
            <div
              className="message-content-container flexStart"
              dir={isSender ? "ltr" : "rtl"}
              key={index}
            >
              <Avatar className="avatar-section" />

              <div
                className={`message-content ${
                  isSender && "message-content-sender"
                } ${isSender && !showEditMessage && "sender-hover"}`}
                onClick={() => handleShowEditMessage(isSender, item?._id)}
              >
                {isSender ? (
                  <IoMdArrowDropleft className="left-indicator" />
                ) : (
                  <IoMdArrowDropright className="right-indicator" />
                )}
                {isSender &&
                showEditMessage &&
                currentMessageID === item?._id ? (
                  <EditMessage
                    message={item?.message}
                    messageId={item?._id}
                    setShowEditMessage={setShowEditMessage}
                    setIsMessageEdited={setIsMessageEdited}
                  />
                ) : (
                  <div>
                    <p>{item.message}</p>
                    <p
                      className="message-timestamp"
                      style={{
                        marginLeft: isSender ? "10px" : "",
                        marginRight: item?.sender !== userId ? "10px" : "",
                      }}
                    >
                      {item.timestamp}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

      {data.length == 0 && !loadingSendMessage && (
        <div className="sub-container flexCenter">
          {loading && <CircularProgress />}
          {success && <h2>Start your first message</h2>}
        </div>
      )}
      {loadingSendMessage && (
        <div className="flexCenter">
          <CircularProgress size={25} />{" "}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
