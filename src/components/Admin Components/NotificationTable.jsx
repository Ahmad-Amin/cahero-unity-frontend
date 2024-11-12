import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axiosInstance";
import LoadingWrapper from "../../components/ui/LoadingWrapper"; // Adjust the import path as necessary
import { toast } from "react-toastify";

const NotificationTable = ({ onViewNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 20;

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/notifications");
      setNotifications(response.data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  const resentNotifications = async (notificationId) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/notifications/${notificationId}/resend`);
      toast.success("Notification sent successfully!");
      fetchNotifications();
    } catch (e) {
      console.error("Error resending notification:", e);
      toast.error("Error sending notifications!");
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (error) return <div className="font-semibold text-xl text-white">Error fetching notifications: {error}</div>;

  return (
    <LoadingWrapper loading={loading}>
      <div className="relative overflow-x-auto shadow-md ml-10">
        <table className="w-full text-base text-left rtl:text-right text-white">
          <thead className="text-lg text-white uppercase bg-transparent">
            <tr>
              <th scope="col" className="px-6 py-3">Notification type</th>
              <th scope="col" className="px-6 py-3">Recipient</th>
              <th scope="col" className="px-6 py-3">Data Sent</th>
              <th scope="col" className="px-6 py-3">Time Sent</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentNotifications.map((notification) => (
              <tr key={notification.id} className="bg-transparent border-b border-[#878788]">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {notification.notificationType}
                </th>
                <td className="px-6 py-4">{notification.recipientType}</td>
                <td className="px-6 py-4 w-56 text-ellipsis whitespace-nowrap line-clamp-1" title={notification.content}>
                  {notification.content}
                </td>
                <td className="px-6 py-4">{notification.createdAt.split("T")[0]}</td>
                <td className="px-6 py-4" style={{ color: getStatusColor(notification.status) }}>
                  {notification.status}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="font-medium text-white bg-[#6a55ea] hover:bg-[#5242b6] mr-2 rounded-lg h-8 w-auto px-3 ease-in-out transition duration-200"
                    onClick={() => onViewNotification(notification)}
                  >
                    View
                  </button>
                  <button
                    onClick={() => resentNotifications(notification.id)}
                    className="font-medium text-[#6a55ea] hover:bg-[#6a55ea] border border-[#6a55ea] hover:text-white rounded-lg h-8 w-auto px-3 ease-in-out transition duration-200"
                  >
                    Resend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#5a49c8] text-white rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-white border-2 rounded-md">{currentPage} of {totalPages}</span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#5a49c8] text-white rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </LoadingWrapper>
  );
};

export default NotificationTable;
