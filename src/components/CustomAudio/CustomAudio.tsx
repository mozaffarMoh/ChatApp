import "./CustomAudio.scss";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import { IoPause } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";

const CustomAudio = ({ volumeFile, itemID, duration }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<any>(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.audio.current.currentTime);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const audioElement = audioRef.current.audio.current;
      audioElement.addEventListener("timeupdate", updateTime);
      return () => {
        audioElement.removeEventListener("timeupdate", updateTime);
      };
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `0${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className={`audio-player-container-${itemID}`}>
      <AudioPlayer
        ref={audioRef}
        autoPlayAfterSrcChange={false}
        autoPlay={false}
        loop={false}
        src={volumeFile}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        showJumpControls={false}
        onPlay={handlePlay}
        onPause={handlePause}
        customIcons={{
          play: (
            <FaPlay className="custom-play-button" size={23} color="#6664da" />
          ),
          pause: (
            <IoPause
              className="custom-pause-button"
              size={35}
              color="#6664da"
            />
          ),
        }}
      />
      <div className="time-display">
        {isPlaying ? (
          <p>{formatTime(currentTime)}</p>
        ) : (
          <p>{formatTime(duration)}</p>
        )}
      </div>
    </div>
  );
};

export default CustomAudio;
