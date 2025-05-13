import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context/AuthContext.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
    <App />
    <ToastContainer position="top-right" autoClose={500}/>
    </AuthProvider>
  </StrictMode>,
)
