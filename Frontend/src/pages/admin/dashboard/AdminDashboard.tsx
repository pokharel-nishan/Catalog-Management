import {
  BookOpen,
  Users,
  ShoppingCart,
  DollarSign,
  Filter,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
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
} from "recharts";

// Define type for the sales data
interface SalesData {
  name: string;
  sales: number;
  orders: number;
}

// Define type for the category data
interface CategoryData {
  name: string;
  value: number;
}

// Define type for the book data
interface Book {
  id: number;
  title: string;
  author: string;
  sales: number;
  price: string;
  stock: number;
  category: string;
}

// Define type for the order data with status type
interface Order {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: string;
  status: "Completed" | "Processing" | "Shipped" | "Cancelled";
}

const salesData: SalesData[] = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 200 },
  { name: "Mar", sales: 5000, orders: 310 },
  { name: "Apr", sales: 7000, orders: 450 },
  { name: "May", sales: 5000, orders: 320 },
  { name: "Jun", sales: 6000, orders: 380 },
];

const categoryData: CategoryData[] = [
  { name: "Fiction", value: 35 },
  { name: "Science", value: 20 },
  { name: "Business", value: 15 },
  { name: "Biography", value: 10 },
  { name: "Self-Help", value: 20 },
];

const recentBooks: Book[] = [
  {
    id: 1,
    title: "The Silent Echo",
    author: "Maria Johnson",
    sales: 243,
    price: "$24.99",
    stock: 54,
    category: "Fiction",
  },
  {
    id: 2,
    title: "Quantum Physics Simplified",
    author: "Alan Cooper",
    sales: 185,
    price: "$32.99",
    stock: 27,
    category: "Science",
  },
  {
    id: 3,
    title: "Market Disruptions",
    author: "Sarah Williams",
    sales: 139,
    price: "$29.99",
    stock: 41,
    category: "Business",
  },
  {
    id: 4,
    title: "The Art of Focus",
    author: "David Chen",
    sales: 127,
    price: "$19.99",
    stock: 35,
    category: "Self-Help",
  },
];

const recentOrders: Order[] = [
  {
    id: "#ORD-7429",
    customer: "John Smith",
    date: "11 May 2025",
    items: 3,
    total: "$87.97",
    status: "Completed",
  },
  {
    id: "#ORD-7428",
    customer: "Emma Wilson",
    date: "10 May 2025",
    items: 1,
    total: "$32.99",
    status: "Processing",
  },
  {
    id: "#ORD-7427",
    customer: "Michael Brown",
    date: "10 May 2025",
    items: 2,
    total: "$49.98",
    status: "Completed",
  },
  {
    id: "#ORD-7426",
    customer: "Lisa Johnson",
    date: "09 May 2025",
    items: 4,
    total: "$105.96",
    status: "Shipped",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DashboardAnalytics() {
  const renderStatus = (
    status: "Completed" | "Processing" | "Shipped" | "Cancelled"
  ) => {
    const statusStyles = {
      Completed: "bg-green-100 text-green-800",
      Processing: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <p className="text-2xl font-bold">$24,589</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium ml-1">+12.5%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">1,520</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium ml-1">+8.2%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold">892</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium ml-1">+5.3%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Books</p>
              <p className="text-2xl font-bold">324</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium ml-1">+2.7%</span>
            <span className="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Sales Overview</h2>
            <div className="flex items-center">
              <div className="flex space-x-1">
                <button className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                  By Month
                </button>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={salesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Category Distribution</h2>
            <button className="flex items-center text-sm text-blue-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <Link to="/admin/books">View All Books</Link>
            </button>
          </div>
          <div className="flex">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col justify-center">
              {categoryData.map((item, index) => (
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
                {recentBooks.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium">{book.title}</td>
                    <td className="py-3 text-sm text-gray-500">
                      {book.author}
                    </td>
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
                    <td className="py-3 text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="py-3 text-sm">{order.total}</td>
                    <td className="py-3 text-sm">
                      {renderStatus(order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
