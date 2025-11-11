import axios from 'axios';

// --- Type Definitions (Mirrored from Backend) ---
// These types are imported by useAuth
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
}

export type LoginData = RegisterData;

// --- Helper Functions for Auth ---
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
};

// Get the API URL from environment variables (set by Vite)
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000'; // Fix: Cast to any to bypass TS error

// Create the axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Auth Token Interceptor ---
// This interceptor checks for the auth token in localStorage
// and adds it to the Authorization header of *every* request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Use the key set by setAuthToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
