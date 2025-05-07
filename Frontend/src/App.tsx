import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/books/BookPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/books" element={<BooksPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>
  );
}

export default App;