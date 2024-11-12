import React, { useEffect, useState, useRef } from "react";
import { Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import WebinarCard from "./WebinarCard";
import LoginedNavbar from "../components/LoginedNavbar";
import axiosInstance from "../lib/axiosInstance";
import LoadingWrapper from "../components/ui/LoadingWrapper";
import { useSelector } from 'react-redux';
import Navbar from "../components/Navbar";
import { FiSearch } from "react-icons/fi";
import { HiOutlineAdjustments } from "react-icons/hi";


const drawerWidth = 280;

const Lectures = () => {
  const navigate = useNavigate(); // Hook to handle navigation
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchDocumentries = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/lectures?search=${debouncedQuery}&target=${selectedDateFilter}`);
        setLectures(response.data);
      } catch (e) {
        console.log("Error getting the lecture", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentries();
  }, [debouncedQuery, selectedDateFilter]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle the search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDropdownSelect = (value) => {
    setSelectedDateFilter(value);
    setIsDropdownOpen(false);
  };

  const isSearchActive = searchQuery || selectedDateFilter;

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#131213",
          minHeight: "100%",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <LoadingWrapper loading={loading} className="h-screen">
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "70px",
              height: "100%",
              background:
                "linear-gradient(to right, #220e37 0%, rgba(34, 14, 55, 0) 100%)",
            }}
          />
          <div>
          {currentUser ? <LoginedNavbar  /> : <Navbar />}
          </div>
          <div
            style={{ position: "relative" }}
            className="mt-5 flex flex-rows items-center"
          >
            <p className="flex-1 text-xl mx-8 text-white font-semibold">
            {isSearchActive ? "Search Results" : "All Documentaries"}
            </p>
            <div className="flex justify-end ml-auto w-1/3 pr-2">
            <div className="w-full sm:w-3/4 h-12 bg-transparent rounded-3xl flex items-center text-black font-normal text-lg border border-white transition-all duration-300 ease-in-out">
              <FiSearch className="mx-2 text-xl sm:text-3xl text-white" />
              <input
                type="text"
                placeholder="Search Documentaries..."
                className="w-full h-full px-1 bg-transparent outline-none text-white font-normal text-sm sm:text-base"
                onChange={handleSearchChange}
              />
              <div className="relative">
                <HiOutlineAdjustments
                  className="mx-2 text-xl sm:text-3xl text-white cursor-pointer"
                  onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    id="dropdown"
                    className="absolute right-0 mt-5 mr-2 bg-[#404041] w-auto h-auto text-[#d0d0d0] rounded-lg shadow-lg flex flex-col z-10"
                  >
                    <div>
                      {[
                        { label: "None", value: "" },
                        { label: "Today", value: "today" },
                        { label: "This Week", value: "this_week" },
                        { label: "This Month", value: "this_month" },
                      ].map((option, index) => (
                        <div key={option.value}>
                          <div
                            className="flex items-center justify-start px-10 w-56 h-12"
                            onClick={() => handleDropdownSelect(option.value)}
                          >
                            <label className="flex items-center w-full h-full cursor-pointer">
                              <input
                                type="radio"
                                name="dateOption"
                                className="appearance-none w-5 h-5 border-2 border-white rounded-full cursor-pointer checked:bg-white checked:border-transparent"
                                checked={selectedDateFilter === option.value}
                                readOnly
                              />
                              <span className="ml-3">{option.label}</span>
                            </label>
                          </div>
                          {index < 2 && <Divider className="bg-[#393e40]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>

          <div
            style={{ position: "relative", zIndex: 2 }}
            className="grid grid-cols-3 gap-6 mx-8 my-4"
          >
            {lectures.map((lecture) => (
              <WebinarCard
                title={lecture.title}
                genre="Webinar Genre"
                height={300}
                image={
                  lecture.coverImageUrl ||
                  `${process.env.PUBLIC_URL}/images/Tokyotrain.png`
                }
                link={`/documentaries/${lecture.id}`}
              />
            ))}
          </div>
          {lectures?.length === 0 && !loading && (
            <h1 className="text-white font-semibold text-2xl text-center w-full">
              There are no Documentaries Available
            </h1>
          )}
          {/* <div
          style={{ position: "relative", zIndex: 2 }}
          className="mt-12 flex justify-between items-center"
        >
          <p className="text-xl mx-8 text-white font-semibold">
            Recommended Documentaries
          </p>
          <div className="ml-auto w-auto"></div>
        </div>

        <div
          style={{ position: "relative", zIndex: 2 }}
          className="grid grid-cols-3 gap-6 mx-8 my-4"
        >
          {recommendedData.map((lecture) => (
            <WebinarCard
              title={lecture.title}
              year={lecture.startDate.split("-")[0]}
              genre="Webinar Genre"
              image={
                lecture.coverImageUrl ||
                `${process.env.PUBLIC_URL}/images/Tokyotrain.png`
              }
              link={`/documentaries/${lecture.id}`}
            />
          ))}
        </div> */}
        </LoadingWrapper>
      </Box>
    </>
  );
};

export default Lectures;
