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
