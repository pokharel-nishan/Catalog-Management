import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios'; // ✅ Type-only import

const DEV_API_URL = 'http://localhost:5213/api';

// Create Axios instance
const apiClient = axios.create({
  baseURL: DEV_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;


// import axios from 'axios';

// // Create axios instance
// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5213/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add request interceptor to attach token for authenticated requests
// apiClient.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage
//     const authUser = localStorage.getItem('authUser');
    
//     if (authUser) {
//       try {
//         const userData = JSON.parse(authUser);
//         const token = userData.token;
        
//         if (token) {
//           // Attach token to Authorization header
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//       } catch (error) {
//         console.error('Error parsing auth user:', error);
//       }
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor to handle token expiration
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle 401 errors (unauthorized - usually due to expired token)
//     if (error.response && error.response.status === 401) {
//       // Clear local storage
//       localStorage.removeItem('authUser');
      
//       // Redirect to login page if not already there
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = '/login';
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
