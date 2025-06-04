import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../../context/AuthContext';
import apiClient from '../../../../api/config';
import { Book } from 'lucide-react';

interface BookType {
  id: string;
  title: string;
  author: string;
  imageURL: string;
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
  items: BookType[];
  subtotal: number;
  discount: number; // Percentage
  discountAmount: number; // Monetary amount
  total: number;
}

interface AuthUser {
  email: string;
  id: string;
  name?: string;
  lastName?: string;
}

const TABS = ["All", "Pending", "Ongoing", "Completed", "Cancelled"] as const;
type TabType = typeof TABS[number];

const STATE_MAP: Record<TabType, string | null> = {
  All: null,
  Pending: "Pending",
  Ongoing: "Ongoing",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

const noOrdersData = {
  All: {
    image: "/noorders.png",
    message: "You have not placed any orders yet.",
  },
  Pending: {
    image: "/noorders.png",
    message: "There are currently no pending orders.",
  },
  Ongoing: {
    image: "/noorders.png",
    message: "There are currently no orders ready for pickup.",
  },
  Completed: {
    image: "/noorder.png",
    message: "No orders have been Completed yet.",
  },
  Cancelled: {
    image: "/noorders.png",
    message: "There are no cancelled orders.",
  },
};

const MyOrders: React.FC = () => {
  const { user, logout } = useAuth() as { user: AuthUser; logout: () => void };
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<OrderType | "not_found" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user orders on component mount
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user?.id) {
        toast.error("Please log in to view your order history.");
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await apiClient.get(`/Order/user-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response for /Order/user-orders:", response.data);

        if (response.data.success) {
          const fetchedOrders = response.data.orders.map((order: any) => {
            const items = Array.isArray(order.items)
              ? order.items.map((item: any) => {
                  console.log(`Item imageUrl for ${item.title || 'Untitled'}:`, item.imageUrl); // Debug log
                  return {
                    id: item.bookId || "unknown",
                    title: item.title || "Untitled",
                    author: item.author || "Unknown Author",
                    imageURL: item.imageURl || "",
                    price: item.unitPrice || (item.subtotal / (item.quantity || 1)) || 0,
                    quantity: item.quantity || 1,
                    discount: item.discount || 0,
                  };
                })
              : [];
            return {
              id: order.orderId || "N/A",
              code: order.claimCode || order.orderId || "N/A",
              trackingId: order.orderId || "N/A",
              orderDate: order.orderDate || new Date().toISOString(),
              customer: {
                firstName: user.name || "Unknown",
                lastName: user.lastName || "User",
                email: user.email || "N/A",
              },
              status: order.status || "Pending",
              items,
              subtotal: order.subTotal || order.subtotal || 0,
              discount: order.discount || 0,
              discountAmount: (order.subTotal - order.totalPrice) || 0,
              total: order.totalPrice || 0,
            };
          });
          console.log("Mapped orders:", fetchedOrders); // Debug log
          setOrders(fetchedOrders);
        } else {
          throw new Error(response.data.message || "Failed to fetch orders");
        }
      } catch (error: any) {
        console.error('Failed to fetch orders:', error);
        toast.error(error.message || 'Failed to load order history.');
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          logout();
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserOrders();
  }, [user?.id, navigate, logout]);

  const handleSearch = async () => {
    if (!user?.id || !searchQuery.trim()) {
      toast.error("Please enter a valid order ID to track.");
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await apiClient.get(`/Order/${searchQuery.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response for /Order/{orderId}:", response.data);

      if (response.data.success) {
        const order = response.data.order || {};
        const items = Array.isArray(order.items)
          ? order.items.map((item: any) => {
              console.log(`Searched item imageUrl for ${item.title || 'Untitled'}:`, item.imageUrl); // Debug log
              return {
                id: item.bookId || item.id || "unknown",
                title: item.title || item.bookTitle || "Untitled",
                author: item.author || "Unknown Author",
                imageURL: item.imageURl || "",
                price: item.unitPrice || (item.subtotal / (item.quantity || 1)) || 0,
                quantity: item.quantity || 1,
                discount: item.discount || 0,
              };
            })
          : [];
        const detailedOrder: OrderType = {
          id: order.orderId || searchQuery.trim(),
          code: order.claimCode || order.orderId || "N/A",
          trackingId: order.orderId || "N/A",
          orderDate: order.orderDate || new Date().toISOString(),
          customer: order.customer || {
            firstName: user.name || "Unknown",
            lastName: user.lastName || "User",
            email: user.email || "N/A",
          },
          status: order.status || "Pending",
          items,
          subtotal: order.subTotal || order.subtotal || 0,
          discount: order.discount || 0,
          discountAmount: (order.subTotal - order.totalPrice) || 0,
          total: order.totalPrice || 0,
        };
        setSearchResult(detailedOrder);
      } else {
        setSearchResult("not_found");
        toast.error("Order not found.");
      }
    } catch (error: any) {
      console.error("Failed to search order:", error);
      setSearchResult("not_found");
      toast.error(error.response?.data?.message || "Order not found or invalid ID.");
    }
  };

  const filteredOrders = (): OrderType[] => {
    const stateFilter = STATE_MAP[activeTab];
    if (!stateFilter) return orders;
    return orders.filter((order) => order.status === stateFilter);
  };

  const renderOrders = (orders: OrderType[]) => {
    if (isLoading) {
      return <div className="text-center py-12">Loading your order history...</div>;
    }

    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center mt-20">
          <img
            src={noOrdersData[activeTab].image}
            alt={`No orders in ${activeTab} tab`}
            className="w-52 h-52 lg:w-96 lg:h-96 object-contain"
          />
          <h2 className="text-gray-500 mt-2 text-sm lg:text-base">
            {noOrdersData[activeTab].message}
          </h2>
          <Link
            to="/books"
            className="mt-6 inline-flex justify-center py-2 px-4 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors text-sm lg:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      );
    }

    return orders.map((order) => (
      <div
        key={order.id}
        className="p-4 mt-4 bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b pb-4">
          <div>
            <h3
              className={`font-bold text-sm lg:text-base ${
                order.status === "Completed"
                  ? "text-green-600"
                  : order.status === "Cancelled"
                  ? "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {order.status} ·{" "}
              <span className="text-black">Order ID #{order.id}</span>
            </h3>
            <div className="flex flex-col lg:flex-row lg:space-x-8 text-xs lg:text-sm text-gray-500 mt-2">
              {order.orderDate && (
                <p>
                  Placed on:{" "}
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
              {order.status === "Completed" && order.orderDate && (
                <p>
                  Completed on:{" "}
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
              {order.status === "Cancelled" && order.orderDate && (
                <p>
                  Cancelled on:{" "}
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
          <div className="text-blue-600 font-bold text-lg lg:text-xl mt-2 lg:mt-0">
            Rs. {order.total.toFixed(2)}
          </div>
        </div>
        <div className="mt-4">
          {order.items.map((item, index) => {
            const discountedPrice =
              item.discount && item.discount > 0
                ? item.price * (1 - item.discount)
                : item.price;
            const totalPrice = discountedPrice * item.quantity;

            return (
              <div key={index} className="flex flex-row justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                    {item.imageURL ? (
                      <img
                        src={`http://localhost:5213${item.imageURL}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log(`Failed to load image for ${item.title}:`, item.imageURL);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ display: item.imageURL ? 'none' : 'flex' }}
                    >
                      <Book size={24} className="text-gray-400" />
                    </div>
                  </div>
                  <span className="text-primary text-sm lg:text-base">
                    {item.title}
                  </span>
                </div>
                <div className="flex flex-row space-x-4 lg:space-x-8 text-xs lg:text-sm mt-2 lg:mt-0">
                  <span>x{item.quantity}</span>
                  <span>
                    {item.discount && item.discount > 0 ? (
                      <>
                        <span className="text-orange-500">
                          Rs. {discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-500 line-through ml-2">
                          Rs. {item.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span>Rs. {item.price.toFixed(2)}</span>
                    )}
                  </span>
                  <span>Rs. {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>Rs. {order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Discount</span>
            <span className="text-green-600">
              {(order.discount * 100).toFixed(0)}%{" "}
              <span className="text-red-400">(+ book discount)</span>
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Discount Amount</span>
            <span className="text-green-600">
              - Rs. {order.discountAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-base mt-4">
            <span>Total</span>
            <span>Rs. {order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-6">Your Order History</h2>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="flex flex-wrap space-x-2 lg:space-x-4 mb-4 lg:mb-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`${
                  activeTab === tab
                    ? "border border-orange-600 text-orange-600"
                    : "text-primary"
                } font-medium py-2 px-4 rounded-md text-sm lg:text-base hover:bg-orange-600 hover:text-white`}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchResult(null);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tracking order id"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm lg:text-base focus:outline-none focus:ring-primary focus:border-primary w-full lg:w-auto"
            />
            <button
              className="py-2 px-4 bg-primary text-white font-medium rounded-md text-sm lg:text-base"
              onClick={handleSearch}
            >
              Track
            </button>
          </div>
        </div>

        {searchResult === "not_found" ? (
          <div className="flex flex-col items-center mt-20">
            <img
              src="/noresults.png"
              alt="No order found"
              className="w-32 h-32 lg:w-96 lg:h-96 object-cover"
            />
            <h2 className="text-lg lg:text-xl font-semibold mt-6 text-red-600">
              #{searchQuery}
            </h2>
            <p className="text-gray-500 mt-2 text-sm lg:text-base">
              No result found for this order id.
            </p>
            <Link
              to="/books"
              className="mt-6 inline-flex justify-center py-2 px-4 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors text-sm lg:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        ) : searchResult ? (
          renderOrders([searchResult])
        ) : (
          renderOrders(filteredOrders())
        )}
      </section>
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
};

export default MyOrders;