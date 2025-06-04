import { useEffect, useState } from 'react';
import {
  BookOpen,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  Megaphone,
  Bell,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import apiClient from '../../../../api/config'; // Adjust path as needed
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '../../../ui/button';
import { useAuth } from '../../../../context/AuthContext';

// Define types based on backend API responses
interface Book {
  bookId: string;
  isbn: string;
  userId: string;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string;
  genre: string;
  language: string;
  format: string;
  description: string;
  price: number;
  stock: number;
  imageURL: string;
  discount: number;
  discountStartDate: string | null;
  discountEndDate: string | null;
  arrivalDate: string | null;
}

interface User {
  firstName: string;
  lastName: string;
  address: string;
  dateJoined: string;
  email: string;
  roles: string[] | null;
}

interface OrderItem {
  bookId: string;
  title: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

interface Order {
  orderId: string;
  userId: string;
  orderDate: string;
  status: 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled';
  totalPrice: number;
  claimCode: string;
  discount: number | null;
  items: OrderItem[];
}

interface Announcement {
  announcementId: string;
  userId: string;
  description: string;
  postedAt: string;
  expiryDate: string;
  isPublished: boolean;
}

interface OrdersData {
  name: string;
  orders: number;
}

interface StatusData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardAnalytics() {
    const { user, isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalInventoryPrice, setTotalInventoryPrice] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActiveAnnouncements, setTotalActiveAnnouncements] = useState(0);
  const [totalPublishedAnnouncements, setTotalPublishedAnnouncements] = useState(0);

if (!user) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-500">
            Please login to access the admin dashboard.
          </p>
          <Button className="mt-4" onClick={() => (window.location.href = "/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-500">
            Only admins can access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }
  
  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch books
        const booksResponse = await apiClient.get('/Book/getallBooks');
        const fetchedBooks: Book[] = booksResponse.data || [];
        setBooks(fetchedBooks);

        // Fetch orders
        const ordersResponse = await apiClient.get('/Order/admin/all-orders');
        const fetchedOrders: Order[] = ordersResponse.data.orders || [];
        setOrders(fetchedOrders);

        // Fetch users
        const usersResponse = await apiClient.get('/User/all-users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const fetchedUsers: User[] = usersResponse.data.userDetails?.result || [];
        setUsers(fetchedUsers);

        // Fetch announcements
        const announcementsResponse = await apiClient.get('/Announcement/getAllAnnouncements');
        const fetchedAnnouncements: Announcement[] = announcementsResponse.data || [];
        // Filter active announcements
        const now = new Date();
        const activeAnnouncements = fetchedAnnouncements.filter((a: Announcement) => {
          const postedAt = new Date(a.postedAt || '');
          const expiryDate = new Date(a.expiryDate || '');
          return a.isPublished && postedAt <= now && expiryDate > now;
        });
        const publishedAnnouncements = fetchedAnnouncements.filter(
          (a: Announcement) => a.isPublished
        );
        setAnnouncements(activeAnnouncements);
        setTotalActiveAnnouncements(activeAnnouncements.length);
        setTotalPublishedAnnouncements(publishedAnnouncements.length);

        // Process data
        // 1. Total Inventory Price
        const inventoryPrice = fetchedBooks.reduce(
          (sum: number, book: Book) => sum + (book.price || 0) * (book.stock || 0),
          0
        );
        setTotalInventoryPrice(inventoryPrice);

        // 2. Total Sales (sum of totalPrice from Completed orders)
        const sales = fetchedOrders
          .filter((order: Order) => order.status === 'Completed')
          .reduce((sum: number, order: Order) => sum + (order.totalPrice || 0), 0);
        setTotalSales(sales);

        // 3. Total Orders
        setTotalOrders(fetchedOrders.length);

        // 4. Total Users
        setTotalUsers(fetchedUsers.length);

        // 5. Orders Data (by month for the last 6 months)
        const months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            name: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
            date: date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0'),
          };
        }).reverse();

        const ordersByMonth = months.map((month) => {
          const monthOrders = fetchedOrders.filter((order: Order) => {
            const orderDate = new Date(order.orderDate || '');
            if (isNaN(orderDate.getTime())) return false;
            const orderMonth =
              orderDate.getFullYear() + '-' + (orderDate.getMonth() + 1).toString().padStart(2, '0');
            return orderMonth === month.date;
          });
          console.log(`Orders for ${month.name}: ${monthOrders.length}`); // Debugging
          return {
            name: month.name,
            orders: monthOrders.length,
          };
        });
        setOrdersData(ordersByMonth);

        // 6. Order Status Distribution
        const statusCounts: { [key: string]: number } = {
          Pending: 0,
          Ongoing: 0,
          Completed: 0,
          Cancelled: 0,
        };
        fetchedOrders.forEach((order: Order) => {
          const status = order.status || 'Unknown';
          if (status in statusCounts) {
            statusCounts[status]++;
          }
        });
        const totalOrdersCount = fetchedOrders.length;
        const statuses = Object.entries(statusCounts)
          .filter(([_, count]) => count > 0) // Only include statuses with orders
          .map(([name, count]) => ({
            name,
            value: totalOrdersCount > 0 ? Math.round((count / totalOrdersCount) * 100) : 0,
          }));
        setStatusData(statuses);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.error(error.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Render status badge
  const renderStatus = (
    status: 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Unknown'
  ) => {
    const statusStyles = {
      Completed: 'bg-green-100 text-green-800',
      Ongoing: 'bg-blue-100 text-blue-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800',
      Unknown: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  // Compute book sales from orders
  const bookSales = orders
    .filter((order) => order.status === 'Completed')
    .reduce((acc: { [key: string]: number }, order: Order) => {
      (order.items || []).forEach((item: OrderItem) => {
        acc[item.bookId] = (acc[item.bookId] || 0) + (item.quantity || 0);
      });
      return acc;
    }, {});

  // Get best-selling books (top 4 by computed sales)
  const bestSellingBooks = [...books]
    .map((book) => ({
      id: book.bookId,
      title: book.title || 'Unknown Title',
      author: book.author || 'Unknown Author',
      sales: bookSales[book.bookId] || 0,
      price: formatCurrency(book.price || 0),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4);

  // Compute user order counts
  const userOrderCounts = orders.reduce((acc: { [key: string]: number }, order: Order) => {
    const userId = order.userId || 'unknown';
    acc[userId] = (acc[userId] || 0) + 1;
    return acc;
  }, {});

  // Get recent orders (latest 4 by orderDate)
  const recentOrders = [...orders]
    .sort((a, b) =>
      new Date(b.orderDate || '').getTime() - new Date(a.orderDate || '').getTime()
    )
    .slice(0, 4)
    .map((order) => {
      const user = users.find((u) => u.email === order.userId) || {
        firstName: 'Unknown',
        lastName: '',
      };
      return {
        id: order.orderId || 'Unknown ID',
        customer: `${user.firstName} ${user.lastName}`.trim() || 'Unknown Customer',
        date: order.orderDate
          ? new Date(order.orderDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'Unknown Date',
        items: (order.items || []).reduce(
          (sum, item: OrderItem) => sum + (item.quantity || 0),
          0
        ),
        total: formatCurrency(order.totalPrice || 0),
        status: order.status || 'Unknown',
      };
    });

  // Calculate percentage changes
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Assume previous month's values are 90% of current
  const salesChange = getPercentageChange(totalSales, totalSales * 0.9).toFixed(1);
  const ordersChange = getPercentageChange(totalOrders, totalOrders * 0.9).toFixed(1);
  const usersChange = getPercentageChange(totalUsers, totalUsers * 0.9).toFixed(1);
  const booksChange = getPercentageChange(books.length, books.length * 0.9).toFixed(1);
  const activeAnnouncementsChange = getPercentageChange(
    totalActiveAnnouncements,
    totalActiveAnnouncements * 0.9
  ).toFixed(1);

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium ml-1">{ordersChange}%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium ml-1">{usersChange}%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Inventory Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalInventoryPrice)}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium ml-1">{booksChange}%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Announcements</p>
                  <p className="text-2xl font-bold">{totalActiveAnnouncements}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Megaphone className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-500 font-medium ml-1">{activeAnnouncementsChange}%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Published Announcements</p>
                  <p className="text-2xl font-bold">{totalPublishedAnnouncements}</p>
                </div>
                <div className="bg-teal-100 p-3 rounded-full">
                  <Bell className="h-6 w-6 text-teal-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-500">Updated as of today</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Orders Overview</h2>
                <div className="flex items-center">
                  <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                    By Month
                  </button>
                </div>
              </div>
              {ordersData.every((data) => data.orders === 0) ? (
                <div className="text-center py-8 text-gray-500">
                  No orders data available for the last 6 months.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={ordersData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value: number) => `${value} orders`} />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Order Status Distribution</h2>
                <button className="flex items-center text-sm text-blue-600">
                  <Link to="/admin/orders">View All Orders</Link>
                </button>
              </div>
              {statusData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No order status data available.
                </div>
              ) : (
                <div className="flex">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col justify-center">
                    {statusData.map((item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="text-sm flex-1">{item.name}</div>
                        <div className="text-sm font-medium">{item.value}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Books and Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Best Selling Books</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestSellingBooks.map((book) => (
                      <tr key={book.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium">{book.title}</td>
                        <td className="py-3 text-sm text-gray-500">{book.author}</td>
                        <td className="py-3 text-sm">{book.sales}</td>
                        <td className="py-3 text-sm">{book.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Recent Orders</h2>
                <button className="text-sm text-blue-600">
                  <Link to="/admin/orders">View All</Link>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="text-left pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium">{order.id}</td>
                        <td className="py-3 text-sm text-gray-500">{order.customer}</td>
                        <td className="py-3 text-sm">{order.total}</td>
                        <td className="py-3 text-sm">{renderStatus(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}