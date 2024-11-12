import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import axiosInstance from "../../lib/axiosInstance"; 
import { logout } from "../../Slice/AuthSlice";
import { toast } from "react-toastify";
const AdminNavbar = ({ pageTitle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    const eventSource = new EventSource(`https://cahero-ott-f285594fd4fa.herokuapp.com/api/notificationStream?role=${user.role}`);
  
    eventSource.onmessage = function(event) {
      const notification = JSON.parse(event.data);
  
      if (notification.recipientType === "All" || notification.recipientType === "Admins") {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
        toast.info(`New Notification: ${notification.notificationType}`);  
      }
    };
  
    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/notifications");
        
        const filteredNotifications = response.data.results
          .filter(
            (notification) =>
              notification.recipientType === "All" || notification.recipientType === "Admins"
          )
          .slice(0, 5); 

        setNotifications(filteredNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user.role]); 

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState({
    name: "English",
    flag: `${process.env.PUBLIC_URL}/images/flags/flag.png`,
  });
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguageDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (language, flag) => {
    setSelectedLanguage({ name: language, flag });
    setIsOpen(false);
  };

  const handleSignOut = () => {
    dispatch(logout())
  };

  return (
    <div className="flex flex-row justify-end items-center px-4 py-3 bg-[#101011] z-50">
      <div className="flex-1">
        <h1 className="text-4xl font-semibold text-white">{pageTitle}</h1>
      </div>

      <div className="flex justify-between items-center gap-8">
        <div className="relative">
          <div
            className="bg-transparent text-white rounded-md px-4 cursor-pointer flex items-center gap-4"
            onClick={toggleLanguageDropdown}
          >
            <img
              src={selectedLanguage.flag}
              alt={selectedLanguage.name}
              className="w-6 h-6 rounded-full"
            />
            {selectedLanguage.name} <KeyboardArrowDownIcon />
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-black text-white rounded-md shadow-lg z-10">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                  onClick={() =>
                    handleLanguageChange(
                      "English",
                      `${process.env.PUBLIC_URL}/images/flags/flag.png`
                    )
                  }
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/flags/flag.png`}
                    alt="English"
                    className="w-6 h-6 rounded-full"
                  />
                  English
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                  onClick={() =>
                    handleLanguageChange(
                      "Spanish",
                      `${process.env.PUBLIC_URL}/images/flags/flag.png`
                    )
                  }
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/flags/flag.png`}
                    alt="Spanish"
                    className="w-6 h-6 rounded-full"
                  />
                  Spanish
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                  onClick={() =>
                    handleLanguageChange(
                      "French",
                      `${process.env.PUBLIC_URL}/images/flags/flag.png`
                    )
                  }
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/flags/flag.png`}
                    alt="French"
                    className="w-6 h-6 rounded-full"
                  />
                  French
                </li>
              </ul>
            </div>
          )}
        </div>

        <div
          className="w-10 h-10 bg-black rounded-md flex justify-center items-center text-[#ffa412] cursor-pointer relative"
          ref={dropdownRef}
        >
          <button onClick={toggleDropdown}>
            <NotificationsIcon />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 bg-[#0d0d0d] text-white rounded-md shadow-lg z-30">
              <div className="text-center py-2 font-bold border-b border-gray-600">Notifications</div>
              {loading ? (
                <div className="py-2 px-4 font-semibold text-lg text-white opacity-70">Loading...</div>
              ) : error ? (
                <div className="py-2 px-4 font-semibold text-lg text-white opacity-70">{error}</div>
              ) : Array.isArray(notifications) && notifications.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <li key={index} className="flex items-center h-20 px-4 py-2 hover:bg-[#404041] cursor-pointer ease-in-out transition">
                      <div className="flex flex-col justify-center flex-grow overflow-hidden">
                        <div className="font-semibold">{notification.notificationType}</div>
                        <div className="text-sm w-96 text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1">{notification.content}</div>
                      </div>
                      <span className="ml-4 text-xs text-gray-400" style={{ width: "100px", textAlign: "center" }}>
                        {notification.time}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-2 px-4 font-semibold text-lg text-white opacity-70">No notifications available</div>
              )}
              <Link to="/dashboard/notifications" onClick={dropdownRef}>
                <button className="flex justify-end w-full my-3 px-3 text-sm hover:font-semibold ease-in-out transition duration-300">
                  View All
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center gap-8">
        <div
          className="flex flex-row items-center cursor-pointer gap-5 mr-6 relative"
          ref={profileRef}
          onClick={toggleProfileDropdown}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/ProfileA.png`}
            alt="Profile"
            className="w-10 h-10"
          />
          <div>
            <h1>{user.firstName || "User"}</h1>
            <p className="text-sm opacity-70">{user?.role || "Role"}</p>
          </div>
          <KeyboardArrowDownIcon />
          {isProfileDropdownOpen && (
            <div className="absolute right-1 top-full mt-3 text-white rounded-md shadow-lg z-30 bg-[#0d0d0d]">
              <div className="px-4 py-3 text-sm border-b-2">
                <div className="text-base font-bold">{user.firstName}</div>
                <div className="font-medium truncate opacity-60">{user.email}</div>
              </div>
              <ul className="py-2 text-sm space-y-2">
                <li>
                  <Link to="/dashboard" className="block px-4 mx-2 py-2 rounded-lg hover:bg-[#5242b6] cursor-pointer ease-in-out transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/notifications" className="block px-4 mx-2 py-2 rounded-lg hover:bg-[#5242b6] cursor-pointer ease-in-out transition">
                    Notifications
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/profile" className="block px-4 mx-2 py-2 rounded-lg hover:bg-[#5242b6] cursor-pointer ease-in-out transition">
                    Settings
                  </Link>
                </li>
                  <li>
                    <Link to="/" className="block px-4 mx-2 py-2 rounded-lg hover:bg-[#5242b6] cursor-pointer ease-in-out transition">
                      User Panel
                    </Link>
                  </li>
              </ul>
              <div className="py-2" onClick={handleSignOut}>
                <Link to="/" className="block px-4 py-2 mx-2 rounded-lg text-sm text-white hover:bg-red-700 cursor-pointer ease-in-out transition">
                  Sign out
                </Link>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
