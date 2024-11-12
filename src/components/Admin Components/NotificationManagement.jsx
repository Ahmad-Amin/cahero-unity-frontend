import React, { useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
const NotificationManagement = ({ isOpen, onClose, onConfirm, itemType }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen || !itemType) return null; 

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFEA00";
      case "Sent":
        return "#46d133"; 
      case "Failed":
        return "#ff0726"; 
      default:
        return "white"; 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="relative bg-[#101011] border border-white rounded-2xl p-6 w-2/5 h-auto flex flex-col items-start justify-center py-10"
      >
        <button
          className="absolute top-4 right-4 text-white text-lg font-bold hover:text-gray-400"
          onClick={onClose}
        >
          <CloseIcon />
          </button>

        <div className="flex flex-row w-full gap-2 items-center mt-5">
          <div className="flex-1 text-start w-auto h-auto">
            <h2 className="text-white text-xl font-semibold">
              Notifications Management
            </h2>
          </div>
          <Link to={`/dashboard/notifications/edit-notification/${itemType.id}`}>
          <button className="text-white bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 w-36 h-12 rounded-lg">
            Edit
          </button>
          </Link>
        </div>

        <div className="bg-black rounded-lg w-full h-auto my-3">
          <div className="flex flex-row">
            <div className="flex-1">
              <h1 className="text-white text-lg font-semibold px-4 py-1">
                {itemType.name}
              </h1>
            </div>
            <h2 className="text-white text-base px-4 py-1">{itemType.timeSent}</h2>
          </div>
          <h3 className="text-white text-base px-4 py-1">User /UserType: {itemType.recipientType}</h3>
          <p className="text-white text-base px-4 pt-4 pb-2 opacity-60 text-ellipsis line-clamp-2">{itemType.content}</p>
        </div>

        <div className="w-full">
          <div className="flex flex-row w-full h-auto mb-4">
            <h1 className="flex-1 text-white text-base font-medium opacity-70">
              Sender
            </h1>
            <p className="text-white text-base font-medium">System Admin</p>
          </div>
          <div className="flex flex-row w-full h-auto mb-4">
            <h1 className="flex-1 text-white text-base font-medium opacity-70">
              Delivery Method
            </h1>
            <p className="text-white text-base font-medium">{itemType.externalNotificationDelivery}</p>
          </div>
          <div className="flex flex-row w-full h-auto mb-4">
            <h1 className="flex-1 text-white text-base font-medium opacity-70">
              Current Status
            </h1>
            <p
              className="text-white text-base font-medium"
              style={{ color: getStatusColor(itemType.status) }}
            >
              {itemType.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
