import React, {
  useEffect,
  useState
} from 'react';

import api from '../api/axios';

import {
  ShieldCheck
} from 'lucide-react';

const AuditLogs = () => {

  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ===========================================
  // FETCH LOGS
  // ===========================================

  useEffect(() => {

    fetchLogs();

  }, []);

  const fetchLogs = async () => {

    try {

      const response =
        await api.get(
          '/admin/audit-logs'
        );

      setLogs(
        response.data || []
      );

    } catch (error) {

      console.error(
        'AUDIT LOG ERROR:',
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // ===========================================
  // LOADING
  // ===========================================

  if (loading) {

    return (

      <div
        className="
          p-6
          text-lg
          font-semibold
        "
      >
        Loading Audit Logs...
      </div>
    );
  }

  // ===========================================
  // UI
  // ===========================================

  return (

    <div className="p-6">

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          gap-3
          mb-6
        "
      >

        <ShieldCheck
          className="
            text-blue-600
          "
          size={30}
        />

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-800
            "
          >
            Audit Logs
          </h1>

          <p
            className="
              text-gray-500
            "
          >
            Track system activities
          </p>

        </div>

      </div>

      {/* TABLE */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          overflow-hidden
        "
      >

        <table
          className="
            w-full
          "
        >

          <thead
            className="
              bg-gray-100
            "
          >

            <tr>

              <th className="p-4 text-left">
                User
              </th>

              <th className="p-4 text-left">
                Action
              </th>

              <th className="p-4 text-left">
                Module
              </th>

              <th className="p-4 text-left">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {
              logs.length > 0
              ? (
                logs.map((log) => (

                  <tr
                    key={log.id}
                    className="
                      border-t
                    "
                  >

                    <td className="p-4">
                      {log.user_name}
                    </td>

                    <td className="p-4">
                      {log.action}
                    </td>

                    <td className="p-4">
                      {log.module}
                    </td>

                    <td className="p-4">
                      {
                        new Date(
                          log.created_at
                        ).toLocaleString()
                      }
                    </td>

                  </tr>
                ))
              )
              : (
                <tr>

                  <td
                    colSpan="4"
                    className="
                      p-6
                      text-center
                      text-gray-500
                    "
                  >
                    No audit logs found
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

export default AuditLogs;