import React from "react";
import { Box, Divider } from "@mui/material";
import LoginedNavbar from "../components/LoginedNavbar";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

const drawerWidth = 280;

const SubscriptionPlans = () => {
  const currentUser = useSelector((state) => state.auth.user);

  const plans = [
    { title: "Basic", price: "$14.44", options: ["Option 1", "Option 1", "Option 1"] },
    { title: "Standard", price: "$49.99", options: ["Option 2", "Option 2", "Option 2"] },
    { title: "Premium", price: "$89.99", options: ["Option 3", "Option 3", "Option 3"] },
  ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        backgroundColor: "#131213",
        minHeight: "100vh",
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
          width: { xs: "40px", sm: "70px" },
          height: "100%",
          background: "linear-gradient(to right, #220e37 0%, rgba(34, 14, 55, 0) 100%)",
          zIndex: 1,
        }}
      />
      
      {currentUser ? <LoginedNavbar /> : <Navbar />}

      <div>
        <div
          style={{ position: "relative", zIndex: 2 }}
          className="mx-4 md:mx-8 mt-5 text-white text-xl font-semibold"
        >
          Subscription Plans
        </div>
      </div>

      <div className="w-auto h-auto mx-4 md:mx-8 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan, index) => (
          <div key={index} className="w-full p-3 overflow-hidden rounded-3xl">
            <div className="relative">
              <img
                src={`${process.env.PUBLIC_URL}/images/Bg.png`}
                alt={`${plan.title} Plan`}
                className="w-full h-full scale-[1.4] rounded-lg"
              />
              <div className="absolute inset-0">
                <div className="flex flex-col items-center justify-center text-white h-full gap-3 md:gap-5 px-4 md:px-6">
                  <h2 className="text-xl md:text-2xl font-bold">{plan.title}</h2>
                  <h3 className="text-sm md:text-base font-extralight">Monthly Charges</h3>
                  <h4 className="text-3xl md:text-4xl font-extrabold text-[#6a55ea]">{plan.price}</h4>
                  <Divider
                    sx={{
                      width: "85%",
                      my: 1,
                      bgcolor: "white",
                      mx: 2,
                      opacity: 0.5,
                    }}
                  />
                  {plan.options.map((option, optionIndex) => (
                    <h2 key={optionIndex} className="text-white font-bold text-lg md:text-xl">
                      {option}
                    </h2>
                  ))}
                  <Divider
                    sx={{
                      width: "85%",
                      my: 1,
                      bgcolor: "white",
                      mx: 2,
                      opacity: 0.5,
                    }}
                  />
                  <button
                    variant="outlined"
                    className="mt-2 w-full max-w-[140px] sm:max-w-[180px] h-12 md:h-16 rounded-full border-2 border-[#6a55ea] text-[#6a55ea] hover:bg-[#6a55ea] font-bold hover:text-black ease-in-out transition duration-300"
                  >
                    Get Started
                  </button>
                  <button className="text-white mt-2 mb-2 text-xs md:text-sm underline font-semibold hover:text-[#6a55ea] ease-in-out transition duration-300">
                    Start Your 30 Day Free Trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default SubscriptionPlans;
