import React, { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8); // Volume ranges from 0 to 1
  const [lecture, setLecture] = useState({});
  const { id: lectureId } = useParams();

  useEffect(() => {
    const fetchLecture = async () => {
      const response = await axiosInstance.get(`lectures/${lectureId}`);
      setLecture(response.data);
    };

    fetchLecture();
  }, [lectureId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    setIsMuted(e.target.value === "0");
  };

  return (
    <div className="relative w-full max-w-full mx-auto bg-[#131213] flex items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center bg-transparent text-white opacity-75 hover:opacity-100 text-lg font-semibold py-1 px-3 z-10 cursor-pointer"
      >
        <MdArrowBack className="mr-2" />
        Back
      </button>

      <div className="relative w-full h-screen">
        <ReactPlayer
          url={lecture.videoUrl} // Use video URL from fetched lecture data
          playing={isPlaying}
          controls={true} // This shows native player controls
          muted={isMuted}
          volume={volume} // Volume between 0 and 1
          width="100%"
          height={'100%'}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
