import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import BookCard from "./BookCards";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "../../ui/pagination";
import apiClient from "../../../api/config";
import type { Book } from "../../../types/book";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState({
    searchTerm: "",
    genre: "",
    format: "",
    minPrice: 0,
    maxPrice: 32390,
    inStock: false,
    sortBy: "title",
    sortDescending: false,
  });
  const [filterOptions, setFilterOptions] = useState({
    genres: ["All Genres"],
    formats: ["All Formats"],
    priceRange: { min: 0, max: 32390 },
    topGenres: [] as string[],
  });
  const booksPerPage = 10;


  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await apiClient.get("/Book/filters");
        console.log("Filter Options API Response:", response.data);
        setFilterOptions({
          genres: ["All Genres", ...(response.data.genres || [])],
          formats: ["All Formats", ...(response.data.formats || [])],
          priceRange: response.data.priceRange || { min: 0, max: 32390 },
          topGenres: (response.data.genres || []).slice(0, 5), // Take top 5 genres
        });
        // Update maxPrice in filters to the dynamic max from API
        setFilters((prev) => ({
          ...prev,
          minPrice: response.data.priceRange?.min || 0,
          maxPrice: response.data.priceRange?.max || 32390,
        }));
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch books based on filters and current page
  const fetchBooks = async () => {
    try {
      const response = await apiClient.get("/Book", {
        params: {
          PageNumber: currentPage,
          PageSize: booksPerPage,
          SearchTerm: filters.searchTerm,
          Genre: filters.genre === "All Genres" ? "" : filters.genre,
          Format: filters.format === "All Formats" ? "" : filters.format,
          MinPrice: filters.minPrice,
          MaxPrice: filters.maxPrice,
          InStock: filters.inStock || undefined,
          SortBy: filters.sortBy,
          SortDescending: filters.sortDescending,
        },
      });
      console.log("BooksPage API Response:", response.data);
      const fetchedBooks = response.data.items.map((item: any) => ({
        id: item.bookId,
        bookId: item.bookId,
        isbn: item.isbn || "",
        userId: item.userId || "",
        title: item.title || "Untitled",
        author: item.author || "Unknown Author",
        publisher: item.publisher || "Unknown Publisher",
        publicationDate: item.publicationDate || "",
        genre: item.genre || "",
        language: item.language || "",
        format: item.format || "",
        description: item.description || "No description available.",
        price: item.price || 0,
        stock: item.inStock ? 1 : 0,
        inStock: item.inStock || false,
        imageURL: item.imageURL || "/default-image.png",
        discount: item.discount || 0,
        discountStartDate: item.discountStartDate || null,
        discountEndDate: item.discountEndDate || null,
        arrivalDate: item.arrivalDate || null,
        rating: item.rating || 0,
        voters: item.voters || "N/A",
        pages: item.pages || 0,
        location: item.location || "N/A",
        reads: item.reads || "0",
        salePercentage: item.salePercentage || 0,
        isNewRelease: item.isNewRelease || false,
        isComingSoon: item.isComingSoon || false,
        category: item.category || [],
        publishedDate: item.publishedDate || item.publicationDate || "",
        coverImage: item.coverImage || item.imageURL || "/default-image.png",
      }));
      console.log("Mapped books in BooksPage:", fetchedBooks);
      setBooks(fetchedBooks);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.pageNumber || 1);
    } catch (error) {
      console.error("Failed to fetch books in BooksPage:", error);
      setBooks([]);
      setTotalPages(1);
    }
  };

  // Fetch books whenever currentPage or filters change
  useEffect(() => {
    fetchBooks();
  }, [currentPage, filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="md:w-1/4">
          <div className="rounded-lg shadow-lg p-6 bg-white">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Filter Books</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {filterOptions.genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select
                  value={filters.format}
                  onChange={(e) => handleFilterChange("format", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {filterOptions.formats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder={`${filterOptions.priceRange.min}`}
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", Number(e.target.value) || filterOptions.priceRange.min)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder={`${filterOptions.priceRange.max}`}
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value) || filterOptions.priceRange.max)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                  />
                  In Stock
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search by title, author, publisher, or language..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="price">Sort by Price</option>
              <option value="publicationDate">Sort by Publication Date</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.sortDescending}
                onChange={(e) => handleFilterChange("sortDescending", e.target.checked)}
              />
              Descending
            </label>
          </div>

          {/* Book List */}
          <div>
            {books.length > 0 ? (
              <BookCard books={books} />
            ) : (
              <p className="text-gray-600">No books found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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