import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDelete from "../../components/Admin Components/ConfirmDelete";
import axiosInstance from "../../lib/axiosInstance"; // Ensure this is correct
import { toast } from "react-toastify";
import LoadingWrapper from "../../components/ui/LoadingWrapper";

const EditLecture = () => {
  const { id } = useParams(); // Extract the ID from the route parameters
  const navigate = useNavigate(); // Navigation hook to redirect after update

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [itemToDelete, setItemToDelete] = useState(null); // Store selected item for deletion
  const [loading, setLoading] = useState(false);
  const [lecture, setLecture] = useState({
    title: "",
    duration: "",
    category: "",
    description: "",
    videoUrl: "", // This will store the URL of the video
    coverImageUrl: "", // This will store the URL of the cover image
    videoFile: null, // For storing the new video file (if changed)
    coverImageFile: null, // For storing the new cover image file (if changed)
  });

  // Fetch lecture details from /lectures/:id when component mounts
  useEffect(() => {
    const fetchLectureDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/lectures/${id}`);
        const lectureData = response.data;
        setLecture({
          title: lectureData.title,
          duration: lectureData.duration,
          category: lectureData.category,
          description: lectureData.description,
          videoUrl: lectureData.videoUrl,
          coverImageUrl: lectureData.coverImageUrl,
        });
      } catch (error) {
        console.error("Error fetching lecture details:", error);
        toast.error("Failed to fetch lecture details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLectureDetails();
  }, [id]);

  // Upload file helper function
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
      toast.error("Failed to upload file.");
      return null;
    }
  };

  // Handle form submission to update lecture
  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedVideoUrl = lecture.videoUrl;
    let updatedCoverImageUrl = lecture.coverImageUrl;
    setLoading(true);

    try {
      if (lecture.videoFile) {
        updatedVideoUrl = await uploadFile(lecture.videoFile, "/upload/video");
        if (!updatedVideoUrl) return; // Stop if video upload fails
      }

      if (lecture.coverImageFile) {
        updatedCoverImageUrl = await uploadFile(
          lecture.coverImageFile,
          "/upload/image"
        );
        if (!updatedCoverImageUrl) return; // Stop if image upload fails
      }

      const lectureToUpdate = {
        title: lecture.title,
        duration: lecture.duration,
        category: lecture.category,
        description: lecture.description,
        videoUrl: updatedVideoUrl,
        coverImageUrl: updatedCoverImageUrl,
      };

      await axiosInstance.patch(`/lectures/${id}`, lectureToUpdate);

      navigate("/dashboard/documentaries");
      toast.success("Documentary updated successfully");
    } catch (error) {
      console.error("Error updating Documentary:", error);
      toast.error("Failed to update Documentary.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLecture((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file changes (video or cover image)
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    // Check file size limit (20MB)
    const maxFileSizeMB = 20;
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

    if (files.length > 0) {
      const file = files[0];

      if (file.size > maxFileSizeBytes) {
        toast.error(`File size exceeds ${maxFileSizeMB}MB limit.`);
        return; // Stop the function if file size is too large
      }

      setLecture((prevState) => ({
        ...prevState,
        [name === "video" ? "videoFile" : "coverImageFile"]: file,
      }));
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    console.log("Deleted:", itemToDelete); // Log or perform deletion for the selected item
    setIsModalOpen(false);
  };

  const handleDeleteClick = () => {
    setItemToDelete(lecture); // Set the selected item to be deleted
    setIsModalOpen(true); // Open the modal
  };
  
  return (
    <LoadingWrapper loading={loading}>
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
        {/* Main Form */}
        <div className="p-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-white py-8">
              Edit Documentary
            </h1>
            <div className="space-x-3">
              <Link to="/dashboard/documentaries">
                <button className="w-44 h-12 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl ease-in-out transition duration-300">
                  Cancel
                </button>
              </Link>
              <DeleteOutlineIcon
                className="text-[#e53939] cursor-pointer hover:text-[#b22c2c]  ease-in-out transition-colors duration-300"
                onClick={handleDeleteClick}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1 w-full md:w-4/6 py-8">
              {/* Lecture Title */}
              <div>
                <label
                  htmlFor="lecture_title"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Documentary Title
                </label>
                <input
                  type="text"
                  id="lecture_title"
                  name="title"
                  value={lecture.title}
                  onChange={handleInputChange}
                  className="w-full h-16 rounded-xl border-2 border-white focus:border-none bg-transparent px-3 text-white"
                  placeholder="Enter Documentary Title"
                  required
                />
              </div>

              {/* Duration and Category */}
              <div className="flex flex-col md:flex-row gap-10 mt-5">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="duration"
                    className="text-white font-normal text-lg block mb-2"
                  >
                    Duration of Documentary
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={lecture.duration}
                    onChange={handleInputChange}
                    className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3"
                    placeholder="hr:min:sec"
                    required
                    pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="category"
                    className="text-white font-normal text-lg block mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={lecture.category}
                    onChange={handleInputChange}
                    className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                  >
                    <option className="bg-[#101011] text-white" value="finance">
                      Finance
                    </option>
                    <option
                      className="bg-[#101011] text-white"
                      value="technology"
                    >
                      Technology
                    </option>
                    <option className="bg-[#101011] text-white" value="health">
                      Health
                    </option>
                    <option
                      className="bg-[#101011] text-white"
                      value="education"
                    >
                      Education
                    </option>
                  </select>
                </div>
              </div>

              {/* Overview */}
              <div className="mt-5">
                <label
                  htmlFor="overview"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Overview
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  value={lecture.description}
                  onChange={handleInputChange}
                  className="w-full h-32 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 pt-4 resize-none"
                  placeholder="Overview"
                  required
                />
              </div>

              {/* Video Upload */}
              <div className="mt-5 relative">
                <label
                  className="text-white font-normal text-lg block mb-2"
                  htmlFor="video-upload"
                >
                  Video Upload
                </label>
                <input
                  type="file"
                  id="video-upload"
                  name="video"
                  accept="video/mp4"
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  onChange={handleFileChange}
                  required
                />
                <div className="w-full h-16 rounded-xl border-2 border-white bg-transparent px-3 text-white flex items-center justify-between">
                  <span className="text-white">
                    {lecture.videoFile ? lecture.videoFile.name : "Choose MP4 Video"}
                  </span>
                  <FileUploadIcon className="w-6 h-6 text-white" />
                </div>
                <video controls className="mt-5 rounded-lg border-2 border-[#404040]" src={lecture.videoUrl}></video>
              </div>
            </div>

            {/* Cover Image */}
            <div className="flex flex-col items-center w-full md:w-1/3 h-full py-8">
            <label
                  className="text-white font-normal text-lg block mb-2"
                  htmlFor="image-upload"
                >
                  Cover Image
                </label>
                <img src={lecture.coverImageUrl} alt={lecture.title} />
              <div className="border-dashed border-2 border-white rounded-lg w-3/4 h-40 mt-10 flex flex-col items-center justify-center text-white bg-transparent hover:bg-gray-800 transition duration-200">
                <input
                  type="file"
                  name="coverImage"
                  className="opacity-0 absolute"
                  accept="image/*"
                  onChange={handleFileChange}
                />
               <span className="text-lg">
                  {lecture.coverImageFile ? lecture.coverImageFile.name : "Upload"}
                </span>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="flex flex-row justify-end gap-6 mt-8 ml-16 w-3/5">
            <button
              onClick={handleSubmit}
              className="w-56 h-12 bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 rounded-xl text-white font-semibold text-lg"
            >
              Update Documentary
            </button>
          </div>
        </div>
      </Box>

      {/* Delete Confirmation Modal */}
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType={"documentary"}
      />
    </LoadingWrapper>
  );
};

export default EditLecture;
