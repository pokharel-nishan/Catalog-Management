import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, HeartIcon, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../../../context/AuthContext";
import type { Book } from "../../../types/book";
import apiClient from "../../../api/config";
import { jwtDecode } from 'jwt-decode'; // Fix import: Use named export

interface BookCardProps {
  books: Book[];
}

interface DecodedToken {
  exp: number;
  sub?: string;
  nameid?: string;
}

const BookCard: React.FC<BookCardProps> = ({ books }) => {
  const [bookRatings, setBookRatings] = useState<{ [key: string]: { rating: number; voters: string } }>({}); // Store ratings per book
  const [likedBooks, setLikedBooks] = useState<{ [key: string]: boolean }>({}); // Track liked/bookmarked state
  const [justClicked, setJustClicked] = useState<string | null>(null); // Track which book was just liked/unliked
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token); // Use named export
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      console.log("Token expiration (exp):", decoded.exp, "Current time:", currentTime); // Debug
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Treat as expired if decoding fails
    }
  };

  // Fetch reviews and bookmark status
  useEffect(() => {
    const fetchReviewsAndBookmarks = async () => {
      try {
        // Mock reviews (replace with real API call if available)
        const ratings = books.map((book) => ({
          bookId: book.bookId,
          rating: 4, // Mock rating
          voters: "100", // Mock voters
        }));
        const ratingsMap = ratings.reduce((acc, { bookId, rating, voters }) => {
          acc[bookId] = { rating, voters };
          return acc;
        }, {} as { [key: string]: { rating: number; voters: string } });
        setBookRatings(ratingsMap);

        // Fetch bookmark status if authenticated
        if (isAuthenticated) {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          console.log("Token for bookmark check:", token); // Debug token

          if (token && isTokenExpired(token)) {
            toast.error("Session expired during bookmark check. Logging out.");
            logout();
            navigate("/login");
            return;
          }

          const bookmarkChecks = await Promise.all(
            books.map((book) => {
              const bookId = book.bookId || book.id;
              if (!bookId) {
                console.error(`Book ID is undefined for book: ${book.title}`);
                return { bookId, isBookmarked: false };
              }
              return apiClient
                .get(`/Bookmark/check/${bookId}`)
                .then((res) => ({
                  bookId,
                  isBookmarked: res.data.isBookmarked || false,
                }))
                .catch((error: unknown) => {
                  const axiosError = error as { response?: { status?: number; data?: any } };
                  console.error(
                    `Failed to fetch bookmark status for book ${bookId}:`,
                    axiosError.response?.status,
                    axiosError.response?.data
                  );
                  if (axiosError.response?.status === 401) {
                    toast.error("Session expired during bookmark check. Logging out.");
                    logout();
                    navigate("/login");
                  }
                  return { bookId, isBookmarked: false };
                });
            })
          );
          const initialLikedBooks = bookmarkChecks.reduce((acc, { bookId, isBookmarked }) => {
            if (bookId) acc[bookId] = isBookmarked;
            return acc;
          }, {} as { [key: string]: boolean });
          setLikedBooks(initialLikedBooks);
        }
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number; data?: any } };
        console.error(
          "Unexpected error in fetchReviewsAndBookmarks:",
          axiosError.response?.status,
          axiosError.response?.data
        );
        if (axiosError.response?.status === 401) {
          toast.error("Session expired during bookmark check. Logging out.");
          logout();
          navigate("/login");
        }
      }
    };
    if (books.length > 0) {
      fetchReviewsAndBookmarks();
    }
  }, [books, isAuthenticated, logout, navigate]);

  const handleWishlistClick = async (bookId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add to wishlist!");
      navigate("/login");
      return;
    }

    if (!bookId) {
      console.error(`Invalid bookId: ${bookId}`);
      toast.error("Invalid book ID. Unable to update wishlist.");
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log("Token for bookmark toggle:", token); // Debug token

    if (!token) {
      toast.error("No authentication token found. Please log in again.");
      logout();
      navigate("/login");
      return;
    }

    if (isTokenExpired(token)) {
      toast.error("Session expired. Please log in again.");
      logout();
      navigate("/login");
      return;
    }

    try {
      const response = await apiClient.post(`/Bookmark/toggle/${bookId}`);
      if (response.data.success) {
        setLikedBooks((prev) => ({
          ...prev,
          [bookId]: !prev[bookId], // Toggle based on current state
        }));
        setJustClicked(bookId);
      } else {
        toast.error("Failed to update wishlist. Please try again.");
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number; data?: any } };
      console.error(
        "Failed to toggle bookmark:",
        axiosError.response?.status,
        axiosError.response?.data
      );
      if (axiosError.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        toast.error("Failed to update wishlist. Please try again.");
      }
    }
  };

  useEffect(() => {

  const handleWishlistClick = () => {
    setIsLiked((prev) => !prev);
    setJustClicked(true);
  };

  React.useEffect(() => {
    if (justClicked) {
      const isNowLiked = likedBooks[justClicked];
      if (isNowLiked) {
        toast.success("Book added to wishlist!");
      } else {
        toast.info("Book removed from wishlist.");
      }
      setJustClicked(null);
    }
  }, [likedBooks, justClicked]);

  const handleAddToCart = (book: Book) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add to cart!");
      navigate("/login");
      return;
    }
    const isOutOfStock = !book.inStock;
    if (isOutOfStock) {
      toast.error("This book is currently out of stock!");
      return;
    }
    try {
      addToCart(book);
      toast.success("Added to cart!");
    } catch (error: unknown) {
      console.error("Failed to add book to cart:", error);
      toast.error("Failed to add book to cart. Please try again.");
    }
  };

  const renderStars = (bookId: string) => {
    const { rating = 0, voters = "N/A" } = bookRatings[bookId] || {};
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-gray-400 ml-2 text-xs font-light">{voters} voters</span>
      </div>
    );
  };

  if (books.length === 0) {
    return <div className="text-gray-600 p-4">No books available.</div>;
  }
  }, [isLiked, justClicked]);

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-orange-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-gray-400 ml-2 text-xs font-light">
        {book.voters || "1,988,288"} voters
      </span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
      {books.map((book) => {
        const isOutOfStock = !book.inStock;
        console.log(`Book ID: ${book.bookId}, Title: ${book.title}, InStock: ${book.inStock}, Out of Stock: ${isOutOfStock}`);
        const bookId = book.bookId || book.id;
        if (!bookId) {
          console.error(`Book ID is undefined for book: ${book.title}`);
          return null; // Skip rendering this book card
        }

        return (
          <div
            key={bookId}
            className="relative flex overflow-hidden group transition-shadow duration-300 hover:shadow-lg rounded-lg"
          >
            <div className="absolute inset-0 flex">
              <div className="w-[20%] bg-gray-50" />
              <div className="w-[80%] bg-white border border-none rounded-lg" />
            </div>

            <div className="flex w-full relative pt-6 z-10">
              <div className="w-1/3 overflow-hidden relative">
                <Link to={`/books/${bookId}`}>
                  <img
                    src={book.imageURL || "/default-image.png"}
                    alt={book.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {book.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {(book.discount * 100).toFixed(0)}% OFF
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute top-12 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Out of Stock
                    </div>
                  )}
                </Link>
              </div>
      {/* Content */}
      <div className="flex w-full relative pt-6 z-10">
        {/* Book Image */}
        <div className="w-1/3 overflow-hidden">
          <Link to={`/books/${book.id}`}>
            <img
              src={`http://localhost:5213${book.imageURL}`}
              alt={book.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

              <div className="w-2/3 pl-8 flex flex-col p-4">
                <Link to={`/books/${bookId}`} className="flex flex-col gap-1">
                  <h1 className="text-xl font-bold line-clamp-1">{book.title}</h1>
                  <p className="text-lg text-gray-600">By {book.author}</p>
                  <div className="mt-2">{renderStars(bookId)}</div>
                  <p className="text-xs text-gray-400 line-clamp-3 mt-2">{book.description || "No description available."}</p>
                </Link>
        {/* Info */}
        <div className="w-2/3 pl-8 flex flex-col p-4">
          <Link to={`/books/${book.id}`} className="flex flex-col gap-1">
            <h1 className="text-xl font-bold line-clamp-1">{book.title}</h1>
            <p className="text-lg text-gray-600">By {book.author}</p>
            <div className="mt-2">{renderStars(book.rating || 4)}</div>
            <p className="text-xs text-gray-400 line-clamp-3 mt-2">
              {book.description}
            </p>
          </Link>

                <div className="mt-auto flex items-center justify-between gap-2">
                  {!isOutOfStock ? (
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="mt-2 w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors bg-orange-400 text-white hover:bg-orange-500"
                      aria-label="Add to Cart"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="mt-2 w-full py-3 rounded-lg flex items-center justify-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed"
                      aria-label="Out of Stock"
                    >
                      Out of Stock
                    </button>
                  )}
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => handleWishlistClick(bookId)}
                    aria-label={likedBooks[bookId] ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    {likedBooks[bookId] ? (
                      <HeartIcon className="w-6 h-6 text-orange-400 transition-colors" />
                    ) : (
                      <Heart className="w-6 h-6 text-gray-400 hover:text-orange-400 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookCard;