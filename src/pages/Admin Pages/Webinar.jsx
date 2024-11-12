import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import UpcommingWebinars from "../../components/Admin Components/UpcommingWebinars";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Webinars = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [debouncedQuery, setDebouncedQuery] = useState(""); // State for debounced query
  const dropdownRef = useRef(null);
  
  // Toggle the dropdown visibility when clicking the adjustments icon
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce the search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); 

    // Cleanup function to clear timeout if typing continues
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle the search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
        <div className="p-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-white py-8">
              Manage Webinars
            </h1>
            <div className="space-x-5 flex items-center">
              {/* Search bar and dropdown */}
              <div className="relative w-full items-center px-4 sm:px-0">
                <div className="flex items-center justify-center w-full sm:w-96 h-14 bg-transparent text-white font-bold text-xl">
                  <div className="w-full h-12 bg-transparent rounded-3xl flex items-center justify-center text-black font-normal text-lg border border-white transition-all duration-300 ease-in-out">
                    <FiSearch className="mx-2 text-xl sm:text-3xl text-white" />
                    <input
                      type="text"
                      placeholder="Search Webinars..."
                      className="w-full h-full px-1 bg-transparent outline-none text-white font-normal text-sm sm:text-base"
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <Link to="/dashboard/webinars/create-webinar">
                <button className="w-44 h-12 hover:bg-[#5242b6] bg-[#6a55ea] text-white text-lg font-semibold rounded-lg transition duration-300">
                  Create Webinar
                </button>
              </Link>

              <Link to="/dashboard/webinars/webinar-lobby">
                <button className="w-44 h-12 hover:bg-[#5242b6] bg-[#6a55ea] text-white text-lg font-semibold rounded-lg transition duration-300">
                  Stream
                </button>
              </Link>
            </div>
          </div>

          {/* Pass the debounced search query to UpcomingWebinars */}
          <UpcommingWebinars searchQuery={debouncedQuery} />
        </div>
      </Box>
    </>
  );
};

export default Webinars;
