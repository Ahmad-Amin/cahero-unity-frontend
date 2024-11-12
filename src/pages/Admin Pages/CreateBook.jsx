import React, { useState } from "react";
import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axiosInstance from "../../lib/axiosInstance"; // Import your axios instance
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast notifications
import LoadingWrapper from "../../components/ui/LoadingWrapper";

const CreateBook = () => {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState(""); // State for image file name
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioError, setAudioError] = useState(""); // State for audio file size error

  const navigate = useNavigate(); // To navigate after successful submission

  const handleInputChange = (e) => {
    setBookData({ ...bookData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected image file: ", file); // Debugging log
      setImageFile(file);
      setImageFileName(file.name); // Set the image file name
    } else {
      console.error("No image file selected!");
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      if (file.size > maxSize) {
        setAudioError("Audio file size exceeds 5MB. Please upload a smaller file.");
        toast.error("Audio file size exceeds 5MB. Please upload a smaller file.")
        setAudioFile(null); 
        setAudioFileName(""); // Reset the file name
        return;
      }

      setAudioError(""); // Clear any previous errors
      setAudioFile(file);
      setAudioFileName(file.name); // Set the audio file name
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let coverImageUrl = "";
      let audioFileUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        console.log("Sending image file:", formData.get("file"));
        const imageResponse = await axiosInstance.post(
          "/upload/image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        coverImageUrl = imageResponse.data.fileUrl;
        console.log("Image uploaded. URL: ", coverImageUrl);
      }

      if (audioFile) {
        const formData = new FormData();
        formData.append("file", audioFile);
        const audioResponse = await axiosInstance.post(
          "/upload/audio",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        audioFileUrl = audioResponse.data.fileUrl;
      }

      const response = await axiosInstance.post("/books", {
        title: bookData.title,
        author: bookData.author,
        genre: bookData.genre,
        description: bookData.description,
        coverImageUrl: coverImageUrl,
        audioFileUrl: audioFileUrl,
      });

      toast.success("Book uploaded successfully!");
      navigate("/dashboard/book-creation");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // If the error contains a message from the server, display it
        toast.error("Error creating book: " + error.response.data.message);
      } else {
        // Default error message if no specific message is available
        toast.error("Error creating book: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingWrapper loading={loading}>
      <ToastContainer /> {/* Add ToastContainer to your JSX */}
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
        <div className="p-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-white py-8">
              Create New Book
            </h1>
            <Link to="/dashboard/book-creation">
              <button className="w-44 h-12 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl ease-in-out transition duration-300">
                Cancel
              </button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1 w-full md:w-4/6 py-8">
              <div>
                <label
                  htmlFor="title"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Book Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full h-16 rounded-xl border-2 border-white focus:border-none bg-transparent px-3 text-white"
                  placeholder="Enter Book Title"
                  value={bookData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row gap-10 mt-5">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="author"
                    className="text-white font-normal text-lg block mb-2"
                  >
                    Author Name
                  </label>
                  <input
                    type="text"
                    id="author"
                    className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3"
                    placeholder="Enter Author Name"
                    value={bookData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="genre"
                    className="text-white font-normal text-lg block mb-2"
                  >
                    Genre
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                    value={bookData.genre}
                    onChange={handleInputChange}
                  >
                    <option className="bg-[#101011] text-white" value="">
                      Select Genre
                    </option>
                    <option className="bg-[#101011] text-white" value="Fiction">
                      Fiction
                    </option>
                    <option
                      className="bg-[#101011] text-white"
                      value="Non-Fiction"
                    >
                      Non-Fiction
                    </option>
                    <option
                      className="bg-[#101011] text-white"
                      value="Science-Fiction"
                    >
                      Science Fiction
                    </option>
                    <option className="bg-[#101011] text-white" value="Fantasy">
                      Fantasy
                    </option>
                    <option
                      className="bg-[#101011] text-white"
                      value="Biography"
                    >
                      Biography
                    </option>
                    <option
                      className="bg-[#101011] text-white"
                      value="Thriller"
                    >
                      Thriller
                    </option>
                    <option className="bg-[#101011] text-white" value="Romance">
                      Romance
                    </option>
                  </select>
                </div>
              </div>
              <div className="mt-5">
                <label
                  htmlFor="description"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Overview
                </label>
                <textarea
                  id="description"
                  className="w-full h-32 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 pt-4 resize-none"
                  placeholder="Overview"
                  value={bookData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Audio Upload Section */}
              <div className="mt-5 relative">
                <label
                  className="text-white font-normal text-lg block mb-2"
                  htmlFor="audio-upload"
                >
                  Audio File
                </label>
                <input
                  type="file"
                  id="audio-upload"
                  name="audioUpload"
                  accept="audio/mp3"
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  onChange={handleAudioChange}
                />
                <div className="w-full h-16 rounded-xl border-2 border-white bg-transparent px-3 text-white flex items-center justify-between">
                  <span className="text-white">
                    {audioFileName || "Choose MP3 Audio (Optional)"}
                  </span>
                  <FileUploadIcon className="w-6 h-6 text-white" />
                </div>
                {audioError && (
                  <p className="text-red-500 mt-2">{audioError}</p>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="flex flex-col items-center w-full md:w-1/3 h-full py-8">
              <label className="text-white font-semibold mb-2">
                Cover Image
              </label>
              <div className="border-dashed border-2 border-white rounded-lg w-3/4 h-80 flex flex-col items-center justify-center text-white bg-transparent hover:bg-gray-800 transition duration-200">
                <input
                  type="file"
                  className="opacity-0 absolute"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <span className="text-lg">{imageFileName || "Upload"}</span>
                <span className="text-gray-400">
                  Browse from your local machine
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-end gap-6 mt-8 ml-16 w-3/5">
            <div>
              <button
                onClick={handleSubmit}
                className="w-56 h-12 bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 rounded-xl text-white font-semibold text-lg"
              >
                Save Book
              </button>
            </div>
          </div>
        </div>
      </Box>
    </LoadingWrapper>
  );
};

export default CreateBook;
