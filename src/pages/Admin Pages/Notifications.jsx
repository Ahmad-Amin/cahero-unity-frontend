import React, { useState } from 'react';
import { Box } from '@mui/material';
import NotificationTable from '../../components/Admin Components/NotificationTable';
import { Link } from "react-router-dom";
import NotificationManagement from '../../components/Admin Components/NotificationManagement'; // Import UserManagement component

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isNotificationManagementOpen, setIsNotificationManagementOpen] = useState(false);

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setIsNotificationManagementOpen(true); // Open the NotificationManagement modal
  };

  const handleCloseNotificationManagement = () => {
    setIsNotificationManagementOpen(false);
    setSelectedNotification(null); // Reset the selected notification
  };

  return (
    <>
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
        <div className="pb-10">
          <div className="flex flex-row items-center gap-6">
            <h1 className="flex-1 text-3xl font-semibold text-white pt-8 pb-5">
              Notifications
            </h1>
            <Link to="/dashboard/notifications/create-notification">
              <button className="w-auto px-5 h-12 hover:bg-[#5242b6] bg-[#6a55ea] text-white text-lg font-semibold rounded-lg ease-in-out transition duration-300">
                Create Notification
              </button>
            </Link>
          </div>
          <p className="font-normal text-base text-white opacity-60">Management of notifications sent to users and hosts.</p>
        </div>
        <div>
          <NotificationTable onViewNotification={handleViewNotification} />
        </div>
        {isNotificationManagementOpen && (
          <NotificationManagement
            isOpen={isNotificationManagementOpen}
            onClose={handleCloseNotificationManagement}
            itemType={selectedNotification} // Pass the selected notification data
          />
        )}
      </Box>
    </>
  );
};

export default Notifications;
