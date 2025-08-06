'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('authToken');
          const storedUser = localStorage.getItem('user');

          if (storedToken && storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setToken(storedToken);
              setUser(parsedUser);

              // Verify token is still valid by fetching profile
              try {
                const response = await authAPI.getProfile();
                if (response.data.success) {
                  setUser(response.data.data.user);
                  localStorage.setItem('user', JSON.stringify(response.data.data.user));
                }
              } catch (error) {
                // Token is invalid, clear storage
                clearAuth();
              }
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              clearAuth();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Clear auth state
  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }, []);

  // Store auth state
  const storeAuth = useCallback((token, user) => {
    setToken(token);
    setUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      const response = await authAPI.login(credentials);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, user } = response.data.data;
      
      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

      storeAuth(token, user);
      return { success: true, user, message: response.data.message };

    } catch (error) {
      clearAuth();
      
      // Handle different error types
      if (error.response) {
        const { data } = error.response;
        return {
          success: false,
          message: data.message || 'Login failed',
          code: data.code,
          errors: data.errors
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please check your internet connection.',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR'
        };
      }
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await authAPI.register(userData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      const { token, user } = response.data.data;
      
      if (!token || !user) {
        throw new Error('Invalid response format from server');
      }

      storeAuth(token, user);
      return { success: true, user, message: response.data.message };

    } catch (error) {
      clearAuth();
      
      if (error.response) {
        const { data } = error.response;
        return {
          success: false,
          message: data.message || 'Registration failed',
          code: data.code,
          errors: data.errors
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please check your internet connection.',
          code: 'NETWORK_ERROR'
        };
      } else {
        return {
          success: false,
          message: error.message || 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR'
        };
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      if (token) {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      setLoading(false);
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        return { success: true, user: updatedUser, message: response.data.message };
      }

      throw new Error(response.data.message || 'Profile update failed');
      
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || 'Profile update failed',
          errors: error.response.data.errors
        };
      }

      return {
        success: false,
        message: error.message || 'Profile update failed'
      };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }

      throw new Error(response.data.message || 'Password change failed');
      
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || 'Password change failed',
          errors: error.response.data.errors
        };
      }

      return {
        success: false,
        message: error.message || 'Password change failed'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!token && !!user,
    clearAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
