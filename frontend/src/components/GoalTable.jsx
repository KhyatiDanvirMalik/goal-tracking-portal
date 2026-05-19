// frontend/src/components/GoalTable.jsx

import React from 'react';

import {
  Pencil,
  Trash2,
  CheckCircle2,
  Clock3,
  TrendingUp
} from 'lucide-react';

const GoalTable = ({
  goals = [],
  onEdit,
  onDelete
}) => {

  // ===========================================
  // STATUS BADGE
  // ===========================================

  const getStatusBadge = (
    status
  ) => {

    switch (status) {

      case 'Completed':

        return (
          <span
            className="
              flex
              items-center
              gap-1
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              bg-green-100
              text-green-700
              w-fit
            "
          >

            <CheckCircle2 size={14} />

            Completed

          </span>
        );

      case 'On Track':

        return (
          <span
            className="
              flex
              items-center
              gap-1
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              bg-blue-100
              text-blue-700
              w-fit
            "
          >

            <TrendingUp size={14} />

            On Track

          </span>
        );

      default:

        return (
          <span
            className="
              flex
              items-center
              gap-1
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              bg-gray-100
              text-gray-700
              w-fit
            "
          >

            <Clock3 size={14} />

            Not Started

          </span>
        );
    }
  };

  // ===========================================
  // PROGRESS %
  // ===========================================

  const calculateProgress = (
    goal
  ) => {

    if (
      !goal.target_value ||
      goal.target_value === 0
    ) {
      return 0;
    }

    return Math.min(
      (
        (goal.achievement_value || 0) /
        goal.target_value
      ) * 100,
      100
    ).toFixed(0);
  };

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        overflow-hidden
      "
    >

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div
        className="
          px-6
          py-5
          border-b
          border-gray-200
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-bold
              text-gray-800
            "
          >
            Goals
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Track and manage goals
          </p>

        </div>

        <div
          className="
            text-sm
            text-gray-500
          "
        >
          Total: {goals.length}
        </div>

      </div>

      {/* ===================================== */}
      {/* TABLE */}
      {/* ===================================== */}

      <div className="overflow-x-auto">

        <table
          className="
            min-w-full
            divide-y
            divide-gray-200
          "
        >

          {/* TABLE HEAD */}

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
                Target
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
                Achievement
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
                Weightage
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

          {/* TABLE BODY */}

          <tbody
            className="
              divide-y
              divide-gray-100
            "
          >

            {
              goals.length > 0 ? (

                goals.map((goal) => (

                  <tr
                    key={goal.id}
                    className="
                      hover:bg-gray-50
                      transition
                    "
                  >

                    {/* GOAL */}

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
                          {goal.title}
                        </h3>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            mt-1
                          "
                        >
                          {
                            goal.thrust_area
                          }
                        </p>

                      </div>

                    </td>

                    {/* TARGET */}

                    <td
                      className="
                        px-6
                        py-5
                        text-sm
                        text-gray-700
                      "
                    >
                      {goal.target_value}
                    </td>

                    {/* ACHIEVEMENT */}

                    <td
                      className="
                        px-6
                        py-5
                        text-sm
                        text-gray-700
                      "
                    >
                      {
                        goal.achievement_value ||
                        0
                      }
                    </td>

                    {/* PROGRESS */}

                    <td
                      className="
                        px-6
                        py-5
                        min-w-[180px]
                      "
                    >

                      <div>

                        <div
                          className="
                            flex
                            justify-between
                            text-xs
                            mb-1
                          "
                        >

                          <span>
                            {
                              calculateProgress(
                                goal
                              )
                            }%
                          </span>

                        </div>

                        <div
                          className="
                            w-full
                            h-2.5
                            bg-gray-200
                            rounded-full
                            overflow-hidden
                          "
                        >

                          <div
                            className="
                              h-full
                              bg-blue-600
                              rounded-full
                            "
                            style={{
                              width: `${
                                calculateProgress(
                                  goal
                                )
                              }%`
                            }}
                          />

                        </div>

                      </div>

                    </td>

                    {/* STATUS */}

                    <td
                      className="
                        px-6
                        py-5
                      "
                    >
                      {
                        getStatusBadge(
                          goal.status
                        )
                      }
                    </td>

                    {/* WEIGHTAGE */}

                    <td
                      className="
                        px-6
                        py-5
                        text-sm
                        font-medium
                        text-gray-700
                      "
                    >
                      {goal.weightage}%
                    </td>

                    {/* ACTIONS */}

                    <td
                      className="
                        px-6
                        py-5
                        text-right
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-end
                          gap-2
                        "
                      >

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            onEdit(goal)
                          }
                          className="
                            p-2
                            rounded-lg
                            bg-blue-100
                            hover:bg-blue-200
                            text-blue-700
                            transition
                          "
                        >

                          <Pencil size={16} />

                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            onDelete(goal.id)
                          }
                          className="
                            p-2
                            rounded-lg
                            bg-red-100
                            hover:bg-red-200
                            text-red-700
                            transition
                          "
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                    </td>

                  </tr>
                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="
                      py-14
                      text-center
                      text-gray-500
                    "
                  >

                    No goals found

                  </td>

                </tr>
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default GoalTable;