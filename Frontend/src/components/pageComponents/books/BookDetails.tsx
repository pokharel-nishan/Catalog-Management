import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { books } from '../../../data/book';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Fallback to first book if ID not found
  const book = books.find(b => b.id === id) || books[0];

  const handleBuyNow = () => {
    setIsLoading(true);
    toast.success('Processing your order...');
    setTimeout(() => {
      setIsLoading(false);
      navigate('/success');
    }, 1500);
  };

  const handleAddToCart = () => {
    toast.success('Added to cart!');
  };
  
  const handleSeeComment = () => {
    toast.success('Comments loaded!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Book Cover */}
        <div className="md:w-1/3">
          <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-white">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <button
              onClick={handleBuyNow}
              disabled={isLoading}
              className="w-full py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              {isLoading ? 'Processing...' : 'Buy Now'}
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full py-3 border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Add To Cart
            </button>
          </div>
        </div>

        {/* Book Details */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-2">By {book.author}</p>
          
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.floor(book.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-8">
            <span className="text-gray-600">{book.author}</span>
            <span className="text-gray-600">{book.voters}</span>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700">{book.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Category</h2>
              <div className="flex flex-wrap gap-2">
                {book.category?.map(cat => (
                  <span key={cat} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    {cat}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <h3 className="font-semibold text-gray-600">Author</h3>
                  <p>{book.author}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Published In</h3>
                  <p>{book.publishedDate}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Genre</h3>
                  <p>{book.genre}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Total Pages</h3>
                  <p>{book.pages}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Location</h3>
                  <p>{book.location}</p>
                </div>
              </div>
            </section>
          </div>

          <button
            onClick={handleSeeComment}
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