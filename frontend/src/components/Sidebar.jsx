// frontend/src/components/Sidebar.jsx

import React from 'react';

import {
  LayoutDashboard,
  Target,
  Users,
  BarChart3,
  CalendarRange,
  FileText,
  Settings,
  LogOut,
  X
} from 'lucide-react';

import {
  NavLink
} from 'react-router-dom';

const Sidebar = ({
  isOpen,
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

  // ===========================================
  // MENU ITEMS
  // ===========================================

  const employeeMenu = [

    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />
    },

    {
      name: 'My Goals',
      path: '/goals',
      icon: <Target size={20} />
    },

    {
      name: 'Reports',
      path: '/reports',
      icon: <BarChart3 size={20} />
    }
  ];

  const managerMenu = [

    ...employeeMenu,

    {
      name: 'Team Goals',
      path: '/team-goals',
      icon: <Users size={20} />
    }
  ];

  const adminMenu = [

    ...managerMenu,

    {
      name: 'Users',
      path: '/users',
      icon: <Users size={20} />
    },

    {
      name: 'Cycles',
      path: '/cycles',
      icon: <CalendarRange size={20} />
    },

    {
      name: 'Audit Logs',
      path: '/audit-logs',
      icon: <FileText size={20} />
    }
  ];

  // ===========================================
  // ROLE-BASED MENU
  // ===========================================

  let menuItems = employeeMenu;

  if (user?.role === 'manager') {
    menuItems = managerMenu;
  }

  if (user?.role === 'admin') {
    menuItems = adminMenu;
  }

  return (

    <>

      {/* ===================================== */}
      {/* OVERLAY */}
      {/* ===================================== */}

      {
        isOpen && (

          <div
            onClick={toggleSidebar}
            className="
              fixed
              inset-0
              bg-black/40
              z-40
              lg:hidden
            "
          />

        )
      }

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-72
          bg-gray-900
          text-white
          z-50
          transform
          transition-transform
          duration-300

          ${isOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          }

          lg:translate-x-0
        `}
      >

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div
          className="
            h-16
            flex
            items-center
            justify-between
            px-5
            border-b
            border-gray-800
          "
        >

          <div>

            <h1
              className="
                text-xl
                font-bold
                tracking-wide
              "
            >
              Goal Portal
            </h1>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Performance System
            </p>

          </div>

          {/* MOBILE CLOSE */}

          <button
            onClick={toggleSidebar}
            className="
              lg:hidden
              p-1
            "
          >

            <X size={22} />

          </button>

        </div>

        {/* ================================= */}
        {/* USER INFO */}
        {/* ================================= */}

        <div
          className="
            px-5
            py-6
            border-b
            border-gray-800
          "
        >

          <div
            className="
              w-14
              h-14
              rounded-full
              bg-blue-600
              flex
              items-center
              justify-center
              text-xl
              font-bold
              mb-3
            "
          >

            {
              user?.name?.charAt(0)
            }

          </div>

          <h2
            className="
              text-lg
              font-semibold
            "
          >
            {user?.name}
          </h2>

          <p
            className="
              text-sm
              text-gray-400
              capitalize
            "
          >
            {user?.role}
          </p>

        </div>

        {/* ================================= */}
        {/* NAVIGATION */}
        {/* ================================= */}

        <nav
          className="
            flex-1
            px-3
            py-4
            overflow-y-auto
          "
        >

          <ul
            className="
              space-y-2
            "
          >

            {
              menuItems.map(
                (item) => (

                  <li key={item.path}>

                    <NavLink
                      to={item.path}
                      onClick={() => {

                        if (
                          window.innerWidth <
                          1024
                        ) {
                          toggleSidebar();
                        }
                      }}

                      className={({
                        isActive
                      }) => `
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        transition
                        text-sm
                        font-medium

                        ${isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'hover:bg-gray-800 text-gray-300'
                        }
                      `}
                    >

                      {item.icon}

                      {item.name}

                    </NavLink>

                  </li>
                )
              )
            }

          </ul>

        </nav>

        {/* ================================= */}
        {/* FOOTER */}
        {/* ================================= */}

        <div
          className="
            p-4
            border-t
            border-gray-800
            space-y-2
          "
        >

          {/* SETTINGS */}

          <button
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              hover:bg-gray-800
              text-sm
              text-gray-300
              transition
            "
          >

            <Settings size={20} />

            Settings

          </button>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-sm
              transition
            "
          >

            <LogOut size={20} />

            Logout

          </button>

        </div>

      </aside>

    </>
  );
};

export default Sidebar;