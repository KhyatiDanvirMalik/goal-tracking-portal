// frontend/src/components/GoalCard.jsx

import React from 'react';

import {
  Target,
  TrendingUp,
  CheckCircle2,
  Clock3
} from 'lucide-react';

const GoalCard = ({ goal }) => {

  // ===========================================
  // PROGRESS %
  // ===========================================

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

  // ===========================================
  // STATUS COLORS
  // ===========================================

  const statusStyles = {

    Completed:
      'bg-green-100 text-green-700',

    'On Track':
      'bg-blue-100 text-blue-700',

    'Not Started':
      'bg-gray-100 text-gray-700'
  };

  // ===========================================
  // STATUS ICONS
  // ===========================================

  const renderStatusIcon = () => {

    switch (goal.status) {

      case 'Completed':
        return (
          <CheckCircle2 size={18} />
        );

      case 'On Track':
        return (
          <TrendingUp size={18} />
        );

      default:
        return (
          <Clock3 size={18} />
        );
    }
  };

  return (

    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        p-5
        hover:shadow-md
        transition
      "
    >

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div
        className="
          flex
          items-start
          justify-between
          mb-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          {/* ICON */}

          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-blue-100
              text-blue-600
              flex
              items-center
              justify-center
            "
          >

            <Target size={22} />

          </div>

          {/* TITLE */}

          <div>

            <h2
              className="
                text-lg
                font-semibold
                text-gray-800
              "
            >
              {goal.title}
            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              {goal.thrust_area}
            </p>

          </div>

        </div>

        {/* STATUS */}

        <div
          className={`
            flex
            items-center
            gap-1
            px-3
            py-1
            rounded-full
            text-xs
            font-medium

            ${
              statusStyles[
                goal.status
              ]
            }
          `}
        >

          {renderStatusIcon()}

          {goal.status}

        </div>

      </div>

      {/* ===================================== */}
      {/* DESCRIPTION */}
      {/* ===================================== */}

      <p
        className="
          text-sm
          text-gray-600
          mb-5
          line-clamp-2
        "
      >
        {
          goal.description ||
          'No description available.'
        }
      </p>

      {/* ===================================== */}
      {/* TARGET + ACHIEVEMENT */}
      {/* ===================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-4
          mb-5
        "
      >

        {/* TARGET */}

        <div
          className="
            bg-gray-50
            rounded-xl
            p-3
          "
        >

          <p
            className="
              text-xs
              text-gray-500
              mb-1
            "
          >
            Target
          </p>

          <h3
            className="
              text-lg
              font-bold
              text-gray-800
            "
          >
            {goal.target_value}
          </h3>

        </div>

        {/* ACHIEVEMENT */}

        <div
          className="
            bg-gray-50
            rounded-xl
            p-3
          "
        >

          <p
            className="
              text-xs
              text-gray-500
              mb-1
            "
          >
            Achievement
          </p>

          <h3
            className="
              text-lg
              font-bold
              text-gray-800
            "
          >
            {
              goal.achievement_value ||
              0
            }
          </h3>

        </div>

      </div>

      {/* ===================================== */}
      {/* PROGRESS BAR */}
      {/* ===================================== */}

      <div className="mb-4">

        <div
          className="
            flex
            items-center
            justify-between
            mb-2
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-gray-700
            "
          >
            Progress
          </p>

          <p
            className="
              text-sm
              font-semibold
              text-blue-600
            "
          >
            {progress.toFixed(0)}%
          </p>

        </div>

        {/* BAR */}

        <div
          className="
            w-full
            h-3
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
              transition-all
              duration-500
            "
            style={{
              width: `${progress}%`
            }}
          />

        </div>

      </div>

      {/* ===================================== */}
      {/* FOOTER */}
      {/* ===================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          pt-4
          border-t
          border-gray-100
        "
      >

        {/* WEIGHTAGE */}

        <div>

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Weightage
          </p>

          <p
            className="
              text-sm
              font-semibold
              text-gray-700
            "
          >
            {goal.weightage}%
          </p>

        </div>

        {/* APPROVAL */}

        <div
          className="
            text-right
          "
        >

          <p
            className="
              text-xs
              text-gray-500
            "
          >
            Approval
          </p>

          <p
            className="
              text-sm
              font-semibold
              capitalize
              text-gray-700
            "
          >
            {
              goal.approval_status
            }
          </p>

        </div>

      </div>

    </div>
  );
};

export default GoalCard;