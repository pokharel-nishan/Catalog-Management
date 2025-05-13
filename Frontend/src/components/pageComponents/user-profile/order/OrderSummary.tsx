import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Book,
  ShoppingBag,
  Truck,
  ArrowLeft,
  Printer,
  MailIcon,
  PhoneIcon,
} from "lucide-react";

interface BookType {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
}

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

interface OrderType {
  id: string;
  code: string;
  trackingId: string;
  orderDate: string;
  customer: Customer;
  status: string;
  orderedBooks: BookType[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
}

export const order: OrderType = {
  id: "ORD-12345",
  code: "INV-78945",
  trackingId: "TRK-98765432",
  orderDate: "2025-05-05T14:32:11",
  customer: {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
  },
  status: "Processing",
  orderedBooks: [
    {
      id: "1",
      title: "Garis Waktu",
      author: "Fiersa Besari",
      coverImage: "/books/book3.png",
      price: 15.99,
      quantity: 1,
    },
    {
      id: "5",
      title: "Atomic Habits",
      author: "James Clear",
      coverImage: "/books/book5.png",
      price: 22.99,
      quantity: 2,
    },
    {
      id: "8",
      title: "Educated",
      author: "Tara Westover",
      coverImage: "/books/book8.png",
      price: 20.0,
      quantity: 1,
    },
    {
      id: "2",
      title: "The Frolic of the Beasts",
      author: "Yukito Mishima",
      coverImage: "/books/book1.png",
      price: 19.99,
      quantity: 1,
    },
  ],
  subtotal: 101.96,
  discount: 10.2,
  shippingCost: 8.4,
  tax: 5.1,
  total: 105.26,
};

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const BookItem: React.FC<{ book: BookType }> = ({ book }) => (
  <div className="flex items-center gap-4 border-b pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0 transition-all hover:bg-gray-50 p-2 rounded">
    <div className="w-16 h-24 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
      {book.coverImage ? (
        <img
          src={`http://localhost:5213${book.coverImage}`}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Book size={24} className="text-gray-400" />
        </div>
      )}
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-gray-800">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.author}</p>
      <div className="flex justify-between mt-2">
        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
          Qty: {book.quantity}
        </span>
        <span className="font-medium">
          Rs {(book.price * book.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/success");
  };

  const handleContinueShopping = () => {
    navigate("/books");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag size={18} className="text-blue-600" />
                  <h2 className="text-xl font-semibold">Order #{order.code}</h2>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="flex items-center gap-4 mb-6 bg-blue-50 p-4 rounded-lg">
              <Truck size={20} className="text-blue-700" />
              <div>
                <p className="text-blue-700 font-medium">Tracking Number</p>
                <p className="text-sm font-mono bg-white px-2 py-1 rounded mt-1">
                  {order.trackingId}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                <ShoppingBag size={16} className="text-blue-600" />
                <span>Your Items</span>
              </h3>
              <div className="space-y-2">
                {order.orderedBooks.map((book) => (
                  <BookItem key={book.id} book={book} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-96">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
              Order Summary
            </h2>
            <div className="space-y-3">
              {order.orderedBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{book.title}</span>
                    <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      x{book.quantity}
                    </span>
                  </div>
                  <span>Rs {(book.price * book.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">
                  - Rs {order.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Cost</span>
                <span>Rs {order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax amount</span>
                <span>Rs {order.tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>Rs {order.total.toFixed(2)}</span>
            </div>

            <div className="mt-8 relative">
              <input
                type="text"
                placeholder="Discount coupon"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded font-medium hover:bg-blue-700 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 order-2 md:order-1">
          <button
            className="flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleContinueShopping}
          >
            <ArrowLeft size={16} className="text-gray-500" />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="w-full md:w-auto order-1 md:order-2">
          <button
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            onClick={handleCheckout}
          >
            <ShoppingBag size={18} />
            <span>Complete Checkout</span>
          </button>
        </div>
      </div>

      <div className="mt-4 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-2">Need Help?</h2>
        <p className="text-gray-600 mb-4">
          If you have any questions about your order, please contact our
          customer support team.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:support@example.com"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <MailIcon size={16} />
            <span>support@example.com</span>
          </a>
          <a
            href="tel:+1234567890"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <PhoneIcon size={16} />
            <span>+1 (234) 567-890</span>
          </a>
        </div>
      </div>
    </div>
  );
};

const OrderConfirmationPage: React.FC = () => (
  <div className="bg-gray-50 min-h-screen py-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <Printer size={18} />
          <span>Print Order</span>
        </button>
      </div>

      <OrderConfirmation />
    </div>
  </div>
);

export default OrderConfirmationPage;
