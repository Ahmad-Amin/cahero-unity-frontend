import React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LogoutIcon from "@mui/icons-material/Logout"; // Import Logout Icon
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/Admin Components/Navbar";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import GroupIcon from "@mui/icons-material/Group";
import LaptopIcon from "@mui/icons-material/Laptop";
import VideocamIcon from "@mui/icons-material/Videocam";
import PaymentsIcon from "@mui/icons-material/Payments";
import GroupsIcon from '@mui/icons-material/Groups';
import { logout } from "../../Slice/AuthSlice"; // Import your logout action
import { useDispatch } from "react-redux"; // Import useSelector and useDispatch

const drawerWidth = 280;

export default function AdminPanelLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // For redirection

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const dispatch = useDispatch(); 

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Updated getPageTitle function
  const getPageTitle = (path) => {
    const segments = path.split("/").filter(Boolean);

    if (segments.length < 2) return "Dashboard";

    const secondSegment = segments[1];

    switch (secondSegment) {
      case "webinars":
        return "Webinars";
      case "documentaries":
        return "Documentaries";
      case "recordings":
        return "Recordings";
      case "subscription":
        return "Subscription";
      case "users":
        return "Users";
      case "book-creation":
        return "Book Management";
      case "profile":
        return "Profile";
      case "notifications":
        return "Notifications";
      case "admin-community":
        return "Community";
      default:
        return "Dashboard";
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
    { text: "Webinar", icon: <LaptopIcon />, link: "/dashboard/webinars" },
    {
      text: "Documentaries",
      icon: <VideocamIcon />,
      link: "/dashboard/documentaries",
    },
    {
      text: "Recording",
      icon: <VideoLibraryIcon />,
      link: "/dashboard/recordings",
    },
    {
      text: "Subscription",
      icon: <PaymentsIcon />,
      link: "/dashboard/subscription",
    },
    {
      text: "Community",
      icon: <GroupsIcon />,
      link: "/dashboard/admin-community",
    },
    { text: "Users", icon: <CalendarTodayIcon />, link: "/dashboard/users" },
    {
      text: "Book Creation",
      icon: <LibraryBooksIcon />,
      link: "/dashboard/book-creation",
    },
    { text: "Profile", icon: <GroupIcon />, link: "/dashboard/profile" },
    {
      text: "Notifications",
      icon: <NotificationsNoneIcon />,
      link: "/dashboard/notifications",
    },
  ];

  const drawer = (
    <div className="bg-[#000000] text-white h-full flex flex-col justify-between">
      <div>
        <div className="p-2 flex items-center">
          <Link to={"/"}>
            <img
              src={`${process.env.PUBLIC_URL}/images/Cahero_Legacy.png`}
              alt="Logo"
              className="h-auto w-auto"
            />
          </Link>
        </div>
        <List className="mx-6 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              (location.pathname === "/dashboard" &&
                item.link === "/dashboard") ||
              (location.pathname.startsWith(item.link) &&
                item.link !== "/dashboard");

            return (
              <ListItem key={item.text} disablePadding>
                <Link to={item.link} className="w-full h-auto mx-5">
                  <ListItemButton
                    sx={{
                      backgroundColor: isActive ? "#6a55ea" : "transparent",
                      borderRadius: "12px",
                      paddingLeft: "16px",
                      marginBottom: "12px",
                      "&:hover": { backgroundColor: "#5242b6" },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                        minWidth: "30px",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: 16,
                        fontWeight: isActive ? "bold" : "normal",
                        color: "white",
                        marginLeft: "8px",
                      }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </div>

      {/* Logout Button added at the bottom */}
      <div className="mx-6 mb-4">
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout} // Trigger logout on click
            sx={{
              backgroundColor: "transparent",
              borderRadius: "12px",
              paddingLeft: "16px",
              "&:hover": { backgroundColor: "#fe3e3e" },
            }}
          >
            <ListItemIcon
              sx={{
                color: "white",
                minWidth: "30px",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: 16,
                fontWeight: "normal",
                color: "white",
                marginLeft: "8px",
              }}
            />
          </ListItemButton>
        </ListItem>
      </div>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: 1100,
          backgroundColor: "transparent",
          boxShadow: "none",
          height: "auto",
        }}
      >
        <AdminNavbar pageTitle={getPageTitle(location.pathname)} />
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="menu navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#131213",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#000000",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          p: 2,
          backgroundColor: "#101011",
          minHeight: "100vh",
          pt: { xs: 12, sm: 14 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
