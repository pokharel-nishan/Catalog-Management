import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { books } from '../../data/book';
import BookCard from '../../components/BookCards';

const BooksPage: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  
  const genres = ['All Genres', 'Business', 'Science', 'Fiction', 'Philosophy', 'Biography'];
  const recommendations = ['Artist of the Month', 'Book of the Year', 'Top Genre', 'Trending'];

  const filteredBooks = selectedGenre === 'All Genres' 
    ? books 
    : books.filter(book => book.category?.includes(selectedGenre));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Book by Genre</h2>
            <ul className="space-y-2">
              {genres.map(genre => (
                <li key={genre}>
                  <button
                    className={`w-full text-left py-2 px-4 rounded ${
                      selectedGenre === genre ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">Recommendations</h2>
            <ul className="space-y-2">
              {recommendations.map(rec => (
                <li key={rec}>
                  <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100">
                    {rec}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Type the name of book or author..."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">&lt;</button>
            <button className="px-3 py-1 rounded bg-blue-500 text-white">1</button>
            <button className="px-3 py-1 rounded hover:bg-gray-200">2</button>
            <button className="px-3 py-1 rounded hover:bg-gray-200">3</button>
            <span>...</span>
            <button className="px-3 py-1 rounded hover:bg-gray-200">10</button>
            <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;