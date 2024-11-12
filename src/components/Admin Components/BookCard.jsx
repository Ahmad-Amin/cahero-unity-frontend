import React, { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDelete from "../../components/Admin Components/ConfirmDelete";
import { Link } from "react-router-dom";
import axiosInstance from "../../lib/axiosInstance";
import LoadingWrapper from "../ui/LoadingWrapper";

const BookCardGrid = ({ searchQuery, dateFilter }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [books, setBooks] = useState([]); 
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/books?search=${searchQuery}&target=${dateFilter}`);
      console.log(response.data); 

      if (Array.isArray(response.data)) {
        setBooks(response.data); 
      } else {
        console.error("Books data is not an array");
      }
    } catch (error) {
      console.error("Error fetching books data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(); 
  }, [searchQuery, dateFilter]);

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await axiosInstance.delete(`/books/${itemToDelete.id}`);

        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.id !== itemToDelete.id)
        );
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (book) => {
    setItemToDelete(book); // Set the selected book to be deleted
    setIsModalOpen(true); // Open the modal
  };

  return (
    <LoadingWrapper loading={loading}>
      <div className="min-h-screen bg-transparent p-10">
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {books.map((book) => (
              <div
                key={book.id} // Use the book ID as the key
                className="bg-transparent h-full rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
              >
                <img
                  src={book.coverImageUrl} // Use fallback if no coverImageUrl
                  alt={book.title}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if fallback image also fails
                  }}
                  className="w-full h-64 object-cover scale-105 overflow-hidden"
                />

                <div className="p-4 h-auto space-y-3 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {book.title}
                  </h3>
                  <p className="text-white text-sm opacity-75">
                    By {book.author}
                  </p>
                  <div className="space-x-2">
                    <DeleteOutlineIcon
                      className="text-[#e53939] hover:text-[#b22c2c] cursor-pointer"
                      onClick={() => handleDeleteClick(book)}
                    />
                    <Link
                      to={`/dashboard/book-creation/${book.id}/manage-book`}
                    >
                      <EditIcon className="text-[#05c283] hover:text-[#038f60]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-2xl text-center w-full mx-auto">
            No books available
          </p>
        )}
      </div>
      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType="book"
      />
    </LoadingWrapper>
  );
};

export default BookCardGrid;
