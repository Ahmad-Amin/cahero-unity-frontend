import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const JoinStream = () => {
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const navigate = useNavigate(); // To navigate to the streaming page

  const handleJoinStream = () => {
    if (remotePeerIdValue) {
      navigate(`/user-lobby/${remotePeerIdValue}`);
    } else {
      alert("Please enter a valid Room ID.");
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "#131213",
        minHeight: "100vh",
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="App flex items-center w-full h-3/5">
      <div className="space-y-5 ml-5 w-full">
        <div>
          <h1 className="font-semibold text-white text-4xl mb-5">
            Join Stream Session
          </h1>
          <label className="font-semibold text-white text-xl">
            Enter Room Id to join
          </label>
          <p className="text-white font-medium text-base opacity-65">
            Please Enter room id to join room
          </p>
        </div>
        <div>
          <input
            type="text"
            value={remotePeerIdValue}
            onChange={(e) => setRemotePeerIdValue(e.target.value)}
            placeholder="Enter Admin's Stream ID"
            className=" w-2/5 h-16 rounded-xl border-2 border-white focus:border-none bg-transparent px-3 text-white"
          />
        </div>
        <button
          className="w-auto h-12 px-3 hover:bg-[#5242b6] bg-[#6a55ea] text-white text-lg font-semibold rounded-lg ease-in-out transition duration-300"
          onClick={handleJoinStream}
        >
          Join Stream
        </button>
      </div>
      </div>
    </Box>
  );
};

export default JoinStream;
