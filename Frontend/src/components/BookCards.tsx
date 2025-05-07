import React from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../types/book';
import StarRating from '../assets/common/Ratings';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link to={`/books/${book.id}`}>
      <div className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:-translate-y-1">
        {/* Sale Tag */}
        {book.salePercentage && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {book.salePercentage}% OFF
          </div>
        )}

        {/* Book Cover */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-200 shadow-md transition-transform duration-300 group-hover:shadow-lg">
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Book Info */}
        <div className="mt-3">
          <h3 className="font-medium text-gray-900 line-clamp-1">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>
          <div className="mt-1">
            <StarRating rating={book.rating} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;