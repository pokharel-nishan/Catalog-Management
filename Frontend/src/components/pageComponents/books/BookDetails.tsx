import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Trash2, Edit, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "../../../api/config";
import type { Book } from "../../../types/book";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../cart/CartContext";
import Layout from "../../../layouts/UserLayout";

interface ReviewDTO {
  reviewId: string;
  username: string;
  createdAt: string | Date;
  content: string;
  rating: number;
}

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [showReviews, setShowReviews] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [newReview, setNewReview] = useState({ content: "", rating: 0 });
  const [editingReview, setEditingReview] = useState<ReviewDTO | null>(null);

  const isAuthenticated = !!user;

  const { averageRating, voterCount } = useMemo(() => {
    const voterCount = reviews.length;
    const averageRating = voterCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / voterCount
      : 0;
    return { averageRating, voterCount };
  }, [reviews]);

  const fetchBook = async () => {
    try {
      const response = await apiClient.get(`/Book/${id}`);
      const fetchedBook: Book = {
        id: response.data.bookId,
        bookId: response.data.bookId,
        isbn: response.data.isbn || "",
        userId: response.data.userId || "",
        title: response.data.title || "Untitled",
        author: response.data.author || "Unknown Author",
        publisher: response.data.publisher || "Unknown Publisher",
        publicationDate: response.data.publicationDate || "",
        genre: response.data.genre || "",
        language: response.data.language || "",
        format: response.data.format || "",
        description: response.data.description || "No description available.",
        price: response.data.price || 0,
        stock: response.data.stock ?? 0,
        inStock: response.data.inStock || false,
        imageURL: response.data.imageURL || "/default-image.png",
        discount: response.data.discount || 0,
        discountStartDate: response.data.discountStartDate || null,
        discountEndDate: response.data.discountEndDate || null,
        arrivalDate: response.data.arrivalDate || null,
        rating: response.data.rating || 0,
        pages: response.data.pages || 0,
        location: response.data.location || "N/A",
        reads: response.data.reads || "0",
        salePercentage: response.data.salePercentage || 0,
        isNewRelease: response.data.isNewRelease || false,
        isComingSoon: response.data.isComingSoon || false,
        category: response.data.category || [],
        publishedDate: response.data.publishedDate || response.data.publicationDate || "",
        coverImage: response.data.coverImage || response.data.imageURL || "/default-image.png",
      };
      setBook(fetchedBook);
    } catch (error) {
      console.error("Failed to fetch book details:", error);
      toast.error("Failed to load book details!");
      setBook(null);
    }
  };

  const fetchReviews = async () => {
    if (showReviews) {
      setShowReviews(false);
      return;
    }

    setIsLoadingReviews(true);
    try {
      const response = await apiClient.get(`/Review/book/${id}`);
      if (response.data.success) {
        setReviews(response.data.reviews || []);
        setShowReviews(true);
        toast.success("Reviews loaded!");
      } else {
        throw new Error("Failed to fetch reviews: Invalid response format");
      }
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
      toast.error(error.response?.data?.message || "Failed to load reviews!");
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, [id]);

  const loadReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const response = await apiClient.get(`/Review/book/${id}`);
      if (response.data.success) {
        setReviews(response.data.reviews || []);
      } else {
        throw new Error("Failed to fetch reviews: Invalid response format");
      }
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
      toast.error(error.response?.data?.message || "Failed to load reviews!");
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add a review!");
      navigate("/login");
      return;
    }
    if (newReview.rating < 1 || newReview.rating > 5) {
      toast.error("Rating must be between 1 and 5 stars!");
      return;
    }
    if (!newReview.content.trim()) {
      toast.error("Review content cannot be empty!");
      return;
    }

    try {
      const response = await apiClient.post(`/Review/add/${id}`, {
        content: newReview.content,
        rating: newReview.rating,
      });
      if (response.data.success) {
        toast.success("Review added successfully!");
        setNewReview({ content: "", rating: 0 });
        if (showReviews) {
          await loadReviews();
        }
      } else {
        throw new Error(response.data.message || "Failed to add review");
      }
    } catch (error: any) {
      console.error("Failed to add review:", error);
      const message = error.response?.data?.message || "Failed to add review!";
      if (message.includes("purchase the book")) {
        toast.error("Could not add review. Please buy the book first!");
      } else if (message.includes("already reviewed")) {
        toast.error("You have already reviewed this book!");
      } else {
        toast.error(message);
      }
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to update your review!");
      navigate("/login");
      return;
    }
    if (!editingReview) {
      toast.error("No review selected for editing!");
      return;
    }
    if (editingReview.rating < 1 || editingReview.rating > 5) {
      toast.error("Rating must be between 1 and 5 stars!");
      return;
    }
    if (!editingReview.content.trim()) {
      toast.error("Review content cannot be empty!");
      return;
    }

    try {
      const response = await apiClient.put(`/Review/update/${reviewId}`, {
        content: editingReview.content,
        rating: editingReview.rating,
      });
      if (response.data.success) {
        toast.success("Review updated successfully!");
        setEditingReview(null);
        await loadReviews();
      } else {
        throw new Error(response.data.message || "Failed to update review");
      }
    } catch (error: any) {
      console.error("Failed to update review:", error);
      toast.error(error.response?.data?.message || "Failed to update review!");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to delete your review!");
      navigate("/login");
      return;
    }

    try {
      const response = await apiClient.delete(`/Review/delete/${reviewId}`);
      if (response.data.success) {
        toast.success("Review deleted successfully!");
        await loadReviews();
      } else {
        throw new Error(response.data.message || "Failed to delete review");
      }
    } catch (error: any) {
      console.error("Failed to delete review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review!");
    }
  };

  const handleEditReview = (review: ReviewDTO) => {
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to buy!");
      navigate("/login");
      return;
    }
    if (!book || book.stock <= 0) {
      toast.error("This book is currently out of stock!");
      return;
    }
    setIsLoading(true);
    toast.success("Processing your order...");
    setTimeout(() => {
      setIsLoading(false);
      navigate("/success");
    }, 1500);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add to cart!");
      navigate("/login");
      return;
    }
    if (!book || book.stock <= 0) {
      toast.error("This book is currently out of stock!");
      return;
    }
    addToCart(book);
  };

  if (!book) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const discountedPrice = book.discount > 0 ? book.price * (1 - book.discount ) : book.price;

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-white relative">
            <img
              src={`http://localhost:5213${book.imageURL}`}
              alt={book.title || ""}
              className="w-full h-full object-cover"
            />
            {book.discount > 0 && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {(book.discount)*100}% OFF
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="text-2xl font-bold">
              {book.discount > 0 ? (
                <>
                  <span className="text-orange-500">${discountedPrice.toFixed(2)}</span>
                  <span className="text-gray-500 line-through ml-2">${book.price.toFixed(2)}</span>
                </>
              ) : (
                <span>${book.price.toFixed(2)}</span>
              )}
            </div>
            <button
              onClick={handleBuyNow}
              disabled={isLoading || !book.stock || book.stock <= 0}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                isLoading || !book.stock || book.stock <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-400 text-white hover:bg-orange-500"
              }`}
            >
              <ShoppingCart size={20} />
              {isLoading ? "Processing..." : "Buy Now"}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!book.stock || book.stock <= 0}
              className={`w-full py-3 rounded-lg transition-colors ${
                !book.stock || book.stock <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "border border-orange-400 text-orange-400 hover:bg-orange-50"
              }`}
            >
              {!book.stock || book.stock <= 0 ? "Out of Stock" : "Add To Cart"}
            </button>
          </div>
        </div>

        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-2">By {book.author}</p>

          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.floor(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({voterCount} {voterCount === 1 ? "voter" : "voters"})
            </span>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700">{book.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Category</h2>
              <div className="flex flex-wrap gap-2">
                {(book.category || []).map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-2 bg-gray-100 rounded-full text-gray-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <h3 className="font-semibold text-gray-600">Author</h3>
                  <p>{book.author}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Publisher</h3>
                  <p>{book.publisher}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Published In</h3>
                  <p>
                    {new Date(
                      book.publishedDate || book.publicationDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Genre</h3>
                  <p>{book.genre}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Language</h3>
                  <p>{book.language}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Format</h3>
                  <p>{book.format}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Total Pages</h3>
                  <p>{book.pages || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">ISBN</h3>
                  <p>{book.isbn || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Location</h3>
                  <p>{book.location || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Stock</h3>
                  <p>{book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}</p>
                </div>
                {book.arrivalDate && (
                  <div>
                    <h3 className="font-semibold text-gray-600">Arrival Date</h3>
                    <p>{new Date(book.arrivalDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  {editingReview ? "Edit Your Review" : "Add Your Review"}
                </h3>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`cursor-pointer ${
                          i < (editingReview ? editingReview.rating : newReview.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() =>
                          editingReview
                            ? setEditingReview({ ...editingReview, rating: i + 1 })
                            : setNewReview({ ...newReview, rating: i + 1 })
                        }
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={4}
                  placeholder="Write your review here..."
                  value={editingReview ? editingReview.content : newReview.content}
                  onChange={(e) =>
                    editingReview
                      ? setEditingReview({ ...editingReview, content: e.target.value })
                      : setNewReview({ ...newReview, content: e.target.value })
                  }
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => (editingReview ? handleUpdateReview(editingReview.reviewId) : handleAddReview())}
                    className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                  >
                    {editingReview ? "Update Review" : "Submit Review"}
                  </button>
                  {editingReview && (
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={fetchReviews}
                disabled={isLoadingReviews}
                className="w-full py-3 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                {isLoadingReviews ? (
                  "Loading..."
                ) : (
                  <>
                    {showReviews ? "Hide Reviews" : "See Reviews"}
                    {showReviews ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </>
                )}
              </button>
              {showReviews && (
                <div className="mt-4 space-y-4">
                  {isLoadingReviews ? (
                    <p className="text-gray-600">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-gray-600">No reviews yet.</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.reviewId} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-semibold">{review.username}</span>
                            <span className="ml-2 text-gray-500 text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {user?.name === review.username && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                title="Edit Review"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.reviewId)}
                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                title="Delete Review"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default BookDetailPage;
