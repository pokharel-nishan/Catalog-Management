import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Truck } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="w-8 h-8 text-yellow-500" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
        Thank you for your order!
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        Check your e-mail inbox for the receipt
      </p>

      {/* Button Group */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate('/books')}
          className="flex items-center justify-center gap-2 bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors"
        >
          <ShoppingCart size={20} />
          Continue Shopping
        </button>

        <button
          className="flex items-center justify-center gap-2 border border-blue-600 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          onClick={() => navigate('/my-orders')}
        >
          <Truck size={20} className="text-blue-600" />
          Track Order
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
