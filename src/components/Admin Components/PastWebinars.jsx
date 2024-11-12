import React, { useState, useEffect } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Link } from "react-router-dom";
import axiosInstance from "../../lib/axiosInstance";
import LoadingWrapper from "../ui/LoadingWrapper";
import ConfirmDelete from "./ConfirmDelete";

const PastWebinars = ({ limit, searchQuery, datefilter }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [upcomingWebinars, setUpcomingWebinars] = useState([]);

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        setLoading(true);
        const searchParam = searchQuery ? `&search=${searchQuery}` : ""; // Set search parameter based on query
        const response = await axiosInstance.get(`/webinars?type=past${searchParam}&target=${datefilter}`);
        const webinars = response.data || []; 
        if (limit) {
          setUpcomingWebinars(webinars.slice(0, limit)); // Limit the webinars if `limit` is passed
        } else {
          setUpcomingWebinars(webinars);
        }
      } catch (error) {
        console.error("Error fetching webinars:", error);
        setUpcomingWebinars([]); // Set to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, [limit, searchQuery, datefilter]); 

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await axiosInstance.delete(`/webinars/${itemToDelete.id}`);
        console.log("Deleted:", itemToDelete);
        setUpcomingWebinars((prevWebinars) =>
          prevWebinars.filter((webinar) => webinar.id !== itemToDelete.id)
        );
      } catch (error) {
        console.error("Error deleting webinar:", error);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (webinar) => {
    setItemToDelete(webinar);
    setIsModalOpen(true);
  };

  return (
    <>
      <LoadingWrapper loading={loading}>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {upcomingWebinars?.length > 0 &&
            upcomingWebinars.map((webinar, index) => (
              <div
                key={index}
                className="bg-transparent rounded-3xl p-4 shadow-md h-auto border-2 relative flex flex-col md:flex-row justify-between"
              >
                <div className="md:w-1/3 w-full md:mr-4 mb-4 md:mb-0">
                  <img
                    src={webinar.coverImageUrl || "default-image-url.jpg"}
                    alt={webinar.title}
                    className="w-44 h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="flex flex-col justify-between w-full">
                  <div className="flex flex-row gap-3">
                    <div className="flex-1">
                      <h2 className="font-bold text-lg md:text-xl lg:text-2xl text-white mt-1">
                        {webinar.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-[#808080] mt-2 text-sm md:text-base text-ellipsis max-h-6 line-clamp-1">
                    {webinar.description}
                  </p>

                  <div className="flex items-center mt-2 text-sm md:text-base">
                    <CalendarTodayIcon className="text-[#6a55ea] mr-1" />
                    <p className="text-white mr-2">Date:</p>
                    <p className="text-[#b2b2b2]">
                      {new Date(webinar.startDate).toLocaleDateString()}{" "}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 text-sm md:text-base">
                    <AccessTimeIcon className="text-[#6a55ea] mr-1" />
                    <p className="text-white mr-2">Time:</p>
                    <p className="text-[#b2b2b2]">{webinar.startTime}</p>
                  </div>

                  <div className="flex items-center mt-2">
                    <PeopleAltIcon className="text-[#6a55ea] mr-1" />
                    <p className="text-white mr-2">Joined Users:</p>
                    <div className="flex ml-2">
                      {webinar.joinedUsers?.length > 0 ? (
                        webinar.joinedUsers.map((user, userIndex) => (
                          <img
                            key={userIndex}
                            src={user}
                            alt={`User ${userIndex + 1}`}
                            className="inline-block w-6 h-6 md:w-8 md:h-8 rounded-full -ml-2"
                          />
                        ))
                      ) : (
                        <p className="text-[#b2b2b2]">No users joined</p>
                      )}
                    </div>
                  </div>

                  {/* Icons for editing and deleting */}
                  <div className="flex justify-end mt-2 gap-2">
                    <Link to={`/dashboard/webinars/${webinar.id}/manage-webinar`}>
                      <ModeEditIcon className="text-[#05c283] cursor-pointer hover:text-[#038f60] ease-in-out transition-colors duration-300" />
                    </Link>
                    <DeleteOutlineIcon
                      className="text-[#e53939] cursor-pointer hover:text-[#b22c2c] ease-in-out transition-colors duration-300"
                      onClick={() => handleDeleteClick(webinar)}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
        {upcomingWebinars?.length === 0 && !loading && (
          <h1 className="text-white font-semibold text-2xl text-center w-full">
            There are no Webinars Available
          </h1>
        )}
      </LoadingWrapper>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType={"Webinar"}
      />
    </>
  );
};

export default PastWebinars;
