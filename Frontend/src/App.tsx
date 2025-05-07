import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/books/BookPage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/books" element={<BooksPage />} />
        </Routes>
    </Router>
  );
}

export default App;