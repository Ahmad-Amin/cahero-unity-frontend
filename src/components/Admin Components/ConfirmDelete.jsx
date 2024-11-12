import React, { useRef, useEffect, useState } from "react";
import LoadingWrapper from "../ui/LoadingWrapper";

const ConfirmDelete = ({ isOpen, onClose, onConfirm, itemType }) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleConfirm = async () => {
    setLoading(true); // Set loading state
    await onConfirm(); // Call the confirmation action
    setLoading(false); // Reset loading state
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#101011] border border-white rounded-2xl p-6 w-1/3 h-1/3 flex items-center justify-center"
        role="dialog"
        aria-labelledby="modal-title"
      >
        <LoadingWrapper loading={loading} >
          <div>
            <div className="text-center mb-10">
              <h2
                id="modal-title"
                className="text-white text-2xl font-semibold"
              >
                Do you really want to delete this {itemType}?
              </h2>
            </div>
            <div className="flex justify-around mx-10 gap-6">
              <button
                className="border border-[#6a55ea] text-[#6a55ea] w-44 h-12 rounded-lg hover:bg-[#6a55ea] hover:text-white transition duration-200"
                onClick={onClose}
              >
                No
              </button>
              <button
                className={`bg-[#6a55ea] text-white rounded-lg w-44 h-12 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleConfirm}
                disabled={loading}
              >
                Yes
              </button>
            </div>
          </div>
        </LoadingWrapper>
      </div>
    </div>
    </div>
  );
};

export default ConfirmDelete;
