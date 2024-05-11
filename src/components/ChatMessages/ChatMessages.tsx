import { Avatar, CircularProgress } from "@mui/material";
import "./ChatMessages.scss";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import useGet from "../../api/useGet";
import { endPoint } from "../../api/endPoint";
import React from "react";

const ChatMessages = ({
  receiverId,
  userId,
  loadingSendMessage,
  successMessage,
}: any) => {
  const messageBoxRef: any = React.useRef(null);
  const [data, loading, getData, success]: any = useGet(
    endPoint.allMessages + `/${userId}/${receiverId}`
  );

  React.useEffect(() => {
    getData();
  }, [receiverId]);

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

  return (
    <div className="chat-messages" ref={messageBoxRef}>
      {data &&
        data.map((item: any, index: number) => {
          return (
            <div
              className="message-content-container flexStart"
              dir={item?.sender == userId ? "ltr" : "rtl"}
              key={index}
            >
              {item?.sender == userId ? (
                <IoMdArrowDropleft className="left-indicator" />
              ) : (
                <IoMdArrowDropright className="right-indicator" />
              )}

              <Avatar className="avatar-section" />

              <div className="message-content">
                <p>{item.message}</p>
                <p
                  className="message-timestamp"
                  style={{
                    marginLeft: item?.sender == userId ? "10px" : "",
                    marginRight: item?.sender !== userId ? "10px" : "",
                  }}
                >
                  {item.timestamp}
                </p>
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
