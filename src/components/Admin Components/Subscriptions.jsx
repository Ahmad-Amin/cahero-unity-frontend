import React, { useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from "react-router-dom";
import ConfirmDelete from "../../components/Admin Components/ConfirmDelete"; // Import the DeleteConfirmation component

const Subscriptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [itemToDelete, setItemToDelete] = useState(null); // State to store the selected item for deletion

  const handleDeleteConfirm = () => {
    console.log("Deleted:", itemToDelete); // Log or perform deletion for the selected item
    setIsModalOpen(false);
  };
  
  const plans = [
    {
      name: "Basic Plan",
      price: "2,499",
      features: [
        "Access to Videos",
        "Exclusive content",
        "Exclusive content",
        "Exclusive content",
        "Exclusive content",
      ],
    },
    {
      name: "Extended Plan",
      price: "2,499",
      features: [
        "Access to Videos",
        "Exclusive content",
        "Exclusive content",
        "Exclusive content",
        "Exclusive content",
      ],
    },
    {
      name: "Premium Plan",
      price: "2,499",
      features: [
        "Access to Videos",
        "Exclusive content",
        "Exclusive content",
        "Exclusive content",
        "Exclusive content",
      ],
    },
  ];
  const handleDeleteClick = (plans) => {
    setItemToDelete(plans);
    setIsModalOpen(true); 
  };
  return (
    <>
    <div className="p-8 bg-transparent min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-[#000000] border border-[#6a55ea] rounded-xl p-6 space-y-7 text-white relative"
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-3 flex-1">
                <h3 className="text-xl font-semibold text-[#6a55ea]">
                  {plan.name}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Link to={"/dashboard/subscription/manage-plan"}>
                <ModeEditIcon className="text-[#05c283] cursor-pointer hover:text-[#038f60] ease-in-out transition-colors duration-300 mr-2" />
                </Link>
                <DeleteOutlineIcon
            className="text-[#e53939] hover:text-[#b22c2c] ease-in-out transition-colors duration-300 cursor-pointer"
            onClick={() => handleDeleteClick(plans)} 
          />
              </div>
            </div>
            <h2 className="text-3xl font-bold my-4">
              {plan.price} <span className="text-lg">$/mo</span>
            </h2>
            <ul className="space-y-5 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-lg">
                  <span className="text-[#6a55ea] mr-2">●</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="w-full flex justify-center">
              <button className="bg-[#6a55ea] w-1/2 py-3 rounded-md text-lg mt-5 font-semibold hover:bg-[#5242b6] transition ease-in-out duration-300">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
        onConfirm={handleDeleteConfirm} // Handle delete confirmation
        itemType={"Plan"}
      />
    </>
  );
};

export default Subscriptions;
