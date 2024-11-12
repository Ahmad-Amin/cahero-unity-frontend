import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDelete from "../../components/Admin Components/ConfirmDelete";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import LoadingWrapper from "../../components/ui/LoadingWrapper";
import { useNavigate } from "react-router-dom";

const ManageWebinars = () => {
  const { id } = useParams(); // Get webinar ID from route params
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("unpaid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null); // For handling image upload
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [webinarData, setWebinarData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    startDate: "",
    description: "",
    price: 0,
    id: "",
    coverImageUrl: "",
  });

  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/webinars/${id}`);
        const data = response.data;

        const formattedStartDate = new Date(data.startDate)
          .toISOString()
          .split("T")[0];

        setWebinarData({
          title: data.title,
          startTime: data.startTime,
          endTime: data.endTime,
          startDate: formattedStartDate,
          description: data.description,
          price: data.price || 0,
          id: data.id,
          coverImageUrl: data.coverImageUrl || "", // Set existing image URL
        });
        setPaymentType(data.price ? "paid" : "unpaid");
      } catch (error) {
        console.error("Error fetching webinar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinar();
  }, [id]);

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWebinarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await axiosInstance.delete(`/webinars/${itemToDelete.id}`);
        navigate("/dashboard/webinars");
      } catch (error) {
        console.error("Error deleting webinar:", error);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (webinar) => {
    setItemToDelete(webinar);
    setIsModalOpen(true);
  };

  const handleUpdateWebinar = async () => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/webinars/${id}`, {
        ...webinarData,
        price: paymentType === "paid" ? webinarData.price : null,
      });
      if (imageFile) {
        await handleImageUpload(); 
      }
      toast.success("Webinar updated successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error updating webinar");
      console.error("Error updating webinar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", imageFile); // Assuming the API requires the key 'file'

    try {
      const response = await axiosInstance.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setWebinarData((prevData) => ({
        ...prevData,
        coverImageUrl: response.data.url, // Assuming response returns the image URL
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
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
        <div className="p-5">
          <div className="flex flex-row items-center gap-5">
            <h1 className="flex-1 text-3xl font-semibold text-white py-8">
              Manage Webinars
            </h1>
            <Link to="/dashboard/webinars">
              <button className="w-44 h-12 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl ease-in-out transition duration-300">
                Cancel
              </button>
            </Link>
            <DeleteOutlineIcon
                    className="text-[#e53939] cursor-pointer hover:text-[#b22c2c] ease-in-out transition-colors duration-300"
                    onClick={() => handleDeleteClick(webinarData)}
                  />
          </div>
          <div className="flex flex-row space-x-20">
          <div className="py-8 w-full flex-1">
            <div>
              <label
                htmlFor="webinar_title"
                className="text-white font-normal text-lg block mb-2"
              >
                Webinar Title
              </label>
              <input
                type="text"
                id="webinar_title"
                name="title"
                value={webinarData.title}
                onChange={handleInputChange}
                className="w-full h-16 rounded-xl border-2 border-white focus:border-none bg-transparent px-3 text-white"
                placeholder="Enter Webinar Title"
                required
              />
            </div>
            <div className="flex gap-10 mt-5">
              <div className="w-1/2">
                <label
                  htmlFor="start_time"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="startTime" 
                  value={webinarData.startTime}
                  onChange={handleInputChange} 
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="end_time"
                  className="text-white font-normal text-lg block mb-2"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="endTime" 
                  value={webinarData.endTime}
                  onChange={handleInputChange} 
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                  required
                />
              </div>
            </div>
            <div className="mt-5">
              <label
                htmlFor="start_date"
                className="text-white font-normal text-lg block mb-2"
              >
                Start Date
              </label>
              <input
                type="date" 
                id="start_date"
                name="startDate" // Set name for handling input change
                value={webinarData.startDate}
                onChange={handleInputChange} // Handle input change
                className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                required
              />
            </div>
            <div className="mt-5">
              <label
                htmlFor="description"
                className="text-white font-normal text-lg block mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={webinarData.description}
                onChange={handleInputChange}
                className="w-full h-32 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 pt-4 resize-none"
                placeholder="Enter Description"
                required
              />
            </div>

            {/* Radio Button Section */}
            <div className="mt-5 flex items-center">
              <label className="text-white font-normal text-lg mr-5 flex items-center">
                Paid
                <input
                  type="radio"
                  name="payment_type"
                  value="paid"
                  checked={paymentType === "paid"}
                  onChange={handlePaymentTypeChange}
                  className="ml-2 appearance-none border border-[#6a55ea] checked:bg-[#6a55ea] rounded-full w-5 h-5 cursor-pointer"
                />
              </label>
              <label className="text-white font-normal text-lg flex items-center">
                Unpaid
                <input
                  type="radio"
                  name="payment_type"
                  value="unpaid"
                  checked={paymentType === "unpaid"}
                  onChange={handlePaymentTypeChange}
                  className="ml-2 appearance-none border border-[#6a55ea] checked:bg-[#6a55ea] rounded-full w-5 h-5 cursor-pointer"
                />
              </label>
            </div>

            {/* Conditionally Render the Webinar Price Input */}
            {paymentType === "paid" && (
              <div className="mt-5">
                <label
                  htmlFor="webinar_price"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Webinar Price
                </label>
                <input
                  type="number"
                  id="webinar_price"
                  name="price" // Set name for handling input change
                  min="0" // Prevent number input below 0
                  value={webinarData.price}
                  onChange={handleInputChange} // Handle input change
                  className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3"
                  required
                />
              </div>
            )}

            <div className="flex justify-between mt-5">
              <button
                onClick={handleUpdateWebinar}
                className="w-48 h-12 bg-[#6a55ea] text-white text-lg font-semibold rounded-xl hover:bg-[#5a4bcf] ease-in-out transition duration-300"
              >
                Update Webinar
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center w-3/12 h-full py-8">
                <label className="text-white font-semibold mb-2">Cover Image</label>
                <img src={webinarData.coverImageUrl} alt={webinarData.title} className="w-1/2" />
                <div className="border-dashed border-2 border-white rounded-lg w-full mx-10 h-40 mt-10 flex flex-col items-center justify-center text-white bg-transparent hover:bg-gray-800 transition duration-200">
                  <input
                    type="file"
                    className="opacity-0 absolute"
                    accept="image/*"
                    onChange={handleImageChange} // Handle file input
                  />
                  <span className="text-lg">Upload</span>
                  <span className="text-gray-400">Browse from your local machine</span>
                </div>
              </div>
            
          </div>
        </div>
      </Box>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType={"Webinar"}
      />
    </LoadingWrapper>
  );
};

export default ManageWebinars;
