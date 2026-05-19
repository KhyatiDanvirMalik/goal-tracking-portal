// frontend/src/pages/Login.jsx

import React, {
  useState
} from 'react';

import {
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';

import {
  useNavigate
} from 'react-router-dom';

import toast from 'react-hot-toast';

import api from '../api/axios';

const Login = () => {

  // ===========================================
  // NAVIGATION
  // ===========================================

  const navigate = useNavigate();

  // ===========================================
  // FORM STATE
  // ===========================================

  const [formData, setFormData] =
    useState({

      email: '',

      password: ''
    });

  // ===========================================
  // LOADING
  // ===========================================

  const [loading, setLoading] =
    useState(false);

  // ===========================================
  // PASSWORD VISIBILITY
  // ===========================================

  const [showPassword,
    setShowPassword] =
    useState(false);

  // ===========================================
  // HANDLE INPUT CHANGE
  // ===========================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    });
  };

  // ===========================================
  // HANDLE LOGIN
  // ===========================================

  const handleLogin = async (
    e
  ) => {

    e.preventDefault();

    // =========================================
    // VALIDATION
    // =========================================

    if (
      !formData.email ||
      !formData.password
    ) {

      return toast.error(
        'Please fill all fields'
      );
    }

    try {

      setLoading(true);

      // =======================================
      // API CALL
      // =======================================

      const response =
        await api.post(
          '/auth/login',
          formData
        );

      // =======================================
      // STORE TOKEN
      // =======================================

      localStorage.setItem(
        'token',
        response.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(
          response.data.user
        )
      );

      toast.success(
        'Login successful'
      );

      // =======================================
      // ROLE-BASED NAVIGATION
      // =======================================

      navigate('/dashboard');

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

    } finally {

      setLoading(false);
    }
  };

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
      {/* LOGIN CARD */}
      {/* ===================================== */}

      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-gray-100
          p-8
        "
      >

        {/* =================================== */}
        {/* HEADER */}
        {/* =================================== */}

        <div
          className="
            text-center
            mb-8
          "
        >

          {/* LOGO */}

          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-2xl
              bg-blue-600
              flex
              items-center
              justify-center
              text-white
              text-3xl
              font-bold
              shadow-lg
              mb-5
            "
          >
            G
          </div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-800
            "
          >
            Welcome Back
          </h1>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Goal Tracking Portal
          </p>

        </div>

        {/* =================================== */}
        {/* FORM */}
        {/* =================================== */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Email Address
            </label>

            <div
              className="
                relative
              "
            >

              <Mail
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="Enter email"
                className="
                  w-full
                  pl-12
                  pr-4
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Password
            </label>

            <div
              className="
                relative
              "
            >

              <Lock
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="Enter password"
                className="
                  w-full
                  pl-12
                  pr-12
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              {/* TOGGLE PASSWORD */}

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              >

                {
                  showPassword
                    ? (
                      <EyeOff size={18} />
                    )
                    : (
                      <Eye size={18} />
                    )
                }

              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              transition
              disabled:opacity-50
            "
          >

            {
              loading
                ? 'Signing In...'
                : 'Login'
            }

          </button>

        </form>

        {/* =================================== */}
        {/* DEMO USERS */}
        {/* =================================== */}

        <div
          className="
            mt-8
            bg-gray-50
            rounded-2xl
            p-4
            text-sm
          "
        >

          <h3
            className="
              font-semibold
              text-gray-700
              mb-3
            "
          >
            Demo Credentials
          </h3>

          <div
            className="
              space-y-2
              text-gray-600
            "
          >

            <p>
              <span className="font-medium">
                Admin:
              </span>
              {' '}
              admin@portal.com
            </p>

            <p>
              <span className="font-medium">
                Manager:
              </span>
              {' '}
              manager@portal.com
            </p>

            <p>
              <span className="font-medium">
                Employee:
              </span>
              {' '}
              john@portal.com
            </p>

            <p>
              <span className="font-medium">
                Password:
              </span>
              {' '}
              password123
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;