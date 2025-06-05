import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiService from '../services/api';
import type { User, AuthContextType, SignUpRequest } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface JWTPayload {
  sub: string;
  exp: number;
  iat: number;
  userId?: number;
  user_id?: number;
  id?: number;
  role: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Check if token is still valid
          const decodedToken = jwtDecode<JWTPayload>(storedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.signIn({ username, password });
      
      setToken(response.token);
      
      // Decode the JWT token to get user information
      const decodedToken = jwtDecode<JWTPayload>(response.token);
      console.log('Decoded JWT token:', decodedToken); // Debug log
      
      // Try to extract user ID from various possible fields in the JWT token
      let userId = 0;
      if (decodedToken.userId) {
        userId = decodedToken.userId;
      } else if (decodedToken.user_id) {
        userId = decodedToken.user_id;
      } else if (decodedToken.id) {
        userId = decodedToken.id;
      } else if (decodedToken.sub && !isNaN(parseInt(decodedToken.sub))) {
        userId = parseInt(decodedToken.sub);
      }
      
      console.log('Extracted user ID:', userId); // Debug log
      
      // Create a user object from the JWT response
      const userObject: User = {
        id: userId,
        username: response.username,
        email: '', // Backend doesn't provide email in JWT response
        role: response.role,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Created user object:', userObject); // Debug log
      
      setUser(userObject);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userObject));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignUpRequest): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiService.signUp(userData);
      
      setToken(response.token);
      
      // Decode the JWT token to get user information
      const decodedToken = jwtDecode<JWTPayload>(response.token);
      
      // Try to extract user ID from various possible fields in the JWT token
      let userId = 0;
      if (decodedToken.userId) {
        userId = decodedToken.userId;
      } else if (decodedToken.user_id) {
        userId = decodedToken.user_id;
      } else if (decodedToken.id) {
        userId = decodedToken.id;
      } else if (decodedToken.sub && !isNaN(parseInt(decodedToken.sub))) {
        userId = parseInt(decodedToken.sub);
      }
      
      console.log('Extracted user ID:', userId); // Debug log
      
      // Create a user object from the JWT response
      const userObject: User = {
        id: userId,
        username: response.username,
        email: userData.email, // Use the email from signup form
        role: response.role,
        createdAt: new Date().toISOString(),
      };
      
      setUser(userObject);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userObject));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 