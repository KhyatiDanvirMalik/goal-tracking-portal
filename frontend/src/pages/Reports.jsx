// frontend/src/pages/Reports.jsx

import React, {
  useEffect,
  useState
} from 'react';

import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock3
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

import toast from 'react-hot-toast';

import api from '../api/axios';

import Loader from '../components/Loader';

const Reports = () => {

  // ===========================================
  // STATES
  // ===========================================

  const [goals, setGoals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ===========================================
  // USER
  // ===========================================

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  // ===========================================
  // FETCH DATA
  // ===========================================

  const fetchReports = async () => {

    try {

      setLoading(true);

      let endpoint =
        '/goals/my';

      if (
        user?.role === 'manager' ||
        user?.role === 'admin'
      ) {

        endpoint = '/goals/team';
      }

      const response =
        await api.get(endpoint);

      setGoals(
        response.data.goals || []
      );

    } catch (error) {

      console.error(
        'REPORT FETCH ERROR:',
        error
      );

      toast.error(
        'Failed to load reports'
      );

    } finally {

      setLoading(false);
    }
  };

  // ===========================================
  // LOAD DATA
  // ===========================================

  useEffect(() => {

    fetchReports();

  }, []);

  // ===========================================
  // CALCULATIONS
  // ===========================================

  const completed =
    goals.filter(
      (goal) =>
        goal.status ===
        'Completed'
    ).length;

  const onTrack =
    goals.filter(
      (goal) =>
        goal.status ===
        'On Track'
    ).length;

  const pending =
    goals.filter(
      (goal) =>
        goal.status ===
        'Not Started'
    ).length;

  const totalGoals =
    goals.length;

  // ===========================================
  // PIE DATA
  // ===========================================

  const pieData = [

    {
      name: 'Completed',
      value: completed
    },

    {
      name: 'On Track',
      value: onTrack
    },

    {
      name: 'Pending',
      value: pending
    }
  ];

  // ===========================================
  // BAR DATA
  // ===========================================

  const barData =
    goals.map((goal) => {

      const progress =
        goal.target_value > 0
          ? Math.min(
              (
                (goal.achievement_value || 0) /
                goal.target_value
              ) * 100,
              100
            )
          : 0;

      return {

        name:
          goal.title.length > 15
            ? `${goal.title.slice(0, 15)}...`
            : goal.title,

        progress:
          Number(
            progress.toFixed(0)
          )
      };
    });

  // ===========================================
  // COLORS
  // ===========================================

  const COLORS = [

    '#22c55e',
    '#3b82f6',
    '#f59e0b'
  ];

  // ===========================================
  // LOADING
  // ===========================================

  if (loading) {

    return (
      <Loader text="Loading reports..." />
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

          <BarChart3
            className="
              text-blue-600
            "
          />

          Reports & Analytics

        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Analyze goal performance and progress
        </p>

      </div>

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
        "
      >

        {/* TOTAL */}

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

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Total Goals
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  text-gray-800
                  mt-2
                "
              >
                {totalGoals}
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
              "
            >

              <TrendingUp size={28} />

            </div>

          </div>

        </div>

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

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Completed
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  text-green-600
                  mt-2
                "
              >
                {completed}
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-green-100
                text-green-600
                flex
                items-center
                justify-center
              "
            >

              <CheckCircle2 size={28} />

            </div>

          </div>

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

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                On Track
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  text-blue-600
                  mt-2
                "
              >
                {onTrack}
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
              "
            >

              <TrendingUp size={28} />

            </div>

          </div>

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

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Pending
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  text-orange-500
                  mt-2
                "
              >
                {pending}
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-orange-100
                text-orange-500
                flex
                items-center
                justify-center
              "
            >

              <Clock3 size={28} />

            </div>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* CHARTS */}
      {/* ===================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        {/* PIE CHART */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            p-6
            shadow-sm
          "
        >

          <h2
            className="
              text-xl
              font-bold
              text-gray-800
              mb-6
            "
          >
            Goal Distribution
          </h2>

          <div
            className="
              h-[320px]
            "
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  dataKey="value"
                  label
                >

                  {
                    pieData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />
                      )
                    )
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* BAR CHART */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            p-6
            shadow-sm
          "
        >

          <h2
            className="
              text-xl
              font-bold
              text-gray-800
              mb-6
            "
          >
            Goal Progress
          </h2>

          <div
            className="
              h-[320px]
            "
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={barData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="progress"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* TABLE SUMMARY */}
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

        <div
          className="
            px-6
            py-5
            border-b
            border-gray-200
          "
        >

          <h2
            className="
              text-xl
              font-bold
              text-gray-800
            "
          >
            Goal Summary
          </h2>

        </div>

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
                  Goal
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
                  Status
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
                  Progress
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
                goals.map((goal) => {

                  const progress =
                    goal.target_value > 0
                      ? Math.min(
                          (
                            (goal.achievement_value || 0) /
                            goal.target_value
                          ) * 100,
                          100
                        )
                      : 0;

                  return (

                    <tr key={goal.id}>

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          font-medium
                          text-gray-800
                        "
                      >
                        {goal.title}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          text-gray-600
                        "
                      >
                        {goal.status}
                      </td>

                      <td
                        className="
                          px-6
                          py-4
                          text-sm
                          font-semibold
                          text-blue-600
                        "
                      >
                        {
                          progress.toFixed(
                            0
                          )
                        }%
                      </td>

                    </tr>
                  );
                })
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Reports;