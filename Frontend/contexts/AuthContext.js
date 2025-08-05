// contexts/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for stored auth data on mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear corrupted data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      const response = await authAPI.login(credentials);
      const responseData = response.data;
      console.log('Login response:', response);
      if(!responseData.success){
        throw new Error(responseData.message);
      }
      
      // Backend returns response.data.data = { token, user }
      const { token, user } = responseData.data;
      
      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      setToken(token);
      setUser(user);
      
      return { success: true };
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Clear any partial auth state
      setToken(null);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      if (error.response) {
        // Server responded with an error
        return {
          success: false,
          message: error.response.data.message || 'Login failed'
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          message: 'Unable to connect to the server. Please check your internet connection.'
        };
      } else {
        // Other errors
        return {
          success: false,
          message: error.message || 'An unexpected error occurred'
        };
      }
    } finally {
      setLoading(false);  
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Attempting registration with:', userData);
      
      const response = await authAPI.register(userData);
      console.log('Registration response:', response);
      
      // Backend returns response.data.data = { token, user }
      const { token, user } = response.data.data || response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      setToken(token);
      setUser(user);
      
      return { success: true };
      
    } catch (error) {
      console.error('Registration error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state regardless of API call result
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
