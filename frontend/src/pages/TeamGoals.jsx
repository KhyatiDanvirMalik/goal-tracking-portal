// frontend/src/pages/TeamGoals.jsx

import React, {
  useEffect,
  useState
} from 'react';

import {
  Users,
  Search
} from 'lucide-react';

import toast from 'react-hot-toast';

import api from '../api/axios';

import Loader from '../components/Loader';
import GoalTable from '../components/GoalTable';

const TeamGoals = () => {

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

  // ===========================================
  // FETCH TEAM GOALS
  // ===========================================

  const fetchTeamGoals =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.get(
            '/goals/team'
          );

        const goalData =
          response.data.goals || [];

        setGoals(goalData);

        setFilteredGoals(
          goalData
        );

      } catch (error) {

        console.error(
          'FETCH TEAM GOALS ERROR:',
          error
        );

        toast.error(
          'Failed to fetch team goals'
        );

      } finally {

        setLoading(false);
      }
    };

  // ===========================================
  // LOAD DATA
  // ===========================================

  useEffect(() => {

    fetchTeamGoals();

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

          ||

          goal.employee_name
            ?.toLowerCase()
            .includes(searchTerm)
        );
      });

    setFilteredGoals(filtered);

  }, [search, goals]);

  // ===========================================
  // EDIT PLACEHOLDER
  // ===========================================

  const handleEdit = (
    goal
  ) => {

    toast(
      'Edit feature can be added next'
    );

    console.log(
      'EDIT:',
      goal
    );
  };

  // ===========================================
  // DELETE PLACEHOLDER
  // ===========================================

  const handleDelete = (
    goalId
  ) => {

    toast(
      'Managers cannot delete team goals'
    );

    console.log(
      'DELETE:',
      goalId
    );
  };

  // ===========================================
  // LOADING
  // ===========================================

  if (loading) {

    return (
      <Loader text="Loading team goals..." />
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
              flex
              items-center
              gap-3
            "
          >

            <Users
              size={32}
              className="
                text-blue-600
              "
            />

            Team Goals

          </h1>

          <p
            className="
              text-gray-500
              mt-1
            "
          >
            Track your team's performance goals
          </p>

        </div>

        {/* TOTAL */}

        <div
          className="
            px-5
            py-3
            rounded-xl
            bg-blue-100
            text-blue-700
            font-semibold
            w-fit
          "
        >

          Total Goals:
          {' '}
          {filteredGoals.length}

        </div>

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
            placeholder="Search team goals..."
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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ===================================== */}
      {/* TEAM SUMMARY */}
      {/* ===================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
        "
      >

        {/* COMPLETED */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            p-5
            shadow-sm
          "
        >

          <h3
            className="
              text-sm
              text-gray-500
            "
          >
            Completed Goals
          </h3>

          <p
            className="
              text-3xl
              font-bold
              text-green-600
              mt-2
            "
          >

            {
              goals.filter(
                (goal) =>
                  goal.status ===
                  'Completed'
              ).length
            }

          </p>

        </div>

        {/* ON TRACK */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            p-5
            shadow-sm
          "
        >

          <h3
            className="
              text-sm
              text-gray-500
            "
          >
            On Track
          </h3>

          <p
            className="
              text-3xl
              font-bold
              text-blue-600
              mt-2
            "
          >

            {
              goals.filter(
                (goal) =>
                  goal.status ===
                  'On Track'
              ).length
            }

          </p>

        </div>

        {/* PENDING */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            p-5
            shadow-sm
          "
        >

          <h3
            className="
              text-sm
              text-gray-500
            "
          >
            Pending Goals
          </h3>

          <p
            className="
              text-3xl
              font-bold
              text-orange-500
              mt-2
            "
          >

            {
              goals.filter(
                (goal) =>
                  goal.status ===
                  'Not Started'
              ).length
            }

          </p>

        </div>

      </div>

    </div>
  );
};

export default TeamGoals;