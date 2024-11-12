import React, { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ConfirmDelete from "../../components/Admin Components/ConfirmDelete"; // Import the DeleteConfirmation component
import { FaPlay } from "react-icons/fa"; // Import the play icon
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Link } from "react-router-dom";
import axiosInstance from "../../lib/axiosInstance"; // Import your Axios instance
import LoadingWrapper from "../ui/LoadingWrapper";

const Lectures = ({ searchQuery, datefilter }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [itemToDelete, setItemToDelete] = useState(null); // State to store the selected item for deletion
  const [upcomingLectures, setUpcomingLectures] = useState([]); // State to store the fetched lectures
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(false); 

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/lectures?search=${searchQuery}&target=${datefilter}`);
      if (Array.isArray(response.data || [])) {
        setUpcomingLectures(response.data);
      } else {
        setError("Unexpected response format."); // Handle unexpected response format
      }
    } catch (err) {
      console.error("Error fetching lectures:", err);
      setError("Failed to fetch lectures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures(); // Call the fetch function whenever searchQuery changes
  }, [searchQuery, datefilter]); // Adding searchQuery to the dependency array

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        console.log("Ready to Delete Item-> ", itemToDelete.id);
        await axiosInstance.delete(`/lectures/${itemToDelete.id}`);

        // Re-fetch the updated lecture list
        await fetchLectures();

        console.log("Deleted:", itemToDelete);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (lecture) => {
    setItemToDelete(lecture); // Set the selected item to be deleted
    setIsModalOpen(true); 
  };

  if (error) {
    return <div>{error}</div>; 
  }

  const formatDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(":");

    const hrsText = `${parseInt(hours)} hrs`;
    const minText = `${parseInt(minutes)} min`;
    const secText = `${parseInt(seconds)} sec`;

    return `${hrsText} ${minText} ${secText}`;
  };

  return (
    <LoadingWrapper loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {upcomingLectures.map((lecture, index) => (
          <div
            key={index}
            className="bg-[#000000] rounded-3xl p-4 shadow-md h-auto border border-[#ffffff] relative mb-3 flex items-center"
          >
            <div className="w-1/3 h-36 relative">
              <img
                src={lecture.coverImageUrl}
                alt={lecture.title}
                className="rounded-lg w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <FaPlay className="text-white opacity-65 text-5xl hover:opacity-85 transition-opacity duration-300" />
              </div>
            </div>

            <div className="w-full pl-4 h-full">
              <h2 className="font-bold text-xl text-white mb-3">
                {lecture.title}
              </h2>

              <div className="flex items-center mb-3">
                <CalendarTodayIcon className="text-[#6a55ea] mr-1" />
                <p className="text-white mr-2">Date:</p>
                <p className="text-[#b2b2b2]">
                  {lecture.createdAt.split("T")[0]}
                </p>
              </div>

              <div className="flex items-center mb-4">
                <AccessTimeIcon className="text-[#6a55ea] mr-1" />
                <p className="text-white mr-2">Duration:</p>
                <p className="text-[#b2b2b2]">
                  {formatDuration(lecture.duration)}
                </p>
              </div>

              <div className="flex justify-start mt-6 gap-3">
                <Link
                  to={`/dashboard/documentaries/${lecture.id}/edit-documentary`}
                >
                  <ModeEditIcon className="text-[#05c283] cursor-pointer hover:text-[#038f60] ease-in-out transition-colors duration-300" />
                </Link>
                <DeleteOutlineIcon
                  className="text-[#e53939] cursor-pointer hover:text-[#b22c2c] ease-in-out transition-colors duration-300"
                  onClick={() => handleDeleteClick(lecture)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {upcomingLectures?.length === 0 && !loading && (
          <h1 className="text-white font-semibold text-2xl text-center w-full">
            There are no Lectures Available
          </h1>
        )}
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
        onConfirm={handleDeleteConfirm} // Handle delete confirmation
        itemType={"Documentary"}
      />
    </LoadingWrapper>
  );
};

export default Lectures;
