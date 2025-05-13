import React, { useState, useEffect } from "react";
import BookCard from "./BookCards";
import apiClient from "../../../api/config";
import type { Book } from "../../../types/book";

interface BookSectionProps {
  title: string;
}

const BookSection: React.FC<BookSectionProps> = ({ title }) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apiClient.get("/Book", {
          params: { PageSize: 3, PageNumber: 1 },
        });
        console.log("BookSection API Response:", response.data);
        const fetchedBooks = response.data.items.map((item: any) => ({
          id: item.bookId,
          bookId: item.bookId,
          isbn: item.isbn || "",
          userId: item.userId || "",
          title: item.title || "Untitled",
          author: item.author || "Unknown Author",
          publisher: item.publisher || "Unknown Publisher",
          publicationDate: item.publicationDate || "",
          genre: item.genre || "",
          language: item.language || "",
          format: item.format || "",
          description: item.description || "No description available.",
          price: item.price || 0,
          stock: item.inStock ? 1 : 0,
          inStock: item.inStock || false,
          imageURL: item.imageURL || "/default-image.png",
          discount: item.discount || 0,
          discountStartDate: item.discountStartDate || null,
          discountEndDate: item.discountEndDate || null,
          arrivalDate: item.arrivalDate || null,
          rating: item.rating || 0,
          voters: item.voters || "N/A",
          pages: item.pages || 0,
          location: item.location || "N/A",
          reads: item.reads || "0",
          salePercentage: item.salePercentage || 0,
          isNewRelease: item.isNewRelease || false,
          isComingSoon: item.isComingSoon || false,
          category: item.category || [],
          publishedDate: item.publishedDate || item.publicationDate || "",
          coverImage: item.coverImage || item.imageURL || "/default-image.png",
        }));
        console.log("Mapped books in BookSection:", fetchedBooks);
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Failed to fetch books in BookSection:", error);
        setBooks([]);
      }
    };
    fetchBooks();
  }, []);

  return (
    <section className="mt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-6 text-gray-800">{title}</h2>
        <div>
          {books.length > 0 ? (
            <BookCard books={books} />
          ) : (
            <p className="text-gray-600">No books available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookSection;