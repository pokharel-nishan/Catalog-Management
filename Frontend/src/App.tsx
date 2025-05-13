import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Books from "./pages/books";
import HomePage from "./pages/home";
import BookDetailPage from "./components/pageComponents/books/BookDetails";
import SuccessPage from "./pages/OrderSuccessPage";
import { CartProvider } from "./components/pageComponents/cart/CartContext";
import Login from "./pages/authentication/login";
import Register from "./pages/authentication/register";
import OrderSummaryPage from "./pages/order";
import UserProfile from "./pages/user-profile/profile";
import StaffManagement from "./pages/admin/manage-staffs";
import BookManagement from "./pages/admin/manage-books";
import OrdersManagement from "./pages/admin/manage-orders";
import UserManagement from "./pages/admin/manage-users";
import Announcements from "./pages/admin/announcements";
import AnnouncementPage from "./pages/announcements";
import UserOrderHistory from "./pages/user-profile/order";
import Wishlist from "./pages/user-profile/wishlist";
import AdminDashboard from "./pages/admin/dashboard";

function App() {
  return (
    <CartProvider>
      <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFoundPage />} />

            
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/announcements" element={<AnnouncementPage />} />
            <Route path="/orders" element={<OrderSummaryPage />} />

            {/* User Specific Pages */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/my-orders" element={<UserOrderHistory />} />
            <Route path="/wishlists" element={<Wishlist />} />


            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/staffs" element={<StaffManagement />} />
            <Route path="/admin/books" element={<BookManagement />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/announcements" element={<Announcements />} />
          </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
