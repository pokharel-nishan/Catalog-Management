import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { books } from '../../../data/book';

const BookDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find(b => b.id === id) || books[0];

  const handleBuyNow = () => {
    toast.success('Processing your order...');
    setTimeout(() => {
      navigate('/success');
    }, 1500);
  };

  const handleAddToCart = () => {
    toast.success('Added to cart!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Book Cover */}
        <div className="md:w-1/3">
          <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Add To Cart
            </button>
          </div>
        </div>

        {/* Book Details */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">By {book.author}</p>
          
          <div className="flex items-center mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={`${
                    i < Math.floor(book.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {book.rating} ({Math.floor(Math.random() * 1000)} reviews)
            </span>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-700 mb-6">{book.description}</p>

            <h2 className="text-2xl font-bold mb-4">Category</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {book.category?.map(cat => (
                <span key={cat} className="px-4 py-2 bg-gray-100 rounded-full">
                  {cat}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Author</h3>
                <p className="text-gray-600">{book.author}</p>
              </div>
              <div>
                <h3 className="font-semibold">Published In</h3>
                <p className="text-gray-600">2023</p>
              </div>
              <div>
                <h3 className="font-semibold">Genre</h3>
                <p className="text-gray-600">{book.category?.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-semibold">Total Pages</h3>
                <p className="text-gray-600">210</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => toast.success('Comments loaded!')}
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