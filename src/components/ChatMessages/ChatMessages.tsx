import { Avatar, CircularProgress, Stack } from "@mui/material";
import "./ChatMessages.scss";
import { IoIosArrowDropup, IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { useDelete, useGet } from "../../Custom-Hooks";
import { endPoint } from "../../api/endPoint";
import React from "react";
import EditMessage from "../EditMessage/EditMessage";
import { ChatMessagesProps } from "../../Types/components/ChatMessages";
import { BiX } from "react-icons/bi";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import Loading from "../Loading/Loading";
import { toast } from "react-toastify";
import { BsThreeDots } from "react-icons/bs";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useMessagesCache } from "../../Context/MessagesContext";

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
  const { messagesCache, setMessagesCache }: any = useMessagesCache();
  const messageBoxRef: any = React.useRef(null);
  const messageSettingRef: any = React.useRef(null);
  const [showEditMessage, setShowEditMessage] = React.useState<boolean>(false);
  const [showDeleteMessage, setShowDeleteMessage] =
    React.useState<boolean>(false);
  const [showMessageSetting, setShowMessageSetting] =
    React.useState<boolean>(false);
  const [isMessageEdited, setIsMessageEdited] = React.useState<boolean>(false);
  const [errorEditMessage, setErrorEditMessage] = React.useState<string>("");
  const [currentMessageID, setCurrentMessageID] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [data, loading, getData, success] = useGet(
    endPoint.allMessages +
      `/${userId}/${receiverId}?page=${!messagesCache[receiverId] ? 1 : page}`
  );
  const [
    handleDeleteMessage,
    deleteMessageLoading,
    errorDeleteMessage,
    successDeleteMessage,
  ] = useDelete(endPoint.deleteMessage + currentMessageID);

  const [senderData, , getSenderData] = useGet(endPoint.oneUser + userId);

  /* Get sender Data when initial page */
  React.useEffect(() => {
    getSenderData();
  }, []);

  /* Get Data when message received by web stock */
  React.useEffect(() => {
    if (isMessageReceived === true) {
      receiveMessageSound.play();
      getData();
      setIsMessageReceived(false);
    }
  }, [isMessageReceived]);

  /* Scroll to bottom */
  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  /* get data when receiverId value change */
  React.useEffect(() => {
    if (!messagesCache[receiverId]) {
      setPage(1);
      getData();
    } else {
      setPage(messagesCache[receiverId].page);
    }

    scrollToBottom();
  }, [receiverId]);

  React.useEffect(() => {
    if (
      (messagesCache[receiverId] &&
        messagesCache[receiverId].receiverId == receiverId) ||
      (!messagesCache[receiverId] &&
        data &&
        (data[0]?.sender == receiverId || data[0]?.receiver == receiverId))
    ) {
      setMessagesCache((prevCache: any) => ({
        ...prevCache,
        [receiverId]: {
          messages: data,
          page,
          receiverId: receiverId,
        },
      }));
    }

    page == 1 && loading && scrollToBottom();
  }, [data]);

  /* Get data when message sent success */
  React.useEffect(() => {
    isSuccessMessage && getData();
  }, [isSuccessMessage]);

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  React.useEffect(() => {
    if (messagesCache[receiverId] && page > messagesCache[receiverId]?.page) {
      getData();
    }
  }, [page]);

  /* Show Message setting */
  const handleShowMessageSetting = (
    isSender: Boolean,
    messageID: string,
    e?: any
  ) => {
    e.preventDefault();
    if (isSender) {
      setCurrentMessageID(messageID);
      !showMessageSetting &&
        !messageSettingRef.current &&
        setShowMessageSetting(true);
    }
  };

  /* Show Edit Message */
  const handleShowEditMessage = () => {
    setShowEditMessage(true);
  };

  /* Show Delete Message */
  const handleShowDeleteMessage = () => {
    setShowDeleteMessage(true);
  };

  /* show success message and get data if delete or edit message success or fail */
  React.useEffect(() => {
    const DeleteMessageSuccess = () =>
      toast("Your message has been deleted successfully.");
    const EditSuccess = () =>
      toast("Your message has been updated successfully.");
    const EditMessageFail = () => toast(errorEditMessage);
    const DeleteMessageFail = () => toast(errorDeleteMessage);
    if (isMessageEdited) {
      EditSuccess();
      getData();
      setIsMessageEdited(false);
    }
    if (errorEditMessage) {
      errorEditMessage && EditMessageFail();
      setTimeout(() => {
        setErrorEditMessage("");
      }, 3000);
    }
    errorDeleteMessage && DeleteMessageFail();
    if (successDeleteMessage) {
      DeleteMessageSuccess();
      getData();
      setShowDeleteMessage(false);
      setShowMessageSetting(false);
    }
  }, [successDeleteMessage, isMessageEdited]);

  /* Hide message setting or message edit when click outside */
  React.useEffect(() => {
    const handelClickOutside = (e: any) => {
      if (messageSettingRef && !messageSettingRef.current?.contains(e.target)) {
        setShowMessageSetting(false);
      }
      if (messageSettingRef && !messageBoxRef.current?.contains(e.target)) {
        setShowEditMessage(false);
      }
    };

    addEventListener("mousedown", handelClickOutside);

    return () => {
      removeEventListener("mousedown", handelClickOutside);
    };
  }, []);

  /* change time fromat to check time left message */
  const formatTimestamp = (timestamp: any) => {
    const isValidTimestamp = (timestamp: any) => {
      const date = new Date(timestamp);
      return !isNaN(date.getTime());
    };
    if (!isValidTimestamp(timestamp)) {
      return "00:00";
    }
    const date = parseISO(timestamp);
    if (isToday(date)) {
      return format(date, "hh:mm a");
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "hh:mm a")}`;
    } else {
      return format(date, "MM/dd/yyyy hh:mm a");
    }
  };

  return (
    <div className="chat-messages" ref={messageBoxRef}>
      {loading && page > 1 && (
        <div className="flexCenter">
          <CircularProgress size={25} />{" "}
        </div>
      )}
      {messagesCache[receiverId] &&
        messagesCache[receiverId].messages.length > 0 &&
        !loading && (
          <Stack alignItems={"center"}>
            <IoIosArrowDropup
              size={35}
              className="show-more-icon"
              onClick={handleShowMore}
            />
          </Stack>
        )}
      {deleteMessageLoading && <Loading />}
      <ConfirmDialog
        onClose={() => setShowDeleteMessage(false)}
        open={showDeleteMessage}
        alertMessage="delete this message"
        handleDeleteMessage={handleDeleteMessage}
      />
      {messagesCache[receiverId] &&
        messagesCache[receiverId].messages.map((item: any, index: number) => {
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
                onClick={(e: any) =>
                  handleShowMessageSetting(isSender, item?._id, e)
                }
                onContextMenu={(e: any) =>
                  handleShowMessageSetting(isSender, item?._id, e)
                }
              >
                {((isSender && !showEditMessage) ||
                  (isSender &&
                    showEditMessage &&
                    currentMessageID !== item?._id)) && (
                  <Stack height={1}>
                    <BsThreeDots />
                  </Stack>
                )}
                {isSender ? (
                  <IoMdArrowDropleft className="left-indicator" />
                ) : (
                  <IoMdArrowDropright className="right-indicator" />
                )}
                <AnimatePresence>
                  {isSender &&
                    showMessageSetting &&
                    !showEditMessage &&
                    currentMessageID === item?._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="message-setting"
                        ref={messageSettingRef}
                      >
                        <Stack
                          alignItems={"end"}
                          onClick={() => setShowMessageSetting(false)}
                        >
                          <BiX className="close-icon" size={20} />
                        </Stack>

                        <div
                          className="message-setting-item"
                          onClick={handleShowEditMessage}
                        >
                          Edit
                        </div>
                        <div
                          className="message-setting-item"
                          onClick={handleShowDeleteMessage}
                        >
                          Delete
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
                {isSender &&
                showEditMessage &&
                currentMessageID === item?._id ? (
                  <EditMessage
                    message={item?.message}
                    messageId={currentMessageID}
                    setShowEditMessage={setShowEditMessage}
                    setIsMessageEdited={setIsMessageEdited}
                    setErrorEditMessage={setErrorEditMessage}
                    setShowMessageSetting={setShowMessageSetting}
                  />
                ) : (
                  <div className="message-details">
                    <p>{item.message}</p>
                    <p
                      className="message-timestamp"
                      style={{
                        marginLeft: isSender ? "10px" : "",
                        marginRight: item?.sender !== userId ? "10px" : "",
                      }}
                    >
                      {formatTimestamp(item.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      {!messagesCache[receiverId] && page == 1 && !loadingSendMessage && (
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
