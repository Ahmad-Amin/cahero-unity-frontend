import { Typography } from "@mui/material";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaPlay, FaPause } from "react-icons/fa"; 
import axiosInstance from "../lib/axiosInstance";
import { useParams } from "react-router-dom";

const AudioPlayer = ({ playing = false }) => {
  const [isPlaying, setIsPlaying] = useState(playing); 
  const [progress, setProgress] = useState(0); 
  const [isDragging, setIsDragging] = useState(false); 
  const audioRef = useRef(null); 
  const [book, setBook] = useState({});
  const progressBarRef = useRef(null); 

  const { id: bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`/books/${bookId}`);
        setBook(response.data);
        console.log(response.data);
      } catch (e) {
        console.log("Error getting book", e);
      }
    };

    fetchBook();
  }, [bookId]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause audio if playing
    } else {
      audioRef.current.play(); // Play audio if paused
    }
    setIsPlaying((prev) => !prev); // Toggle play/pause state
  }, [isPlaying]);

  useEffect(() => {
    if (book.audioFileUrl && audioRef.current) {
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, book.audioFileUrl]);

  const updateProgress = useCallback(() => {
    if (!isDragging && audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0; // Ensure duration is valid
      if (duration > 0) {
        const progressPercentage = (currentTime / duration) * 100;
        setProgress(progressPercentage);
      }
    }
  }, [isDragging]);

  const handleSeek = useCallback((e) => {
    if (audioRef.current) {
      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect(); // Get the size and position of the progress bar
      const offsetX = e.clientX - rect.left; // Calculate the mouse's X position relative to the progress bar
      const progressBarWidth = rect.width; // Width of the progress bar
      const duration = audioRef.current.duration || 0; // Ensure valid duration
      if (duration > 0) {
        const newTime = (offsetX / progressBarWidth) * duration;
        audioRef.current.currentTime = newTime; // Seek to the new time
        setProgress((offsetX / progressBarWidth) * 100); // Update the progress bar visually
      }
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    handleSeek(e); // Immediately seek to the position where the drag starts
  }, [handleSeek]);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        handleSeek(e); // Update the position while dragging
      }
    },
    [isDragging, handleSeek]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      // Ensure the audio metadata is loaded before calculating progress
      audioElement.addEventListener("loadedmetadata", updateProgress); 
      audioElement.addEventListener("timeupdate", updateProgress); // Update progress on time update
      audioElement.addEventListener("play", updateProgress); // Force progress update when playback starts
    }

    // Add event listeners for drag functionality
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("loadedmetadata", updateProgress);
        audioElement.removeEventListener("timeupdate", updateProgress);
        audioElement.removeEventListener("play", updateProgress);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, updateProgress]);

  if (!book.audioFileUrl) {
    return <div>No audio available for this book.</div>; // Fallback if no audio is available
  }

  return (
    <div style={{ zIndex: 2 }} className="absolute bottom-0 left-0 w-full">
      <div
        ref={progressBarRef}
        className="h-1 bg-[#e0d4fd] cursor-pointer"
        onMouseDown={handleMouseDown} 
      >
        <div
          className="h-full bg-[#6a55ea]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="bg-[#121226] w-full h-24 flex items-center p-4">
        <img
          src={book.coverImageUrl}
          className="w-16 h-16 rounded-lg"
          alt="Audio thumbnail"
        />
        <div className="items-center mx-3 flex-grow">
          <Typography className="text-white text-xl font-medium">
            {book.title}
          </Typography>
          <h1 className="text-white text-sm opacity-45">{book.author}</h1>
        </div>

        <div className="ml-auto">
          <button onClick={togglePlayPause} className="text-white text-3xl">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef}>
        <source
          src={book.audioFileUrl}
          type="audio/mp3"
          className="text-white font-semibold text-xl"
        />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
