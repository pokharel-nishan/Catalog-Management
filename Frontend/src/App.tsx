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

function App() {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/wishlists" element={<UserWishlist />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
