import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksPage from "./pages/books/BookPage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./layouts/UserLayout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/books" element={<BooksPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
