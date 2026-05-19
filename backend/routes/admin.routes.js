// backend/routes/admin.routes.js

const express = require('express');

const db = require('../config/db');

const {
  authMiddleware,
  authorize
} = require('../middleware/auth');

const router = express.Router();

// =============================================
// APPLY AUTH + ADMIN AUTHORIZATION
// =============================================

router.use(authMiddleware);
router.use(authorize('admin'));

// =============================================
// DASHBOARD SUMMARY
// =============================================

router.get('/dashboard', async (req, res) => {

  try {

    // ============================
    // TOTAL USERS
    // ============================

    const totalUsers = await db.query(`
      SELECT COUNT(*) AS count
      FROM users
    `);

    // ============================
    // TOTAL EMPLOYEES
    // ============================

    const totalEmployees = await db.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE role = 'employee'
    `);

    // ============================
    // TOTAL MANAGERS
    // ============================

    const totalManagers = await db.query(`
      SELECT COUNT(*) AS count
      FROM users
      WHERE role = 'manager'
    `);

    // ============================
    // TOTAL GOALS
    // ============================

    const totalGoals = await db.query(`
      SELECT COUNT(*) AS count
      FROM goals
    `);

    // ============================
    // COMPLETED GOALS
    // ============================

    const completedGoals = await db.query(`
      SELECT COUNT(*) AS count
      FROM goals
      WHERE status = 'Completed'
    `);

    // ============================
    // PENDING APPROVALS
    // ============================

    const pendingApprovals = await db.query(`
      SELECT COUNT(*) AS count
      FROM goals
      WHERE approval_status = 'submitted'
    `);

    // ============================
    // ACTIVE CYCLE
    // ============================

    const activeCycle = await db.query(`
      SELECT *
      FROM cycles
      WHERE is_active = 1
      LIMIT 1
    `);

    res.status(200).json({
      success: true,

      dashboard: {
        total_users:
          totalUsers[0]?.count || 0,

        total_employees:
          totalEmployees[0]?.count || 0,

        total_managers:
          totalManagers[0]?.count || 0,

        total_goals:
          totalGoals[0]?.count || 0,

        completed_goals:
          completedGoals[0]?.count || 0,

        pending_approvals:
          pendingApprovals[0]?.count || 0,

        active_cycle:
          activeCycle[0] || null
      }
    });

  } catch (error) {

    console.error(
      'ADMIN DASHBOARD ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch dashboard data'
    });
  }
});

// =============================================
// UNLOCK GOAL
// =============================================

router.patch(
  '/unlock-goal/:id',
  async (req, res) => {

    try {

      const goalId = req.params.id;

      // ============================
      // CHECK GOAL EXISTS
      // ============================

      const goals = await db.query(
        `
        SELECT *
        FROM goals
        WHERE id = ?
        `,
        [goalId]
      );

      if (!goals.length) {

        return res.status(404).json({
          success: false,
          message: 'Goal not found'
        });
      }

      // ============================
      // UNLOCK GOAL
      // ============================

      await db.execute(
        `
        UPDATE goals
        SET locked = 0
        WHERE id = ?
        `,
        [goalId]
      );

      // ============================
      // AUDIT LOG
      // ============================

      await db.execute(
        `
        INSERT INTO audit_logs
        (
          user_id,
          action,
          entity_type,
          entity_id,
          new_value
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          req.user.id,
          'UNLOCK_GOAL',
          'goal',
          goalId,
          'Goal unlocked by admin'
        ]
      );

      res.status(200).json({
        success: true,
        message:
          'Goal unlocked successfully'
      });

    } catch (error) {

      console.error(
        'UNLOCK GOAL ERROR:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Failed to unlock goal'
      });
    }
  }
);

// =============================================
// GET ALL AUDIT LOGS
// =============================================

router.get('/audit-logs', async (req, res) => {

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
      total_logs: logs.length,
      logs
    });

  } catch (error) {

    console.error(
      'AUDIT LOG ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch audit logs'
    });
  }
});

// =============================================
// CREATE SHARED GOAL
// =============================================

router.post(
  '/shared-goals',
  async (req, res) => {

    try {

      const {
        title,
        description,
        target_value,
        uom_type,
        employee_ids,
        cycle_id,
        weightage,
        thrust_area
      } = req.body;

      // ============================
      // VALIDATION
      // ============================

      if (
        !title ||
        !target_value ||
        !uom_type ||
        !employee_ids ||
        !Array.isArray(employee_ids)
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Missing required fields'
        });
      }

      // ============================
      // CREATE SHARED GOAL MASTER
      // ============================

      const sharedGoal = await db.execute(
        `
        INSERT INTO shared_goals
        (
          title,
          description,
          target_value,
          uom_type,
          owner_id
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          title,
          description || '',
          target_value,
          uom_type,
          req.user.id
        ]
      );

      const sharedGoalId = sharedGoal.id;

      // ============================
      // ASSIGN TO EMPLOYEES
      // ============================

      for (const employeeId of employee_ids) {

        await db.execute(
          `
          INSERT INTO goals
          (
            user_id,
            thrust_area,
            title,
            description,
            uom_type,
            target_value,
            weightage,
            cycle_id,
            shared_goal_id,
            approval_status,
            locked,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            employeeId,
            thrust_area || 'Shared KPI',
            title,
            description || '',
            uom_type,
            target_value,
            weightage || 10,
            cycle_id || null,
            sharedGoalId,
            'approved',
            1,
            'Not Started'
          ]
        );
      }

      res.status(201).json({
        success: true,
        message:
          'Shared goal assigned successfully',
        shared_goal_id: sharedGoalId
      });

    } catch (error) {

      console.error(
        'SHARED GOAL ERROR:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Failed to create shared goal'
      });
    }
  }
);

// =============================================
// GET SHARED GOALS
// =============================================

router.get('/shared-goals', async (req, res) => {

  try {

    const sharedGoals = await db.query(`
      SELECT *
      FROM shared_goals
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      sharedGoals
    });

  } catch (error) {

    console.error(
      'GET SHARED GOALS ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch shared goals'
    });
  }
});

// =============================================
// SYSTEM NOTIFICATIONS
// =============================================

router.get('/notifications', async (req, res) => {

  try {

    const notifications = await db.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      notifications
    });

  } catch (error) {

    console.error(
      'NOTIFICATIONS ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch notifications'
    });
  }
});

// =============================================
// CREATE NOTIFICATION
// =============================================

router.post(
  '/notifications',
  async (req, res) => {

    try {

      const {
        user_id,
        title,
        message
      } = req.body;

      if (
        !user_id ||
        !title ||
        !message
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Missing required fields'
        });
      }

      await db.execute(
        `
        INSERT INTO notifications
        (
          user_id,
          title,
          message
        )
        VALUES (?, ?, ?)
        `,
        [
          user_id,
          title,
          message
        ]
      );

      res.status(201).json({
        success: true,
        message:
          'Notification created successfully'
      });

    } catch (error) {

      console.error(
        'CREATE NOTIFICATION ERROR:',
        error
      );

      res.status(500).json({
        success: false,
        message:
          'Failed to create notification'
      });
    }
  }
);

// =============================================
// GET SYSTEM HEALTH
// =============================================

router.get('/system-health', async (req, res) => {

  try {

    const dbCheck = await db.query(`
      SELECT 1 AS status
    `);

    res.status(200).json({
      success: true,
      system: {
        api: 'running',
        database:
          dbCheck.length > 0
            ? 'connected'
            : 'disconnected',
        timestamp: new Date()
      }
    });

  } catch (error) {

    console.error(
      'SYSTEM HEALTH ERROR:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'System health check failed'
    });
  }
});

module.exports = router;