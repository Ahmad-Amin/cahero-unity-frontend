import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import LoginedNavbar from "../components/LoginedNavbar";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";
import { FiPlayCircle } from "react-icons/fi";
import { RiBook2Line } from "react-icons/ri";
import AudioPlayer from "../components/AudioPlayer"; // Import your AudioPlayer component
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and useLocation
import { MdArrowBack } from "react-icons/md"; // Importing the left arrow icon from React Icons
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import LoadingWrapper from "../components/ui/LoadingWrapper";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import RatingsReviews from "../components/RatingsReview";
import Comments from "../components/Comments";

const drawerWidth = 280;

const BookDetails = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const navigate = useNavigate();
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1); 
  };

  const { id: bookId } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/books/${bookId}`);
        setBook(response.data);
      } catch (e) {
        console.log("Error getting book", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

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
        <LoadingWrapper loading={loading} className="h-full">
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "70px",
              height: "100%",
              background:
                "linear-gradient(to right, #220e37 0%, rgba(34, 14, 55, 0) 100%)",
              zIndex: 0,
            }}
          />
          {currentUser ? <LoginedNavbar /> : <Navbar />}
          <Link to={"/all-books"}>
            <button
              style={{ zIndex: 3 }}
              className="relative flex items-center bg-transparent text-white mx-5 opacity-75 hover:opacity-100 text-lg font-semibold"
            >
              <MdArrowBack className="mr-2" />
              BACK
            </button>
          </Link>

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              mt: 2,
              mx: { xs: 2, md: 8 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
              gap: { xs: 2, md: 4 },
            }}
          >
            <img
              className="w-full md:w-64 md:h-72 object-cover"
              src={
                book.coverImageUrl ||
                `${process.env.PUBLIC_URL}/images/image1.png`
              }
              alt="Book cover"
            />
            <Box className="mt-10" sx={{ flexGrow: 1 }}>
              <Typography className="text-white !text-2xl font-medium">
                {book.title}
              </Typography>
              <Typography className="text-white text-base font-normal">
                {book.author}
              </Typography>
              <Box className="flex items-center gap-1 mt-2">
                <FaStar className="text-[#FFC01E]" />
                <FaStar className="text-[#FFC01E]" />
                <FaStar className="text-[#FFC01E]" />
                <FaStar className="text-[#FFC01E]" />
                <FaRegStar className="text-[#FFC01E]" />
                <Typography className="text-white text-lg font-normal">
                  4.0
                </Typography>
              </Box>
              <Box className="flex items-center gap-2 mt-2">
                {["Fantasy", "Drama", "Fiction"].map((genre) => (
                  <Box
                    key={genre}
                    className="border border-white rounded-xl text-white text-xs font-semibold px-3 py-1"
                  >
                    {genre}
                  </Box>
                ))}
              </Box>
              <Box className="flex items-center mt-3 gap-3">
                <Box className="flex items-center mt-3">
                  <Button
                    variant="contained"
                    onClick={() => setIsAudioPlaying(true)} // Set state to true on button click
                    sx={{
                      backgroundColor: "#6a55ea", // Your desired color
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#5a47d1", // Darker shade on hover
                      },
                      height: "64px",
                      width: "160px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <FiPlayCircle />
                    Play Audio
                  </Button>
                  <Link to={`/all-books/${bookId}/read-book`}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/read-book")} // Navigate to /read-book on button click
                      sx={{
                        borderColor: "white", // White border
                        color: "white", // White text
                        height: "64px",
                        width: "160px",
                        marginLeft: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)", // Lighten background on hover
                        },
                      }}
                    >
                      <RiBook2Line />
                      Read Book
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              mt: 4,
              mx: { xs: 2, md: 8 },
            }}
          >
            <Typography className="text-white font-semibold text-sm">
              Summary
            </Typography>
            <Typography className="text-white font-light text-sm mt-2 opacity-70">
              {book.description}
            </Typography>
          </Box>
          <div className="mt-20 w-1/2">
              <RatingsReviews type="book" key={refreshKey} className="relative z-20" />
            </div>
            <div className="mt-10 w-2/3">
              <Comments onCommentAdded={handleCommentAdded} type="book" />
            </div>
          {isAudioPlaying && (
            <Box sx={{ mt: 3 }}>
              <AudioPlayer playing={isAudioPlaying} />
            </Box>
          )}
        </LoadingWrapper>
      </Box>
    </>
  );
};

export default BookDetails;
