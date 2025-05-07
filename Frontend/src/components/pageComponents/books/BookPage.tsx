import React, { useState } from "react";
import { Search } from "lucide-react";
import BookCard from "./BookCards";
import { books } from "../../../data/book";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "../../ui/pagination";

const BooksPage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("All Genres");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const booksPerPage = 6;

  const genres = [
    "All Genres",
    "Business",
    "Science",
    "Fiction",
    "Philosophy",
    "Biography",
  ];
  const recommendations = [
    "Artist of the Month",
    "Book of the Year",
    "Top Genre",
    "Trending",
  ];

  const filteredBooks =
    selectedGenre === "All Genres"
      ? books
      : books.filter((book) => book.category?.includes(selectedGenre));

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Book by Genre</h2>
            <ul className="space-y-2">
              {genres.map((genre) => (
                <li key={genre}>
                  <button
                    className={`w-full text-left py-2 px-4 rounded ${
                      selectedGenre === genre
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedGenre(genre);
                      setCurrentPage(1);
                    }}
                  >
                    {genre}
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">Recommendations</h2>
            <ul className="space-y-2">
              {recommendations.map((rec) => (
                <li key={rec}>
                  <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100">
                    {rec}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Type the name of book or author..."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Shadcn Pagination */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      size="sm"
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
