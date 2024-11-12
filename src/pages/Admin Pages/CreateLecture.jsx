import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import axiosInstance from "../../lib/axiosInstance"; // Make sure this is correctly set up for Axios
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import LoadingWrapper from "../../components/ui/LoadingWrapper";

const CreateLecture = () => {
  const [lectureData, setLectureData] = useState({
    title: "",
    duration: "",
    category: "",
    overview: "",
    videoFile: null,
    coverImage: null,
  });

  const [videoFileName, setVideoFileName] = useState("Choose MP4 Video"); // State to hold video file name
  const [imageFileName, setImageFileName] = useState("Upload"); // State to hold image file name
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Use the hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLectureData({ ...lectureData, [name]: value });
  };

  const handleTimeChange = (e) => {
    const { value } = e.target;

    setLectureData((prevData) => ({
      ...prevData,
      duration: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const maxFileSizeMB = 20;
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

    if (files.length > 0) {
      const file = files[0];

      // Check if the file size exceeds 20MB
      if (file.size > maxFileSizeBytes) {
        toast.error(`${name === "videoFile" ? "Video" : "Image"} file exceeds 20MB limit. Please upload a smaller file.`);
        return; // Stop the function if the file size is too large
      }

      setLectureData({ ...lectureData, [name]: file });

      if (name === "videoFile") {
        setVideoFileName(file.name);
      } else if (name === "coverImage") {
        setImageFileName(file.name);
      }
    }
  };

  const uploadFile = async (file, uploadUrl) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null; // Handle error appropriately
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Uploading Video");
      const videoUrl = await uploadFile(lectureData.videoFile, "/upload/video");
      console.log("Video Upload Success");

      console.log("Uploading Image");
      const coverImageUrl = await uploadFile(
        lectureData.coverImage,
        "/upload/image"
      );
      console.log("Image Upload Success");

      const lectureToSubmit = {
        title: lectureData.title,
        duration: lectureData.duration,
        category: lectureData.category,
        description: lectureData.overview,
        videoUrl: videoUrl,
        coverImageUrl: coverImageUrl,
      };

      await axiosInstance.post("/lectures", lectureToSubmit);
      console.log("Lecture created successfully:", lectureToSubmit);

      toast.success("Documentary created successfully");

      navigate("/dashboard/documentaries");
    } catch (error) {
      console.error("Error creating Documentary:", error);
      toast.error("Error Creating Documentary");
    } finally {
      setLoading(false);
    }
  };


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
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-white py-8">Create Documentary</h1>
          <Link to="/dashboard/documentaries">
            <button className="w-44 h-12 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl ease-in-out transition duration-300">
              Cancel
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Flexbox for 60% form and 40% image upload */}
          <div className="flex flex-col md:flex-row gap-10">
            {/* Form Section - 60% */}
            <div className="flex-1 w-full md:w-4/6 py-8">
              <div>
                <label  className="text-white font-normal text-lg block mb-2">
                Documentary Title
                </label>
                <input
                  type="text"
                  id="webinar_title"
                  name="title"
                  className="w-full h-16 rounded-xl border-2 border-white focus:border-none bg-transparent px-3 text-white"
                  placeholder="Enter Documentary Title"
                  value={lectureData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row gap-10 mt-5">
                <div className="w-full md:w-1/2">
                  <label htmlFor="time-input" className="text-white font-normal text-lg block mb-2">
                    Duration of Documentary
                  </label>
                  <InputMask
                    mask="99:99:99"
                    value={lectureData.duration} // Ensure this uses lectureData.duration
                    onChange={handleTimeChange}
                    className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3"
                    placeholder="HH:MM:SS"
                    id="time-input"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="category" className="text-white font-normal text-lg block mb-2">
                    Category
                  </label>
                  <select
                    id="sort"
                    name="category"
                    className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                    value={lectureData.category}
                    onChange={handleChange}
                  >
                    <option className="bg-[#101011] text-white">Select a Category</option>
                    <option className="bg-[#101011] text-white" value="Finance">
                      Finance
                    </option>
                    <option className="bg-[#101011] text-white" value="Technology">
                      Technology
                    </option>
                    <option className="bg-[#101011] text-white" value="Health">
                      Health
                    </option>
                    <option className="bg-[#101011] text-white" value="Education">
                      Education
                    </option>
                  </select>
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="overview" className="text-white font-normal text-lg block mb-2">
                  Overview
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  className="w-full h-32 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 pt-4 resize-none"
                  placeholder="Overview"
                  value={lectureData.overview}
                  onChange={handleChange}
                  required
                />
              </div>

                {/* Video Upload Section */}
                <div className="mt-5 relative">
                  <label
                    className="text-white font-normal text-lg block mb-2"
                    htmlFor="video-upload"
                  >
                    Video Upload (Optional)
                  </label>
                  <input
                    type="file"
                    id="video-upload"
                    name="videoFile"
                    accept="video/mp4"
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    onChange={handleFileChange}
                    required
                  />
                  <div className="w-full h-16 rounded-xl border-2 border-white bg-transparent px-3 text-white flex items-center justify-between">
                    <span className="text-white">
                      {videoFileName || "Upload MP4 Video"}
                    </span>{" "}
                    {/* Display the video file name */}
                    <FileUploadIcon
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </FileUploadIcon>
                  </div>
                </div>
              </div>

            {/* Image Upload Section - 40% */}
            <div className="flex flex-col items-center w-full md:w-1/3 h-full py-8">
              <label className="text-white font-semibold mb-2">Cover Image</label>
              <div className="border-dashed border-2 border-white rounded-lg w-3/4 h-80 flex flex-col items-center justify-center text-white bg-transparent hover:bg-gray-800 transition duration-200">
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  className="opacity-0 absolute"
                  onChange={handleFileChange}
                  required
                />
                <span className="text-lg">{imageFileName || "Upload Image"}</span> 
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end gap-6 mt-8 ml-16 w-3/5">
            <div className="">
              <button
                type="submit"
                className="w-56 h-12 bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 rounded-xl text-white font-semibold text-lg"
              >
                Save Documentary
              </button>
            </div>
          </div>
        </form>
      </div>
    </Box>
  );
};

export default CreateLecture;
