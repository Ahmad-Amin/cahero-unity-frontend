import React, { useState } from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const CreateNewPlan = () => {
  const [description, setDescription] = useState("");
  const [addedContent, setAddedContent] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Add new content or update existing content
  const handleAddContent = () => {
    if (description.trim()) {
      setAddedContent([...addedContent, description]);
      setDescription("");
    }
  };

  // Trigger edit mode
  const handleEditContent = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setEditingText(addedContent[index]);
  };

  // Save edited content
  const handleSaveEdit = () => {
    const updatedContent = addedContent.map((content, index) =>
      index === editingIndex ? editingText : content
    );
    setAddedContent(updatedContent);
    setIsEditing(false);
    setEditingIndex(null);
    setEditingText("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingIndex(null);
    setEditingText("");
  };

  // Delete content
  const handleDeleteContent = (index) => {
    const updatedContent = addedContent.filter((_, i) => i !== index);
    setAddedContent(updatedContent);
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
              Create New Plan
            </h1>
            <Link to="/dashboard/subscription">
              <button className="w-44 h-12 hover:bg-[#b22c2c] bg-[#e53939] text-white text-lg font-semibold rounded-xl ease-in-out transition duration-300">
                Cancel
              </button>
            </Link>
          </div>

          {/* Form and Content Section */}
          <div className="flex flex-col md:flex-row gap-10 w-3/5">
            {/* Form Section */}
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
                    <option className="bg-[#101011] text-white" value="monthly">
                      Monthly
                    </option>
                    <option className="bg-[#101011] text-white" value="yearly">
                      Yearly
                    </option>
                    <option
                      className="bg-[#101011] text-white"
                      value="lifetime"
                    >
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

                {/* Display added content */}
                <div className="space-y-2 mb-4">
                  {addedContent.map((content, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-white gap-2"
                    >
                      {isEditing && editingIndex === index ? (
                        <>
                          <input
                            className="text-white bg-transparent border-2 border-white rounded-lg p-2 w-full"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                          />
                          <CheckIcon
                            className="cursor-pointer text-[#05c283] hover:text-[#038f60] ease-in-out transition duration-300 ml-2"
                            onClick={handleSaveEdit}
                          />
                          <CloseIcon
                            className="cursor-pointer text-[#e53939] hover:text-[#b22c2c] ease-in-out transition duration-300"
                            onClick={handleCancelEdit}
                          />
                        </>
                      ) : (
                        <>
                          <span className="opacity-60">{content}</span>{" "}
                          {/* Wrap content in span for opacity */}
                          <div className="flex space-x-2">
                            <EditIcon
                              className="cursor-pointer text-[#05c283] hover:text-[#038f60] ease-in-out transition duration-300"
                              onClick={() => handleEditContent(index)}
                            />
                            <DeleteIcon
                              className="text-[#e53939] hover:text-[#b22c2c] cursor-pointer ease-in-out transition duration-300"
                              onClick={() => handleDeleteContent(index)}
                            />
                          </div>
                        </>
                      )}
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

          {/* Button Section */}
          <div className="flex flex-row justify-end gap-6 mt-5 w-3/5">
            <div className="">
              <button className="w-auto px-3 h-12 bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 rounded-xl text-white font-semibold text-lg">
                Create Subscription Plan
              </button>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default CreateNewPlan;
