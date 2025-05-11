import { useState } from "react";
import { Link } from "react-router-dom";
import type { WishlistItem } from "../../../../data/wishlist";
import { wishlist as initialWishlist } from "../../../../data/wishlist";
import AccLayout from "../UserSidebar";

type SortOption = "alphabetical" | "date-newest" | "date-oldest";

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [sortOption, setSortOption] = useState<SortOption>("date-newest");

  const handleRemoveFromWishlist = (bookId: string) => {
    setWishlist(wishlist.filter((book) => book.id !== bookId));
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
