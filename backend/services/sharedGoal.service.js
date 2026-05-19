// backend/services/sharedGoal.service.js

const db = require('../config/db');

const {
  createAuditLog
} = require('./audit.service');

// =============================================
// CREATE SHARED GOAL MASTER
// =============================================

const createSharedGoal = async ({
  title,
  description,
  target_value,
  uom_type,
  owner_id
}) => {

  try {

    const result = await db.execute(
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
        owner_id
      ]
    );

    return result.id;

  } catch (error) {

    console.error(
      'CREATE SHARED GOAL ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// ASSIGN SHARED GOAL TO EMPLOYEES
// =============================================

const assignSharedGoalToEmployees = async ({
  shared_goal_id,
  employee_ids,
  thrust_area,
  cycle_id,
  weightage = 10
}) => {

  try {

    // =========================================
    // FETCH SHARED GOAL MASTER
    // =========================================

    const sharedGoals = await db.query(
      `
      SELECT *
      FROM shared_goals
      WHERE id = ?
      `,
      [shared_goal_id]
    );

    if (!sharedGoals.length) {
      throw new Error(
        'Shared goal not found'
      );
    }

    const sharedGoal = sharedGoals[0];

    // =========================================
    // ASSIGN TO EACH EMPLOYEE
    // =========================================

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
          sharedGoal.title,
          sharedGoal.description,
          sharedGoal.uom_type,
          sharedGoal.target_value,
          weightage,
          cycle_id || null,
          shared_goal_id,
          'approved',
          1,
          'Not Started'
        ]
      );
    }

    return true;

  } catch (error) {

    console.error(
      'ASSIGN SHARED GOAL ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// UPDATE SHARED GOAL TARGET
// Sync across linked goals
// =============================================

const updateSharedGoalTarget = async ({
  shared_goal_id,
  target_value,
  updated_by
}) => {

  try {

    // =========================================
    // UPDATE MASTER GOAL
    // =========================================

    await db.execute(
      `
      UPDATE shared_goals
      SET target_value = ?
      WHERE id = ?
      `,
      [
        target_value,
        shared_goal_id
      ]
    );

    // =========================================
    // UPDATE ALL LINKED GOALS
    // =========================================

    await db.execute(
      `
      UPDATE goals
      SET
        target_value = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE shared_goal_id = ?
      `,
      [
        target_value,
        shared_goal_id
      ]
    );

    // =========================================
    // AUDIT LOG
    // =========================================

    await createAuditLog({
      user_id: updated_by,
      action: 'UPDATE_SHARED_GOAL_TARGET',
      entity_type: 'shared_goal',
      entity_id: shared_goal_id,
      new_value: {
        target_value
      }
    });

    return true;

  } catch (error) {

    console.error(
      'UPDATE SHARED TARGET ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// UPDATE SHARED GOAL ACHIEVEMENT
// Sync actual achievement
// =============================================

const updateSharedGoalAchievement = async ({
  shared_goal_id,
  achievement_value,
  status,
  updated_by
}) => {

  try {

    // =========================================
    // UPDATE ALL LINKED GOALS
    // =========================================

    await db.execute(
      `
      UPDATE goals
      SET
        achievement_value = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE shared_goal_id = ?
      `,
      [
        achievement_value,
        status,
        shared_goal_id
      ]
    );

    // =========================================
    // AUDIT LOG
    // =========================================

    await createAuditLog({
      user_id: updated_by,
      action:
        'SYNC_SHARED_GOAL_ACHIEVEMENT',
      entity_type: 'shared_goal',
      entity_id: shared_goal_id,
      new_value: {
        achievement_value,
        status
      }
    });

    return true;

  } catch (error) {

    console.error(
      'SYNC SHARED GOAL ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// GET SHARED GOAL DETAILS
// =============================================

const getSharedGoalById = async (
  shared_goal_id
) => {

  try {

    const sharedGoals = await db.query(
      `
      SELECT *
      FROM shared_goals
      WHERE id = ?
      `,
      [shared_goal_id]
    );

    return sharedGoals[0] || null;

  } catch (error) {

    console.error(
      'GET SHARED GOAL ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// GET LINKED EMPLOYEE GOALS
// =============================================

const getLinkedGoals = async (
  shared_goal_id
) => {

  try {

    const linkedGoals = await db.query(
      `
      SELECT
        g.*,
        u.name AS employee_name,
        u.department
      FROM goals g

      JOIN users u
        ON g.user_id = u.id

      WHERE g.shared_goal_id = ?

      ORDER BY u.name ASC
      `,
      [shared_goal_id]
    );

    return linkedGoals;

  } catch (error) {

    console.error(
      'GET LINKED GOALS ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// REMOVE SHARED GOAL
// =============================================

const removeSharedGoal = async ({
  shared_goal_id,
  removed_by
}) => {

  try {

    // =========================================
    // DELETE LINKED GOALS
    // =========================================

    await db.execute(
      `
      DELETE FROM goals
      WHERE shared_goal_id = ?
      `,
      [shared_goal_id]
    );

    // =========================================
    // DELETE MASTER SHARED GOAL
    // =========================================

    await db.execute(
      `
      DELETE FROM shared_goals
      WHERE id = ?
      `,
      [shared_goal_id]
    );

    // =========================================
    // AUDIT LOG
    // =========================================

    await createAuditLog({
      user_id: removed_by,
      action: 'DELETE_SHARED_GOAL',
      entity_type: 'shared_goal',
      entity_id: shared_goal_id
    });

    return true;

  } catch (error) {

    console.error(
      'REMOVE SHARED GOAL ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// GET ALL SHARED GOALS
// =============================================

const getAllSharedGoals = async () => {

  try {

    const sharedGoals = await db.query(`
      SELECT
        sg.*,
        u.name AS owner_name
      FROM shared_goals sg

      LEFT JOIN users u
        ON sg.owner_id = u.id

      ORDER BY sg.created_at DESC
    `);

    return sharedGoals;

  } catch (error) {

    console.error(
      'GET ALL SHARED GOALS ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// EXPORTS
// =============================================

module.exports = {

  createSharedGoal,

  assignSharedGoalToEmployees,

  updateSharedGoalTarget,

  updateSharedGoalAchievement,

  getSharedGoalById,

  getLinkedGoals,

  removeSharedGoal,

  getAllSharedGoals
};