import React, { useEffect } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from '@mui/icons-material/Groups';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Slice/AuthSlice";

const drawerWidth = 280;

export default function Homepage({ window }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) {
      dispatch(logout());
      navigate("/");
    }
  }, [token, user, dispatch, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/" },
    { text: "Event Workshop", icon: <VideoLibraryIcon />, link: "/event-workshop" },
    { text: "Knowledge Hub", icon: <LibraryBooksIcon />, link: "/knowledge-hub" },
    {
      text: "Community",
      icon: <VideoLibraryIcon />,
      link: "/coummunity",
    },
  ];

  const drawer = (
    <div className="bg-[#101011] text-white h-full">
      <div className="p-2 flex items-center">
        <Link to={"/"}>
          <img
            src={`${process.env.PUBLIC_URL}/images/Cahero_Unity.png`}
            alt="Logo"
            className="h-auto w-auto"
          />
        </Link>
      </div>
      <List className="mx-6 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.link ||
            (item.link === "/all-books" &&
              location.pathname.startsWith("/all-books")) ||
            (item.link === "/webinar" &&
              location.pathname.startsWith("/webinar")) ||
            (item.link === "/documentaries" &&
              location.pathname.startsWith("/documentaries")) ||
            (item.link === "/subscription-plans" &&
              location.pathname.startsWith("/subscription-plans"));
              (item.link === "/community" &&
                location.pathname.startsWith("/community"));

          return (
            <ListItem key={item.text} disablePadding>
              <Link to={item.link} className="w-full h-auto mx-5">
                <ListItemButton
                  sx={{
                    backgroundColor: isActive ? "#6a55ea" : "transparent",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    paddingLeft: "16px",
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
                      fontSize: 15,
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
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const shouldHideSidebar = location.pathname.includes("/documentaries/details/");

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Use backticks here
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", padding: "0 16px" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </AppBar>

      {!shouldHideSidebar && (
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="menu navigation"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }} // Improves performance on mobile
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

          {/* Permanent Drawer for larger screens */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: "#131213",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      <Outlet />
    </Box>
  );
}
