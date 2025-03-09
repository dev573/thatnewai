import axios from 'axios';

// Define base API URL
const API_URL = 'http://localhost:8000/api';

// Define user interfaces
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Create axios instance with auth header
export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to outgoing requests if available
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors, specifically for authentication issues
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an invalid/expired token (401 Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Mark the request to avoid infinite retry loops
      originalRequest._retry = true;
      
      // If it's a token issue, clear the token
      if (localStorage.getItem('auth_token')) {
        // Log for debugging
        console.log('Auth token was invalid or expired');
      }
      
      // Don't automatically remove the token here - let the AuthContext handle that
      // This allows the UI to show proper auth status changes
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  // Login user and store token
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await authApi.post<LoginResponse>('/auth/login/json', { email, password });
      
      // Store token in localStorage for persistence
      localStorage.setItem('auth_token', response.data.access_token);
      
      // Get and return user data
      return await this.getCurrentUser();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register new user
  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await authApi.post<User>('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Get current user information
  async getCurrentUser(): Promise<User> {
    try {
      // Check if token exists before making request
      if (!this.isLoggedIn()) {
        throw new Error('No authentication token found');
      }
      
      const response = await authApi.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout(): void {
    localStorage.removeItem('auth_token');
  },
  
  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  },
  
  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
};
