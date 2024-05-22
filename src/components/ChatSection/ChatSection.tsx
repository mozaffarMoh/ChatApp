import { FaArrowAltCircleLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import "./ChatSection.scss";
import UserDetails from "../UserDetails/UserDetails";
import ChatMessages from "../ChatMessages/ChatMessages";
import { IconButton, TextField, Tooltip, Zoom } from "@mui/material";
import { endPoint } from "../../api/endPoint";
import Cookies from "js-cookie";
import { useGet } from "../../Custom-Hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootType } from "../../store";
import React from "react";
import { usePost } from "../../Custom-Hooks";
import getCurrentTime from "../../assets/constants/getCurrentTime";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { Howl } from "howler";
import sendMessageSoundFile from "../../assets/sounds/sendMessage.mp3";
import receiveMessageSoundFile from "../../assets/sounds/receiveMessage.mp3";
import { io } from "socket.io-client";
import { setRefreshUsers } from "../../Slices/refreshUsers";
import { BiPhoneCall, BiVideo } from "react-icons/bi";
import CallSection from "../CallSection/CallSection";

const ChatSection = ({ showUserChat, setShowUserChat, isSmallScreen }: any) => {
  const dispatch = useDispatch();
  const userId: any = Cookies.get("userId");
  const emojiRef: any = React.useRef(null);
  const socketRef: any = React.useRef();
  const [message, setMessage] = React.useState("");
  const [showEmojis, setShowEmojis] = React.useState(false);
  const [isCallStart, setIsCallStart] = React.useState(false);
  const [isVideoCall, setIsVideoCall] = React.useState(false);
  const [isVoiceCall, setIsVoiceCall] = React.useState(false);
  const [messageDetailsForm, setMessageDetailsForm] = React.useState({});
  const [isMessageReceived, setIsMessageReceived] = React.useState({});

  const receiverId: any = useSelector((state: RootType) => state.id.value);
  const isProfileUpdated: any = useSelector(
    (state: RootType) => state.refreshUsers.value
  );
  const CallerName: any = useSelector(
    (state: RootType) => state.CallerName.value
  );
  const [data, loading, getData, success, , setData]: any = useGet(
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

  /* refresh user details when receiverId changed */
  React.useEffect(() => {
    setData({});
    getData();
  }, [receiverId]);

  /* refersh user data when profile updated */
  React.useEffect(() => {
    if (isProfileUpdated) {
      setData({});
      getData();
      setTimeout(() => {
        dispatch(setRefreshUsers(false));
      }, 1000);
    }
  }, [isProfileUpdated]);

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
      socketRef.current.emit("sendMessage", receiverId);
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

  // Socket Code
  const [name, setName] = React.useState("");
  const [caller, setCaller] = React.useState("");
  const [callerSignal, setCallerSignal]: any = React.useState();
  const [isReceiveCall, setIsReceiveCall] = React.useState(false);
  const [stream, setStream]: any = React.useState();

  React.useEffect(() => {
    const socket = io("https://test-node-js-ze6q.onrender.com");
    socketRef.current = socket;

    const handleReceiveMessage = (messageReceiverID: string) => {
      if (userId == messageReceiverID) {
        setIsMessageReceived(true);
      }
    };

    const handleReceiveCall = (data: any) => {
      if (userId == data.userToCall) {
        setShowUserChat(true);
        setIsVideoCall(data.video);
        setIsVoiceCall(data.voice);
        setIsReceiveCall(true);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
      }
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("callUser", handleReceiveCall);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.disconnect();
    };
  }, []);

  const handleShowVideoCall = () => {
    if (!isCallStart) {
      setIsCallStart(true);
      setIsVideoCall(true);
    }
  };

  const handleShowVoiceCall = () => {
    if (!isCallStart) {
      setIsCallStart(true);
      setIsVoiceCall(true);
    }
  };

  return (
    <div
      className={`chat-section flexStartColumnItemsCenter ${
        isSmallScreen == true && showUserChat == false
          ? "hide-chat-section"
          : ""
      }`}
    >
      {(isCallStart || isReceiveCall) && (
        <CallSection
          stream={stream}
          isVoiceCall={isVoiceCall}
          setIsVoiceCall={setIsVoiceCall}
          isVideoCall={isVideoCall}
          setIsVideoCall={setIsVideoCall}
          isCallStart={isCallStart}
          setIsCallStart={setIsCallStart}
          userId={userId}
          receiverId={receiverId}
          CallerName={CallerName}
          name={name}
          caller={caller}
          callerSignal={callerSignal}
          isReceiveCall={isReceiveCall}
          setIsReceiveCall={setIsReceiveCall}
          setShowUserChat={setShowUserChat}
        />
      )}

      <div className="user-section">
        <UserDetails isInChatSection={true} myData={data} loading={loading} />
        <div className="header-tools">
          {userId !== receiverId && success && (
            <Tooltip
              title="Video Call"
              arrow
              TransitionComponent={Zoom}
              placement="bottom"
            >
              <IconButton onClick={handleShowVideoCall}>
                <BiVideo className="call-icon" size={30} />
              </IconButton>
            </Tooltip>
          )}
          {userId !== receiverId && success && (
            <Tooltip
              title="Voice Call"
              arrow
              TransitionComponent={Zoom}
              placement="bottom"
            >
              <IconButton onClick={handleShowVoiceCall}>
                <BiPhoneCall className="call-icon" size={28} />
              </IconButton>
            </Tooltip>
          )}
          {isSmallScreen && (
            <Tooltip
              title="Back"
              arrow
              TransitionComponent={Zoom}
              placement="bottom"
            >
              <IconButton onClick={() => setShowUserChat(false)}>
                <FaArrowAltCircleLeft size={30} className="back-icon" />
              </IconButton>
            </Tooltip>
          )}
        </div>
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
