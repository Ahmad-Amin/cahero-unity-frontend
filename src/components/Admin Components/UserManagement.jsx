import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../lib/axiosInstance";
import CloseIcon from "@mui/icons-material/Close";
import loadingWrapper from "../../components/ui/LoadingWrapper";
import LoadingWrapper from "../../components/ui/LoadingWrapper";
const UserManagement = ({ isOpen, onClose, onConfirm, itemType }) => {
  const modalRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    phoneNumber: "",
  });

  // Get the current user information from Redux
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (itemType) {
      setUserData({
        firstName: itemType.firstName,
        lastName: itemType.lastName,
        role: itemType.role,
        phoneNumber: itemType.phoneNumber,
      });
    }
  }, [itemType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    setUserData({
      firstName: itemType.firstName,
      lastName: itemType.lastName,
      role: itemType.role,
      phoneNumber: itemType.phoneNumber,
    });
    setIsEditing(false);
    onClose();
  };

  if (!isOpen || !itemType) return null;

  const getUserTypeColor = (role) => {
    switch (role.toLowerCase()) {
      case "host":
        return "#FFEA00";
      case "admin":
        return "#46d133";
      case "participant":
        return "#6a55ea";
      default:
        return "white";
    }
  };

  const handleRemoveUser = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/users/${itemType.id}`);
      handleClose();
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/users/${itemType.id}`, userData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isCurrentUser = currentUser && currentUser.id === itemType.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="relative bg-[#101011] border border-white rounded-2xl p-6 w-1/3 h-auto flex flex-col items-start justify-center py-10"
      >
      <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400 transition ease-in-out"
        >
          <CloseIcon />
        </button>
        <LoadingWrapper loading = {Loading} className="w-full h-full">
        <div className="flex flex-row w-full mt-5">
          <div className="flex-1 text-start mb-10">
            <h2 className="text-white text-xl font-semibold">
              User Management
            </h2>
            <p className="text-white">Manage Participants and Hosts</p>
          </div>

          {!isEditing ? (
            <button
              className="border border-[#6a55ea] text-[#6a55ea] hover:bg-[#6a55ea] hover:text-white ease-in-out transition duration-300 w-36 h-12 px-3 rounded-lg"
              onClick={handleEditClick}
              disabled={isCurrentUser} // Disable the button if it's the current user
              style={isCurrentUser ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              Edit
            </button>
          ) : (
            <button
              className="border border-[#6a55ea] text-[#6a55ea] hover:bg-[#6a55ea] hover:text-white ease-in-out transition duration-300 w-36 h-12 px-3 rounded-lg"
              onClick={handleUpdateClick}
            >
              Update
            </button>
          )}
        </div>

        <div className="flex flex-row w-full h-auto mb-4">
            <h1 className="flex-1 text-white text-base font-medium opacity-70">
              Full Name
            </h1>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className="text-white text-base font-medium bg-transparent border-b border-white mr-2 w-1/4"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="text-white text-base font-medium bg-transparent border-b border-white w-1/4"
                  placeholder="Last Name"
                />
              </>
            ) : (
              <p className="text-white text-base font-medium">
                {userData.firstName} {userData.lastName}
              </p>
            )}
          </div>

          {/* User Type */}
          <div className="flex flex-row w-full h-auto mb-4">
            <h1 className="flex-1 text-white text-base font-medium opacity-70">User Type</h1>
            {isEditing ? (
              <select
                name="role"
                value={userData.role}
                onChange={handleChange}
                className="text-white text-base font-medium bg-transparent border-b border-white"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="admin" style={{ color: getUserTypeColor("admin") }}>
                  Admin
                </option>
                <option value="user" style={{ color: getUserTypeColor("user") }}>
                  User
                </option>
              </select>
            ) : (
              <p
                className="text-white text-base font-medium"
                style={{ color: getUserTypeColor(userData.role) }}
              >
                {userData.role}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-row w-full h-auto mb-4">
            <h1 className="flex-1 text-white text-base font-medium opacity-70">Phone Number</h1>
            {isEditing ? (
              <input
                type="number"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
                className="text-white text-base font-medium bg-transparent border-b border-white w-1/4"
                placeholder="Phone Number"
              />
            ) : (
              <p className="text-white text-base font-medium">
                {userData.phoneNumber}
              </p>
            )}
          </div>

          {/* Other fields */}
          <div className="flex flex-row w-full h-auto mb-4">
            <h1 className="flex-1 text-white text-base font-medium opacity-70">Email</h1>
            <p className="text-white text-base font-medium">{itemType.email}</p>
          </div>
          <div className="flex flex-row w-full h-auto mb-4">
            <h1 className="flex-1 text-white text-base font-medium opacity-70">Current Status</h1>
            <p className="text-white text-base font-medium">Active</p>
          </div>

          {/* Block and Remove buttons */}
          <div className="w-full flex justify-center space-x-5 pt-10">
            <button
              className="border border-[#6a55ea] text-[#6a55ea] w-44 h-12 rounded-lg hover:bg-[#6a55ea] hover:text-white transition duration-200"
              onClick={handleClose}
              disabled={isCurrentUser}
            >
              Block User
            </button>
            <button
              className="bg-[#6a55ea] text-white rounded-lg w-44 h-12 hover:bg-[#e53939] transition duration-200"
              onClick={handleRemoveUser}
              disabled={isCurrentUser}
            >
              Remove User
            </button>
          </div>
          </LoadingWrapper>
      </div>
    </div>
  );
};

export default UserManagement;
