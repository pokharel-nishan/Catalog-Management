import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./layouts/UserLayout";
import Books from "./pages/books";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/books" element={<Books />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
