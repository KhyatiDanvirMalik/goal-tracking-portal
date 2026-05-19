// backend/utils/constants.js

// =============================================
// USER ROLES
// =============================================

const USER_ROLES = {

  EMPLOYEE: 'employee',

  MANAGER: 'manager',

  ADMIN: 'admin'
};

// =============================================
// GOAL STATUS
// =============================================

const GOAL_STATUS = {

  NOT_STARTED: 'Not Started',

  ON_TRACK: 'On Track',

  COMPLETED: 'Completed'
};

// =============================================
// APPROVAL STATUS
// =============================================

const APPROVAL_STATUS = {

  DRAFT: 'draft',

  SUBMITTED: 'submitted',

  APPROVED: 'approved',

  REJECTED: 'rejected'
};

// =============================================
// UOM TYPES
// =============================================

const UOM_TYPES = {

  MIN: 'min',

  MAX: 'max',

  TIMELINE: 'timeline',

  ZERO: 'zero'
};

// =============================================
// QUARTERS
// =============================================

const QUARTERS = {

  Q1: 'Q1',

  Q2: 'Q2',

  Q3: 'Q3',

  Q4: 'Q4'
};

// =============================================
// CHECK-IN WINDOWS
// =============================================

const CHECKIN_WINDOWS = {

  GOAL_SETTING: {
    name: 'Goal Setting',
    months: [5, 6]
  },

  Q1: {
    name: 'Q1 Check-in',
    months: [7, 8, 9]
  },

  Q2: {
    name: 'Q2 Check-in',
    months: [10, 11, 12]
  },

  Q3: {
    name: 'Q3 Check-in',
    months: [1, 2]
  },

  Q4: {
    name: 'Q4 / Annual',
    months: [3, 4]
  }
};

// =============================================
// VALIDATION LIMITS
// =============================================

const VALIDATION = {

  MAX_GOALS_PER_EMPLOYEE: 8,

  MIN_WEIGHTAGE_PER_GOAL: 10,

  TOTAL_WEIGHTAGE: 100
};

// =============================================
// NOTIFICATION TYPES
// =============================================

const NOTIFICATION_TYPES = {

  GOAL_SUBMISSION: 'goal_submission',

  GOAL_APPROVAL: 'goal_approval',

  GOAL_REJECTION: 'goal_rejection',

  CHECKIN_REMINDER: 'checkin_reminder',

  SHARED_GOAL: 'shared_goal',

  ESCALATION: 'escalation'
};

// =============================================
// AUDIT ACTIONS
// =============================================

const AUDIT_ACTIONS = {

  LOGIN: 'LOGIN',

  LOGOUT: 'LOGOUT',

  CREATE_USER: 'CREATE_USER',

  UPDATE_USER: 'UPDATE_USER',

  DELETE_USER: 'DELETE_USER',

  CREATE_GOAL: 'CREATE_GOAL',

  UPDATE_GOAL: 'UPDATE_GOAL',

  DELETE_GOAL: 'DELETE_GOAL',

  APPROVE_GOAL: 'APPROVE_GOAL',

  REJECT_GOAL: 'REJECT_GOAL',

  UNLOCK_GOAL: 'UNLOCK_GOAL',

  CREATE_CYCLE: 'CREATE_CYCLE',

  UPDATE_CYCLE: 'UPDATE_CYCLE',

  DELETE_CYCLE: 'DELETE_CYCLE',

  CHECKIN_UPDATE: 'CHECKIN_UPDATE',

  CREATE_SHARED_GOAL:
    'CREATE_SHARED_GOAL',

  UPDATE_SHARED_GOAL:
    'UPDATE_SHARED_GOAL',

  DELETE_SHARED_GOAL:
    'DELETE_SHARED_GOAL'
};

// =============================================
// API RESPONSE MESSAGES
// =============================================

const MESSAGES = {

  UNAUTHORIZED:
    'Unauthorized access',

  FORBIDDEN:
    'You do not have permission',

  USER_NOT_FOUND:
    'User not found',

  GOAL_NOT_FOUND:
    'Goal not found',

  CYCLE_NOT_FOUND:
    'Cycle not found',

  VALIDATION_FAILED:
    'Validation failed',

  INTERNAL_SERVER_ERROR:
    'Internal server error',

  LOGIN_SUCCESS:
    'Login successful',

  GOAL_CREATED:
    'Goal created successfully',

  GOAL_UPDATED:
    'Goal updated successfully',

  GOAL_APPROVED:
    'Goal approved successfully',

  GOAL_REJECTED:
    'Goal rejected successfully',

  CHECKIN_COMPLETED:
    'Quarterly check-in completed'
};

// =============================================
// DEFAULT PAGINATION
// =============================================

const PAGINATION = {

  DEFAULT_PAGE: 1,

  DEFAULT_LIMIT: 10,

  MAX_LIMIT: 100
};

// =============================================
// EXPORTS
// =============================================

module.exports = {

  USER_ROLES,

  GOAL_STATUS,

  APPROVAL_STATUS,

  UOM_TYPES,

  QUARTERS,

  CHECKIN_WINDOWS,

  VALIDATION,

  NOTIFICATION_TYPES,

  AUDIT_ACTIONS,

  MESSAGES,

  PAGINATION
};