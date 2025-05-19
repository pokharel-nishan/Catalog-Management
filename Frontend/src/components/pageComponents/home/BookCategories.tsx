import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, HeartIcon, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/config';
import { jwtDecode } from 'jwt-decode';

// Minimal interface for API response books
interface FeaturedBook {
  bookId: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  discount: number;
  imageURL: string;
  inStock: boolean;
  onSaleUntil: string | null;
}

// Extended Book interface for frontend, aligned with src/types/book.ts
export interface Book {
  id: string;
  bookId: string;
  isbn: string;
  userId: string;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string;
  publishedDate: string;
  genre: string;
  language: string;
  format: string;
  description: string;
  price: number;
  stock: number;
  inStock: boolean;
  imageURL: string;
  coverImage: string;
  discount: number;
  discountStartDate: string | null;
  discountEndDate: string | null;
  arrivalDate: string | null;
  rating: number;
  voters: number | undefined; // Changed to number | undefined
  pages: number;
  location: string;
  reads: string;
  salePercentage: number;
  isNewRelease: boolean;
  isComingSoon: boolean;
  category: string[];
}

// API response interface
interface FeaturedBooksResponse {
  newArrivals: FeaturedBook[];
  newReleases: FeaturedBook[];
  topSales: FeaturedBook[];
  bestSellers: FeaturedBook[];
  comingSoon: FeaturedBook[];
}

// Review DTO for fetching reviews
interface ReviewDTO {
  reviewId: string;
  username: string;
  createdAt: string | Date;
  content: string;
  rating: number;
}

// Decoded token interface
interface DecodedToken {
  exp: number;
  sub?: string;
  nameid?: string;
}

// Map FeaturedBook to Book interface
const mapToBook = (book: FeaturedBook, section: keyof FeaturedBooksResponse): Book => ({
  id: book.bookId,
  bookId: book.bookId,
  isbn: '',
  userId: '',
  title: book.title,
  author: book.author,
  publisher: 'Unknown',
  publicationDate: book.onSaleUntil || new Date().toISOString(),
  publishedDate: book.onSaleUntil || new Date().toISOString(),
  genre: book.genre,
  language: 'Unknown',
  format: 'Unknown',
  description: 'No description available.',
  category: book.genre.split('/').map((g) => g.trim()),
  price: book.price,
  stock: book.inStock ? 50 : 0,
  inStock: section === 'comingSoon' ? false : book.inStock,
  imageURL: `http://localhost:5213${book.imageURL}`,
  coverImage: `http://localhost:5213${book.imageURL}`,
  rating: 0,
  voters: 0, // Set as number
  reads: '0',
  salePercentage: book.discount,
  discount: book.discount,
  discountStartDate: null,
  discountEndDate: book.onSaleUntil,
  arrivalDate: section === 'comingSoon' ? book.onSaleUntil : null,
  pages: 0,
  location: 'Unknown',
  isNewRelease: section === 'newReleases' || section === 'newArrivals',
  isComingSoon: section === 'comingSoon',
});

// HomeComponent with BookCard design
const HomeComponent: React.FC = () => {
  const [likedBooks, setLikedBooks] = useState<{ [key: string]: boolean }>({});
  const [bookRatings, setBookRatings] = useState<{
    [key: string]: { rating: number; voters: number }; // Changed voters to number
  }>({});
  const [justClicked, setJustClicked] = useState<string | null>(null);
  const [featuredBooks, setFeaturedBooks] = useState<FeaturedBooksResponse>({
    newArrivals: [],
    newReleases: [],
    topSales: [],
    bestSellers: [],
    comingSoon: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // Fetch featured books
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.get('/Book/featured', { headers });
        if (response.data) {
          setFeaturedBooks(response.data);
        } else {
          throw new Error('No data returned from API');
        }
      } catch (error: any) {
        console.error('Failed to fetch featured books:', error);
        toast.error(error.response?.data?.message || 'Failed to load books');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  // Fetch reviews and bookmarks for all books
  useEffect(() => {
    const fetchReviewsAndBookmarks = async () => {
      const allBooks = [
        ...featuredBooks.newArrivals,
        ...featuredBooks.newReleases,
        ...featuredBooks.topSales,
        ...featuredBooks.bestSellers,
        ...featuredBooks.comingSoon,
      ].map((book) => mapToBook(book, 'bestSellers')); // Section doesn't matter for reviews/bookmarks

      if (allBooks.length === 0) return;

      try {
        // Fetch reviews
        const reviewPromises = allBooks.map((book) => {
          const bookId = book.bookId || book.id;
          if (!bookId) {
            console.error(`Book ID is undefined for book: ${book.title}`);
            return Promise.resolve({ bookId, reviews: [] });
          }
          return apiClient
            .get(`/Review/book/${bookId}`)
            .then((res) => ({
              bookId,
              reviews: res.data.success ? res.data.reviews || [] : [],
            }))
            .catch((error) => {
              console.error(`Failed to fetch reviews for book ${bookId}:`, error);
              return { bookId, reviews: [] };
            });
        });

        const reviewResults = await Promise.all(reviewPromises);
        const ratingsMap = reviewResults.reduce((acc, { bookId, reviews }) => {
          if (bookId) {
            const voterCount = reviews.length;
            const averageRating =
              voterCount > 0
                ? reviews.reduce((sum: number, review: ReviewDTO) => sum + review.rating, 0) /
                  voterCount
                : 0;
            acc[bookId] = {
              rating: averageRating,
              voters: voterCount, // Store as number
            };
          }
          return acc;
        }, {} as { [key: string]: { rating: number; voters: number } });
        setBookRatings(ratingsMap);

        // Fetch bookmarks if authenticated
        if (isAuthenticated) {
          const token = localStorage.getItem('token') || sessionStorage.getItem('token');
          if (token && isTokenExpired(token)) {
            toast.error('Session expired during bookmark check. Logging out.');
            logout();
            navigate('/login');
            return;
          }

          const bookmarkChecks = await Promise.all(
            allBooks.map((book) => {
              const bookId = book.bookId || book.id;
              if (!bookId) {
                console.error(`Book ID is undefined for book: ${book.title}`);
                return { bookId, isBookmarked: false };
              }
              return apiClient
                .get(`/Bookmark/check/${bookId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => ({
                  bookId,
                  isBookmarked: res.data.isBookmarked || false,
                }))
                .catch((error: any) => {
                  console.error(`Failed to fetch bookmark status for book ${bookId}:`, error);
                  if (error.response?.status === 401) {
                    toast.error('Session expired during bookmark check. Logging out.');
                    logout();
                    navigate('/login');
                  }
                  return { bookId, isBookmarked: false };
                });
            })
          );
          const initialLikedBooks = bookmarkChecks.reduce(
            (acc, { bookId, isBookmarked }) => {
              if (bookId) acc[bookId] = isBookmarked;
              return acc;
            },
            {} as { [key: string]: boolean }
          );
          setLikedBooks(initialLikedBooks);
        }
      } catch (error: any) {
        console.error('Unexpected error in fetchReviewsAndBookmarks:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired during bookmark check. Logging out.');
          logout();
          navigate('/login');
        }
      }
    };

    if (
      featuredBooks.newArrivals.length > 0 ||
      featuredBooks.newReleases.length > 0 ||
      featuredBooks.topSales.length > 0 ||
      featuredBooks.bestSellers.length > 0 ||
      featuredBooks.comingSoon.length > 0
    ) {
      fetchReviewsAndBookmarks();
    }
  }, [featuredBooks, isAuthenticated, logout, navigate]);

  // Handle wishlist toggle
  const handleWishlistClick = async (bookId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add to wishlist!');
      navigate('/login');
      return;
    }

    if (!bookId) {
      console.error(`Invalid bookId: ${bookId}`);
      toast.error('Invalid book ID. Unable to update wishlist.');
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      toast.error('Session expired or no token. Please log in again.');
      logout();
      navigate('/login');
      return;
    }

    try {
      const response = await apiClient.post(
        `/Bookmark/toggle/${bookId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setLikedBooks((prev) => ({
          ...prev,
          [bookId]: !prev[bookId],
        }));
        setJustClicked(bookId);
      } else {
        toast.error('Failed to update wishlist. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to toggle bookmark:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to update wishlist. Please try again.');
      }
    }
  };

  // Show toast for wishlist actions
  useEffect(() => {
    if (justClicked) {
      const isNowLiked = likedBooks[justClicked];
      if (isNowLiked) {
        toast.success('Book added to wishlist!');
      } else {
        toast.info('Book removed from wishlist.');
      }
      setJustClicked(null);
    }
  }, [likedBooks, justClicked]);

  // Handle add to cart
  const handleAddToCart = (book: Book) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add to cart!');
      navigate('/login');
      return;
    }
    if (book.isComingSoon) {
      toast.error('This book is coming soon and not yet available');
      return;
    }
    if (!book.inStock) {
      toast.error('This book is out of stock');
      return;
    }
    addToCart(book);
    toast.success(`${book.title} added to cart!`);
  };

  // Define filtering functions using API data
  const getTopDeals = (): Book[] => {
    return featuredBooks.topSales
      .filter((book) => book.discount > 0)
      .map((book) => mapToBook(book, 'topSales'))
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 6);
  };

  const getBestSellers = (): Book[] => {
    return featuredBooks.bestSellers
      .map((book) => mapToBook(book, 'bestSellers'))
      .slice(0, 6);
  };

  const getNewArrivals = (): Book[] => {
    return featuredBooks.newArrivals
      .map((book) => mapToBook(book, 'newArrivals'))
      .slice(0, 6);
  };

  const getNewReleases = (): Book[] => {
    return featuredBooks.newReleases
      .map((book) => mapToBook(book, 'newReleases'))
      .slice(0, 6);
  };

  const getComingSoon = (): Book[] => {
    return featuredBooks.comingSoon
      .map((book) => mapToBook(book, 'comingSoon'))
      .slice(0, 6);
  };

  // Render star ratings based on fetched reviews
  const renderStars = (bookId: string) => {
    const { rating = 0, voters = 0 } = bookRatings[bookId] || {};
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            data-testid={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-gray-400 ml-2 text-xs font-light">
          ({voters} {voters === 1 ? 'voter' : 'voters'})
        </span>
      </div>
    );
  };

  // Helper to render a section of books
  const renderSection = (title: string, sectionBooks: Book[]) => {
    if (isLoading) {
      return (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="text-gray-600 p-4">Loading books...</div>
        </section>
      );
    }

    if (sectionBooks.length === 0) {
      return (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="text-gray-600 p-4">No books available.</div>
        </section>
      );
    }

    return (
      <section className="mb-8 mx-6 lg:mx-16">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 p-4">
          {sectionBooks.map((book) => {
            const isOutOfStock = title === 'Coming Soon' ? true : !book.inStock;
            const bookId = book.bookId || book.id;
            if (!bookId) {
              console.error(`Book ID is undefined for book: ${book.title}`);
              return null;
            }

            const discountedPrice =
              book.discount > 0 ? book.price * (1 - book.discount) : book.price;

            return (
              <div
                key={bookId}
                className="relative flex overflow-hidden group transition-shadow duration-300 hover:shadow-lg rounded-lg"
              >
                <div className="absolute inset-0 flex">
                  <div className="w-[20%] bg-gray-50" />
                  <div className="w-[80%] bg-white border border-none rounded-lg" />
                </div>

                {/* Content */}
                <div className="flex w-full relative pt-6 z-10">
                  <div className="w-1/3 overflow-hidden">
                    <Link to={`/books/${bookId}`}>
                      <img
                        src={book.imageURL}
                        alt={book.title}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {book.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {(book.discount * 100).toFixed(0)}% OFF
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute top-12 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {title === 'Coming Soon' ? 'Coming Soon' : 'Out of Stock'}
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="w-2/3 pl-8 flex flex-col p-4">
                    <Link to={`/books/${bookId}`} className="flex flex-col gap-1">
                      <h1 className="text-xl font-bold line-clamp-1">{book.title}</h1>
                      <p className="text-lg text-gray-600">By {book.author}</p>
                      <div className="mt-2">{renderStars(bookId)}</div>
                      <p className="text-xs text-gray-400 line-clamp-3 mt-2">
                        {book.description}
                      </p>
                      <p className="text-base text-gray-800 line-clamp-3 mt-2">
                        {book.discount > 0 ? (
                          <>
                            <span className="text-orange-500">${discountedPrice.toFixed(2)}</span>
                            <span className="text-gray-500 line-through ml-2">
                              ${book.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span>${book.price.toFixed(2)}</span>
                        )}
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
                          aria-label={title === 'Coming Soon' ? 'Coming Soon' : 'Out of Stock'}
                        >
                          {title === 'Coming Soon' ? 'Coming Soon' : 'Out of Stock'}
                        </button>
                      )}
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => handleWishlistClick(bookId)}
                        aria-label={
                          likedBooks[bookId] ? 'Remove from Wishlist' : 'Add to Wishlist'
                        }
                        data-testid="wishlist-icon"
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
      </section>
    );
  };

  return (
    <div className="p-4">
      {renderSection('Top Deals', getTopDeals())}
      {renderSection('Best Sellers', getBestSellers())}
      {renderSection('New Arrivals', getNewArrivals())}
      {renderSection('New Releases', getNewReleases())}
      {renderSection('Coming Soon', getComingSoon())}
    </div>
  );
};

export default HomeComponent;