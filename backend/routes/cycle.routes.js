// backend/routes/cycle.routes.js

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
// GET ALL CYCLES
// =============================================

router.get('/', async (req, res) => {

  try {

    const cycles = await db.query(`
      SELECT *
      FROM cycles
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      cycles
    });

  } catch (error) {

    console.error('GET CYCLES ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch cycles'
    });
  }
});

// =============================================
// GET ACTIVE CYCLE
// =============================================

router.get('/active', async (req, res) => {

  try {

    const cycles = await db.query(`
      SELECT *
      FROM cycles
      WHERE is_active = 1
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (!cycles.length) {

      return res.status(404).json({
        success: false,
        message: 'No active cycle found'
      });
    }

    res.status(200).json({
      success: true,
      cycle: cycles[0]
    });

  } catch (error) {

    console.error('ACTIVE CYCLE ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch active cycle'
    });
  }
});

// =============================================
// GET SINGLE CYCLE
// =============================================

router.get('/:id', async (req, res) => {

  try {

    const cycles = await db.query(
      `
      SELECT *
      FROM cycles
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (!cycles.length) {

      return res.status(404).json({
        success: false,
        message: 'Cycle not found'
      });
    }

    res.status(200).json({
      success: true,
      cycle: cycles[0]
    });

  } catch (error) {

    console.error('GET CYCLE ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch cycle'
    });
  }
});

// =============================================
// CREATE CYCLE
// Admin Only
// =============================================

router.post(
  '/',
  authorize('admin'),
  async (req, res) => {

    try {

      const {
        name,
        quarter,
        start_date,
        end_date,
        is_active
      } = req.body;

      // ============================
      // VALIDATION
      // ============================

      if (
        !name ||
        !quarter ||
        !start_date ||
        !end_date
      ) {

        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      // ============================
      // DEACTIVATE OTHER CYCLES
      // ============================

      if (is_active === 1) {

        await db.execute(`
          UPDATE cycles
          SET is_active = 0
        `);
      }

      // ============================
      // INSERT NEW CYCLE
      // ============================

      const result = await db.execute(
        `
        INSERT INTO cycles
        (
          name,
          quarter,
          start_date,
          end_date,
          is_active
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          name,
          quarter,
          start_date,
          end_date,
          is_active || 0
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Cycle created successfully',
        cycleId: result.id
      });

    } catch (error) {

      console.error('CREATE CYCLE ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to create cycle'
      });
    }
  }
);

// =============================================
// UPDATE CYCLE
// Admin Only
// =============================================

router.put(
  '/:id',
  authorize('admin'),
  async (req, res) => {

    try {

      const {
        name,
        quarter,
        start_date,
        end_date,
        is_active
      } = req.body;

      // ============================
      // HANDLE ACTIVE CYCLE SWITCH
      // ============================

      if (is_active === 1) {

        await db.execute(`
          UPDATE cycles
          SET is_active = 0
        `);
      }

      // ============================
      // UPDATE CYCLE
      // ============================

      await db.execute(
        `
        UPDATE cycles
        SET
          name = ?,
          quarter = ?,
          start_date = ?,
          end_date = ?,
          is_active = ?
        WHERE id = ?
        `,
        [
          name,
          quarter,
          start_date,
          end_date,
          is_active,
          req.params.id
        ]
      );

      res.status(200).json({
        success: true,
        message: 'Cycle updated successfully'
      });

    } catch (error) {

      console.error('UPDATE CYCLE ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to update cycle'
      });
    }
  }
);

// =============================================
// DELETE CYCLE
// Admin Only
// =============================================

router.delete(
  '/:id',
  authorize('admin'),
  async (req, res) => {

    try {

      // ============================
      // CHECK GOAL DEPENDENCIES
      // ============================

      const linkedGoals = await db.query(
        `
        SELECT id
        FROM goals
        WHERE cycle_id = ?
        `,
        [req.params.id]
      );

      if (linkedGoals.length > 0) {

        return res.status(400).json({
          success: false,
          message:
            'Cannot delete cycle with linked goals'
        });
      }

      // ============================
      // DELETE CYCLE
      // ============================

      await db.execute(
        `
        DELETE FROM cycles
        WHERE id = ?
        `,
        [req.params.id]
      );

      res.status(200).json({
        success: true,
        message: 'Cycle deleted successfully'
      });

    } catch (error) {

      console.error('DELETE CYCLE ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to delete cycle'
      });
    }
  }
);

// =============================================
// ACTIVATE CYCLE
// Admin Only
// =============================================

router.patch(
  '/:id/activate',
  authorize('admin'),
  async (req, res) => {

    try {

      // ============================
      // DEACTIVATE ALL
      // ============================

      await db.execute(`
        UPDATE cycles
        SET is_active = 0
      `);

      // ============================
      // ACTIVATE SELECTED
      // ============================

      await db.execute(
        `
        UPDATE cycles
        SET is_active = 1
        WHERE id = ?
        `,
        [req.params.id]
      );

      res.status(200).json({
        success: true,
        message: 'Cycle activated successfully'
      });

    } catch (error) {

      console.error('ACTIVATE CYCLE ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to activate cycle'
      });
    }
  }
);

// =============================================
// GET CURRENT QUARTER WINDOW
// =============================================

router.get(
  '/system/current-window',
  async (req, res) => {

    try {

      const currentDate = new Date();

      const month = currentDate.getMonth() + 1;

      let phase = '';

      if (month >= 5 && month <= 6) {
        phase = 'Goal Setting';
      }

      else if (month >= 7 && month <= 9) {
        phase = 'Q1 Check-in';
      }

      else if (month >= 10 && month <= 12) {
        phase = 'Q2 Check-in';
      }

      else if (month >= 1 && month <= 2) {
        phase = 'Q3 Check-in';
      }

      else {
        phase = 'Q4 / Annual';
      }

      res.status(200).json({
        success: true,
        current_phase: phase,
        current_month: month,
        server_time: currentDate
      });

    } catch (error) {

      console.error('WINDOW ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to fetch current window'
      });
    }
  }
);

module.exports = router;