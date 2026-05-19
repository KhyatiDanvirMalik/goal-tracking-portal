// frontend/src/components/Loader.jsx

import React from 'react';

const Loader = ({
  text = 'Loading...'
}) => {

  return (

    <div
      className="
        w-full
        min-h-[300px]
        flex
        flex-col
        items-center
        justify-center
        gap-4
      "
    >

      {/* ===================================== */}
      {/* SPINNER */}
      {/* ===================================== */}

      <div
        className="
          relative
          w-14
          h-14
        "
      >

        {/* OUTER RING */}

        <div
          className="
            absolute
            inset-0
            rounded-full
            border-4
            border-blue-200
          "
        />

        {/* ANIMATED RING */}

        <div
          className="
            absolute
            inset-0
            rounded-full
            border-4
            border-transparent
            border-t-blue-600
            animate-spin
          "
        />

      </div>

      {/* ===================================== */}
      {/* TEXT */}
      {/* ===================================== */}

      <div
        className="
          text-center
        "
      >

        <p
          className="
            text-gray-700
            font-medium
            text-lg
          "
        >
          {text}
        </p>

        <p
          className="
            text-sm
            text-gray-500
            mt-1
          "
        >
          Please wait a moment
        </p>

      </div>

    </div>
  );
};

export default Loader;