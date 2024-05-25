import { Avatar, CircularProgress } from "@mui/material";
import "./ChatMessages.scss";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { useGet } from "../../Custom-Hooks";
import { endPoint } from "../../api/endPoint";
import React from "react";
import EditMessage from "../EditMessage/EditMessage";
import { ChatMessagesProps } from "../../Types/components/ChatMessages";

const ChatMessages: React.FC<ChatMessagesProps> = ({
  receiverData,
  receiverId,
  userId,
  loadingSendMessage,
  isSuccessMessage,
  isMessageReceived,
  setIsMessageReceived,
  receiveMessageSound,
}) => {
  const messageBoxRef: any = React.useRef(null);
  const [showEditMessage, setShowEditMessage] = React.useState<boolean>(false);
  const [isMessageEdited, setIsMessageEdited] = React.useState<boolean>(false);
  const [currentMessageID, setCurrentMessageID] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [filteredLoading, setFilteredLoading] = React.useState<boolean>(false);
  const [data, loading, getData, success] = useGet(
    endPoint.allMessages + `/${userId}/${receiverId}?page=${page}`
  );
  const [senderData, senderLoading, getSenderData] = useGet(
    endPoint.oneUser + userId
  );

  /* Get sender Data when initial page */
  React.useEffect(() => {
    getSenderData();
  }, []);

  /* get data when page value change */
  React.useEffect(() => {
    if (page > 1) {
      setFilteredLoading(true);
      getData();
      setTimeout(() => {
        setFilteredLoading(false);
      }, 2000);
    }
  }, [page]);

  /* Get Data when message received by web stock */
  React.useEffect(() => {
    if (isMessageReceived === true) {
      receiveMessageSound.play();
      getData();
      setIsMessageReceived(false);
    }
  }, [isMessageReceived]);

  /* get data when receiverId value change */
  React.useEffect(() => {
    setPage(1);
    getData();
  }, [receiverId]);

  /* get data when message edites success */
  React.useEffect(() => {
    if (isMessageEdited) {
      getData();
      setIsMessageEdited(false);
    }
  }, [isMessageEdited]);

  /* Get data when message sent success */
  React.useEffect(() => {
    if (isSuccessMessage) {
      getData();
    }
  }, [isSuccessMessage]);

  /* Scroll to bottom */
  React.useEffect(() => {
    if (
      (success && page == 1 && messageBoxRef.current) ||
      (isSuccessMessage && messageBoxRef.current)
    ) {
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [success, isSuccessMessage]);

  /* Get filtered data when scroll is go to top */
  React.useEffect(() => {
    if (messageBoxRef && messageBoxRef?.current) {
      const current = messageBoxRef.current;
      const handleScroll = () => {
        if (messageBoxRef?.current?.scrollTop == 0) {
          setPage((prev) => prev + 1);
        }
      };

      if (current) {
        current.addEventListener("scroll", handleScroll);
      }

      // Clean up the event listener on component unmount
      return () => {
        if (current) {
          current.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, []);

  /* Show Edit Message */
  const handleShowEditMessage = (isSender: Boolean, messageID: string) => {
    if (isSender) {
      !showEditMessage && setShowEditMessage(true);
      setCurrentMessageID(messageID);
    }
  };

  return (
    <div className="chat-messages" ref={messageBoxRef}>
      {filteredLoading && (
        <div className="flexCenter">
          <CircularProgress size={25} />{" "}
        </div>
      )}
      {data &&
        data.map((item: any, index: number) => {
          let isSender = item?.sender == userId;
          return (
            <div
              className="message-content-container flexStart"
              dir={isSender ? "ltr" : "rtl"}
              key={index}
            >
              {isSender && senderData?.profilePhoto && (
                <img
                  className="profile-picture"
                  src={senderData?.profilePhoto}
                />
              )}

              {!isSender && receiverData?.profilePhoto && (
                <img
                  className="profile-picture"
                  src={receiverData?.profilePhoto}
                />
              )}

              {((isSender && !senderData?.profilePhoto) ||
                (!isSender && !receiverData?.profilePhoto)) && (
                <Avatar className="avatar-section" />
              )}

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
      {data.length == 0 && page == 1 && !loadingSendMessage && (
        <div className="sub-container flexCenter">
          {loading && <CircularProgress />}
          {success && <h2>Start your first message</h2>}
        </div>
      )}
      {loadingSendMessage && (
        <div className="flexCenter">
          <CircularProgress size={25} />{" "}
        </div>
      )}{" "}
    </div>
  );
};

export default ChatMessages;
