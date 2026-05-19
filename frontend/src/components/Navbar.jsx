// frontend/src/components/Navbar.jsx

import React from 'react';

import {
  Bell,
  LogOut,
  User,
  Menu
} from 'lucide-react';

const Navbar = ({
  toggleSidebar
}) => {

  // ===========================================
  // GET USER
  // ===========================================

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  // ===========================================
  // LOGOUT
  // ===========================================

  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    window.location.href = '/login';
  };

  return (

    <div
      className="
        w-full
        h-16
        bg-white
        border-b
        border-gray-200
        px-4
        flex
        items-center
        justify-between
        shadow-sm
      "
    >

      {/* ===================================== */}
      {/* LEFT SECTION */}
      {/* ===================================== */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        {/* MOBILE MENU BUTTON */}

        <button
          onClick={toggleSidebar}
          className="
            lg:hidden
            p-2
            rounded-lg
            hover:bg-gray-100
            transition
          "
        >

          <Menu size={22} />

        </button>

        {/* APP TITLE */}

        <div>

          <h1
            className="
              text-lg
              md:text-xl
              font-bold
              text-gray-800
            "
          >
            Goal Tracking Portal
          </h1>

          <p
            className="
              text-xs
              text-gray-500
              hidden
              md:block
            "
          >
            Performance & Goal Management
          </p>

        </div>

      </div>

      {/* ===================================== */}
      {/* RIGHT SECTION */}
      {/* ===================================== */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        {/* NOTIFICATION BUTTON */}

        <button
          className="
            relative
            p-2
            rounded-full
            hover:bg-gray-100
            transition
          "
        >

          <Bell
            size={22}
            className="text-gray-700"
          />

          {/* NOTIFICATION DOT */}

          <span
            className="
              absolute
              top-1
              right-1
              w-2
              h-2
              bg-red-500
              rounded-full
            "
          />

        </button>

        {/* USER INFO */}

        <div
          className="
            hidden
            sm:flex
            flex-col
            items-end
          "
        >

          <p
            className="
              text-sm
              font-semibold
              text-gray-800
            "
          >
            {user?.name || 'User'}
          </p>

          <p
            className="
              text-xs
              text-gray-500
              capitalize
            "
          >
            {user?.role || 'Employee'}
          </p>

        </div>

        {/* USER AVATAR */}

        <div
          className="
            w-10
            h-10
            rounded-full
            bg-blue-600
            flex
            items-center
            justify-center
            text-white
            font-bold
            shadow-md
          "
        >

          <User size={18} />

        </div>

        {/* LOGOUT BUTTON */}

        <button
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-lg
            bg-red-500
            hover:bg-red-600
            text-white
            text-sm
            transition
          "
        >

          <LogOut size={18} />

          <span className="hidden md:block">
            Logout
          </span>

        </button>

      </div>

    </div>
  );
};

export default Navbar;