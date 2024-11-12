import React from "react";
import Banner from "../components/Banner";
import UpcomingWebinars from "../pages/UpcomingWebinars";
import Recommendedbooks from "../pages/Recommendedbooks";
import Latestlectures from "../pages/Latestlectures";
import { Box } from "@mui/material";

const drawerWidth = 280;

const Dashboard = () => {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` }, // Full width on mobile
          backgroundColor: "#131213",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left Gradient Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "70px",
            height: "100%",
            background:
              "linear-gradient(to right, #220e37 0%, rgba(34, 14, 55, 0) 100%)",
            zIndex: 1,
          }}
        />

        <Box className="w-full" sx={{ position: "relative", zIndex: 2 }}>
          <Banner />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            mt: { xs: 4, sm: 8 }, 
          }}
        >
          <UpcomingWebinars />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            mt: { xs: 4, sm: 8 }, 
          }}
        >
          <Recommendedbooks />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            mt: { xs: 4, sm: 8 }, 
          }}
        >
          <Latestlectures limit={3} />
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
