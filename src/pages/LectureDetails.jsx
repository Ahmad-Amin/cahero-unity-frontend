import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import LoginedNavbar from "../components/LoginedNavbar";
import { FaRegHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import LoadingWrapper from "../components/ui/LoadingWrapper";
import { useSelector } from 'react-redux';
import Navbar from "../components/Navbar";
import RatingsReviews from "../components/RatingsReview";
import Comments from "../components/Comments";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";

const drawerWidth = 280;

const LectureDetails = () => {
  const [loading, setLoading] = useState(true);
  const [Lecture, setLecture] = useState(null);
  const currentUser = useSelector((state) => state.auth.user); 
  const { id: lectureId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1); 
  };

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const response = await axiosInstance.get(`lectures/${lectureId}`);
        setLecture(response.data);
      } catch (error) {
        console.error("Error fetching lecture data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLecture();
  }, [lectureId]);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
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
            width: "70px",
            height: "100%",
            background: "linear-gradient(to right, #220e37 0%, rgba(34, 14, 55, 0) 100%)",
          }}
        />
        <LoadingWrapper loading={loading}>
          <div>{currentUser ? <LoginedNavbar /> : <Navbar />}</div>
          {Lecture && (
            <div
              style={{ position: "relative", zIndex: 2 }}
              className="mt-12 mx-4 md:mx-8 flex flex-row flex-wrap justify-start"
            >
              <img
                src={Lecture.coverImageUrl || `${process.env.PUBLIC_URL}/images/Rectangle1.png`}
                alt=""
                className="w-full rounded-xl md:w-[288px] h-[296px]"
              />
              <div className="mt-10 mx-5 w-full lg:w-2/4">
                <div className="flex justify-between items-center">
                  <h1 className="text-white text-3xl font-semibold">{Lecture.title}</h1>
                  <div className="mx-0 flex items-center gap-1">
                    <FaStar className="text-[#FFC01E]" />
                    <FaStar className="text-[#FFC01E]" />
                    <FaStar className="text-[#FFC01E]" />
                    <FaStar className="text-[#FFC01E]" />
                    <FaStar className="text-[#FFC01E]" />
                    <p className="text-white text-sm font-medium mx-2">7/10</p>
                  </div>
                </div>
                <div className="flex justify-between mt-2 flex-wrap">
                  <p className="text-white text-lg font-medium mr-4">Category: {Lecture.category}</p>
                </div>
                <div className="flex justify-between mt-2 flex-wrap">
                  <p className="text-white text-lg font-medium mr-4">Duration: {Lecture.duration}</p>
                </div>
                <div className="mt-5 mr-0">
                  <p className="text-white text-base line-clamp-1 text-ellipsis">{Lecture.description}</p>
                </div>
                <div className="flex flex-col md:flex-row items-center">
                  <Link to={`/documentaries/details/${lectureId}`}>
                    <button className="h-16 w-full md:w-36 text-white rounded-2xl mt-3 bg-[#6a55ea] hover:bg-[#5242b6] cursor-pointer ease-in-out transition">
                      Play Video
                    </button>
                  </Link>
                  <button className="bg-white h-16 w-full md:w-16 text-black mx-0 md:mx-5 rounded-2xl mt-3 flex justify-center items-center">
                    <FaRegHeart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-20 w-1/2">
            <RatingsReviews type='lecture' key={refreshKey} className="z-20" />
          </div>
          <div className="mt-10 w-2/3">
            <Comments onCommentAdded={handleCommentAdded} type="lecture" />
          </div>
        </LoadingWrapper>
      </Box>
    </>
  );
};

export default LectureDetails;
