// frontend/src/pages/NotFound.jsx

import React from 'react';

import {
  Link
} from 'react-router-dom';

import {
  Home,
  ArrowLeft
} from 'lucide-react';

const NotFound = () => {

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-blue-50
        via-white
        to-indigo-100
        px-4
      "
    >

      {/* ===================================== */}
      {/* CARD */}
      {/* ===================================== */}

      <div
        className="
          w-full
          max-w-xl
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-gray-100
          p-10
          text-center
        "
      >

        {/* =================================== */}
        {/* 404 */}
        {/* =================================== */}

        <div
          className="
            text-8xl
            md:text-9xl
            font-black
            text-blue-600
            leading-none
          "
        >
          404
        </div>

        {/* =================================== */}
        {/* TITLE */}
        {/* =================================== */}

        <h1
          className="
            text-3xl
            font-bold
            text-gray-800
            mt-6
          "
        >
          Page Not Found
        </h1>

        {/* =================================== */}
        {/* DESCRIPTION */}
        {/* =================================== */}

        <p
          className="
            text-gray-500
            mt-4
            leading-relaxed
          "
        >
          The page you are looking for
          does not exist or may have
          been moved.
        </p>

        {/* =================================== */}
        {/* ACTIONS */}
        {/* =================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-4
            mt-8
          "
        >

          {/* GO HOME */}

          <Link
            to="/dashboard"
            className="
              flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              transition
            "
          >

            <Home size={18} />

            Go to Dashboard

          </Link>

          {/* GO BACK */}

          <button
            onClick={() =>
              window.history.back()
            }
            className="
              flex
              items-center
              gap-2
              px-6
              py-3
              rounded-xl
              border
              border-gray-300
              hover:bg-gray-100
              text-gray-700
              font-medium
              transition
            "
          >

            <ArrowLeft size={18} />

            Go Back

          </button>

        </div>

      </div>

    </div>
  );
};

export default NotFound;