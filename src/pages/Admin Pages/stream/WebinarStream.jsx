import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../lib/axiosInstance";
import LoadingWrapper from "../../../components/ui/LoadingWrapper";
import { useNavigate } from "react-router-dom";

const WebinarStream = () => {
  const { webinarId } = useParams();
  const [peerId, setPeerId] = useState(webinarId);
  const currentUserVideoRef = useRef(null); // Reference to video element
  const peerInstance = useRef(null);
  const mediaStreamRef = useRef(null); // Reference to the media stream
  const [streamStarted, setStreamStarted] = useState(false);
  const [viewersCount, setViewersCount] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Effect to set video once the video element and media stream are available
  useEffect(() => {
    if (currentUserVideoRef.current && mediaStreamRef.current) {
      currentUserVideoRef.current.srcObject = mediaStreamRef.current;
      currentUserVideoRef.current.onloadedmetadata = () => {
        currentUserVideoRef.current
          .play()
          .then(() => {
            console.log("Video is playing successfully.");
          })
          .catch((error) => {
            console.error("Error while playing video:", error);
          });
      };
    }
  }, [streamStarted]);

  const startStreamRequest = async () => {
    return true;
  };

  const initStream = async () => {
    const isSuccess = await startStreamRequest();
    if (isSuccess) {
      const peer = new Peer(webinarId); // Create a Peer with the webinarId
      peer.on("open", (id) => {
        setPeerId(id); // This sets the peer ID for others to join
      });

      peer.on("call", (call) => {
        if (mediaStreamRef.current) {
          call.answer(mediaStreamRef.current); // Admin sends video/audio
          setViewersCount((prevCount) => prevCount + 1);

          call.on("close", () => {
            setViewersCount((prevCount) => Math.max(prevCount - 1, 0));
          });
        }
      });

      peerInstance.current = peer;
    }
  };

  const startStream = async () => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/webinars/${webinarId}/start-stream`);

      const getUserMedia =
        navigator.mediaDevices.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          mediaStreamRef.current = mediaStream;

          setStreamStarted(true);
          initStream(); // Initialize the peer after starting the media stream
        })
        .catch((err) => {
          console.error("Failed to get media stream", err);
          toast.error("Error accessing camera or microphone.");
        });
    } catch (error) {
      console.error("Error starting the stream:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; // Toggle video track enabled state
        setIsVideoEnabled(videoTrack.enabled); // Update state for UI
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled; // Toggle audio track enabled state
        setIsAudioEnabled(audioTrack.enabled); // Update state for UI
      }
    }
  };

  const endStream = async () => {
    try {
      axiosInstance.patch(`/webinars/${webinarId}/start-stream`, {isLive: false})
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        mediaStreamRef.current = null;
      }

      // Close all peer connections
      if (peerInstance.current) {
        const connections = peerInstance.current.connections;
        Object.keys(connections).forEach((peerId) => {
          connections[peerId].forEach((call) => {
            call.close(); // Close each call
          });
        });

        // Destroy the Peer instance (makes the Peer ID unavailable)
        peerInstance.current.destroy();
        peerInstance.current = null; // Clear the peer reference
        console.log("Peer ID destroyed, it is now unavailable.");
      }

      // Clear the video element
      if (currentUserVideoRef.current) {
        currentUserVideoRef.current.srcObject = null;
      }

      setViewersCount(0);
      setStreamStarted(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error ending the stream:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(peerId)
      .then(() => toast.success("Peer ID copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <LoadingWrapper loading={loading}>
      <div className="App text-white">
        {!streamStarted ? (
          <div className="space-y-7 w-full h-auto ml-5">
            <button
              onClick={startStream}
              className="w-auto h-12 px-5 hover:bg-[#5242b6] bg-[#6a55ea] text-white text-lg font-semibold rounded-lg"
            >
              Start Stream
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-xl font-semibold">
                  Streaming Live
                </h3>
                <h2 className="text-white text-xl">Viewers: {viewersCount}</h2>
              </div>
              <button
                onClick={endStream}
                className="w-auto h-12 px-5 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl"
              >
                End Stream
              </button>
            </div>
            <div className="flex space-x-5 justify-center">
              <button
                onClick={toggleVideo}
                className={`w-auto h-12 px-5 ${
                  isVideoEnabled ? "bg-red-500" : "bg-green-500"
                } text-white text-lg font-semibold rounded-xl`}
              >
                {isVideoEnabled ? "Turn Off Video" : "Turn On Video"}
              </button>
              <button
                onClick={toggleAudio}
                className={`w-auto h-12 px-5 ${
                  isAudioEnabled ? "bg-red-500" : "bg-green-500"
                } text-white text-lg font-semibold rounded-xl`}
              >
                {isAudioEnabled ? "Mute Mic" : "Unmute Mic"}
              </button>
            </div>
            <video
              className="mx-auto w-4/6 rounded-xl"
              ref={currentUserVideoRef}
              playsInline
              autoPlay
              muted
            />
            <h1 className="border-2 border-white rounded-lg flex items-center justify-center p-2 text-xl">
              <strong>Copy Stream Id</strong>
              <ContentCopyIcon
                className="ml-2 cursor-pointer text-white"
                onClick={copyToClipboard}
                title="Copy Peer ID"
              />
            </h1>
          </div>
        )}
      </div>
    </LoadingWrapper>
  );
};

export default WebinarStream;
