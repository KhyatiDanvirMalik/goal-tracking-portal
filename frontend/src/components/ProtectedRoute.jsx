// frontend/src/components/ProtectedRoute.jsx

import React from 'react';

import {
  Navigate
} from 'react-router-dom';

import Loader from './Loader';

// =============================================
// PROTECTED ROUTE COMPONENT
// =============================================

const ProtectedRoute = ({
  children,
  allowedRoles = []
}) => {

  // ===========================================
  // GET TOKEN + USER
  // ===========================================

  const token =
    localStorage.getItem('token');

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  // ===========================================
  // LOADING STATE
  // Optional Future Use
  // ===========================================

  const loading = false;

  if (loading) {
    return <Loader />;
  }

  // ===========================================
  // NOT AUTHENTICATED
  // ===========================================

  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ===========================================
  // ROLE CHECK
  // ===========================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // ===========================================
  // AUTHORIZED
  // ===========================================

  return children;
};

export default ProtectedRoute;