import React, { useEffect, useRef, useState, useCallback } from "react";
import Peer from "peerjs";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const StreamPage = () => {
  const { id: urlId } = useParams(); // Get the admin's peer ID from the URL
  const [inCall, setInCall] = useState(false);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const callInstance = useRef(null);
  const navigate = useNavigate();

  const handleStreamEnd = useCallback(() => {
    setInCall(false);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null; // Clear video
    }
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const peer = new Peer(); // Create a new Peer instance for the viewer
    peerInstance.current = peer;

    peer.on("open", (id) => {
      console.log("Viewer Peer ID:", id); // Log the viewer's peer ID
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      toast.error("Peer connection error: " + err.message);
    });

    return () => {
      peer.disconnect(); // Disconnect the peer when the component unmounts
    };
  }, []);

  const initiateCall = () => {
    if (!peerInstance.current) {
      toast.error("Peer instance is not initialized.");
      return;
    }

    if (!urlId) {
      toast.error("No stream ID found!");
      return;
    }

    console.log("Calling admin with Peer ID:", urlId);
    const emptyStream = new MediaStream();
    
    const call = peerInstance.current.call(urlId, emptyStream, {
      constraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      },
    });

    if (!call) {
      console.error("Failed to initiate the call. The peer might not be available.");
      toast.error("Failed to initiate the call. Please try again.");
      return;
    }

    call.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        console.log("Receiving stream from admin...");
        remoteVideoRef.current.srcObject = remoteStream; // Display the stream
        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current.play();
        };
      }
    });

    call.on("close", () => {
      console.log("Stream ended by the admin.");
      handleStreamEnd();
    });

    call.on("error", (err) => {
      console.error("Call error:", err);
      toast.error("Call error: " + err.message);
      handleStreamEnd();
    });

    callInstance.current = call;
    setInCall(true);
  };

  const endCall = () => {
    if (callInstance.current) {
      callInstance.current.close();
      handleStreamEnd();
    }
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#131213", minHeight: "100vh" }}>
        <div className="App flex items-center w-full h-3/5">
          <div className="w-full h-full mt-32 ml-5">
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xl font-semibold">Join the Stream!</h3>
                {inCall && (
                  <button
                    onClick={endCall}
                    className="w-auto h-12 px-5 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl"
                  >
                    End Stream
                  </button>
                )}
              </div>
              <div className="flex justify-center">
                <video
                  className="w-4/6 rounded-xl"
                  ref={remoteVideoRef}
                  playsInline
                  autoPlay
                />
              </div>
              {!inCall && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={initiateCall}
                    className="w-auto h-12 px-5 bg-[#4caf50] text-white text-lg font-semibold rounded-xl"
                  >
                    Join Stream
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default StreamPage;
