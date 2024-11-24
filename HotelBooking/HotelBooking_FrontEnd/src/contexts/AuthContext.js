import React, { createContext, useState, useEffect } from 'react';
import ApiService from 'services/ApiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Checking auth status. Token:', !!token);

      if (!token) {
        console.log('No token found. Setting isAuthenticated to false.');
        setIsAuthenticated(false);
        setUserDetails(null);
        setLoading(false);
        return;
      }

      const response = await ApiService.getUserProfile();
      console.log('User data response:', response);

      if (response && response.statusCode === 200 && response.user) {
        console.log('Valid user data received. Setting isAuthenticated to true.');
        setIsAuthenticated(true);
        setUserDetails(response.user);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('role', response.user.role);
      } else {
        console.log('Invalid or no user data. Clearing auth data.');
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    ApiService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserDetails(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const triggerAuthCheck = () => {
    console.log('Triggering auth check');
    checkAuthStatus();
  };

  const login = async (loginDetails) => {
    try {
      const response = await ApiService.loginUser(loginDetails);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        await checkAuthStatus(); // Gọi lại checkAuthStatus để cập nhật trạng thái
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  console.log('Current isAuthenticated state:', isAuthenticated);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userDetails,
        triggerAuthCheck,
        clearAuthData,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};