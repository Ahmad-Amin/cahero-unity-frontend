import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorIcon from '@mui/icons-material/BorderColor';
const ViewMoreModal = ({ open, onClose, onEdit, onDelete }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-[#000000] border border-[#505051] rounded-lg p-6 w-80 text-white space-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-white text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <button
          onClick={onEdit}
          className="w-full py-2 text-white bg-transparent border-none hover:bg-[#202022] rounded ease-in-out transition duration-300 flex items-center justify-between space-x-2 px-2"
        >
          <span>Edit Post</span>
         <BorderColorIcon className="text-lg" />
        </button>
        <button
          onClick={onDelete}
          className="w-full py-2 text-white bg-transparent border-none hover:bg-[#202022] rounded ease-in-out transition duration-300 flex items-center justify-between space-x-2 px-2"
        >
          <span>Delete Post</span>
          <DeleteOutlineIcon className="text-lg" />
          
        </button>
      </div>
    </div>
  );
};

export default ViewMoreModal;
