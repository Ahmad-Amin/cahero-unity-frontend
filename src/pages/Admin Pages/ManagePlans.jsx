import React, { useState } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import ConfirmDelete from "../../components/Admin Components/ConfirmDelete"; 
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const ManagePlans = () => {

  const [itemToDelete, setItemToDelete] = useState(null); // State to store the selected item for deletion

  const [description, setDescription] = useState("");
  const [addedContent, setAddedContent] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Track which content is being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempContent, setTempContent] = useState(""); // Temporary content for editing

  const handleAddContent = () => {
    if (description.trim()) {
      setAddedContent([...addedContent, description]); // Add new content
      setDescription(""); // Clear input after adding
    }
  };

  const handleEditContent = (index) => {
    setEditingIndex(index); // Track the index of the content being edited
    setTempContent(addedContent[index]); // Set the content to be edited in the temp state
  };

  const handleConfirmEdit = (index) => {
    const updatedContent = [...addedContent];
    updatedContent[index] = tempContent; // Update the content with the edited value
    setAddedContent(updatedContent);
    setEditingIndex(null); // Reset editing mode
  };

  const handleCancelEdit = () => {
    setEditingIndex(null); // Cancel editing mode
  };

  const handleDeleteContent = (index) => {
    const updatedContent = addedContent.filter((_, i) => i !== index);
    setAddedContent(updatedContent); // Remove the selected content
  };

  const handleDeleteConfirm = () => {
    console.log("Deleted:", itemToDelete); // Log or perform deletion for the selected item
    setIsModalOpen(false);
  };


  const handleDeleteClick = (index) => {
    setItemToDelete(index); // Set the selected item to be deleted
    setIsModalOpen(true); // Open the modal
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
        <div className="p-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-white py-8">
              Edit Subscription Plan
            </h1>
            <DeleteOutlineIcon
              className="text-[#e53939] hover:text-[#b22c2c] ease-in-out transition-colors duration-300 cursor-pointer"
              onClick={() => handleDeleteClick(itemToDelete)} // Open modal on click
            />
          </div>

          {/* Flexbox for 60% form and 40% image upload */}
          <div className="flex flex-col md:flex-row gap-10 w-3/5">
            {/* Form Section - 60% */}
            <div className="flex-1 w-full md:w-4/6 py-8">
              <div>
                <label
                  htmlFor="title"
                  className="text-white font-normal text-lg block mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full h-16 rounded-xl border-2 border-white focus:border-none bg-transparent px-3 text-white"
                  placeholder="Enter Webinar Title"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row gap-10 mt-5">
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="type"
                    className="text-white font-normal text-lg block mb-2"
                  >
                    Plan Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3 appearance-none"
                  >
                    <option className="bg-[#101011] text-white" value="weekly">
                      Weekly
                    </option>
                    <option
                      className="bg-[#101011] text-white"
                      value="monthly"
                    >
                      Monthly
                    </option>
                    <option className="bg-[#101011] text-white" value="yearly">
                      Yearly
                    </option>
                    <option className="bg-[#101011] text-white" value="lifetime">
                      Lifetime
                    </option>
                  </select>
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="price"
                    className="text-white font-normal text-lg block mb-2"
                  >
                    Plan Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="w-full h-16 rounded-xl border-2 border-white text-white focus:border-none bg-transparent px-3"
                    placeholder="120$"
                    required
                  />
                </div>
              </div>

              <div className="mt-5 relative">
                <label
                  className="text-white font-normal text-lg block mb-2"
                  htmlFor="description"
                >
                  Description and Added Content
                </label>

                <div className="space-y-2 mb-4">
                  {addedContent.map((content, index) => (
                    <div key={index} className="flex justify-between items-center">
                      {editingIndex === index ? (
                        <input
                          className="text-white bg-transparent border-2 border-white rounded-lg p-2 w-full"
                          value={tempContent}
                          onChange={(e) => setTempContent(e.target.value)}
                        />
                      ) : (
                        <p className="text-white opacity-60">{content}</p>
                      )}
                      <div className="flex gap-2">
                        {editingIndex === index ? (
                          <>
                            <CheckIcon
                              className="cursor-pointer text-[#05c283] hover:text-[#038f60] ease-in-out transition duration-300 ml-2"
                              onClick={() => handleConfirmEdit(index)} // Confirm edit
                            />
                            <CloseIcon
                              className="cursor-pointer text-[#e53939] hover:text-[#b22c2c] ease-in-out transition duration-300"
                              onClick={handleCancelEdit} // Cancel edit
                            />
                          </>
                        ) : (
                          <>
                            <EditIcon
                              className="cursor-pointer text-[#05c283] hover:text-[#038f60] ease-in-out transition duration-300"
                              onClick={() => handleEditContent(index)} // Edit content
                            />
                            <DeleteIcon
                              className="text-[#e53939] hover:text-[#b22c2c] cursor-pointer ease-in-out transition duration-300"
                              onClick={() => handleDeleteContent(index)} // Delete content
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-16 rounded-xl border-2 border-white bg-transparent flex items-center justify-between px-3 text-white">
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="bg-transparent text-white placeholder-gray-400 w-full h-full border-none outline-none"
                    placeholder="About the Subscription Plan"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} 
                    required
                  />
                  <div
                    className="bg-[#6a55ea] p-2 rounded-lg cursor-pointer"
                    onClick={handleAddContent} 
                  >
                    <AddIcon
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="white"
                      strokeWidth={2}
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </AddIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Section - 40% */}
          <div className="flex flex-row justify-end gap-6 mt-5 w-3/5">
            <div className="">
              <button className="w-auto px-3 h-12 bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 rounded-xl text-white font-semibold text-lg">
                Update Subscription Plan
              </button>
            </div>
            <div className="">
              <Link to={"/dashboard/subscription"}>
                <button className="w-auto px-3 h-12 bg-[#e53939] hover:bg-[#b22c2c] ease-in-out transition duration-300 rounded-xl text-white font-semibold text-lg">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Box>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
        onConfirm={handleDeleteConfirm} // Handle delete confirmation
        itemType={"Plan"}
      />
    </>
  );
};

export default ManagePlans;
