import React, { useEffect, useState, useRef } from "react";
import { Box, Divider } from "@mui/material";
import LoginedNavbar from "../components/LoginedNavbar";
import WebinarCard from "./WebinarCard";
import axiosInstance from "../lib/axiosInstance";
import LoadingWrapper from "../components/ui/LoadingWrapper";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { HiOutlineAdjustments } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";

const drawerWidth = 280;

function Allbooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const dropdownRef = useRef(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/books?search=${debouncedQuery}&target=${selectedDateFilter}`
        );
        const sortedResults = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // Take the first four items after sorting
        const firstFourResults = sortedResults.slice(0, 4);
        setBooks(firstFourResults);
      } catch (error) {
        console.log("Error fetching the webinars");
      } finally {
        setLoading(false);
      }
    })();
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

  // Check if search or filter is active
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
        {currentUser ? <LoginedNavbar /> : <Navbar />}
        <div
          style={{ position: "relative" }}
          className="mt-5 flex flex-row items-center"
        >
          <p className="flex-1 text-xl mx-8 text-white font-semibold">
            {" "}
            {isSearchActive ? "Search Results" : "All Books"}
          </p>
          <div className="flex justify-end ml-auto w-1/3 pr-2">
            <div className="w-full sm:w-3/4 h-12 bg-transparent rounded-3xl flex items-center text-black font-normal text-lg border border-white transition-all duration-300 ease-in-out">
              <FiSearch className="mx-2 text-xl sm:text-3xl text-white" />
              <input
                type="text"
                placeholder="Search Books..."
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

        <LoadingWrapper loading={loading} className="h-screen">
          <div
            style={{ position: "relative" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-8 my-4"
          >
            {books.map((book) => (
              <WebinarCard
                title={book.title}
                genre="Book Genre"
                image={
                  book.coverImageUrl ||
                  `${process.env.PUBLIC_URL}/images/Tokyotrain.png`
                }
                link={`/all-books/${book.id}`}
              />
            ))}
          </div>
          {books?.length === 0 && !loading && (
            <h1 className="text-white font-semibold text-2xl text-center w-full">
              There are no Books Available
            </h1>
          )}
        </LoadingWrapper>
      </Box>
    </>
  );
}

export default Allbooks;
