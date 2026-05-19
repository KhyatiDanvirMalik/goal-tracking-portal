// frontend/src/components/GoalForm.jsx

import React, {
  useState
} from 'react';

import toast from 'react-hot-toast';

import api from '../api/axios';

const GoalForm = ({
  fetchGoals,
  closeModal
}) => {

  // ===========================================
  // FORM STATE
  // ===========================================

  const [formData, setFormData] =
    useState({

      thrust_area: '',

      title: '',

      description: '',

      uom_type: 'min',

      target_value: '',

      weightage: '',

      cycle_id: 1
    });

  // ===========================================
  // LOADING
  // ===========================================

  const [loading, setLoading] =
    useState(false);

  // ===========================================
  // HANDLE CHANGE
  // ===========================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    });
  };

  // ===========================================
  // SUBMIT FORM
  // ===========================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    // =========================================
    // VALIDATION
    // =========================================

    if (
      !formData.title ||
      !formData.thrust_area ||
      !formData.target_value ||
      !formData.weightage
    ) {

      return toast.error(
        'Please fill all required fields'
      );
    }

    try {

      setLoading(true);

      // =======================================
      // API CALL
      // =======================================

      await api.post(
        '/goals',
        {
          goals: [
            {
              ...formData,

              target_value:
                Number(
                  formData.target_value
                ),

              weightage:
                Number(
                  formData.weightage
                )
            }
          ]
        }
      );

      toast.success(
        'Goal created successfully'
      );

      // =======================================
      // REFRESH GOALS
      // =======================================

      if (fetchGoals) {
        fetchGoals();
      }

      // =======================================
      // CLOSE MODAL
      // =======================================

      if (closeModal) {
        closeModal();
      }

      // =======================================
      // RESET FORM
      // =======================================

      setFormData({

        thrust_area: '',

        title: '',

        description: '',

        uom_type: 'min',

        target_value: '',

        weightage: '',

        cycle_id: 1
      });

    } catch (error) {

      console.error(
        'CREATE GOAL ERROR:',
        error
      );

      toast.error(
        error?.response?.data
          ?.message ||
        'Failed to create goal'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      className="
        bg-white
        rounded-2xl
        p-6
        shadow-lg
        border
        border-gray-200
        w-full
      "
    >

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="mb-6">

        <h2
          className="
            text-2xl
            font-bold
            text-gray-800
          "
        >
          Create Goal
        </h2>

        <p
          className="
            text-sm
            text-gray-500
            mt-1
          "
        >
          Add a new performance goal
        </p>

      </div>

      {/* ===================================== */}
      {/* FORM */}
      {/* ===================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* =================================== */}
        {/* THRUST AREA */}
        {/* =================================== */}

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
            Thrust Area
          </label>

          <input
            type="text"
            name="thrust_area"
            value={
              formData.thrust_area
            }
            onChange={handleChange}
            placeholder="Enter thrust area"
            className="
              w-full
              px-4
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

        {/* =================================== */}
        {/* TITLE */}
        {/* =================================== */}

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
            Goal Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter goal title"
            className="
              w-full
              px-4
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

        {/* =================================== */}
        {/* DESCRIPTION */}
        {/* =================================== */}

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
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            placeholder="Enter goal description"
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-gray-300
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              resize-none
            "
          />

        </div>

        {/* =================================== */}
        {/* UOM + TARGET */}
        {/* =================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >

          {/* UOM */}

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
              UOM Type
            </label>

            <select
              name="uom_type"
              value={
                formData.uom_type
              }
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-300
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            >

              <option value="min">
                Min
              </option>

              <option value="max">
                Max
              </option>

              <option value="timeline">
                Timeline
              </option>

              <option value="zero">
                Zero
              </option>

            </select>

          </div>

          {/* TARGET */}

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
              Target Value
            </label>

            <input
              type="number"
              name="target_value"
              value={
                formData.target_value
              }
              onChange={handleChange}
              placeholder="Enter target"
              className="
                w-full
                px-4
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

        {/* =================================== */}
        {/* WEIGHTAGE */}
        {/* =================================== */}

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
            Weightage (%)
          </label>

          <input
            type="number"
            name="weightage"
            value={
              formData.weightage
            }
            onChange={handleChange}
            placeholder="Enter weightage"
            className="
              w-full
              px-4
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

        {/* =================================== */}
        {/* BUTTONS */}
        {/* =================================== */}

        <div
          className="
            flex
            items-center
            justify-end
            gap-3
            pt-4
          "
        >

          {/* CANCEL */}

          <button
            type="button"
            onClick={closeModal}
            className="
              px-5
              py-3
              rounded-xl
              border
              border-gray-300
              hover:bg-gray-100
              transition
            "
          >
            Cancel
          </button>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="
              px-5
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              transition
              disabled:opacity-50
            "
          >

            {
              loading
                ? 'Creating...'
                : 'Create Goal'
            }

          </button>

        </div>

      </form>

    </div>
  );
};

export default GoalForm;