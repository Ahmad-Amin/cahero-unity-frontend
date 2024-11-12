import React, { useEffect, useState } from "react";
import WebinarCard from "./WebinarCard";
// import axiosInstance from "../lib/axiosInstance";
// import { useSelector } from "react-redux";
import LoadingWrapper from "../components/ui/LoadingWrapper";
import { Link } from "react-router-dom";
function UpcomingWebinars() {
  // const [webinars, setWebinars] = useState([]);
  // const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     if (user?.id !== "") {
  //       try {
  //         setLoading(true);
  //         const response = await axiosInstance.get("/webinars");
  //         const sortedResults = response.data.sort((a, b) => {
  //           return new Date(b.createdAt) - new Date(a.createdAt);
  //         });

  //         const firstFourResults = sortedResults.slice(0, 3);
  //         setWebinars(firstFourResults);
  //       } catch (error) {
  //         console.log("Error fetching the webinars");
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   })();
  // }, [user]);
  const webinar = [
    {
      id: 1,
      title: "Leadership Summit 2024",
      startDate: "March 18, 2024",
      description: "A summit focused on leadership skills for the new year.",
      coverImageUrl: `${process.env.PUBLIC_URL}/images/Event1.png`,
    },
    {
      id: 2,
      title: "Leadership Summit 2024",
      startDate: "March 18, 2024",
      description: "A summit focused on leadership skills for the new year.",
      coverImageUrl: `${process.env.PUBLIC_URL}/images/Event2.png`,
    },
    {
      id: 3,
      title: "Leadership Summit 2024",
      startDate: "March 18, 2024",
      description: "A summit focused on leadership skills for the new year.",
      coverImageUrl: `${process.env.PUBLIC_URL}/images/Event3.png`,
    }
  ];
  

  return (
    <LoadingWrapper loading={loading}>
    <div>
      <h1 className="text-white text-3xl font-semibold ml-8 mt-3 p-4">
        Upcoming Events
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mx-8 my-4">
        {webinar.map((webinar) => (
          <WebinarCard
            key={webinar.id} // Add key here
            title={webinar.title}
            year={webinar.startDate}
            image={
              webinar.coverImageUrl ||
              `${process.env.PUBLIC_URL}/images/Tokyotrain.png`
            }
            // link={`/webinar/${webinar.id}`}
          />
        ))}
      </div>
      {/* <Link to={"/webinar"}> */}
        <button className="flex justify-end w-full px-10 font-semibold text-lg text-white text-opacity-65 hover:text-opacity-100 ease-in-out transition duration-300">
          View All
        </button>
      {/* </Link> */}
    </div>
  </LoadingWrapper>
);
}

export default UpcomingWebinars;
