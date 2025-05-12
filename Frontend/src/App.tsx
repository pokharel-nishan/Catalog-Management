import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./layouts/UserLayout";
import Books from "./pages/books";
import HomePage from "./pages/home";
import BookDetailPage from "./components/pageComponents/books/BookDetails";
import SuccessPage from "./pages/OrderSuccessPage";
import { CartProvider } from "./components/pageComponents/cart/CartContext";
import Login from "./pages/authentication/login";
import MyOrders from "./components/pageComponents/user-profile/order/OrderHistory";
import UserWishlist from "./components/pageComponents/user-profile/wishlist/UserWishlist";
import Register from "./pages/authentication/register";
import OrderSummaryPage from "./pages/user-profile/order";
import UserProfile from "./pages/user-profile/profile";
import AdminLayout from "./layouts/AdminLayout";
import DashboardAnalytics from "./components/pageComponents/admin/dashboard/AdminDashboard";
import StaffManagement from "./pages/admin/manage-staffs";
import BookManagement from "./pages/admin/manage-books";
import OrdersManagement from "./pages/admin/manage-orders";

function App() {
  return (
    <CartProvider>
      <Router>
        <AdminLayout>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/success" element={<SuccessPage />} />

            {/* User Specific Pages */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/wishlists" element={<UserWishlist />} />
            <Route path="/orders" element={<OrderSummaryPage />} />

            <Route path="*" element={<NotFoundPage />} />


      
            <Route path="/admin" element={<DashboardAnalytics />} />
            <Route path="/admin/staffs" element={<StaffManagement />} />
            <Route path="/admin/books" element={<BookManagement />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
          </Routes>
          </AdminLayout>
      </Router>
    </CartProvider>
  );
}

export default App;
