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
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { Howl } from "howler";
import sendMessageSoundFile from "../../assets/sounds/sendMessage.mp3";
import receiveMessageSoundFile from "../../assets/sounds/receiveMessage.mp3";
import { io } from "socket.io-client";
import { setRefreshUsers } from "../../Slices/refreshUsers";
import { BiPhoneCall, BiVideo } from "react-icons/bi";
import CallSection from "../CallSection/CallSection";
import { ChatSectionProps } from "../../Types/components/ChatSection";
import { useUserDetails } from "../../Context/UserDetailsProvider";

const ChatSection: React.FC<ChatSectionProps> = ({
  showUserChat,
  setShowUserChat,
  isSmallScreen,
}) => {
  const { userDetails, setUserDetails }: any = useUserDetails();
  const dispatch = useDispatch();
  const userId = Cookies.get("userId");
  const emojiRef = React.useRef<any>(null);
  const emojiIconRef = React.useRef<any>(null);
  const socketRef = React.useRef<any>(null);
  const [message, setMessage] = React.useState<string>("");
  const [showEmojis, setShowEmojis] = React.useState<boolean>(false);
  const [emojiesHover, setEmojiesHover] = React.useState<boolean>(false);
  const [isCallStart, setIsCallStart] = React.useState<boolean>(false);
  const [isVideoCall, setIsVideoCall] = React.useState<boolean>(false);
  const [isVoiceCall, setIsVoiceCall] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");
  const [caller, setCaller] = React.useState<string>("");
  const [callerSignal, setCallerSignal] = React.useState<object | null>(null);
  const [stream, setStream]: any = React.useState<object | null>(null);
  const [isReceiveCall, setIsReceiveCall] = React.useState<boolean>(false);
  const [isMessageReceived, setIsMessageReceived] =
    React.useState<boolean>(false);
  const [messageDetailsForm, setMessageDetailsForm] = React.useState<object>(
    {}
  );

  const receiverId = useSelector((state: RootType) => state.id.value);
  const isProfileUpdated = useSelector(
    (state: RootType) => state.refreshUsers.value
  );
  const CallerName = useSelector((state: RootType) => state.CallerName.value);
  const [data, loading, getData, , , setData] = useGet(
    endPoint.oneUser + receiverId
  );
  const [sendMessagePost, loadingSendMessage, isSuccessMessage] = usePost(
    `${endPoint.sendMessage}?userId=${userId}&receiverId=${receiverId}`,
    messageDetailsForm
  );
  const sendMessageSound = new Howl({
    src: [sendMessageSoundFile],
  });
  const receiveMessageSound = new Howl({
    src: [receiveMessageSoundFile],
  });

  // Socket Code
  React.useEffect(() => {
    const socket = io("https://chatappapi-2w5v.onrender.com");
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

  /* refresh user details when receiverId changed */
  React.useEffect(() => {
    if (!userDetails[receiverId] && receiverId) {
      getData();
    }
  }, [receiverId]);

  /* store user details in context */
  React.useEffect(() => {
    if (!userDetails[receiverId] && data?._id == receiverId) {
      setUserDetails((prevCache: any) => {
        return { ...prevCache, [receiverId]: data };
      });
    }
  }, [data]);

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
    });
  }, [message]);

  /* Handle send message */
  const handleSendMessage = () => {
    if (message) {
      setMessage("");
      socketRef.current.emit("sendMessage", receiverId);
      sendMessageSound.play();
      sendMessagePost();
    }
  };

  /* Send message when enter key */
  const handleEnterKey = (e: any) => {
    if (e.key == "Enter") {
      handleSendMessage();
    }
  };

  /* Select emoji */
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev: any) => prev + emoji.emoji);
  };

  /* Hide emojies if click outside */
  React.useEffect(() => {
    const hideEmojiesWhenClickOutside = (e: any) => {
      if (
        emojiRef &&
        !emojiRef.current?.contains(e.target) &&
        emojiIconRef &&
        !emojiIconRef.current?.contains(e.target)
      ) {
        setShowEmojis(false);
      }
    };
    document.addEventListener("mousedown", hideEmojiesWhenClickOutside);
    return () => {
      document.removeEventListener("mousedown", hideEmojiesWhenClickOutside);
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
        isSmallScreen && !showUserChat ? "hide-chat-section" : "chat-section"
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
        <UserDetails
          isInChatSection={true}
          myData={userDetails[receiverId]}
          loading={loading}
        />
        <div className="header-tools">
          {userId !== receiverId && (
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
          {userId !== receiverId && (
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
          receiverData={userDetails[receiverId]}
          receiverId={receiverId}
          userId={userId}
          loadingSendMessage={loadingSendMessage}
          isSuccessMessage={isSuccessMessage}
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
            onMouseEnter={() => setEmojiesHover(true)}
            onMouseLeave={() => setEmojiesHover(false)}
            className="emojis-icon"
            ref={emojiIconRef}
          >
            <BsEmojiSmile
              size={25}
              color="#2db8db"
              className={`emoji-position  ${
                !emojiesHover && !showEmojis ? "emoji-visible" : "emoji-hidden"
              }`}
            />

            <BsEmojiSmileFill
              size={25}
              color="#2db8ff"
              className={`emoji-position  ${
                emojiesHover || showEmojis ? "emoji-visible" : "emoji-hidden"
              }`}
            />
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
            className={`send-message-icon ${
              message &&
              userDetails[receiverId] &&
              userDetails[receiverId]?._id == receiverId
                ? "send-active"
                : ""
            }`}
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
