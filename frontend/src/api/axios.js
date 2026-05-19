// frontend/src/api/axios.js

import axios from 'axios';
import toast from 'react-hot-toast';

// =============================================
// AXIOS INSTANCE
// =============================================

const api = axios.create({

  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:4000/api',

  headers: {
    'Content-Type': 'application/json'
  },

  timeout: 10000
});

// =============================================
// REQUEST INTERCEPTOR
// Attach JWT Token
// =============================================

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem('token');

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);

// =============================================
// RESPONSE INTERCEPTOR
// Global Error Handling
// =============================================

api.interceptors.response.use(

  (response) => {

    return response;
  },

  (error) => {

    // =========================================
    // NETWORK ERROR
    // =========================================

    if (!error.response) {

      toast.error(
        'Server not responding'
      );

      return Promise.reject(error);
    }

    const {
      status,
      data
    } = error.response;

    // =========================================
    // UNAUTHORIZED
    // =========================================

    if (status === 401) {

      localStorage.removeItem('token');

      localStorage.removeItem('user');

      toast.error(
        'Session expired. Please login again.'
      );

      window.location.href = '/login';
    }

    // =========================================
    // FORBIDDEN
    // =========================================

    else if (status === 403) {

      toast.error(
        data?.message ||
        'Access denied'
      );
    }

    // =========================================
    // BAD REQUEST
    // =========================================

    else if (status === 400) {

      toast.error(
        data?.message ||
        'Invalid request'
      );
    }

    // =========================================
    // SERVER ERROR
    // =========================================

    else if (status >= 500) {

      toast.error(
        'Internal server error'
      );
    }

    return Promise.reject(error);
  }
);

// =============================================
// EXPORT
// =============================================

export default api;