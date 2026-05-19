// frontend/src/pages/Goals.jsx

import React, {
  useEffect,
  useState
} from 'react';

import {
  Plus,
  Search
} from 'lucide-react';

import toast from 'react-hot-toast';

import api from '../api/axios';

import Loader from '../components/Loader';
import GoalTable from '../components/GoalTable';
import GoalForm from '../components/GoalForm';

const Goals = () => {

  // ===========================================
  // STATES
  // ===========================================

  const [goals, setGoals] =
    useState([]);

  const [filteredGoals,
    setFilteredGoals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [showModal,
    setShowModal] =
    useState(false);

  // ===========================================
  // FETCH GOALS
  // ===========================================

  const fetchGoals = async () => {

    try {

      setLoading(true);

      const response =
        await api.get('/goals/my');

      const goalData =
        response.data.goals || [];

      setGoals(goalData);

      setFilteredGoals(goalData);

    } catch (error) {

      console.error(
        'FETCH GOALS ERROR:',
        error
      );

      toast.error(
        'Failed to fetch goals'
      );

    } finally {

      setLoading(false);
    }
  };

  // ===========================================
  // LOAD DATA
  // ===========================================

  useEffect(() => {

    fetchGoals();

  }, []);

  // ===========================================
  // SEARCH FILTER
  // ===========================================

  useEffect(() => {

    const filtered =
      goals.filter((goal) => {

        const searchTerm =
          search.toLowerCase();

        return (

          goal.title
            ?.toLowerCase()
            .includes(searchTerm)

          ||

          goal.thrust_area
            ?.toLowerCase()
            .includes(searchTerm)

          ||

          goal.status
            ?.toLowerCase()
            .includes(searchTerm)
        );
      });

    setFilteredGoals(filtered);

  }, [search, goals]);

  // ===========================================
  // DELETE GOAL
  // ===========================================

  const handleDelete = async (
    goalId
  ) => {

    const confirmDelete =
      window.confirm(
        'Are you sure you want to delete this goal?'
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/goals/${goalId}`
      );

      toast.success(
        'Goal deleted successfully'
      );

      fetchGoals();

    } catch (error) {

      console.error(
        'DELETE GOAL ERROR:',
        error
      );

      toast.error(
        error?.response?.data
          ?.message ||
        'Failed to delete goal'
      );
    }
  };

  // ===========================================
  // EDIT GOAL
  // ===========================================

  const handleEdit = (
    goal
  ) => {

    toast(
      'Edit functionality can be added next'
    );

    console.log(
      'EDIT GOAL:',
      goal
    );
  };

  // ===========================================
  // LOADING
  // ===========================================

  if (loading) {

    return (
      <Loader text="Loading goals..." />
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
      {/* PAGE HEADER */}
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
            "
          >
            My Goals
          </h1>

          <p
            className="
              text-gray-500
              mt-1
            "
          >
            Create and manage your goals
          </p>

        </div>

        {/* ADD GOAL BUTTON */}

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

          Add Goal

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
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search goals..."
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
      {/* GOALS TABLE */}
      {/* ===================================== */}

      <GoalTable
        goals={filteredGoals}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

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
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
              "
            >

              <GoalForm
                fetchGoals={
                  fetchGoals
                }
                closeModal={() =>
                  setShowModal(
                    false
                  )
                }
              />

            </div>

          </div>
        )
      }

    </div>
  );
};

export default Goals;