// backend/services/audit.service.js

const db = require('../config/db');

// =============================================
// CREATE AUDIT LOG
// =============================================

const createAuditLog = async ({
  user_id,
  action,
  entity_type,
  entity_id,
  old_value = null,
  new_value = null
}) => {

  try {

    await db.execute(
      `
      INSERT INTO audit_logs
      (
        user_id,
        action,
        entity_type,
        entity_id,
        old_value,
        new_value
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        action,
        entity_type,
        entity_id,
        old_value
          ? JSON.stringify(old_value)
          : null,
        new_value
          ? JSON.stringify(new_value)
          : null
      ]
    );

    return true;

  } catch (error) {

    console.error(
      'CREATE AUDIT LOG ERROR:',
      error
    );

    return false;
  }
};

// =============================================
// GET ALL AUDIT LOGS
// =============================================

const getAllAuditLogs = async () => {

  try {

    const logs = await db.query(`
      SELECT
        a.*,
        u.name AS user_name,
        u.email AS user_email
      FROM audit_logs a

      LEFT JOIN users u
        ON a.user_id = u.id

      ORDER BY a.created_at DESC
    `);

    return logs;

  } catch (error) {

    console.error(
      'GET AUDIT LOGS ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// GET AUDIT LOGS BY ENTITY
// =============================================

const getAuditLogsByEntity = async (
  entity_type,
  entity_id
) => {

  try {

    const logs = await db.query(
      `
      SELECT
        a.*,
        u.name AS user_name
      FROM audit_logs a

      LEFT JOIN users u
        ON a.user_id = u.id

      WHERE a.entity_type = ?
      AND a.entity_id = ?

      ORDER BY a.created_at DESC
      `,
      [
        entity_type,
        entity_id
      ]
    );

    return logs;

  } catch (error) {

    console.error(
      'ENTITY AUDIT LOG ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// GET USER AUDIT LOGS
// =============================================

const getUserAuditLogs = async (
  user_id
) => {

  try {

    const logs = await db.query(
      `
      SELECT *
      FROM audit_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [user_id]
    );

    return logs;

  } catch (error) {

    console.error(
      'USER AUDIT LOG ERROR:',
      error
    );

    throw error;
  }
};

// =============================================
// DELETE OLD AUDIT LOGS
// Cleanup utility
// =============================================

const deleteOldAuditLogs = async (
  days = 365
) => {

  try {

    await db.execute(
      `
      DELETE FROM audit_logs
      WHERE created_at <
      DATE_SUB(NOW(), INTERVAL ? DAY)
      `,
      [days]
    );

    return true;

  } catch (error) {

    console.error(
      'DELETE AUDIT LOG ERROR:',
      error
    );

    return false;
  }
};

// =============================================
// LOG GOAL UPDATE
// =============================================

const logGoalUpdate = async ({
  user_id,
  goal_id,
  old_goal,
  updated_goal
}) => {

  return await createAuditLog({
    user_id,
    action: 'UPDATE_GOAL',
    entity_type: 'goal',
    entity_id: goal_id,
    old_value: old_goal,
    new_value: updated_goal
  });
};

// =============================================
// LOG GOAL APPROVAL
// =============================================

const logGoalApproval = async ({
  user_id,
  goal_id
}) => {

  return await createAuditLog({
    user_id,
    action: 'APPROVE_GOAL',
    entity_type: 'goal',
    entity_id: goal_id,
    new_value: {
      status: 'approved'
    }
  });
};

// =============================================
// LOG GOAL REJECTION
// =============================================

const logGoalRejection = async ({
  user_id,
  goal_id
}) => {

  return await createAuditLog({
    user_id,
    action: 'REJECT_GOAL',
    entity_type: 'goal',
    entity_id: goal_id,
    new_value: {
      status: 'rejected'
    }
  });
};

// =============================================
// LOG GOAL UNLOCK
// =============================================

const logGoalUnlock = async ({
  user_id,
  goal_id
}) => {

  return await createAuditLog({
    user_id,
    action: 'UNLOCK_GOAL',
    entity_type: 'goal',
    entity_id: goal_id,
    new_value: {
      locked: false
    }
  });
};

// =============================================
// LOG CHECK-IN
// =============================================

const logCheckin = async ({
  user_id,
  goal_id,
  quarter,
  achievement
}) => {

  return await createAuditLog({
    user_id,
    action: 'CHECKIN_UPDATE',
    entity_type: 'goal',
    entity_id: goal_id,
    new_value: {
      quarter,
      achievement
    }
  });
};

// =============================================
// LOG USER CREATION
// =============================================

const logUserCreation = async ({
  admin_id,
  created_user_id,
  user_data
}) => {

  return await createAuditLog({
    user_id: admin_id,
    action: 'CREATE_USER',
    entity_type: 'user',
    entity_id: created_user_id,
    new_value: user_data
  });
};

// =============================================
// LOG USER DELETE
// =============================================

const logUserDelete = async ({
  admin_id,
  deleted_user_id,
  deleted_user
}) => {

  return await createAuditLog({
    user_id: admin_id,
    action: 'DELETE_USER',
    entity_type: 'user',
    entity_id: deleted_user_id,
    old_value: deleted_user
  });
};

// =============================================
// LOG CYCLE CREATE
// =============================================

const logCycleCreate = async ({
  user_id,
  cycle_id,
  cycle_data
}) => {

  return await createAuditLog({
    user_id,
    action: 'CREATE_CYCLE',
    entity_type: 'cycle',
    entity_id: cycle_id,
    new_value: cycle_data
  });
};

// =============================================
// LOG LOGIN EVENT
// =============================================

const logLogin = async ({
  user_id
}) => {

  return await createAuditLog({
    user_id,
    action: 'LOGIN',
    entity_type: 'auth',
    entity_id: user_id
  });
};

// =============================================
// LOG LOGOUT EVENT
// =============================================

const logLogout = async ({
  user_id
}) => {

  return await createAuditLog({
    user_id,
    action: 'LOGOUT',
    entity_type: 'auth',
    entity_id: user_id
  });
};

// =============================================
// EXPORTS
// =============================================

module.exports = {

  createAuditLog,

  getAllAuditLogs,

  getAuditLogsByEntity,

  getUserAuditLogs,

  deleteOldAuditLogs,

  logGoalUpdate,

  logGoalApproval,

  logGoalRejection,

  logGoalUnlock,

  logCheckin,

  logUserCreation,

  logUserDelete,

  logCycleCreate,

  logLogin,

  logLogout
};