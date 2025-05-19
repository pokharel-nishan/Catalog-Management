import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Book,
  ShoppingBag,
  Truck,
  Printer,
  MailIcon,
  PhoneIcon,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";
import apiClient from "../../../../api/config";

interface BookType {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
  discount?: number;
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
  total: number;
}

interface AuthUser {
  email: string;
  id: string;
  name?: string;
  lastName?: string;
}

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
      case "ongoing":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
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
      <p className="text-sm text-gray-600">{book.author || "Unknown Author"}</p>
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
  const location = useLocation();
  const { user, logout } = useAuth() as { user: AuthUser; logout: () => void };
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order data provided.");
        setLoading(false);
        return;
      }

      if (!user) {
        setError("Please log in to view your order.");
        navigate("/login");
        return;
      }

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await apiClient.get(`/Order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Response from /Order/{orderId}:", response.data); // Debug: Log response

        if (response.data.success) {
          const fetchedOrder = response.data.order || {};
          const transformedOrder: OrderType = {
            id: fetchedOrder.orderId || orderId,
            code: fetchedOrder.claimCode || "N/A",
            trackingId: fetchedOrder.trackingId || "N/A",
            orderDate: fetchedOrder.orderDate || new Date().toISOString(),
            customer: fetchedOrder.customer || { firstName: "Unknown", lastName: "User", email: "N/A" },
            status: fetchedOrder.status || "Pending",
            orderedBooks: Array.isArray(fetchedOrder.items)
              ? fetchedOrder.items.map((item: any) => ({
                  id: item.bookId || item.id || "unknown",
                  title: item.title || item.bookTitle || "Untitled",
                  author: item.author || "Unknown Author",
                  coverImage: item.imageUrl,
                  price: item.price || item.unitPrice || 0,
                  quantity: item.quantity || 1,
                  discount: item.discount || 0,
                }))
              : [],
            subtotal: fetchedOrder.subtotal || fetchedOrder.totalPrice || 0,
            discount: fetchedOrder.discount || 0,
            total: fetchedOrder.total || fetchedOrder.totalPrice || 0,
          };
          setOrder(transformedOrder);
        } else {
          throw new Error(response.data.message || "Failed to fetch order");
        }
      } catch (error: any) {
        console.error("Failed to fetch order:", error);
        setError(error.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  const handleCheckout = async () => {
    if (!order) return;
  
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
        return;
      }
  
      const response = await apiClient.post(
        `/Order/confirm-order/${order.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        const updatedOrder: OrderType = { ...order, status: "Ongoing" };
        setOrder(updatedOrder);
        toast.success("Order confirmed successfully!");
        setIsConfirmed(true);
        navigate("/success", { state: { order: updatedOrder } }); // Redirect to /success with order details
      } else {
        throw new Error(response.data.message || "Failed to confirm order");
      }
    } catch (error: any) {
      console.error("Failed to confirm order:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        toast.error("Failed to confirm order. Please try again!");
      }
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
        return;
      }

      const response = await apiClient.post(
        `/Order/cancel-order/${order.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedOrder: OrderType = { ...order, status: "Cancelled" };
        setOrder(updatedOrder);
        toast.success("Order cancelled successfully!");
        navigate("/books"); // Navigate to /books after cancellation
      } else {
        throw new Error(response.data.message || "Failed to cancel order");
      }
    } catch (error: any) {
      console.error("Failed to cancel order:", error);
      toast.error("Failed to cancel order. Please try again!");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  if (error || !order) {
    return <div className="text-center py-8 text-red-600">{error || "Order not found."}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Order Confirmation</h1>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <Printer size={18} />
            <span>Print Order</span>
          </button>
        </div>

        {isConfirmed && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Your order has been successfully placed!</span>
          </div>
        )}

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
                  {order.orderedBooks && order.orderedBooks.length > 0 ? (
                    <div className="space-y-2">
                      {order.orderedBooks.map((book) => (
                        <BookItem key={book.id} book={book} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No items found in this order.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-96">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  {order.orderedBooks && order.orderedBooks.length > 0 ? (
                    order.orderedBooks.map((book) => (
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
                    ))
                  ) : (
                    <p className="text-gray-500">No items to display.</p>
                  )}
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
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rs {order.total.toFixed(2)}</span>
                </div>

                {!isConfirmed && (
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
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 order-2 md:order-1">
              {!isConfirmed && (
                <button
                  className="flex items-center justify-center gap-2 border border-red-300 bg-white text-red-700 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors"
                  onClick={handleCancelOrder}
                >
                  <X size={16} className="text-red-500" />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>

            {!isConfirmed && (
              <div className="w-full md:w-auto order-1 md:order-2">
                <button
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                  onClick={handleCheckout}
                >
                  <ShoppingBag size={18} />
                  <span>Complete Checkout</span>
                </button>
              </div>
            )}
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
      </div>
    </div>
  );
};

export default OrderConfirmation;