import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { WishlistItem } from "../../../../data/wishlist";
import AccLayout from "../UserSidebar";
import apiClient from "../../../../api/config";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { AxiosError } from "axios"; // Import AxiosError for type safety

type SortOption = "alphabetical" | "date-newest" | "date-oldest";

interface DecodedToken {
  exp: number;
  sub?: string;
  nameid?: string;
}

// Define BookResponse to match backend response
interface BookResponse {
  bookId: string;
  isbn: string;
  userId: string;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string;
  genre: string;
  language: string;
  format: string;
  description: string;
  price: number;
  stock: number;
  inStock: boolean;
  imageURL: string;
  discount: number;
  discountStartDate: string | null;
  discountEndDate: string | null;
  arrivalDate: string | null;
  user: any; // Adjust type if needed
  
}

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("date-newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log("User object on mount:", user); // Debug user object

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      console.log("Token expiration (exp):", decoded.exp, "Current time:", currentTime);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Treat as expired if decoding fails
    }
  };

  // Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      // Wait for user to be initialized
      if (!user) {
        console.log("Waiting for user initialization...");
        setTimeout(fetchWishlist, 100); // Retry after 100ms
        return;
      }

      console.log("Fetching wishlist, user:", user); // Debug before fetch
      if (isTokenExpired(user.token)) {
        console.log("Token expired, logging out. Exp:", jwtDecode(user.token).exp);
        setError("Session expired. Please log in again.");
        logout();
        navigate("/login");
        return;
      }

      try {
        const response = await apiClient.get(`/Bookmark/my-books`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log("Wishlist response:", response.data); // Debug response
        // Map backend response to WishlistItem
        const books: BookResponse[] = response.data.books || response.data;
        const mappedWishlist: WishlistItem[] = books.map((book) => ({
          id: book.bookId,
          bookId: book.bookId,
          isbn: book.isbn,
          userId: book.userId,
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          publicationDate: book.publicationDate,
          genre: book.genre,
          language: book.language,
          format: book.format,
          description: book.description,
          price: book.price,
          stock: book.stock,
          imageURL: book.imageURL,
          discount: book.discount,
          discountStartDate: book.discountStartDate,
          discountEndDate: book.discountEndDate,
          arrivalDate: book.arrivalDate,
          user: book.user,
          rating: 0, // Default rating if not provided
          voters: 0, // Default voters if not provided
          createdAt: book.publicationDate || new Date().toISOString(), // Use publicationDate or current time
          inStock: book.stock > 0,
        }));
        setWishlist(mappedWishlist);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error("Failed to fetch wishlist:", axiosError.response?.data || axiosError.message);
        if (axiosError.response?.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
          navigate("/login");
        } else {
          setError("Failed to load wishlist. Please try again later. (Server may be down)");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, logout, navigate]);

  const handleRemoveFromWishlist = async (bookId: string) => {
    if (!user) {
      setError("Please log in to remove items from your wishlist.");
      return;
    }

    if (isTokenExpired(user.token)) {
      setError("Session expired. Please log in again.");
      logout();
      navigate("/login");
      return;
    }

    try {
      await apiClient.post(`/Bookmark/toggle/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setWishlist(wishlist.filter((book) => book.id !== bookId));
      toast.success("Item removed from wishlist!");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error("Failed to remove from wishlist:", axiosError.response?.data || axiosError.message);
      if (axiosError.response?.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        setError("Failed to remove item. Please try again.");
      }
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value as SortOption;
    setSortOption(selectedOption);

    const sortedWishlist = [...wishlist];

    if (selectedOption === "alphabetical") {
      sortedWishlist.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedOption === "date-newest") {
      sortedWishlist.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (selectedOption === "date-oldest") {
      sortedWishlist.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    setWishlist(sortedWishlist);
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <AccLayout>
          <section className="container mx-auto py-10 text-center">
            <p className="text-gray-600">Loading wishlist...</p>
          </section>
        </AccLayout>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <AccLayout>
          <section className="container mx-auto py-10 text-center">
            <p className="text-red-600">{error}</p>
            {error.includes("log in") && (
              <Link
                to="/login"
                className="mt-4 inline-block text-primary hover:underline"
              >
                Go to Login
              </Link>
            )}
          </section>
        </AccLayout>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <AccLayout>
        <section className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
            >
              <option value="date-newest">Sort by: Date (Newest First)</option>
              <option value="date-oldest">Sort by: Date (Oldest First)</option>
              <option value="alphabetical">Sort by: Alphabetical</option>
            </select>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center mt-20">
              <img
                src="/noresults.png"
                alt="Empty Wishlist"
                className="w-32 h-32 lg:w-56 lg:h-56 object-contain mx-auto"
              />
              <h3 className="text-xl text-gray-500 mt-4">
                Your wishlist is empty.
              </h3>
              <Link
                to="/books"
                className="mt-6 inline-flex justify-center py-2 px-4 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors text-sm lg:text-base"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((book) => (
                <div
                  key={book.id}
                  className="p-4 bg-white rounded-xl shadow-md border border-gray-200"
                >
                  <img
                    src={`http://localhost:5213${book.imageURL}`}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500">by {book.author}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Added on: {new Date(book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleRemoveFromWishlist(book.id)}
                      className="py-2 px-4 bg-red-600 text-white font-medium rounded-md text-sm hover:bg-red-700"
                    >
                      Remove
                    </button>
                    <Link
                      to={`/books/${book.id}`}
                      className="py-2 px-4 bg-primary text-white font-medium rounded-md text-sm hover:bg-primary-dark"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </AccLayout>
    </main>
  );
};

export default UserWishlist;