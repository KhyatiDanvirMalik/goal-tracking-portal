// backend/routes/report.routes.js

const express = require('express');

const db = require('../config/db');

const {
  authMiddleware,
  authorize
} = require('../middleware/auth');

const router = express.Router();

// =============================================
// APPLY AUTH MIDDLEWARE
// =============================================

router.use(authMiddleware);

// =============================================
// ACHIEVEMENT REPORT
// Manager/Admin
// =============================================

router.get(
  '/achievement',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      let report = [];

      // ============================
      // ADMIN REPORT
      // ============================

      if (req.user.role === 'admin') {

        report = await db.query(`
          SELECT
            u.name AS employee_name,
            u.department,
            g.title,
            g.thrust_area,
            g.target_value,
            g.achievement_value,
            g.weightage,
            g.status,
            g.approval_status,
            c.name AS cycle_name,
            c.quarter
          FROM goals g
          JOIN users u
            ON g.user_id = u.id
          LEFT JOIN cycles c
            ON g.cycle_id = c.id
          ORDER BY u.name ASC
        `);

      }

      // ============================
      // MANAGER REPORT
      // ============================

      else {

        report = await db.query(
          `
          SELECT
            u.name AS employee_name,
            u.department,
            g.title,
            g.thrust_area,
            g.target_value,
            g.achievement_value,
            g.weightage,
            g.status,
            g.approval_status,
            c.name AS cycle_name,
            c.quarter
          FROM goals g
          JOIN users u
            ON g.user_id = u.id
          LEFT JOIN cycles c
            ON g.cycle_id = c.id
          WHERE u.manager_id = ?
          ORDER BY u.name ASC
          `,
          [req.user.id]
        );
      }

      res.status(200).json({
        success: true,
        total_records: report.length,
        report
      });

    } catch (error) {

      console.error('ACHIEVEMENT REPORT ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to fetch achievement report'
      });
    }
  }
);

// =============================================
// COMPLETION DASHBOARD
// =============================================

router.get(
  '/completion',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      let completion = [];

      // ============================
      // ADMIN VIEW
      // ============================

      if (req.user.role === 'admin') {

        completion = await db.query(`
          SELECT
            u.id,
            u.name,
            u.department,

            COUNT(g.id) AS total_goals,

            SUM(
              CASE
                WHEN g.status = 'Completed'
                THEN 1
                ELSE 0
              END
            ) AS completed_goals,

            ROUND(
              (
                SUM(
                  CASE
                    WHEN g.status = 'Completed'
                    THEN 1
                    ELSE 0
                  END
                ) * 100.0
              ) / COUNT(g.id),
              2
            ) AS completion_percentage

          FROM users u

          LEFT JOIN goals g
            ON u.id = g.user_id

          WHERE u.role = 'employee'

          GROUP BY u.id

          ORDER BY completion_percentage DESC
        `);

      }

      // ============================
      // MANAGER VIEW
      // ============================

      else {

        completion = await db.query(
          `
          SELECT
            u.id,
            u.name,
            u.department,

            COUNT(g.id) AS total_goals,

            SUM(
              CASE
                WHEN g.status = 'Completed'
                THEN 1
                ELSE 0
              END
            ) AS completed_goals,

            ROUND(
              (
                SUM(
                  CASE
                    WHEN g.status = 'Completed'
                    THEN 1
                    ELSE 0
                  END
                ) * 100.0
              ) / COUNT(g.id),
              2
            ) AS completion_percentage

          FROM users u

          LEFT JOIN goals g
            ON u.id = g.user_id

          WHERE u.manager_id = ?

          GROUP BY u.id

          ORDER BY completion_percentage DESC
          `,
          [req.user.id]
        );
      }

      res.status(200).json({
        success: true,
        completion
      });

    } catch (error) {

      console.error('COMPLETION REPORT ERROR:', error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch completion dashboard'
      });
    }
  }
);

// =============================================
// GOAL STATUS ANALYTICS
// =============================================

router.get(
  '/analytics/status',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      const analytics = await db.query(`
        SELECT
          status,
          COUNT(*) AS total
        FROM goals
        GROUP BY status
      `);

      res.status(200).json({
        success: true,
        analytics
      });

    } catch (error) {

      console.error('STATUS ANALYTICS ERROR:', error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch status analytics'
      });
    }
  }
);

// =============================================
// UOM ANALYTICS
// =============================================

router.get(
  '/analytics/uom',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      const analytics = await db.query(`
        SELECT
          uom_type,
          COUNT(*) AS total
        FROM goals
        GROUP BY uom_type
      `);

      res.status(200).json({
        success: true,
        analytics
      });

    } catch (error) {

      console.error('UOM ANALYTICS ERROR:', error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch UOM analytics'
      });
    }
  }
);

// =============================================
// DEPARTMENT ANALYTICS
// =============================================

router.get(
  '/analytics/department',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      const analytics = await db.query(`
        SELECT
          u.department,

          COUNT(g.id) AS total_goals,

          SUM(
            CASE
              WHEN g.status = 'Completed'
              THEN 1
              ELSE 0
            END
          ) AS completed_goals

        FROM users u

        LEFT JOIN goals g
          ON u.id = g.user_id

        GROUP BY u.department
      `);

      res.status(200).json({
        success: true,
        analytics
      });

    } catch (error) {

      console.error('DEPARTMENT ANALYTICS ERROR:', error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch department analytics'
      });
    }
  }
);

// =============================================
// AUDIT LOGS
// Admin Only
// =============================================

router.get(
  '/audit-logs',
  authorize('admin'),
  async (req, res) => {

    try {

      const logs = await db.query(`
        SELECT
          a.*,
          u.name AS user_name
        FROM audit_logs a
        LEFT JOIN users u
          ON a.user_id = u.id
        ORDER BY a.created_at DESC
      `);

      res.status(200).json({
        success: true,
        logs
      });

    } catch (error) {

      console.error('AUDIT LOG ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to fetch audit logs'
      });
    }
  }
);

// =============================================
// CHECK-IN REPORT
// =============================================

router.get(
  '/checkins',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      const checkins = await db.query(`
        SELECT
          c.*,
          g.title AS goal_title,
          u.name AS employee_name
        FROM checkins c

        JOIN goals g
          ON c.goal_id = g.id

        JOIN users u
          ON g.user_id = u.id

        ORDER BY c.created_at DESC
      `);

      res.status(200).json({
        success: true,
        checkins
      });

    } catch (error) {

      console.error('CHECK-IN REPORT ERROR:', error);

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch check-in report'
      });
    }
  }
);

// =============================================
// MANAGER EFFECTIVENESS DASHBOARD
// =============================================

router.get(
  '/manager-effectiveness',
  authorize('admin'),
  async (req, res) => {

    try {

      const dashboard = await db.query(`
        SELECT
          m.id,
          m.name AS manager_name,

          COUNT(DISTINCT u.id) AS team_size,

          COUNT(g.id) AS total_goals,

          SUM(
            CASE
              WHEN g.status = 'Completed'
              THEN 1
              ELSE 0
            END
          ) AS completed_goals

        FROM users m

        LEFT JOIN users u
          ON u.manager_id = m.id

        LEFT JOIN goals g
          ON g.user_id = u.id

        WHERE m.role = 'manager'

        GROUP BY m.id

        ORDER BY completed_goals DESC
      `);

      res.status(200).json({
        success: true,
        dashboard
      });

    } catch (error) {

      console.error(
        'MANAGER DASHBOARD ERROR:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Failed to fetch manager dashboard'
      });
    }
  }
);

module.exports = router;