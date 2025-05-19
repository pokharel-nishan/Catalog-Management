import React, { useState } from 'react';

// Define the Book interface
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
  voters: number | string;
  pages: number;
  location: string;
  reads: string;
  salePercentage: number;
  isNewRelease: boolean;
  isComingSoon: boolean;
  category: string[];
}

// Seed data for books
const books: Book[] = [
  {
    id: '1',
    bookId: '1',
    isbn: '978-602-424-694-5',
    userId: '',
    title: 'Garis Waktu',
    author: 'Fiersa Besari',
    publisher: 'Mediakita',
    publicationDate: '1 Juli 2016',
    publishedDate: '1 Juli 2016',
    genre: 'Fiksi / Romance / Umum',
    language: 'Indonesia',
    format: 'Paperback',
    description: "A heartfelt story of love and time, blending romance with deep emotional reflections.",
    category: ['Biography', 'Inspiring', 'AutoBiography'],
    price: 15.99,
    stock: 100,
    inStock: true,
    imageURL: '/books/book3.png',
    coverImage: '/books/book3.png',
    rating: 4,
    voters: 9800,
    reads: '3.7M',
    salePercentage: 10,
    discount: 10,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 210,
    location: 'Indonesia',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '2',
    bookId: '2',
    isbn: '978-014-044-926-6',
    userId: '',
    title: 'The Frolic of the Beasts',
    author: 'Yukito Mishima',
    publisher: 'Penguin Classics',
    publicationDate: '15 April 2022',
    publishedDate: '15 April 2022',
    genre: 'Romance / Drama / Fiction',
    language: 'English',
    format: 'Paperback',
    description: "A gripping tale of love, betrayal, and the consequences of unchecked desire.",
    category: ['Romance', 'Drama', 'Classics'],
    price: 19.99,
    stock: 50,
    inStock: true,
    imageURL: '/books/book1.png',
    coverImage: '/books/book1.png',
    rating: 4.5,
    voters: 3250,
    reads: '1.2M',
    salePercentage: 15,
    discount: 15,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 176,
    location: 'Japan',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '3',
    bookId: '3',
    isbn: '978-080-701-429-5',
    userId: '',
    title: "Man's Search For Meaning",
    author: "Viktor E. Frankl",
    publisher: 'Beacon Press',
    publicationDate: '1 June 2006',
    publishedDate: '1 June 2006',
    genre: 'Non-fiction / Psychology / Philosophy',
    language: 'English',
    format: 'Paperback',
    description: "A profound exploration of finding meaning in the face of unimaginable suffering.",
    category: ['Philosophy', 'Psychology', 'Memoir'],
    price: 21.99,
    stock: 75,
    inStock: true,
    imageURL: '/books/book2.png',
    coverImage: '/books/book2.png',
    rating: 4.7,
    voters: 14750,
    reads: '8.3M',
    salePercentage: 0,
    discount: 0,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 184,
    location: 'Austria',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '4',
    bookId: '4',
    isbn: '978-073-521-129-2',
    userId: '',
    title: "Where The Crawdads Sing",
    author: "Delia Owens",
    publisher: "G.P. Putnam's Sons",
    publicationDate: '14 August 2018',
    publishedDate: '14 August 2018',
    genre: 'Fiction / Mystery / Coming-of-age',
    language: 'English',
    format: 'Hardcover',
    description: "A beautifully written story of resilience, nature, and a young girl's journey.",
    category: ['Fiction', 'Mystery', 'Coming-of-age'],
    price: 18.50,
    stock: 60,
    inStock: true,
    imageURL: '/books/book4.png',
    coverImage: '/books/book4.png',
    rating: 4.3,
    voters: 8250,
    reads: '5.4M',
    salePercentage: 10,
    discount: 10,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 384,
    location: 'United States',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '5',
    bookId: '5',
    isbn: '978-073-521-910-6',
    userId: '',
    title: 'Atomic Habits',
    author: 'James Clear',
    publisher: 'Avery',
    publicationDate: '16 October 2018',
    publishedDate: '16 October 2018',
    genre: 'Non-fiction / Self-help / Productivity',
    language: 'English',
    format: 'Hardcover',
    description: "A practical guide to building good habits and breaking bad ones through small changes.",
    category: ['Self-help', 'Productivity', 'Psychology'],
    price: 22.99,
    stock: 80,
    inStock: true,
    imageURL: '/books/book5.png',
    coverImage: '/books/book5.png',
    rating: 4.8,
    voters: 20100,
    reads: '9.1M',
    salePercentage: 20,
    discount: 20,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 320,
    location: 'United States',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '6',
    bookId: '6',
    isbn: '978-602-033-295-6',
    userId: '',
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    publisher: 'Kepustakaan Populer Gramedia',
    publicationDate: '30 November 2017',
    publishedDate: '30 November 2017',
    genre: 'Fiksi / Sejarah / Politik',
    language: 'Indonesia',
    format: 'Paperback',
    description: "A moving historical fiction about activism and injustice in Indonesia's reform era.",
    category: ['Historical', 'Drama', 'Indonesia'],
    price: 17.50,
    stock: 45,
    inStock: true,
    imageURL: '/books/book6.png',
    coverImage: '/books/book6.png',
    rating: 4.6,
    voters: 4300,
    reads: '2.8M',
    salePercentage: 5,
    discount: 5,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 379,
    location: 'Indonesia',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '7',
    bookId: '7',
    isbn: '978-037-570-402-4',
    userId: '',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    publisher: 'Vintage',
    publicationDate: '4 September 2000',
    publishedDate: '4 September 2000',
    genre: 'Fiction / Romance / Psychological',
    language: 'English',
    format: 'Paperback',
    description: "A nostalgic tale of love, loss, and coming of age in 1960s Japan.",
    category: ['Romance', 'Drama', 'Psychological'],
    price: 18.99,
    stock: 55,
    inStock: true,
    imageURL: '/books/book7.png',
    coverImage: '/books/book7.png',
    rating: 4.4,
    voters: 11000,
    reads: '6.7M',
    salePercentage: 0,
    discount: 0,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 296,
    location: 'Japan',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '8',
    bookId: '8',
    isbn: '978-039-959-050-4',
    userId: '',
    title: 'Educated',
    author: 'Tara Westover',
    publisher: 'Random House',
    publicationDate: '20 February 2018',
    publishedDate: '20 February 2018',
    genre: 'Non-fiction / Memoir / Biography',
    language: 'English',
    format: 'Hardcover',
    description: "A memoir of a woman who transforms her life through education despite a challenging upbringing.",
    category: ['Memoir', 'Biography', 'Inspiring'],
    price: 20.00,
    stock: 65,
    inStock: true,
    imageURL: '/books/book8.png',
    coverImage: '/books/book8.png',
    rating: 4.7,
    voters: 12900,
    reads: '7.9M',
    salePercentage: 10,
    discount: 10,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 352,
    location: 'United States',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '9',
    bookId: '9',
    isbn: '978-602-031-278-1',
    userId: '',
    title: 'Pulang',
    author: 'Leila S. Chudori',
    publisher: 'Kepustakaan Populer Gramedia',
    publicationDate: '13 Mei 2012',
    publishedDate: '13 Mei 2012',
    genre: 'Fiksi / Sejarah / Sosial',
    language: 'Indonesia',
    format: 'Paperback',
    description: "A historical novel about a family facing political exile in Indonesia.",
    category: ['Historical', 'Drama', 'Indonesia'],
    price: 16.75,
    stock: 40,
    inStock: true,
    imageURL: '/books/book9.png',
    coverImage: '/books/book9.png',
    rating: 4.5,
    voters: 5000,
    reads: '3.5M',
    salePercentage: 5,
    discount: 5,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 464,
    location: 'Indonesia',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '10',
    bookId: '10',
    isbn: '978-006-231-500-7',
    userId: '',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    publisher: 'HarperOne',
    publicationDate: '1 April 1993',
    publishedDate: '1 April 1993',
    genre: 'Fiction / Inspirational',
    language: 'English',
    format: 'Paperback',
    description: "A magical story of a young shepherd's journey to find a hidden treasure, teaching lessons of purpose and destiny.",
    category: ['Fiction', 'Inspirational', 'Adventure'],
    price: 16.99,
    stock: 90,
    inStock: true,
    imageURL: '/books/book10.png',
    coverImage: '/books/book10.png',
    rating: 4.6,
    voters: 18000,
    reads: '10M',
    salePercentage: 0,
    discount: 0,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 208,
    location: 'Brazil',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '11',
    bookId: '11',
    isbn: '978-006-112-008-4',
    userId: '',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    publisher: 'J.B. Lippincott & Co.',
    publicationDate: '11 July 1960',
    publishedDate: '11 July 1960',
    genre: 'Fiction / Classics',
    language: 'English',
    format: 'Hardcover',
    description: "A powerful story of racial injustice and the loss of innocence in a small Southern town.",
    category: ['Fiction', 'Classics', 'Social Issues'],
    price: 14.99,
    stock: 70,
    inStock: true,
    imageURL: '/books/book11.png',
    coverImage: '/books/book11.png',
    rating: 4.8,
    voters: 22000,
    reads: '12M',
    salePercentage: 0,
    discount: 0,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 281,
    location: 'United States',
    isNewRelease: false,
    isComingSoon: false,
  },
  {
    id: '12',
    bookId: '12',
    isbn: '978-059-333-682-3',
    userId: '',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    publisher: 'Viking',
    publicationDate: '29 December 2025',
    publishedDate: '29 December 2025',
    genre: 'Fiction / Fantasy',
    language: 'English',
    format: 'Hardcover',
    description: "A woman discovers a magical library that allows her to explore the lives she could have lived.",
    category: ['Fiction', 'Fantasy', 'Self-discovery'],
    price: 24.99,
    stock: 0,
    inStock: false,
    imageURL: '/books/book12.png',
    coverImage: '/books/book12.png',
    rating: 0,
    voters: 0,
    reads: '0',
    salePercentage: 0,
    discount: 0,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: '29 December 2025',
    pages: 304,
    location: 'United Kingdom',
    isNewRelease: false,
    isComingSoon: true,
  },
  {
    id: '13',
    bookId: '13',
    isbn: '978-125-082-765-4',
    userId: '',
    title: 'The Future of Us',
    author: 'Naomi Alderman',
    publisher: 'Flatiron Books',
    publicationDate: '10 May 2025',
    publishedDate: '10 May 2025',
    genre: 'Fiction / Sci-Fi',
    language: 'English',
    format: 'Hardcover',
    description: "A speculative novel exploring the impact of technology on humanity's future.",
    category: ['Fiction', 'Sci-Fi', 'Technology'],
    price: 27.99,
    stock: 30,
    inStock: true,
    imageURL: '/books/book13.png',
    coverImage: '/books/book13.png',
    rating: 4.2,
    voters: 1500,
    reads: '500K',
    salePercentage: 10,
    discount: 10,
    discountStartDate: null,
    discountEndDate: null,
    arrivalDate: null,
    pages: 352,
    location: 'United Kingdom',
    isNewRelease: true,
    isComingSoon: false,
  },
];

// Define filtering functions
const getTopDeals = (): Book[] => {
  return books
    .filter((book) => book.salePercentage && book.salePercentage > 0)
    .sort((a, b) => (b.salePercentage || 0) - (a.salePercentage || 0))
    .slice(0, 6);
};

const getBestSellers = (): Book[] => {
  return [...books]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
};

const getNewArrivals = (): Book[] => {
  const today = new Date("2025-05-14T12:00:00+0545"); // Updated to current date and time
  return books
    .filter((book) => {
      const pubDate = new Date(book.publishedDate || "");
      const daysSincePub = (today.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSincePub <= 30 || book.isNewRelease;
    })
    .slice(0, 6);
};

const getNewReleases = (): Book[] => {
  return books
    .filter((book) => book.isNewRelease)
    .slice(0, 6);
};

const getComingSoon = (): Book[] => {
  return books
    .filter((book) => book.isComingSoon)
    .slice(0, 6);
};

// Render star ratings based on book's rating
const renderStars = (book: Book) => {
  const rating = book.rating || 0;
  const voters = book.voters || 0;
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-gray-400 ml-2 text-xs font-light">
        ({voters} {parseInt(voters.toString()) === 1 ? "voter" : "voters"})
      </span>
    </div>
  );
};

// HomeComponent with BookCard design
const HomeComponent: React.FC = () => {
  const [likedBooks, setLikedBooks] = useState<{ [key: string]: boolean }>({});

  // Mock wishlist toggle functionality
  const handleWishlistClick = (bookId: string) => {
    setLikedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  // Helper to render a section of books
  const renderSection = (title: string, sectionBooks: Book[]) => {
    if (sectionBooks.length === 0) {
      return (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="text-gray-600 p-4">No books available.</div>
        </section>
      );
    }

    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
          {sectionBooks.map((book) => {
            const isOutOfStock = !book.inStock;
            const bookId = book.bookId || book.id;

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
                    <div>
                      <img
                        src={book.imageURL}
                        alt={book.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {book.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {(book.discount).toFixed(0)}% OFF
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="absolute top-12 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-2/3 pl-8 flex flex-col p-4">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-xl font-bold line-clamp-1">
                        {book.title}
                      </h1>
                      <p className="text-lg text-gray-600">By {book.author}</p>
                      <div className="mt-2">{renderStars(book)}</div>
                      <p className="text-xs text-gray-400 line-clamp-3 mt-2">
                        {book.description || "No description available."}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      {!isOutOfStock ? (
                        <button
                          className="mt-2 w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors bg-orange-400 text-white hover:bg-orange-500"
                          aria-label="Add to Cart"
                        >
                          <span>Add to Cart</span>
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
                        aria-label={
                          likedBooks[bookId]
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                      >
                        {likedBooks[bookId] ? (
                          <svg
                            className="w-6 h-6 text-orange-400 transition-colors"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-gray-400 hover:text-orange-400 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            />
                          </svg>
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
      {renderSection("Top Deals", getTopDeals())}
      {renderSection("Best Sellers", getBestSellers())}
      {renderSection("New Arrivals", getNewArrivals())}
      {renderSection("New Releases", getNewReleases())}
      {renderSection("Coming Soon", getComingSoon())}
    </div>
  );
};

export default HomeComponent;