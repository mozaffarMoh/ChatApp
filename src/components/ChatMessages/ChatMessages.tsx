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
  setMessage,
}: any) => {
  const [data, loading, getData, success]: any = useGet(
    endPoint.allMessages + `/${userId}/${receiverId}`
  );

  React.useEffect(() => {
    getData();
  }, [receiverId]);

  React.useEffect(() => {
    if (successMessage) {
      setMessage("");
      getData();
    }
  }, [successMessage]);

  return (
    <div className="chat-messages">
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
              <Avatar />
              <div className="message-content flexCenter">
                <p>{item.message}</p>
                <span
                  className="message-timestamp"
                  style={{
                    marginLeft: item?.sender == userId ? "10px" : "",
                    marginRight: item?.sender !== userId ? "10px" : "",
                  }}
                >
                  {item.timestamp}
                </span>
              </div>
            </div>
          );
        })}

      {data.length == 0 && (
        <div className="sub-container flexCenter">
          {loading && <CircularProgress />}
          {success && <h2>Start your first message</h2>}
        </div>
      )}
      {loadingSendMessage && (
        <div className="flexCenter">
          <CircularProgress />{" "}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
