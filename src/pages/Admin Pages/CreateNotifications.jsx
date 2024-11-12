import React, { useState } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../lib/axiosInstance";
import LoadingWrapper from "../../components/ui/LoadingWrapper";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom";


const CreateNotifications = () => {
  const [notificationData, setNotificationData] = useState({
    notificationType: "",
    recipientType: "",
    specificRecipient: "",
    externalNotificationDelivery: "None",
    content: ""
  });
const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotificationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await axiosInstance.post('/notifications', notificationData);
      toast.success('Notification sent successfully!');
      navigate("/dashboard/notifications") 
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error sending notification: ' + error.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <LoadingWrapper loading={loading}>
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
        <div className="p-5">
          <div className="flex flex-row items-center">
            <h1 className="flex-1 text-3xl font-semibold text-white py-8">
              Create New Notification
            </h1>
            <div className="space-x-5">
              <button
                onClick={handleSubmit}
                className="w-44 px-3 h-12 bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 rounded-xl text-white font-semibold text-lg"
              >
                Send Now
              </button>

              <Link to="/dashboard/notifications">
                <button className="w-44 h-12 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl ease-in-out transition duration-300">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-3/5 px-5">
          <div className="flex-1 w-full md:w-4/6 py-8">
            <div>
              <label
                htmlFor="type"
                className="text-white font-normal text-lg block mb-2"
              >
                Notification Type
              </label>
              <select
                id="type"
                name="notificationType"
                value={notificationData.notificationType}
                onChange={handleChange}
                className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
              >
                <option className="bg-[#101011] text-white" value="">
                  Select Type
                </option>
                <option className="bg-[#101011] text-white" value="System Update">
                  System Update
                </option>
                <option className="bg-[#101011] text-white" value="User Notification">
                  User Notification
                </option>
                <option className="bg-[#101011] text-white" value="Upcoming Webinar">
                  Upcoming Webinar
                </option>
                <option className="bg-[#101011] text-white" value="New Documentary">
                  New Documentary
                </option>
                <option className="bg-[#101011] text-white" value="New Book">
                  New Book
                </option>
              </select>
            </div>
            <div className="flex flex-col md:flex-row gap-10 mt-5">
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="recipientType"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Recipient Type
                </label>
                <select
                  id="recipientType"
                  name="recipientType"
                  value={notificationData.recipientType}
                  onChange={handleChange}
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                >
                  <option className="bg-[#101011] text-white" value="">
                    Select Recipient Type
                  </option>
                  <option className="bg-[#101011] text-white" value="All">
                    All
                  </option>
                  <option className="bg-[#101011] text-white" value="Admins">
                    Admins
                  </option>
                  <option className="bg-[#101011] text-white" value="Users">
                    Users
                  </option>
                </select>
              </div>
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="specificRecipient"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Specific Recipient (Not Mandatory)
                </label>
                <input
                  type="text"
                  id="specificRecipient"
                  name="specificRecipient"
                  value={notificationData.specificRecipient}
                  onChange={handleChange}
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3"
                  placeholder="By Username"
                />
              </div>
            </div>
            <div className="mt-5">
              <label
                htmlFor="externalNotificationDelivery"
                className="text-white font-normal text-lg block mb-2"
              >
                External Notification Delivery
              </label>
              <select
                id="externalNotificationDelivery"
                name="externalNotificationDelivery"
                value={notificationData.externalNotificationDelivery}
                onChange={handleChange}
                className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
              >
                <option className="bg-[#101011] text-white" value="None">
                Website
                </option>
                <option className="bg-[#101011] text-white" value="All">
                Website + Email
                </option>
              </select>
            </div>
            <div className="mt-5">
              <label
                className="text-white font-normal text-lg block mb-2"
                htmlFor="content"
              >
                Content of the Notification
              </label>

              <textarea
                id="content"
                name="content"
                value={notificationData.content}
                onChange={handleChange}
                className="w-full h-32 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 pt-4"
                placeholder="Content"
                required
              />
            </div>
          </div>
        </form>
      </Box>
    </LoadingWrapper>
  );
};

export default CreateNotifications;
