// AuthContext.tsx - Only contains the AuthProvider component
import React, { useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/authService';
import { AuthContext } from './AuthContextDefinition';

// Define interface for the provider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component - This is the only export from this file, which helps Fast Refresh work correctly
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for user on initial load
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        if (authService.isLoggedIn()) {
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } catch (err) {
            console.error('Error getting current user:', err);
            // Don't immediately logout if there's a temporary API error
            // Instead, let's try once more after a short delay
            setTimeout(async () => {
              try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
              } catch (retryErr) {
                console.error('Retry failed, logging out:', retryErr);
                authService.logout();
                setUser(null);
              }
              setIsLoading(false);
            }, 1000);
            return; // Exit to prevent setting isLoading to false prematurely
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Registration functionality removed as per requirements
  
  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  const value = {
    user,
    isLoading,
    error,
    login,
    register: async () => {}, // Placeholder for types compatibility
    logout,
    isAuthenticated: !!user,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
