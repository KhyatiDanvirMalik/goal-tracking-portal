// backend/routes/goal.routes.js

const express = require('express');

const db = require('../config/db');

const {
  authMiddleware,
  authorize
} = require('../middleware/auth');

const {
  validateGoalPayload,
  validateCheckin
} = require('../middleware/validate');

const router = express.Router();

// =============================================
// APPLY AUTH MIDDLEWARE
// =============================================

router.use(authMiddleware);

// =============================================
// GET MY GOALS
// =============================================

router.get('/my', async (req, res) => {

  try {

    const goals = await db.query(
      `
      SELECT
        g.*,
        c.name AS cycle_name,
        c.quarter,

        CASE
          WHEN g.status = 'Completed'
          THEN 100

          WHEN g.target_value = 0
          THEN 0

          ELSE ROUND(
            (g.achievement_value * 100.0)
            / g.target_value
          )
        END AS progress

      FROM goals g

      LEFT JOIN cycles c
        ON g.cycle_id = c.id

      WHERE g.user_id = ?

      ORDER BY g.created_at DESC
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      goals
    });

  } catch (error) {

    console.error('GET MY GOALS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals'
    });
  }
});

// =============================================
// GET DASHBOARD GOALS
// =============================================

router.get('/', async (req, res) => {

  try {

    let goals = [];

    // ADMIN CAN SEE ALL

    if (req.user.role === 'admin') {

      goals = await db.query(`
        SELECT
          g.*,
          u.name AS employee_name
        FROM goals g
        LEFT JOIN users u
          ON g.user_id = u.id
        ORDER BY g.created_at DESC
      `);

    }

    // MANAGER CAN SEE OWN GOALS

    else if (req.user.role === 'manager') {

      goals = await db.query(
        `
        SELECT *
        FROM goals
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [req.user.id]
      );

    }

    // EMPLOYEE CAN SEE OWN GOALS

    else {

      goals = await db.query(
        `
        SELECT *
        FROM goals
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [req.user.id]
      );

    }

    // ADD PROGRESS %

    const updatedGoals = goals.map(goal => {

      let progress = 0;

      if (goal.status === 'Completed') {

        progress = 100;

      } else if (goal.target_value > 0) {

        progress = Math.round(
          (goal.achievement_value * 100)
          / goal.target_value
        );

      }

      return {
        ...goal,
        progress
      };
    });

    res.status(200).json({
      success: true,
      goals: updatedGoals
    });

  } catch (error) {

    console.error('GET GOALS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals'
    });
  }
});

// =============================================
// GET TEAM GOALS
// Manager/Admin
// =============================================

router.get(
  '/team',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      let goals = [];

      if (req.user.role === 'admin') {

        goals = await db.query(`
          SELECT
            g.*,
            u.name AS employee_name,
            u.department
          FROM goals g
          JOIN users u
            ON g.user_id = u.id
          ORDER BY g.created_at DESC
        `);

      } else {

        goals = await db.query(
          `
          SELECT
            g.*,
            u.name AS employee_name,
            u.department
          FROM goals g
          JOIN users u
            ON g.user_id = u.id
          WHERE u.manager_id = ?
             OR g.user_id = ?
          ORDER BY g.created_at DESC
          `,
          [req.user.id, req.user.id]
        );
      }

      res.status(200).json({
        success: true,
        goals
      });

    } catch (error) {

      console.error('TEAM GOALS ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to fetch team goals'
      });
    }
  }
);

// =============================================
// CREATE GOALS
// =============================================

router.post('/', async (req, res) => {

  try {

    const { goals } = req.body;

    // ============================
    // VALIDATE GOALS
    // ============================

    validateGoalPayload(goals);

    // ============================
    // INSERT GOALS
    // ============================

    for (const goal of goals) {

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
          approval_status,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          req.user.id,
          goal.thrust_area,
          goal.title,
          goal.description || '',
          goal.uom_type,
          goal.target_value,
          goal.weightage,
          goal.cycle_id,
          'draft',
          'Not Started'
        ]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Goals created successfully'
    });

  } catch (error) {

    console.error('CREATE GOALS ERROR:', error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// =============================================
// UPDATE GOAL
// =============================================

router.put('/:id', async (req, res) => {

  try {

    const goalId = req.params.id;

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

    const goal = goals[0];

    // ============================
    // ACCESS CONTROL
    // ============================

    if (
      goal.user_id !== req.user.id &&
      req.user.role !== 'admin'
    ) {

      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // ============================
    // LOCK CHECK
    // ============================

    if (
      goal.locked === 1 &&
      req.user.role !== 'admin'
    ) {

      return res.status(400).json({
        success: false,
        message:
          'Goal is locked after approval'
      });
    }

    const {
      thrust_area,
      title,
      description,
      uom_type,
      target_value,
      weightage
    } = req.body;

    // ============================
    // UPDATE GOAL
    // ============================

    await db.execute(
      `
      UPDATE goals
      SET
        thrust_area = ?,
        title = ?,
        description = ?,
        uom_type = ?,
        target_value = ?,
        weightage = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        thrust_area,
        title,
        description,
        uom_type,
        target_value,
        weightage,
        goalId
      ]
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
        'UPDATE_GOAL',
        'goal',
        goalId,
        JSON.stringify(req.body)
      ]
    );

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully'
    });

  } catch (error) {

    console.error('UPDATE GOAL ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update goal'
    });
  }
});

// =============================================
// DELETE GOAL
// =============================================

router.delete('/:id', async (req, res) => {

  try {

    const goals = await db.query(
      `
      SELECT *
      FROM goals
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (!goals.length) {

      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    const goal = goals[0];

    // ============================
    // ACCESS CONTROL
    // ============================

    if (
      goal.user_id !== req.user.id &&
      req.user.role !== 'admin'
    ) {

      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // ============================
    // LOCK CHECK
    // ============================

    if (
      goal.locked === 1 &&
      req.user.role !== 'admin'
    ) {

      return res.status(400).json({
        success: false,
        message:
          'Approved goals cannot be deleted'
      });
    }

    // ============================
    // DELETE GOAL
    // ============================

    await db.execute(
      `
      DELETE FROM goals
      WHERE id = ?
      `,
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });

  } catch (error) {

    console.error('DELETE GOAL ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete goal'
    });
  }
});

// =============================================
// SUBMIT GOALS
// =============================================

router.post('/submit', async (req, res) => {

  try {

    await db.execute(
      `
      UPDATE goals
      SET approval_status = 'submitted'
      WHERE user_id = ?
      AND approval_status = 'draft'
      `,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      message:
        'Goals submitted for approval'
    });

  } catch (error) {

    console.error('SUBMIT GOALS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Submission failed'
    });
  }
});

// =============================================
// APPROVE GOAL
// =============================================

router.post(
  '/:id/approve',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      await db.execute(
        `
        UPDATE goals
        SET
          approval_status = 'approved',
          locked = 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [req.params.id]
      );

      res.status(200).json({
        success: true,
        message: 'Goal approved successfully'
      });

    } catch (error) {

      console.error('APPROVE GOAL ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Approval failed'
      });
    }
  }
);

// =============================================
// REJECT GOAL
// =============================================

router.post(
  '/:id/reject',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      await db.execute(
        `
        UPDATE goals
        SET
          approval_status = 'rejected',
          locked = 0,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [req.params.id]
      );

      res.status(200).json({
        success: true,
        message: 'Goal rejected successfully'
      });

    } catch (error) {

      console.error('REJECT GOAL ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Rejection failed'
      });
    }
  }
);

// =============================================
// CHECK-IN UPDATE
// =============================================

router.post('/:id/checkin', async (req, res) => {

  try {

    validateCheckin(req.body);

    const {
      quarter,
      achievement,
      status,
      employee_comment,
      manager_comment
    } = req.body;

    // ============================
    // INSERT CHECK-IN
    // ============================

    await db.execute(
      `
      INSERT INTO checkins
      (
        goal_id,
        quarter,
        achievement,
        employee_comment,
        manager_comment,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        req.params.id,
        quarter,
        achievement,
        employee_comment || '',
        manager_comment || '',
        status
      ]
    );

    // ============================
    // UPDATE GOAL
    // ============================

    await db.execute(
      `
      UPDATE goals
      SET
        achievement_value = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        achievement,
        status,
        req.params.id
      ]
    );

    res.status(200).json({
      success: true,
      message:
        'Quarterly check-in completed'
    });

  } catch (error) {

    console.error('CHECK-IN ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =============================================
// GET CHECK-IN HISTORY
// =============================================

router.get('/:id/checkins', async (req, res) => {

  try {

    const checkins = await db.query(
      `
      SELECT *
      FROM checkins
      WHERE goal_id = ?
      ORDER BY created_at DESC
      `,
      [req.params.id]
    );

    res.status(200).json({
      success: true,
      checkins
    });

  } catch (error) {

    console.error('CHECK-IN HISTORY ERROR:', error);

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch check-in history'
    });
  }
});

// =============================================
// ADMIN UNLOCK GOAL
// =============================================

router.patch(
  '/:id/unlock',
  authorize('admin'),
  async (req, res) => {

    try {

      await db.execute(
        `
        UPDATE goals
        SET locked = 0
        WHERE id = ?
        `,
        [req.params.id]
      );

      res.status(200).json({
        success: true,
        message: 'Goal unlocked successfully'
      });

    } catch (error) {

      console.error('UNLOCK GOAL ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to unlock goal'
      });
    }
  }
);

module.exports = router;