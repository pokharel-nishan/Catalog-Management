import { useState } from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../../../types/book";
import { books } from "../../../../data/book";
import AccLayout from "../UserSidebar";

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState<Book[]>([
    books[0],
    books[1],
    books[2],
  ]);

  const handleRemoveFromWishlist = (bookId: string) => {
    setWishlist(wishlist.filter((book) => book.id !== bookId));
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <AccLayout>
        <section className="container mx-auto py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>

          {wishlist.length === 0 ? (
            <div className="text-center mt-20">
              <img
                src="/images/empty_wishlist.png"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((book) => (
                <div
                  key={book.id}
                  className="p-4 bg-white rounded-xl shadow-md border border-gray-200"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500">by {book.author}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">
                        {"★".repeat(book.rating)}
                      </span>
                      <span className="ml-2 text-gray-400">
                        ({book.voters ?? 0} votes)
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-lg font-bold text-primary">
                        ${book.price ?? "N/A"}
                      </span>
                    </div>
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
