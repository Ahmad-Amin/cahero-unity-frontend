import React, { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import axiosInstance from "../lib/axiosInstance";
import { useParams } from "react-router-dom";

const RatingsReviews = ({ type }) => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await axiosInstance.get(
          `/${type}s/${id}/reviews/stats`
        );
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch review stats", error);
      } 
    };

    fetchReviewStats();
  }, [type, id]);

  return (
    <div className="ratings-container bg-transparent p-6 rounded-lg text-white h-60">
      <h2 className="text-2xl font-semibold">Ratings & Reviews</h2>
      <p className="text-sm text-gray-400 mt-1">
        Rating and reviews are verified and are from people who use the service
      </p>
      <div className="flex items-center mt-4">
        <div className="text-center mr-6">
          <p className="text-4xl font-bold">{stats?.averageRating}</p>
          <p className="text-yellow-400 flex items-center">
            {[...Array(5)].map((_, index) =>
              index < Math.round(stats?.averageRating) ? (
                <StarIcon key={index} fontSize="small" />
              ) : (
                <StarBorderIcon key={index} fontSize="small" />
              )
            )}
          </p>
          <p className="text-sm">{stats?.totalReviews} reviews</p>
        </div>
        <div className="flex-1">
          {stats?.ratings.map((rating) => {
            const percentage =
              stats?.totalReviews > 0
                ? (rating.count / stats?.totalReviews) * 100
                : 0;
            return (
              <div key={rating.stars} className="flex items-center mb-2">
                <p className="w-6 text-sm">{rating.stars}</p>
                <div className="flex-1 h-3 bg-gray-700 rounded-lg overflow-hidden mx-2">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-blue-500 rounded-lg"
                  ></div>
                </div>
                <p className="text-sm">{rating.count}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingsReviews;
