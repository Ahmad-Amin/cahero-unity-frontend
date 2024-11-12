import React, { useRef, useEffect, useState } from "react";
import { FiFileText, FiVideo, FiImage } from "react-icons/fi";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../../lib/axiosInstance";
import { toast } from "react-toastify";
import LoadingWrapper from "../ui/LoadingWrapper";

const AdminEditPost = ({ isOpen, onClose, onPost, editData, onUpdate }) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [postContent, setPostContent] = useState(editData?.content || "");
  const [assetLink, setAssetLink] = useState(editData?.assetUrl || "");
  const [assetType, setAssetType] = useState(editData?.type || "");

  const fileInputRefs = {
    image: useRef(),
    video: useRef(),
    document: useRef(),
  };

  const handleFileClick = (type) => {
    if (!assetType) fileInputRefs[type].current.click();
  };

  const handleUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(`/upload/${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAssetLink(response.data.fileUrl);
      setAssetType(type);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
    } catch (e) {
      console.error(`Error uploading the ${type}`, e);
      toast.error(`Error uploading the ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setPostContent("");
    setAssetLink("");
    setAssetType("");
  };

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setPostContent(editData.content || "");
        setAssetLink(editData.assetUrl || "");
        setAssetType(editData.type || "");
      }
    }
  }, [isOpen, editData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => event.key === "Escape" && onClose();

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handlePost = async () => {
    setLoading(true);
    if (editData) {
      await onUpdate(editData.id, postContent, assetLink, assetType);
    } else {
      await onPost(postContent, assetLink, assetType);
    }
    setLoading(false);
    resetFields(); // Reset the fields after post creation/updating
    setTimeout(() => {
      onClose(); // Close modal after fields are reset
    }, 300); // Small delay before closing modal (300ms)
  };

  const handleContentChange = (e) => {
    if (e.target.value.length <= 1000) setPostContent(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#101011] border border-gray-700 rounded-xl p-6 w-2/5 flex flex-col justify-between"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <button
          onClick={() => {
            setTimeout(() => {
              onClose();
            }, 300);
          }}
          className="flex justify-end mb-7 text-white hover:text-gray-400 transition ease-in-out"
        >
          <CloseIcon />
        </button>
        <LoadingWrapper loading={loading}>
          <div className="flex flex-row">
            <h2
              className="flex-1 text-white text-xl font-semibold mb-4"
              id="modal-title"
            >
              {editData ? "Edit Post" : "Create Post"}
            </h2>
            <div className="flex justify-end gap-4 mb-6 text-gray-400">
              <span>{assetLink ? "File Uploaded!" : ""}</span>
              {assetType === "image" && <span className="text-white ml-1">Image</span>}
              {assetType === "video" && <span className="text-white ml-1">Video</span>}
              {assetType === "document" && <span className="text-white ml-1">Document</span>}
              <FiImage
                className={`text-2xl cursor-pointer ${!assetType ? "hover:text-white" : "opacity-50"}`}
                onClick={() => handleFileClick("image")}
              />
              <FiVideo
                className={`text-2xl cursor-pointer ${!assetType ? "hover:text-white" : "opacity-50"}`}
                onClick={() => handleFileClick("video")}
              />
              <FiFileText
                className={`text-2xl cursor-pointer ${!assetType ? "hover:text-white" : "opacity-50"}`}
                onClick={() => handleFileClick("document")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <textarea
              className="w-full h-40 p-2 rounded-lg bg-[#202022] text-white resize-none outline-none"
              value={postContent}
              onChange={handleContentChange}
              placeholder={!editData ? "What you want to Share" : ""}
            />
            <p className="text-right text-gray-400 text-sm">
              {postContent.length}/1000 characters
            </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={handlePost}
              disabled={loading}
              className={`w-32 px-5 h-12 bg-[#6a55ea] text-white rounded-lg font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#5a48c9]"
              } transition duration-200`}
            >
              {editData ? "Update" : "Post"}
            </button>
          </div>
        </LoadingWrapper>
      </div>

      <input
        type="file"
        ref={fileInputRefs.image}
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) => handleUpload(e, "image")}
      />
      <input
        type="file"
        ref={fileInputRefs.video}
        style={{ display: "none" }}
        accept="video/*"
        onChange={(e) => handleUpload(e, "video")}
      />
      <input
        type="file"
        ref={fileInputRefs.document}
        style={{ display: "none" }}
        accept="application/pdf"
        onChange={(e) => handleUpload(e, "document")}
      />
    </div>
  );
};

export default AdminEditPost;
