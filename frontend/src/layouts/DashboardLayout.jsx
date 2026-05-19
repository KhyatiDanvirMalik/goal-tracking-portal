// frontend/src/layouts/DashboardLayout.jsx

import React, {
  useState
} from 'react';

import {
  Outlet
} from 'react-router-dom';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {

  // ===========================================
  // SIDEBAR STATE
  // ===========================================

  const [isSidebarOpen,
    setIsSidebarOpen] =
    useState(false);

  // ===========================================
  // TOGGLE SIDEBAR
  // ===========================================

  const toggleSidebar = () => {

    setIsSidebarOpen(
      !isSidebarOpen
    );
  };

  return (

    <div
      className="
        min-h-screen
        bg-gray-100
      "
    >

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={
          toggleSidebar
        }
      />

      {/* ===================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================== */}

      <div
        className="
          lg:ml-72
          min-h-screen
          flex
          flex-col
        "
      >

        {/* NAVBAR */}

        <Navbar
          toggleSidebar={
            toggleSidebar
          }
        />

        {/* PAGE CONTENT */}

        <main
          className="
            flex-1
            overflow-y-auto
          "
        >

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;