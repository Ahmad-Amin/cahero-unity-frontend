import React from "react";
import { Link } from "react-router-dom";

function WebinarCard({
  title,
  year,
  image,
  height,
  description
}) {
  return (
    // <Link to={link || ""}>
      <div
        className="rounded-xl shadow-lg bg-[#1c1c1e] text-white border-2 border-gray-400 relative overflow-hidden hover:scale-[1.05]  ease-in-out transition duration-300"
        style={{ height: height || "400px" }}
      >
        <img
          src={image}
          alt={title}
          className="rounded-t-xl w-full object-cover rounded-lg scale-[1.03]  "
          style={{ height: "100%" }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-white/100 to-transparent backdrop-blur-sm text-black p-4 rounded-b-xl">
          <h3 className="font-semibold">{title}</h3>
          {description ? (
            <p className="text-sm">{description}</p>
          ) : (
            <p className="text-sm">
              {year}
            </p>
          )}
          <button className="bg-[#6a55ea] hover:bg-[#5242b6] ease-in-out transition duration-300 h-8 px-4 text-white text-sm font-normal rounded-md mt-2">Register</button>
        </div>
      </div>
    // </Link>
  );
}

export default WebinarCard;
