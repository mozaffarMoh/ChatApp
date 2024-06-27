import { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { FaTrashCan } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa6";
import recordingAudioImage from "../../assets/images/recordingAudio.svg";
import "./VoiceRecorder.scss";
import { Typography } from "@mui/material";

const VoiceRecorder = ({
  sendMessage,
  setMessageDetailsForm,
  messageDetailsForm,
  setMessage,
  message,
  isStopRecording,
  setIsStopRecording,
  socketRef,
  receiverId
}: any) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData]: any = useState(null);
  const [duration, setDuration]: any = useState(null);
  const mediaRecorderRef: any = useRef(null);
  const [recordingTime, setRecordingTime]: any = useState({
    minutes: 0,
    seconds: 0,
  });

  /* Start recording */
  const startRecording = async () => {
    setMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
        bitsPerSecond: 16000,
      });

      const audioChunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (event: any) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, {
          type: "audio/webm",
        });

        const arrayBuffer = await audioBlob.arrayBuffer();
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const duration = audioBuffer.duration;
        setDuration(duration);
        const reader: any = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1]; // Get the base64 string without the metadata
          setAudioData(`data:audio/webm;base64,${base64String}`);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  /* Function to handle sending the audio */
  const handleSendingAudio = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  /* store audio inside form for sending to server */
  useEffect(() => {
    if (audioData) {
      setMessageDetailsForm({
        message: audioData,
        isAudio: true,
        duration: duration,
      });
    }
  }, [audioData]);

  /* start send message */
  useEffect(() => {
    if (messageDetailsForm?.message !== "" && isRecording) {
      socketRef.current.emit("sendMessage", receiverId);
      sendMessage();
      closeRecording();
    }
  }, [messageDetailsForm?.message]);

  /* Start call timer when user accept the call */
  useEffect(() => {
    if (isRecording) {
      const intervalId = setInterval(() => {
        setRecordingTime((prevCallTime: any) => {
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
  }, [isRecording]);

  /* Stop recording */
  const closeRecording = () => {
    setAudioData(null);
    setIsRecording(false);
    setIsStopRecording(false);
    setRecordingTime({ minutes: 0, seconds: 0 });
  };

  useEffect(() => {
    if (message !== "" || isStopRecording) {
      closeRecording();
    }
  }, [message, isStopRecording]);

  return (
    <div className="voice-recorder">
      {!isRecording ? (
        <FaMicrophone onClick={startRecording} color="#5252ae" />
      ) : (
        <div className="recording-actions flexEvenly">
          <FaTrashCan onClick={closeRecording} className="delete-icon" />
          <div className="flexCenterColumn">
            <img
              src={recordingAudioImage}
              alt="Recording..."
              className="recording-image"
            />
            <Typography color={"#aaaae0"} variant="body2">
              {recordingTime.minutes < 60 &&
                "0" +
                  recordingTime.minutes +
                  ":" +
                  (recordingTime.seconds < 10 ? "0" : "") +
                  recordingTime.seconds}
            </Typography>
          </div>
          <IoIosSend onClick={handleSendingAudio} className="send-icon" />
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
