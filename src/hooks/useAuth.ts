import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextDefinition';

// Export the hook to be used throughout the application
export const useAuth = () => useContext(AuthContext);
