import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector and useDispatch
import SearchBar from "./Searchbar";
import { Modal, Box } from "@mui/material";
import SignInForm from "../pages/SignInForm";
import SignUpForm from "../pages/SignUpForm";
import { logout } from "../Slice/AuthSlice"; // Import your logout action

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "700px",
  boxShadow: 24,
  background: "#0d0d0d",
  borderRadius: "16px",
  padding: "20px",
};

function Navbar({ position = "relative" }) {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  
  const dispatch = useDispatch(); 
  const currentUser = useSelector((state) => state.auth.user); 

  const toggleSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const toggleSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const closeModal = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  const handleLogout = () => {
    dispatch(logout()); 
  };

  return (
    <div className={`w-full h-20 flex items-center justify-end bg-transparent ${position} mt-10 md:mt-0`}>
      {/* <SearchBar /> */}
      <div className=" w-ful"></div>
      

      <div className="flex items-center justify-end">
        {currentUser ? ( 

          <button className="w-24 py-2 hover:font-semibold hover:scale-[1.05] text-white bg-red-700 hover:bg-red-800 ease-in-out transition duration-300 flex items-center justify-center mx-5 rounded-lg" onClick={handleLogout}>
            <h1
              className="text-white"
            >
              Logout
            </h1>
          </button>
          
        ) : (
          <>
            <div className=" w-20 text-white flex items-center">
              <button
                onClick={toggleSignIn}
                className="text-white hover:font-semibold hover:scale-[1.05] ease-in-out transition duration-300"
              >
                Sign in
              </button>
            </div>
            <div className="h-18 w-20 text-white flex items-center">
              <button
                onClick={toggleSignUp}
                className="text-white hover:font-semibold hover:scale-[1.05] ease-in-out transition duration-300"
              >
                Sign up
              </button>
            </div>
          </>
        )}
      </div>

      <div>
        <Modal
          open={showSignIn}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <SignInForm onClose={closeModal} toggleSignUp={toggleSignUp} />
          </Box>
        </Modal>

        <Modal
          open={showSignUp}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <SignUpForm onClose={closeModal} toggleSignIn={toggleSignIn} />
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Navbar;
