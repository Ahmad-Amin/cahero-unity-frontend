import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineAdjustments } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { Divider } from "@mui/material";
import axiosInstance from "../lib/axiosInstance";
import LoadingWrapper from "./ui/LoadingWrapper";

const AdminSearchBar = ({ showAdjustments = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [placeholderText, setPlaceholderText] = useState("Search...");
  const debounceTimeout = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/webinar")) {
      setPlaceholderText("Search Webinars...");
    } else if (location.pathname.startsWith("/all-books")) {
      setPlaceholderText("Search Books...");
    } else if (location.pathname.startsWith("/documentaries")) {
      setPlaceholderText("Search Documentaries...");
    } else {
      setPlaceholderText("Search...");
    }
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const fetchSearchResults = async (query) => {
    let endpoint = "";
    if (location.pathname.startsWith("/webinar")) {
      endpoint = `/webinars?search=${query}`;
    } else if (location.pathname.startsWith("/all-books")) {
      endpoint = `/books?search=${query}`;
    } else if (location.pathname.startsWith("/documentaries")) {
      endpoint = `/lectures?search=${query}`;
    }

    if (endpoint) {
      try {
        setLoading(true);
        const response = await axiosInstance.get(endpoint);
        setSearchResults(response.data || []);
      } catch (error) {
        console.log("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (query.trim()) {
        fetchSearchResults(query);
      } else {
        setSearchResults([]);
      }
    }, 1000);
  };

  const handleResultClick = (result) => {
    let path = "";
    if (location.pathname.startsWith("/webinar")) {
      path = `/webinar/${result.id}`;
    } else if (location.pathname.startsWith("/all-books")) {
      path = `/all-books/${result.id}`;
    } else if (location.pathname.startsWith("/documentaries")) {
      path = `/documentaries/${result.id}`;
    }
    navigate(path);
    setSearchResults([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full items-center px-4 sm:px-0">
      <div className="flex items-center justify-center w-full sm:w-96 h-14 bg-transparent text-white font-bold text-xl">
        <div className="w-full sm:w-3/4 h-12 bg-transparent rounded-3xl flex items-center justify-center text-black font-normal text-lg border border-white transition-all duration-300 ease-in-out">
          <FiSearch className="mx-2 text-xl sm:text-3xl text-white" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={placeholderText}
            className="w-full h-full px-1 bg-transparent outline-none text-white font-normal text-sm sm:text-base"
          />
          {showAdjustments && (
            <div onClick={toggleDropdown} className="relative">
              <HiOutlineAdjustments className="mx-2 text-xl sm:text-3xl text-white cursor-pointer" />
              {isDropdownOpen && (
                <div
                  id="dropdown"
                  className="absolute right-0 mt-5 mr-2 bg-[#0d0d0d] w-auto h-auto text-[#d0d0d0] rounded-lg shadow-lg  flex flex-col"
                  onClick={handleDropdownClick}
                >
                  <div>
                    {["Today", "This week", "This month"].map((option, index) => (
                      <div key={option}>
                        <div
                          className={`flex items-center justify-start px-10 w-56 h-12 ${
                            selectedOption === option ? "bg-[#1b1a1f] rounded-lg" : ""
                          }`}
                        >
                          <label className="flex items-center w-full h-full cursor-pointer">
                            <input
                              type="radio"
                              name="dateOption"
                              value={option}
                              checked={selectedOption === option}
                              onChange={() => handleOptionChange(option)}
                              className="appearance-none w-5 h-5 border-2 border-white rounded-full cursor-pointer checked:bg-white checked:border-transparent"
                            />
                            <span className="ml-3">{option}</span>
                          </label>
                        </div>
                        {index < 4 && <Divider className="bg-[#393e40]" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <LoadingWrapper loading={loading}>
          <div className="absolute mt-2 bg-[#0d0d0d] ml-9 w-4/5 h-auto overflow-y-auto rounded-lg shadow-lg z-20">
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="flex flex-row items-center h-16 px-4 py-2 space-x-4 cursor-pointer"
              >
                <div className="flex-1">
                  <img src={result.coverImageUrl} className="w-10 h-10" />
                </div>
                <span className="text-[#d0d0d0]">{result.title}</span>
              </div>
            ))}

            {loading && searchResults.length === 0 && <p className="text-white p-5">No Result Found</p>}
          </div>
        </LoadingWrapper>
      </div>
    </div>
  );
};

export default AdminSearchBar;
