import "./CallSection.scss";
import React from "react";
import Peer from "simple-peer";
import { Button, Typography } from "@mui/material";
import { IoCallSharp } from "react-icons/io5";
import { BiBlock } from "react-icons/bi";
import { Socket, io } from "socket.io-client";
import sendCallSoundFile from "../../assets/sounds/sendCall.mp3";
import receiveCallSoundFile from "../../assets/sounds/receiveCall.mp3";
import { CallSectionProps, CallTime } from "../../Types/components/CallSection";

const CallSection: React.FC<CallSectionProps> = ({
  stream,
  isVoiceCall,
  setIsVoiceCall,
  isVideoCall,
  setIsVideoCall,
  isCallStart,
  setIsCallStart,
  userId,
  receiverId,
  CallerName,
  name,
  caller,
  callerSignal,
  isReceiveCall,
  setIsReceiveCall,
  setShowUserChat,
}) => {
  const myAudio = React.useRef<HTMLAudioElement | any>(null);
  const userAudio = React.useRef<HTMLVideoElement | any>(null);
  const connectionRef = React.useRef<Peer.Instance | any>(null);
  const socketRef = React.useRef<Socket | any>(null);
  const [callAccepted, setCallAccepted] = React.useState<boolean>(false);
  const [callEnded, setCallEnded] = React.useState<boolean>(false);
  const [switchCamera, setSwitchCamera] = React.useState<boolean>(false);
  const [callTime, setCallTime] = React.useState<CallTime>({
    minutes: 0,
    seconds: 0,
  });
  const sendCallSound = React.useRef<any>(
    new Howl({ src: [sendCallSoundFile] })
  );
  const receiveCallSound = React.useRef<any>(
    new Howl({ src: [receiveCallSoundFile] })
  );

  React.useEffect(() => {
    const socket = io("https://chatappapi-2w5v.onrender.com");
    socketRef.current = socket;
    setTimeout(() => {
      myAudio.current.srcObject = stream;
    }, 10);
    const handleLeaveCall = () => {
      leaveCall();
    };

    if (isReceiveCall == true && !callAccepted) {
      receiveCallSound.current.play();
    }

    socket.on("leaveCall", handleLeaveCall);

    return () => {
      socket.off("leaveCall", handleLeaveCall);
    };
  }, []);

  const callUser = () => {
    setIsCallStart(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    const handleSignal = (data: any) => {
      socketRef.current.emit("callUser", {
        userToCall: receiverId,
        voice: isVoiceCall == true ? true : false,
        video: isVideoCall == true ? true : false,
        signalData: data,
        from: userId,
        name: CallerName,
      });
    };

    const handleStream = (stream: any) => {
      userAudio.current.srcObject = stream;
    };

    const handleCallAccepted = (data: any) => {
      setCallAccepted(true);
      peer.signal(data.signal);
    };

    peer.on("signal", handleSignal);
    peer.on("stream", handleStream);

    socketRef.current.on("callAccepted", handleCallAccepted);
    connectionRef.current = peer;
  };

  const answerCall = () => {
    sendCallSound.current.stop();
    receiveCallSound.current.stop();
    setCallAccepted(true);
    setCallTime({ minutes: 0, seconds: 0 });

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    const handleSignal = (data: any) => {
      socketRef.current.emit("answerCall", { signal: data, to: caller });
    };

    const handleStream = (stream: any) => {
      userAudio.current.srcObject = stream;
    };

    peer.on("signal", handleSignal);
    peer.on("stream", handleStream);

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  React.useEffect(() => {
    if (isCallStart == true) {
      sendCallSound.current.play();
      const cleanup = callUser();
      return cleanup; // Cleanup event listeners when call ends
    }
  }, [isCallStart]);

  /* Leave the call */
  const leaveCall = () => {
    sendCallSound.current.stop();
    receiveCallSound.current.stop();
    setShowUserChat(false);
    setCallEnded(true);
    setIsCallStart(false);
    setCallAccepted(false);
    setIsReceiveCall(false);
    setIsVideoCall(false);
    setIsVoiceCall(false);
    setCallTime({ minutes: 0, seconds: 0 });
    if (socketRef.current) {
      socketRef.current.emit("leaveCall");
      socketRef.current.disconnect();
    }
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    // Clear the video elements
    if (myAudio.current) {
      myAudio.current.srcObject = null;
      myAudio.current = null;
    }

    if (userAudio.current) {
      userAudio.current.srcObject = null;
      userAudio.current = null;
    }
    connectionRef.current = null;
  };

  /* Start call timer when user accept the call */
  React.useEffect(() => {
    if (callAccepted) {
      sendCallSound.current.stop();
      receiveCallSound.current.stop();
      const intervalId = setInterval(() => {
        setCallTime((prevCallTime: any) => {
          let newMinutes = prevCallTime.minutes;
          let newSeconds = prevCallTime.seconds + 1;

          if (newSeconds >= 60) {
            newMinutes += 1;
            newSeconds = 0;
          }

          return { minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup interval when call ends or component unmounts
    }
  }, [callAccepted]);

  /* Switch camera */
  React.useEffect(() => {
    if (switchCamera && isVideoCall == true) {
      const myStream = myAudio.current.srcObject;
      myAudio.current.srcObject = userAudio.current.srcObject;
      userAudio.current.srcObject = myStream;
      setSwitchCamera(false);
    }
  }, [switchCamera, isVideoCall]);

  return (
    <div className="voice-call flexCenterColumn">
      <div
        className="video-container flexCenterColumn"
        style={{ height: callAccepted && isVideoCall == true ? "100%" : "" }}
      >
        {stream && isVideoCall == true && (
          <video
            playsInline
            muted
            ref={myAudio}
            autoPlay
            onClick={() => setSwitchCamera(true)}
            className="my-video"
          />
        )}
        {callAccepted && !callEnded && isVideoCall == true && (
          <video
            playsInline
            ref={userAudio}
            autoPlay
            onClick={() => setSwitchCamera(true)}
            className="user-video"
          />
        )}
        {callAccepted && !callEnded && isVoiceCall == true && (
          <audio
            playsInline
            ref={userAudio}
            autoPlay
            onClick={() => setSwitchCamera(!switchCamera)}
          />
        )}
      </div>
      {callAccepted && (
        <div className="flexCenterColumn">
          <Typography
            color={"#aaaae0"}
            variant="h5"
            fontFamily={"revert-layer"}
          >
            The call has started
          </Typography>
          <Typography color={"#aaaae0"} variant="h3">
            {callTime.minutes < 60 &&
              "0" +
                callTime.minutes +
                ":" +
                (callTime.seconds < 10 ? "0" : "") +
                callTime.seconds}
          </Typography>
        </div>
      )}
      {!callAccepted && (
        <div className="caller flexCenterColumn">
          <div className="caller-name flexCenter">
            <h1>{isReceiveCall && `${name} is calling...`}</h1>
            <h1>{isCallStart && "Ringing..."} </h1>
          </div>
          <div className="flexCenterColumn">
            {isReceiveCall && (
              <Button variant="contained" color="info" onClick={answerCall}>
                <IoCallSharp size={35} />
              </Button>
            )}
          </div>
        </div>
      )}
      <Button
        className="leave-call"
        variant="contained"
        color="error"
        onClick={leaveCall}
      >
        <BiBlock size={35} />
      </Button>{" "}
    </div>
  );
};

export default CallSection;
