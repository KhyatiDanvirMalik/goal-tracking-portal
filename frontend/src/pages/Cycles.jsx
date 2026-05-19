// frontend/src/pages/Cycles.jsx

import React, {
  useEffect,
  useState
} from 'react';

import {
  CalendarRange,
  Plus,
  Trash2
} from 'lucide-react';

import toast from 'react-hot-toast';

import api from '../api/axios';

import Loader from '../components/Loader';

const Cycles = () => {

  // ===========================================
  // STATES
  // ===========================================

  const [cycles, setCycles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal,
    setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name: '',

      quarter: 'Q1',

      start_date: '',

      end_date: ''
    });

  // ===========================================
  // FETCH CYCLES
  // ===========================================

  const fetchCycles = async () => {

    try {

      setLoading(true);

      const response =
        await api.get('/cycles');

      setCycles(
        response.data.cycles || []
      );

    } catch (error) {

      console.error(
        'FETCH CYCLES ERROR:',
        error
      );

      toast.error(
        'Failed to fetch cycles'
      );

    } finally {

      setLoading(false);
    }
  };

  // ===========================================
  // LOAD DATA
  // ===========================================

  useEffect(() => {

    fetchCycles();

  }, []);

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
  // CREATE CYCLE
  // ===========================================

  const handleCreateCycle =
    async (e) => {

      e.preventDefault();

      try {

        await api.post(
          '/cycles',
          formData
        );

        toast.success(
          'Cycle created successfully'
        );

        setShowModal(false);

        fetchCycles();

        // RESET

        setFormData({

          name: '',

          quarter: 'Q1',

          start_date: '',

          end_date: ''
        });

      } catch (error) {

        console.error(
          'CREATE CYCLE ERROR:',
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          'Failed to create cycle'
        );
      }
    };

  // ===========================================
  // DELETE CYCLE
  // ===========================================

  const handleDeleteCycle =
    async (id) => {

      const confirmDelete =
        window.confirm(
          'Delete this cycle?'
        );

      if (!confirmDelete) {
        return;
      }

      try {

        await api.delete(
          `/cycles/${id}`
        );

        toast.success(
          'Cycle deleted successfully'
        );

        fetchCycles();

      } catch (error) {

        console.error(
          'DELETE CYCLE ERROR:',
          error
        );

        toast.error(
          error?.response?.data
            ?.message ||
          'Failed to delete cycle'
        );
      }
    };

  // ===========================================
  // ACTIVATE CYCLE
  // ===========================================

  const handleActivateCycle =
    async (id) => {

      try {

        await api.put(
          `/cycles/${id}/activate`
        );

        toast.success(
          'Cycle activated'
        );

        fetchCycles();

      } catch (error) {

        console.error(
          'ACTIVATE CYCLE ERROR:',
          error
        );

        toast.error(
          'Failed to activate cycle'
        );
      }
    };

  // ===========================================
  // LOADING
  // ===========================================

  if (loading) {

    return (
      <Loader text="Loading cycles..." />
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

            <CalendarRange
              className="
                text-blue-600
              "
            />

            Goal Cycles

          </h1>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Manage performance cycles
          </p>

        </div>

        {/* CREATE BUTTON */}

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

          Create Cycle

        </button>

      </div>

      {/* ===================================== */}
      {/* CYCLE GRID */}
      {/* ===================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        {
          cycles.length > 0 ? (

            cycles.map((cycle) => (

              <div
                key={cycle.id}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  shadow-sm
                  p-6
                "
              >

                {/* TITLE */}

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    mb-4
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
                      {cycle.name}
                    </h2>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      Quarter:
                      {' '}
                      {cycle.quarter}
                    </p>

                  </div>

                  {
                    cycle.is_active ? (

                      <span
                        className="
                          px-3
                          py-1
                          rounded-full
                          bg-green-100
                          text-green-700
                          text-xs
                          font-semibold
                        "
                      >
                        Active
                      </span>

                    ) : (

                      <span
                        className="
                          px-3
                          py-1
                          rounded-full
                          bg-gray-100
                          text-gray-600
                          text-xs
                          font-semibold
                        "
                      >
                        Inactive
                      </span>
                    )
                  }

                </div>

                {/* DATES */}

                <div
                  className="
                    space-y-2
                    text-sm
                    text-gray-600
                    mb-6
                  "
                >

                  <p>
                    <span className="font-medium">
                      Start:
                    </span>
                    {' '}
                    {cycle.start_date}
                  </p>

                  <p>
                    <span className="font-medium">
                      End:
                    </span>
                    {' '}
                    {cycle.end_date}
                  </p>

                </div>

                {/* ACTIONS */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  {
                    !cycle.is_active && (

                      <button
                        onClick={() =>
                          handleActivateCycle(
                            cycle.id
                          )
                        }
                        className="
                          flex-1
                          px-4
                          py-2.5
                          rounded-xl
                          bg-blue-600
                          hover:bg-blue-700
                          text-white
                          text-sm
                          font-medium
                          transition
                        "
                      >
                        Activate
                      </button>
                    )
                  }

                  <button
                    onClick={() =>
                      handleDeleteCycle(
                        cycle.id
                      )
                    }
                    className="
                      p-2.5
                      rounded-xl
                      bg-red-100
                      hover:bg-red-200
                      text-red-600
                      transition
                    "
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>
            ))

          ) : (

            <div
              className="
                col-span-full
                bg-white
                rounded-2xl
                border
                border-dashed
                border-gray-300
                p-12
                text-center
              "
            >

              <h3
                className="
                  text-xl
                  font-semibold
                  text-gray-700
                "
              >
                No Cycles Found
              </h3>

              <p
                className="
                  text-gray-500
                  mt-2
                "
              >
                Create your first cycle.
              </p>

            </div>
          )
        }

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
                Create Cycle
              </h2>

              <form
                onSubmit={
                  handleCreateCycle
                }
                className="
                  space-y-4
                "
              >

                <input
                  type="text"
                  name="name"
                  placeholder="Cycle Name"
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

                <select
                  name="quarter"
                  value={
                    formData.quarter
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

                  <option value="Q1">
                    Q1
                  </option>

                  <option value="Q2">
                    Q2
                  </option>

                  <option value="Q3">
                    Q3
                  </option>

                  <option value="Q4">
                    Q4
                  </option>

                </select>

                <input
                  type="date"
                  name="start_date"
                  value={
                    formData.start_date
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
                  type="date"
                  name="end_date"
                  value={
                    formData.end_date
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
                    Create
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

export default Cycles;