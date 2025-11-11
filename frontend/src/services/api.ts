import axios from 'axios';
import Keycloak from 'keycloak-js';

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
  baseURL: API_URL
});

// Keycloak Instance Management
let keycloakInstance: Keycloak | null = null;

/**
 * This function is called by the AuthProvider (in useAuth.tsx)
 * once Keycloak has been successfully initialized.
 * @param keycloak The initialized Keycloak instance
 */
export const setKeycloakInstance = (keycloak: Keycloak) => {
  keycloakInstance = keycloak;
};

// --- Axios Request Interceptor ---
// This is the critical piece that solves the 401 Unauthorized error.
// It intercepts every API request and adds the auth token.
api.interceptors.request.use(
  async (config) => {
    // Check if Keycloak is initialized and the user is authenticated
    if (keycloakInstance && keycloakInstance.authenticated) {
      try {
        // Silently refresh the token if it's about to expire (e.g., within 5 seconds)
        // This is an async operation, which is why the interceptor is async.
        await keycloakInstance.updateToken(5);

        // Attach the (potentially refreshed) token to the Authorization header
        if (keycloakInstance.token) {
          config.headers.Authorization = `Bearer ${keycloakInstance.token}`;
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // If refresh fails, log the user out to be safe
        keycloakInstance.logout();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- Export the configured Axios instance ---
export default api;
