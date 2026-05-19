// frontend/src/context/AuthContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import {
  useNavigate
} from 'react-router-dom';

import toast from 'react-hot-toast';

import api from '../api/axios';

// =============================================
// CREATE CONTEXT
// =============================================

const AuthContext =
  createContext();

// =============================================
// PROVIDER
// =============================================

export const AuthProvider = ({
  children
}) => {

  // ===========================================
  // STATES
  // ===========================================

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ===========================================
  // NAVIGATION
  // ===========================================

  const navigate = useNavigate();

  // ===========================================
  // LOAD USER FROM LOCAL STORAGE
  // ===========================================

  useEffect(() => {

    const storedToken =
      localStorage.getItem(
        'token'
      );

    const storedUser =
      localStorage.getItem(
        'user'
      );

    if (
      storedToken &&
      storedUser
    ) {

      setToken(storedToken);

      setUser(
        JSON.parse(storedUser)
      );
    }

    setLoading(false);

  }, []);

  // ===========================================
  // LOGIN
  // ===========================================

  const login = async (
    email,
    password
  ) => {

    try {

      const response =
        await api.post(
          '/auth/login',
          {
            email,
            password
          }
        );

      const {
        token,
        user
      } = response.data;

      // STORE

      localStorage.setItem(
        'token',
        token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      // UPDATE STATE

      setToken(token);

      setUser(user);

      toast.success(
        'Login successful'
      );

      navigate('/dashboard');

      return {
        success: true
      };

    } catch (error) {

      console.error(
        'LOGIN ERROR:',
        error
      );

      toast.error(
        error?.response?.data
          ?.message ||
        'Login failed'
      );

      return {
        success: false
      };
    }
  };

  // ===========================================
  // LOGOUT
  // ===========================================

  const logout = () => {

    // CLEAR STORAGE

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    // CLEAR STATE

    setUser(null);

    setToken(null);

    toast.success(
      'Logged out successfully'
    );

    navigate('/login');
  };

  // ===========================================
  // ROLE CHECKS
  // ===========================================

  const isAdmin =
    user?.role === 'admin';

  const isManager =
    user?.role === 'manager';

  const isEmployee =
    user?.role === 'employee';

  // ===========================================
  // CONTEXT VALUE
  // ===========================================

  const value = {

    user,

    token,

    loading,

    login,

    logout,

    isAdmin,

    isManager,

    isEmployee,

    isAuthenticated:
      !!token
  };

  // ===========================================
  // PROVIDER
  // ===========================================

  return (

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>
  );
};

// =============================================
// CUSTOM HOOK
// =============================================

export const useAuth = () => {

  return useContext(
    AuthContext
  );
};