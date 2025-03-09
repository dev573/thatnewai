import { createContext } from 'react';
import { User } from '../services/authService';

// Define a simple user registration type
export interface RegisterUserData {
  email: string;
  password: string;
  fullName?: string;
}

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>; // Kept for interface compatibility but not used
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});
