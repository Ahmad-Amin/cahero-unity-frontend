import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ConfirmDelete from "../../components/Admin Components/ConfirmDelete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";
import LoadingWrapper from "../../components/ui/LoadingWrapper";
const ManageBook = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [BooksData, setBooksData] = useState({
    title: "",
    author: "",
    description: "",
    coverImageUrl: "",
    audioFileUrl: "",
  });
  const navigate = useNavigate();
  const handleUpdateBook = async () => {
    try {
      await axiosInstance.patch(`/books/${id}`, {
        ...BooksData,
      });
      navigate("/dashboard/book-creation");
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  useEffect(() => {
    const fetchbook = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/books/${id}`);
        const data = response.data;

        setBooksData({
          title: data.title,
          author: data.author,
          description: data.description,
          coverImageUrl: data.coverImageUrl,
          audioFileUrl: data.audioFileUrl,
        });
      } catch (error) {
        console.error("Error fetching book data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchbook();
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        setLoading(true);
        await axiosInstance.delete(`/books/${id}`);
        navigate("/dashboard/book-creation");
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("Error deleting book.");
      } finally {
        setLoading(false);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (book) => {
    setItemToDelete(book);
    setIsModalOpen(true);
  };

  // Handle file upload changes
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if the file size exceeds 5MB (5 * 1024 * 1024 = 5242880 bytes)
      const maxFileSizeMB = 5;
      const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

      if (file.size > maxFileSizeBytes) {
        console.error("Error: File size exceeds 5MB.");
        toast.error(
          "File size exceeds the 5MB limit. Please upload a smaller file."
        );
        return; // Stop the function if file size is too large
      }

      let uploadUrl;
      if (e.target.id === "audio-upload") {
        uploadUrl = "/upload/audio";
        setBooksData((prev) => ({ ...prev, audioFileUrl: file.name })); // temporarily store file name
      } else if (e.target.id === "cover-upload") {
        uploadUrl = "/upload/image";
        setBooksData((prev) => ({ ...prev, coverImageUrl: file.name })); // temporarily store file name
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        // Upload the file
        setLoading(true);
        const uploadResponse = await axiosInstance.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Assuming the response contains the URL of the uploaded file
        const fileUrl = uploadResponse.data.fileUrl;

        // Now update the book details with the new URLs
        await updateBookData(
          fileUrl,
          e.target.id === "audio-upload" ? "audioFileUrl" : "coverImageUrl"
        );
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateBookData = async (fileUrl, field) => {
    setLoading(true);
    try {
      const updatedData = {
        ...BooksData,
        [field]: fileUrl, // update the specific field with the new URL
      };

      await axiosInstance.patch(`/books/${id}`, updatedData);
      console.log("Book updated successfully:", updatedData);
    } catch (error) {
      console.error("Error updating book data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        <LoadingWrapper loading={loading}>
          <div className="p-5">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-semibold text-white py-8">
                Update Book
              </h1>
              <DeleteOutlineIcon
                className="text-[#e53939] cursor-pointer hover:text-[#b22c2c] ease-in-out transition-colors duration-300 mr-10"
                onClick={() => handleDeleteClick(id)}
                sx={{ fontSize: 40 }}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 w-full md:w-4/6 py-8">
                <div>
                  <label
                    htmlFor="Book_title"
                    className="text-white font-normal text-lg block mb-2"
                  >
                    Book Title
                  </label>
                  <input
                    type="text"
                    id="Book_title"
                    className="w-full h-16 rounded-xl border-2 border-white focus:border-none bg-transparent px-3 text-white"
                    placeholder="Enter Book Title"
                    value={BooksData.title}
                    onChange={(e) =>
                      setBooksData({ ...BooksData, title: e.target.value })
                    } // Update state
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-10 mt-5">
                  <div className="w-full md:w-1/2">
                    <label
                      htmlFor="author_name"
                      className="text-white font-normal text-lg block mb-2"
                    >
                      Author Name
                    </label>
                    <input
                      type="text"
                      id="author_name"
                      className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3"
                      placeholder="Enter Author Name"
                      value={BooksData.author}
                      onChange={(e) =>
                        setBooksData({ ...BooksData, author: e.target.value })
                      } // Update state
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label
                      htmlFor="category"
                      className="text-white font-normal text-lg block mb-2"
                    >
                      Genre
                    </label>
                    <select
                      id="sort"
                      name="category"
                      className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                      value={BooksData.genre} // Value of the select field
                    >
                      <option className="bg-[#101011] text-white" value="">
                        Select Genre
                      </option>
                      <option
                        className="bg-[#101011] text-white"
                        value="Fiction"
                      >
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
                      <option
                        className="bg-[#101011] text-white"
                        value="Fantasy"
                      >
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
                      <option
                        className="bg-[#101011] text-white"
                        value="Romance"
                      >
                        Romance
                      </option>
                    </select>
                  </div>
                </div>
                <div className="mt-5">
                  <label
                    htmlFor="overview"
                    className="text-white font-normal text-lg block mb-2"
                  >
                    Overview
                  </label>
                  <textarea
                    id="overview"
                    className="w-full h-32 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 pt-4 resize-none"
                    placeholder="Overview"
                    value={BooksData.description}
                    onChange={(e) =>
                      setBooksData({
                        ...BooksData,
                        description: e.target.value,
                      })
                    } // Update state
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
                    onChange={handleFileChange}
                  />
                  <div className="w-full h-16 rounded-xl border-2 border-white bg-transparent px-3 text-white flex items-center justify-between">
                    <span className="text-white">
                      Choose MP3 Audio (Optional)
                    </span>
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
                  {BooksData.audioFileUrl && (
                    <audio
                      controls
                      className="mt-5"
                      src={BooksData.audioFileUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="flex flex-col items-center w-full md:w-1/3 h-full py-8">
                <label className="text-white font-semibold mb-2">
                  Cover Image
                </label>
                <img src={BooksData.coverImageUrl} alt={BooksData.title} />
                <div className="mt-10 border-dashed border-2 border-white rounded-lg w-3/4 h-40 flex flex-col items-center justify-center text-white bg-transparent hover:bg-gray-800 transition duration-200">
                  <input
                    type="file"
                    id="cover-upload" // Add an ID to the file input for the cover image
                    className="opacity-0 absolute"
                    accept="image/*"
                    onChange={handleFileChange} // Handle file changes
                  />
                  <span className="text-lg">Change Image</span>
                  <span className="text-gray-400">Upload Image</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-end gap-6 mt-8 ml-16 w-3/5">
              <div className="">
                <button
                  onClick={handleUpdateBook} // Call handleUpdateBook on button click
                  className="w-56 h-12 bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 rounded-xl text-white font-semibold text-lg"
                >
                  {" "}
                  Update Book
                </button>
              </div>
              <Link to="/dashboard/book-creation">
                <button className="w-44 h-12 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl ease-in-out transition duration-300">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </LoadingWrapper>
      </Box>

      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType={"Book"}
      />
    </>
  );
};

export default ManageBook;
