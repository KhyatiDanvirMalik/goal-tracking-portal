// frontend/src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';

import {
  Target,
  CheckCircle2,
  Clock3,
  TrendingUp
} from 'lucide-react';

import toast from 'react-hot-toast';

import api from '../api/axios';

import Loader from '../components/Loader';
import GoalCard from '../components/GoalCard';

const Dashboard = () => {

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  // ===========================================
  // FETCH GOALS
  // ===========================================

  const fetchGoals = async () => {

    try {

      setLoading(true);

      let response;

      // MANAGER + ADMIN
      // SHOULD SEE TEAM GOALS

      if (
        user?.role === 'manager' ||
        user?.role === 'admin'
      ) {

        response = await api.get(
          '/goals/team'
        );

      }

      // EMPLOYEE
      // SHOULD SEE ONLY OWN GOALS

      else {

        response = await api.get(
          '/goals/my'
        );
      }

      setGoals(
        response.data.goals || []
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to load dashboard'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchGoals();

  }, []);

  // ===========================================
  // CALCULATIONS
  // ===========================================

  const totalGoals = goals.length;

  const completedGoals =
    goals.filter(
      (goal) =>
        goal.status === 'Completed'
    ).length;

  const onTrackGoals =
    goals.filter(
      (goal) =>
        goal.status === 'On Track'
    ).length;

  const pendingGoals =
    goals.filter(
      (goal) =>
        goal.status === 'Not Started'
    ).length;

  const completionRate =
    totalGoals > 0
      ? (
          goals.reduce((sum, goal) => {

            const progress =
              goal.status === 'Completed'
                ? 100
                : goal.target_value > 0
                ? Math.round(
                    (goal.achievement_value * 100) /
                    goal.target_value
                  )
                : 0;

            return sum + progress;

          }, 0) / totalGoals
        ).toFixed(0)
      : 0;

  // ===========================================
  // LOADER
  // ===========================================

  if (loading) {

    return (
      <Loader text="Loading dashboard..." />
    );
  }

  return (

    <div className="p-4 md:p-6 space-y-6">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-gray-800
          ">
            Dashboard
          </h1>

          <p className="
            text-gray-500
            mt-1
          ">
            Welcome back, {user?.name}
          </p>

        </div>

        <div className="
          px-4
          py-2
          rounded-xl
          bg-blue-100
          text-blue-700
          text-sm
          font-semibold
          capitalize
          w-fit
        ">
          {user?.role}
        </div>

      </div>

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5
      ">

        {/* TOTAL */}

        <div className="
          bg-white
          rounded-2xl
          p-5
          shadow-sm
          border
          border-gray-200
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                Total Goals
              </p>

              <h2 className="
                text-3xl
                font-bold
                text-gray-800
                mt-2
              ">
                {totalGoals}
              </h2>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-blue-100
              flex
              items-center
              justify-center
            ">
              <Target className="text-blue-600" />
            </div>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="
          bg-white
          rounded-2xl
          p-5
          shadow-sm
          border
          border-gray-200
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                Completed
              </p>

              <h2 className="
                text-3xl
                font-bold
                text-green-600
                mt-2
              ">
                {completedGoals}
              </h2>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-green-100
              flex
              items-center
              justify-center
            ">
              <CheckCircle2 className="text-green-600" />
            </div>

          </div>

        </div>

        {/* ON TRACK */}

        <div className="
          bg-white
          rounded-2xl
          p-5
          shadow-sm
          border
          border-gray-200
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                On Track
              </p>

              <h2 className="
                text-3xl
                font-bold
                text-blue-600
                mt-2
              ">
                {onTrackGoals}
              </h2>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-blue-100
              flex
              items-center
              justify-center
            ">
              <TrendingUp className="text-blue-600" />
            </div>

          </div>

        </div>

        {/* PENDING */}

        <div className="
          bg-white
          rounded-2xl
          p-5
          shadow-sm
          border
          border-gray-200
        ">

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                Pending
              </p>

              <h2 className="
                text-3xl
                font-bold
                text-orange-500
                mt-2
              ">
                {pendingGoals}
              </h2>

            </div>

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-orange-100
              flex
              items-center
              justify-center
            ">
              <Clock3 className="text-orange-500" />
            </div>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* COMPLETION OVERVIEW */}
      {/* ===================================== */}

      <div className="
        bg-white
        rounded-2xl
        p-6
        shadow-sm
        border
        border-gray-200
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-4
        ">

          <h2 className="
            text-xl
            font-bold
            text-gray-800
          ">
            Completion Overview
          </h2>

          <span className="
            text-2xl
            font-bold
            text-blue-600
          ">
            {completionRate}%
          </span>

        </div>

        <div className="
          w-full
          h-5
          bg-gray-200
          rounded-full
          overflow-hidden
        ">

          <div
            className="
              h-full
              bg-blue-600
              rounded-full
              transition-all
              duration-500
            "
            style={{
              width: `${completionRate}%`
            }}
          />

        </div>

      </div>

      {/* ===================================== */}
      {/* RECENT GOALS */}
      {/* ===================================== */}

      <div>

        <h2 className="
          text-2xl
          font-bold
          text-gray-800
          mb-5
        ">
          Recent Goals
        </h2>

        {
          goals.length === 0 ? (

            <div className="
              bg-white
              rounded-2xl
              p-10
              text-center
              border
              border-gray-200
            ">

              <p className="text-gray-500">
                No goals found.
              </p>

            </div>

          ) : (

            <div className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-5
            ">

              {
                goals
                  .slice(0, 6)
                  .map((goal) => (

                    <GoalCard
                      key={goal.id}
                      goal={goal}
                    />
                  ))
              }

            </div>

          )
        }

      </div>

    </div>
  );
};

export default Dashboard;