import React from 'react';
import type { Book } from '../types/book';
import BookCard from './BookCards';

interface BookSectionProps {
  title: string;
  books: Book[];
}

const BookSection: React.FC<BookSectionProps> = ({ title, books }) => {
  return (
    <section className="mt-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection;