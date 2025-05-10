import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../../types/book";
import { Heart, HeartIcon } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../cart/CartContext";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const { addToCart } = useCart();

 
  const handleWishlistClick = () => {
    setIsLiked((prev) => !prev);
    setJustClicked(true);
  };

  React.useEffect(() => {
    if (justClicked) {
      if (isLiked) {
        toast.success("Book added to wishlist!");
      } else {
        toast.info("Book removed from wishlist.");
      }
      setJustClicked(false);
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
    <div className="relative flex overflow-hidden group transition-shadow duration-300 hover:shadow-lg rounded-lg">
      {/* Background Layers */}
      <div className="absolute inset-0 flex">
        <div className="w-[20%] bg-gray-50" />
        <div className="w-[80%] bg-white border border-none rounded-lg" />
      </div>

      {/* Content */}
      <div className="flex w-full relative pt-6 z-10">
        {/* Book Image */}
        <div className="w-1/3 overflow-hidden">
          <Link to={`/books/${book.id}`}>
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Info */}
        <div className="w-2/3 pl-8 flex flex-col p-4">
          <Link to={`/books/${book.id}`} className="flex flex-col gap-1">
            <h1 className="text-xl font-bold line-clamp-1">{book.title}</h1>
            <p className="text-lg text-gray-600">By {book.author}</p>
            <div className="mt-2">{renderStars(book.rating || 4)}</div>
            <p className="text-xs text-gray-400 line-clamp-3 mt-2">{book.description}</p>
          </Link>

          {/* Buttons OUTSIDE Link */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(book);
              }}
              className="mt-2 w-full rounded-lg border border-orange-600 px-4 py-2 text-orange-600 transition-colors duration-300 ease-in-out hover:bg-orange-600 hover:text-white"
            >
              Add to Cart
            </button>

            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlistClick();
              }}
            >
              {isLiked ? (
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
};

export default BookCard;
