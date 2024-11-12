import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import LoginedNavbar from "../components/LoginedNavbar";
import LoadingWrapper from "../components/ui/LoadingWrapper";
import axiosInstance from "../lib/axiosInstance";
import { updateUser } from "../Slice/AuthSlice";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const drawerWidth = 280;

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [profileImage, setprofileImage] = useState(""); 
  const currentUser = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState({
    profile: false,
    email: false,
    phoneNumber: false,
    bio: false,
  });

  const [selectedFile, setSelectedFile] = useState(null); 
  const [fileName, setFileName] = useState(""); 

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setBio(user.bio || "");
      setRole(user.role || ""); 
      setprofileImage(user.profileImageUrl || ""); 
      setLoading(false);
    } else {
      axiosInstance
        .get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const userData = response.data;
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setEmail(userData.email || "");
          setPhoneNumber(userData.phoneNumber || "");
          setBio(userData.bio || "");
          setRole(userData.role || ""); 
          setprofileImage(userData.profileImageUrl || "")
          dispatch(updateUser({ user: userData, token }));
        })
        .catch((error) => {
          toast.error("Failed to fetch user data");
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, user, token]);
  console.log(profileImage)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName") setFirstName(value);
    if (name === "lastName") setLastName(value);
    if (name === "email") setEmail(value);
    if (name === "phoneNumber") setPhoneNumber(value);
    if (name === "bio") setBio(value);
  };

  const handleSave = (field) => {
    setLoading(true);
    const updatedUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      boi: bio ? bio : undefined,
      role,
      profileImageUrl: profileImage ? profileImage : undefined,
    };

    axiosInstance
      .patch(`/users/${currentUser.id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("User information updated successfully!");
        dispatch(updateUser({ user: updatedUser, token }));
      })
      .catch((error) => {
        toast.error("Failed to update user information");
        console.error("Error updating user data:", error);
      })
      .finally(() => {
        setLoading(false);
        setIsEditing((prev) => ({ ...prev, [field]: false }));
      });
  };
  
  

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name); 
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      const response = await axiosInstance.post("/upload/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      const profileImageUrl = response.data.fileUrl; 
      setprofileImage(profileImageUrl); 
      console.log("Profile Image URL-> ",profileImageUrl); 
  
      const updatedUser = { ...user, profileImageUrl }; 
      dispatch(updateUser({ user: updatedUser, token })); 
  
      toast.success("Profile image updated successfully!"); 
      setSelectedFile(null); 
      setFileName("");
  
    } catch (error) {
      toast.error("Failed to upload profile image"); 
      console.error("Error uploading image:", error); 
    }
  };
  
  

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        backgroundColor: "#131213",
        minHeight: "100vh",
        padding: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "70px",
            height: "100%",
            background:
              "linear-gradient(to right, #220e37 0%, rgba(34, 14, 55, 0) 100%)",
            zIndex: 1,
          }}
        />
        <div>{currentUser ? <LoginedNavbar /> : <Navbar />}</div>

        <LoadingWrapper loading={loading}>
          <div className="mr-10">
            <div
              style={{ position: "relative", zIndex: 2 }}
              className="mx-4 md:mx-8 mt-5 text-white text-xl font-semibold"
            >
              Profile Settings
            </div>
            <div
              style={{ position: "relative", zIndex: 2 }}
              className="mt-10 mx-4 md:mx-8 flex flex-col md:flex-row justify-start"
            >
              <div className="flex flex-col items-center ">
                <img
                  src={
                    profileImage || `${process.env.PUBLIC_URL}/images/profile.png`
                  }
                  alt="Profile"
                  className="w-64 h-64 rounded-lg"
                />
                {selectedFile ? (
                  <>
                    <span className="text-white mt-2">{fileName}</span>
                    <button
                      className="text-[#6a55ea] hover:text-[#5242b6] ease-in-out transition duration-300 font-medium text-base mt-4"
                      onClick={handleImageUpload}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <label className="text-[#6a55ea] hover:text-[#5242b6] ease-in-out transition duration-300 font-medium text-base mt-4">
                    Change image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
              <div className="mt-10 ml-10 w-auto flex-1">
                <div className="flex justify-between items-center">
                  {isEditing.profile ? (
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={handleInputChange}
                        className="text-white bg-transparent border-b-2 px-2 py-1 mr-2"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={handleInputChange}
                        className="text-white bg-transparent border-b-2 px-2 py-1"
                      />
                    </div>
                  ) : (
                    <h1 className="text-white text-4xl font-semibold">
                      {firstName} {lastName}
                    </h1>
                  )}
                  <div className="whitespace-nowrap">
                    {isEditing.profile ? (
                      <button
                        className="text-[#6a55ea] hover:text-[#5242b6] transition duration-300 text-base font-medium"
                        onClick={() => handleSave("profile")}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="text-[#6a55ea] hover:text-[#5242b6] transition duration-300 text-base font-medium"
                        onClick={() => handleEditToggle("profile")}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-4 flex-wrap">
                  <p className="text-white opacity-85 text-lg font-normal mr-4">
                    No Address Available
                  </p>
                </div>
                <div className="flex justify-between mt-4 flex-wrap">
                  <p className="text-white opacity-65 text-lg font-thin mr-4">
                    Member Since 2024
                  </p>
                </div>
                <div className="flex justify-between mt-4 flex-wrap">
                  <p className="text-white opacity-65 text-lg font-thin mr-4">
                    Hired&nbsp;&nbsp;&nbsp;24&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Posted&nbsp;20&nbsp;Reviews
                  </p>
                </div>
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 2 }}>
              <div className="mt-7 mx-4 md:mx-8">
                <h1 className="text-xl font-semibold text-white">Bio</h1>
                <div className="text-white  text-base font-normal flex justify-between w-auto">
                  {isEditing.bio ? (
                    <textarea
                      type="text"
                      name="bio"
                      value={bio}
                      onChange={handleInputChange}
                      className="text-white bg-transparent border-b-2 px-2 py-1 w-1/3"
                    />
                  ) : (
                    <h1 className="text-lg opacity-85 font-thin">
                      {bio || "You have no Bio"}
                    </h1>
                  )}
                  <div className="whitespace-nowrap">
                    {isEditing.bio ? (
                      <button
                        className="text-[#6a55ea] hover:text-[#5242b6] transition duration-300 font-medium"
                        onClick={() => handleSave("bio")}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="text-[#6a55ea] hover:text-[#5242b6] transition duration-300 font-medium"
                        onClick={() => handleEditToggle("bio")}
                      >
                        Edit bio
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mx-8 mt-5">
                <h1 className="text-xl font-semibold text-white">
                  Verified Info
                </h1>
              </div>

              <div className="text-white mt-3 mx-4 md:mx-8 text-base font-normal flex justify-between w-auto">
                {isEditing.email ? (
                  <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    className="text-white bg-transparent border-b-2 px-2 py-1 w-1/4"
                  />
                ) : (
                  <h1 className="text-lg opacity-85 font-thin">{email}</h1>
                )}
                <div className="whitespace-nowrap">
                  {isEditing.email ? (
                    <button
                      className="text-[#6a55ea] hover:text-[#5242b6] transition duration-300 font-medium"
                      onClick={() => handleSave("email")}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-[#6a55ea] hover:text-[#5242b6] transition duration-300 font-medium"
                      onClick={() => handleEditToggle("email")}
                    >
                      Edit Email
                    </button>
                  )}
                </div>
              </div>

              <div className="text-white mt-10 mx-4 md:mx-8 text-base font-normal flex justify-between w-auto">
                {isEditing.phoneNumber ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleInputChange}
                    className="text-white bg-transparent border-b-2 px-2 py-1 w-1/4"
                  />
                ) : (
                  <h1 className="text-lg opacity-85 font-thin">
                    {phoneNumber || "No phone number available"}
                  </h1>
                )}
                <div className="whitespace-nowrap">
                  {isEditing.phoneNumber ? (
                    <button
                      className="text-[#6a55ea] hover:text-[#5242b6] transition duration-300 font-medium"
                      onClick={() => handleSave("phoneNumber")}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-[#6a55ea] hover:text-[#5242b6] transition duration-300 font-medium"
                      onClick={() => handleEditToggle("phoneNumber")}
                    >
                      Edit Phone Number
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </LoadingWrapper>
      </div>
    </Box>
  );
};

export default ProfileSettings;