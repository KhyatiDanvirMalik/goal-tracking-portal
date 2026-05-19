// frontend/src/pages/Users.jsx

import React, {
  useEffect,
  useState
} from 'react';

import {
  Plus,
  Search,
  Trash2,
  UserPlus
} from 'lucide-react';

import toast from 'react-hot-toast';

import api from '../api/axios';

import Loader from '../components/Loader';

const Users = () => {

  // ===========================================
  // STATES
  // ===========================================

  const [users, setUsers] =
    useState([]);

  const [filteredUsers,
    setFilteredUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [showModal,
    setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({

      employee_id: '',

      name: '',

      email: '',

      password: '',

      role: 'employee',

      department: ''
    });

  // ===========================================
  // FETCH USERS
  // ===========================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const response =
        await api.get('/users');

      const userData =
        response.data.users || [];

      setUsers(userData);

      setFilteredUsers(userData);

    } catch (error) {

      console.error(
        'FETCH USERS ERROR:',
        error
      );

      toast.error(
        'Failed to load users'
      );

    } finally {

      setLoading(false);
    }
  };

  // ===========================================
  // LOAD DATA
  // ===========================================

  useEffect(() => {

    fetchUsers();

  }, []);

  // ===========================================
  // SEARCH FILTER
  // ===========================================

  useEffect(() => {

    const filtered =
      users.filter((user) => {

        const term =
          search.toLowerCase();

        return (

          user.name
            ?.toLowerCase()
            .includes(term)

          ||

          user.email
            ?.toLowerCase()
            .includes(term)

          ||

          user.role
            ?.toLowerCase()
            .includes(term)

          ||

          user.department
            ?.toLowerCase()
            .includes(term)
        );
      });

    setFilteredUsers(filtered);

  }, [search, users]);

  // ===========================================
  // HANDLE INPUT
  // ===========================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    });
  };

  // ===========================================
  // CREATE USER
  // ===========================================

  const handleCreateUser =
    async (e) => {

      e.preventDefault();

      try {

        await api.post(
          '/users',
          formData
        );

        toast.success(
          'User created successfully'
        );

        setShowModal(false);

        fetchUsers();

        // RESET FORM

        setFormData({

          employee_id: '',

          name: '',

          email: '',

          password: '',

          role: 'employee',

          department: ''
        });

      } catch (error) {

        console.error(
          'CREATE USER ERROR:',
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          'Failed to create user'
        );
      }
    };

  // ===========================================
  // DELETE USER
  // ===========================================

  const handleDeleteUser =
    async (id) => {

      const confirmDelete =
        window.confirm(
          'Delete this user?'
        );

      if (!confirmDelete) {
        return;
      }

      try {

        await api.delete(
          `/users/${id}`
        );

        toast.success(
          'User deleted successfully'
        );

        fetchUsers();

      } catch (error) {

        console.error(
          'DELETE USER ERROR:',
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          'Failed to delete user'
        );
      }
    };

  // ===========================================
  // LOADING
  // ===========================================

  if (loading) {

    return (
      <Loader text="Loading users..." />
    );
  }

  return (

    <div
      className="
        p-4
        md:p-6
        space-y-6
      "
    >

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-800
              flex
              items-center
              gap-3
            "
          >

            <UserPlus
              className="
                text-blue-600
              "
            />

            Users

          </h1>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Manage employees and managers
          </p>

        </div>

        {/* ADD BUTTON */}

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-medium
            transition
            w-fit
          "
        >

          <Plus size={20} />

          Add User

        </button>

      </div>

      {/* ===================================== */}
      {/* SEARCH */}
      {/* ===================================== */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          p-4
        "
      >

        <div
          className="
            relative
          "
        >

          <Search
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
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
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

      {/* ===================================== */}
      {/* TABLE */}
      {/* ===================================== */}

      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table
            className="
              min-w-full
            "
          >

            <thead
              className="
                bg-gray-50
              "
            >

              <tr>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-gray-500
                    uppercase
                  "
                >
                  Employee
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-gray-500
                    uppercase
                  "
                >
                  Email
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-gray-500
                    uppercase
                  "
                >
                  Role
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-gray-500
                    uppercase
                  "
                >
                  Department
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-right
                    text-xs
                    font-semibold
                    text-gray-500
                    uppercase
                  "
                >
                  Actions
                </th>

              </tr>

            </thead>

            <tbody
              className="
                divide-y
                divide-gray-100
              "
            >

              {
                filteredUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                      className="
                        hover:bg-gray-50
                      "
                    >

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <div>

                          <h3
                            className="
                              text-sm
                              font-semibold
                              text-gray-800
                            "
                          >
                            {user.name}
                          </h3>

                          <p
                            className="
                              text-xs
                              text-gray-500
                              mt-1
                            "
                          >
                            {
                              user.employee_id
                            }
                          </p>

                        </div>

                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          text-sm
                          text-gray-700
                        "
                      >
                        {user.email}
                      </td>

                      <td
                        className="
                          px-6
                          py-5
                        "
                      >

                        <span
                          className="
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            bg-blue-100
                            text-blue-700
                            capitalize
                          "
                        >
                          {user.role}
                        </span>

                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          text-sm
                          text-gray-700
                        "
                      >
                        {
                          user.department ||
                          '-'
                        }
                      </td>

                      <td
                        className="
                          px-6
                          py-5
                          text-right
                        "
                      >

                        <button
                          onClick={() =>
                            handleDeleteUser(
                              user.id
                            )
                          }
                          className="
                            p-2
                            rounded-lg
                            bg-red-100
                            hover:bg-red-200
                            text-red-600
                            transition
                          "
                        >

                          <Trash2 size={16} />

                        </button>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

      {/* ===================================== */}
      {/* MODAL */}
      {/* ===================================== */}

      {
        showModal && (

          <div
            className="
              fixed
              inset-0
              bg-black/50
              z-50
              flex
              items-center
              justify-center
              p-4
            "
          >

            <div
              className="
                w-full
                max-w-xl
                bg-white
                rounded-2xl
                p-6
              "
            >

              <h2
                className="
                  text-2xl
                  font-bold
                  text-gray-800
                  mb-6
                "
              >
                Create User
              </h2>

              <form
                onSubmit={
                  handleCreateUser
                }
                className="
                  space-y-4
                "
              >

                <input
                  type="text"
                  name="employee_id"
                  placeholder="Employee ID"
                  value={
                    formData.employee_id
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                  "
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                  "
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                  "
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                  "
                />

                <select
                  name="role"
                  value={
                    formData.role
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                  "
                >

                  <option value="employee">
                    Employee
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                </select>

                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={
                    formData.department
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                  "
                />

                {/* BUTTONS */}

                <div
                  className="
                    flex
                    justify-end
                    gap-3
                    pt-3
                  "
                >

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(
                        false
                      )
                    }
                    className="
                      px-5
                      py-3
                      rounded-xl
                      border
                      border-gray-300
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      px-5
                      py-3
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                    "
                  >
                    Create User
                  </button>

                </div>

              </form>

            </div>

          </div>
        )
      }

    </div>
  );
};

export default Users;