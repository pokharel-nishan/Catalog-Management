// src/router.js
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/authentication/login';
import SignUp from '../pages/authentication/register';


const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <SignUp /> },
]);

export default router;
