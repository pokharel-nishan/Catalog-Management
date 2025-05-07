import React from 'react';
import BookCard from './BookCards';
import type { Book } from '../../../types/book';

interface BookSectionProps {
  title: string;
  books: Book[];
}

const BookSection: React.FC<BookSectionProps> = ({ title, books }) => {
  return (
    <section className="mt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection;