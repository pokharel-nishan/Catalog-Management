import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../../api/config";
import type { Book } from "../../../types/book";
import { useAuth } from "../../../context/AuthContext";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState<Book | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
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
          voters: response.data.voters || "N/A",
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
        setBook(null);
      }
    };
    fetchBook();
  }, [id]);

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
    toast.success("Added to cart!");
  };

  const handleSeeComment = () => {
    toast.success("Comments loaded!");
  };

  if (!book) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-white">
            <img
              src={book.coverImage || book.imageURL || ""}
              alt={book.title || ""}
              className="w-full h-full object-cover"
            />
            {book.discount > 0 && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {book.discount}% OFF
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
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
              {(!book.stock || book.stock <= 0) ? "Out of Stock" : "Add To Cart"}
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
                    i < Math.floor(book.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <span className="text-gray-600">{book.author}</span>
            <span className="text-gray-600">{book.voters || "N/A"}</span>
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
                  <span key={cat} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    {cat}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <h3 className="font-semibold text-gray-600">Author</h3>
                  <p>{book.author}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Published In</h3>
                  <p>{new Date(book.publishedDate || book.publicationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Genre</h3>
                  <p>{book.genre}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Total Pages</h3>
                  <p>{book.pages || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Location</h3>
                  <p>{book.location || "N/A"}</p>
                </div>
              </div>
            </section>
          </div>

          <button
            onClick={handleSeeComment}
            className="mt-8 w-full py-3 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            See Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;