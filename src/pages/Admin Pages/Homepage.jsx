import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Link } from "react-router-dom";
import UpcomingWebinars from "../../components/Admin Components/UpcommingWebinars";
import PastWebinars from "../../components/Admin Components/PastWebinars";
import CountUp from "react-countup";
import axiosInstance from "../../lib/axiosInstance";
import LoadingWrapper from "../../components/ui/LoadingWrapper";

const AdminHomepage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeUsers: 0,
    totalSubscribers: 0,
    upcomingWebinars: 0,
  });
  const [upcomingWebinars, setUpcomingWebinars] = useState([]);
  const [pastWebinars, setPastWebinars] = useState([]);

  useEffect(() => {
    const fetchStatsAndWebinars = async () => {
      try {
        setLoading(true);

        // Fetch statistics
        const statsResponse = await axiosInstance.get("/stats");
        const { totalSales, activeUsers, totalSubscribers, upcomingWebinars } =
          statsResponse.data;
        setStats({
          totalSales,
          activeUsers,
          totalSubscribers,
          upcomingWebinars,
        });

        // Fetch webinars
        const webinarsResponse = await axiosInstance.get("/webinars");
        const webinars = webinarsResponse.data;

        // Categorize webinars based on their type
        const upcoming = webinars.filter(
          (webinar) => new Date(webinar.startDate) >= new Date()
        );
        const past = webinars.filter(
          (webinar) => new Date(webinar.startDate) < new Date()
        );

        setUpcomingWebinars(upcoming);
        setPastWebinars(past);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndWebinars();
  }, []);

  return (
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
      <div className="px-6">
        <LoadingWrapper loading={loading}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-10 items-center">
            <div className="bg-[#ffe2e5] rounded-3xl shadow-md h-full">
              <div className="w-full flex justify-start items-center">
                <div className="bg-[#fa5a7d] rounded-full w-20 h-20 mx-6 my-7 flex justify-center items-center text-white">
                  <AnalyticsIcon fontSize="large" />
                </div>
              </div>
              <div className="w-auto justify-start items-center mx-7 my-5">
                <div className="space-y-3">
                  <h1 className="text-[#151d48] font-bold text-2xl md:text-4xl">
                    <CountUp
                      start={0}
                      end={stats.totalSales}
                      duration={1}
                      prefix="$"
                      separator=","
                    />
                  </h1>
                  <h1 className="text-[#425166] font-bold text-lg md:text-2xl">
                    Total Sales
                  </h1>
                  <h1 className="text-[#4079ed] font-bold text-lg md:text-xl">
                    +8% from Last Month
                  </h1>
                </div>
              </div>
            </div>
            <div className="bg-[#fff4de] rounded-3xl shadow-md h-full">
              <div className="w-full flex justify-start items-center">
                <div className="bg-[#ff947a] rounded-full w-20 h-20 mx-6 my-7 flex justify-center items-center text-white">
                  <DescriptionIcon fontSize="large" />
                </div>
              </div>
              <div className="w-auto justify-start items-center mx-7 my-5">
                <div className="space-y-3">
                  <h1 className="text-[#151d48] font-bold text-2xl md:text-4xl">
                    <CountUp start={0} end={stats.activeUsers} duration={2} />
                  </h1>
                  <h1 className="text-[#425166] font-bold text-lg md:text-2xl">
                    Active Users
                  </h1>
                  <h1 className="text-[#4079ed] font-bold text-lg md:text-xl">
                    +5% from Yesterday
                  </h1>
                </div>
              </div>
            </div>
            <div className="bg-[#dcfce7] rounded-3xl shadow-md h-full">
              <div className="w-full flex justify-start items-center">
                <div className="bg-[#3cd856] rounded-full w-20 h-20 mx-6 my-7 flex justify-center items-center text-white">
                  <LocalOfferIcon fontSize="large" />
                </div>
              </div>
              <div className="w-auto justify-start items-center mx-7 my-5">
                <div className="space-y-3">
                  <h1 className="text-[#151d48] font-bold text-2xl md:text-4xl">
                    <CountUp
                      start={0}
                      end={stats.totalSubscribers}
                      duration={2}
                    />
                  </h1>
                  <h1 className="text-[#425166] font-bold text-lg md:text-2xl">
                    Total Subscribers
                  </h1>
                  <h1 className="text-[#4079ed] font-bold text-lg md:text-xl">
                    +1.2% from Yesterday
                  </h1>
                </div>
              </div>
            </div>
            <div className="bg-[#f3e8ff] rounded-3xl shadow-md h-full">
              <div className="w-full flex justify-start items-center">
                <div className="bg-[#bf83ff] rounded-full w-20 h-20 mx-6 my-7 flex justify-center items-center text-white">
                  <PersonAddAlt1Icon fontSize="large" />
                </div>
              </div>
              <div className="w-auto justify-start items-center mx-7 my-5">
                <div className="space-y-3">
                  <h1 className="text-[#151d48] font-bold text-2xl lg:text-4xl md:text-2xl">
                    <CountUp
                      start={0}
                      end={stats.upcomingWebinars}
                      duration={2}
                    />
                  </h1>
                  <h1 className="text-[#425166] font-bold text-lg lg:text-2xl md:text-xl w-32">
                    Upcoming Webinars
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </LoadingWrapper>

        <div className="bg-black rounded-2xl p-10 mt-10 flex flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center mb-5 gap-10">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={` text-3xl font-semibold ${
                  activeTab === "upcoming"
                    ? "text-white"
                    : "text-[#808080] hover:text-white ease-in-out transition duration-300"
                }`}
              >
                Upcoming Webinars
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={` text-3xl font-semibold ${
                  activeTab === "past"
                    ? "text-white"
                    : "text-[#808080] hover:text-white ease-in-out transition duration-300"
                }`}
              >
                Past Webinars
              </button>
            </div>
            <div className="w-auto h-auto flex justify-end">
              <Link to="/dashboard/webinars/create-webinar">
                <button className="w-52 h-12 bg-[#6a55ea] text-white rounded-lg text-lg font-semibold hover:bg-[#3b2f83] ease-in-out transition duration-300">
                  Create Webinar
                </button>
              </Link>
            </div>
            <div className="py-4 w-full">
              {activeTab === "upcoming" ? (
                <UpcomingWebinars limit={4} webinars={upcomingWebinars} />
              ) : (
                <PastWebinars limit={4} webinars={pastWebinars} />
              )}
            </div>
            <div className="w-auto h-auto flex justify-end">
              <Link to="/dashboard/webinars">
                <button className="w-52 h-12 text-[#6a55ea]  rounded-lg text-lg font-semibold hover:text-[#3b2f83] ease-in-out transition duration-300">
                  View All
                </button>
              </Link>
              </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default AdminHomepage;
