import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axiosInstance from "../../lib/axiosInstance";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from "../../Slice/AuthSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderWrapper from "../../components/ui/LoadingWrapper"; // Import your loader wrapper

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [loading, setLoading] = useState(true);  
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setrole] = useState("");

  useEffect(() => {
    if (user) {
      setrole(user.role);
      setId(user.id);
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPassword(user.password || "");
      setLoading(false);  
    } else {
      axiosInstance.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          const userData = response.data;
          setrole(userData.role);
          setId(userData.id);
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setEmail(userData.email || "");
          setPassword(userData.password || "");

          dispatch(updateUser({ user: userData, token }));
        })
        .catch(error => {
          toast.error("Failed to fetch user data");
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);  
        });
    }
  }, [dispatch, user, token]);

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setLoading(true); 

    const updatedUser = {
      role,
      id,
      firstName,
      lastName,
      email
    };

    axiosInstance.patch('/me', updatedUser, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        toast.success("User information updated successfully!");
        dispatch(updateUser({ user: updatedUser, token }));
      })
      .catch(error => {
        toast.error("Failed to update user information");
        console.error("Error updating user data:", error);
      })
      .finally(() => setLoading(false));  
  };

  return (
    <LoaderWrapper loading={loading}> 
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#101011",
          minHeight: "100vh",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <form onSubmit={handleUpdateUser}>
          <div className="w-full h-auto flex justify-center pb-7">
            <div className="w-1/6 h-full rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/TheFireQueen.png`}
                alt="Profile-Image"
                className="scale-110 object-cover"
              />
            </div>
          </div>
          <div>
            <div className="flex gap-10 mt-5 mx-10">
              <div className="w-1/2">
                <label
                  htmlFor="first_name"
                  className="text-white font-normal text-lg block mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                  placeholder="Enter Your First Name"
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="last_name"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter Your Last Name"
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                  required
                />
              </div>
            </div>
            <div className="flex gap-10 mt-5 mx-10">
              <div className="w-1/2">
                <label
                  htmlFor="email"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                  placeholder="Enter Your Email"
                  readOnly
                />
              </div>
              <div className="w-1/2 relative">
                <label
                  htmlFor="password"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Your Password"
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                  readOnly
                />
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{
                    position: "absolute",
                    right: "20px",
                    top: "50%",
                    color: "white",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>
          </div>
          <div className="w-full h-auto flex justify-end mt-2 pr-10">
            <button className="text-xl font-semibold text-[#6a55ea] hover:text-[#5242b6] ease-in-out transition duration-300">
              Forgot Password?
            </button>
          </div>
          <div className="w-full h-auto flex justify-center mt-10">
            <button
              type="submit"
              className="text-white text-xl font-semibold bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 w-auto h-12 px-10 flex items-center justify-center rounded-lg mt-10"
            >
              Update Information
            </button>
          </div>
        </form>
      </Box>
    </LoaderWrapper>
  );
};

export default Profile;
