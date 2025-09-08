import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authAPI.getProfile();
      setUser(userData);
    } catch (error) {
      // User is not logged in
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await authAPI.login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userData = await authAPI.signup(name, email, password);
      setUser(userData.user);
      // Clear verified email since signup is complete
      setVerifiedEmail(null);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setVerifiedEmail(null);
    }
  };

  const requestOTP = async (email) => {
    try {
      const result = await authAPI.requestOTP(email);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const result = await authAPI.verifyOTP(email, otp);
      setVerifiedEmail(email);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const clearVerifiedEmail = () => {
    setVerifiedEmail(null);
  };

  const value = {
    user,
    isLoading,
    verifiedEmail,
    login,
    signup,
    logout,
    requestOTP,
    verifyOTP,
    clearVerifiedEmail,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
