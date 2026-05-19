// frontend/src/App.jsx

import React from 'react';

import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import {
  Toaster
} from 'react-hot-toast';

// =============================================
// CONTEXT
// =============================================

import {
  AuthProvider
} from './context/AuthContext';

// =============================================
// LAYOUTS
// =============================================

import DashboardLayout
  from './layouts/DashboardLayout';

// =============================================
// PROTECTED ROUTE
// =============================================

import ProtectedRoute
  from './components/ProtectedRoute';

// =============================================
// PAGES
// =============================================

import Login
  from './pages/Login';

import Dashboard
  from './pages/Dashboard';

import Goals
  from './pages/Goals';

import TeamGoals
  from './pages/TeamGoals';

import Reports
  from './pages/Reports';

import Users
  from './pages/Users';

import Cycles
  from './pages/Cycles';

import NotFound
  from './pages/NotFound';

import AuditLogs 
  from './pages/AuditLogs';

const App = () => {

  return (

    <AuthProvider>

      {/* =================================== */}
      {/* TOAST */}
      {/* =================================== */}

      <Toaster
        position="top-right"
      />

      {/* =================================== */}
      {/* ROUTES */}
      {/* =================================== */}

      <Routes>

        {/* ================================= */}
        {/* LOGIN */}
        {/* ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================================= */}
        {/* DASHBOARD LAYOUT */}
        {/* ================================= */}

        <Route
          element={
            <ProtectedRoute>

              <DashboardLayout />

            </ProtectedRoute>
          }
        >

          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* GOALS */}

          <Route
            path="/goals"
            element={<Goals />}
          />

          {/* TEAM GOALS */}

          <Route
            path="/team-goals"
            element={

              <ProtectedRoute
                allowedRoles={[
                  'manager',
                  'admin'
                ]}
              >

                <TeamGoals />

              </ProtectedRoute>
            }
          />

          {/* REPORTS */}

          <Route
            path="/reports"
            element={<Reports />}
          />

          {/* USERS */}

          <Route
            path="/users"
            element={

              <ProtectedRoute
                allowedRoles={[
                  'admin'
                ]}
              >

                <Users />

              </ProtectedRoute>
            }
          />

          {/* CYCLES */}

          <Route
            path="/cycles"
            element={

              <ProtectedRoute
                allowedRoles={[
                  'admin'
                ]}
              >

                <Cycles />

              </ProtectedRoute>
            }
          />

          {/* AUDITLOGS */}

          <Route
            path="/audit-logs"
            element={

              <ProtectedRoute
                allowedRoles={[
                  'admin'
                ]}
              >

                <AuditLogs />

              </ProtectedRoute>
            }
          />

        </Route>

        {/* ================================= */}
        {/* DEFAULT REDIRECT */}
        {/* ================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ================================= */}
        {/* 404 */}
        {/* ================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </AuthProvider>
  );
};

export default App;