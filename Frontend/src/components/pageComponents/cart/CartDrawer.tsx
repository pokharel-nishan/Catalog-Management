import React from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const CartDrawer: React.FC = () => {
  const { items, removeFromCart, updateQuantity, total, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/success');
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} />
              <h2 className="text-lg font-semibold">Your Cart</h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="h-24 w-16 rounded object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">Rs {item.price}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="rounded-full p-1 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded-full p-1 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start rounded-full p-1 hover:bg-gray-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
              <div className="mb-4 flex justify-between text-sm text-gray-500">
                <span>Shipping Cost</span>
                <span>Rs 50.00</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 hover:bg-gray-50"
                >
                  Shop more
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer