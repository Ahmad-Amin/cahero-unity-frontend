import React, { useEffect, useState } from "react";
import WebinarCard from "./WebinarCard";
import axiosInstance from "../lib/axiosInstance";
import LoadingWrapper from "../components/ui/LoadingWrapper";
import { Link } from "react-router-dom";

function RecommendedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/books");
        const sortedResults = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const firstFourResults = sortedResults.slice(0, 4);
        setBooks(firstFourResults);
      } catch (error) {
        console.log("Error fetching the webinars");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <LoadingWrapper loading={loading}>
      <div>
        <h1 className="text-white text-3xl font-semibold ml-8 mt-3 p-4">
          Recommended Books
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-8 my-4">
          {books.map((book) => (
            <WebinarCard
              title={book.title}
              genre="Book Genre"
              image={
                book.coverImageUrl ||
                `${process.env.PUBLIC_URL}/images/Tokyotrain.png`
              }
              link={`/all-books/${book.id}`}
            />
          ))}
        </div>
        <Link to={"/all-books"}>
        <button className="flex justify-end w-full px-10 font-semibold text-lg text-white text-opacity-65 hover:text-opacity-100 ease-in-out transition duration-300">
          View All
        </button>
        </Link>
      </div>
    </LoadingWrapper>
  );
}

export default RecommendedBooks;
