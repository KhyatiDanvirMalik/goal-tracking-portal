// frontend/src/utils/constants.js

// =============================================
// USER ROLES
// =============================================

export const ROLES = {

  ADMIN: 'admin',

  MANAGER: 'manager',

  EMPLOYEE: 'employee'
};

// =============================================
// GOAL STATUS
// =============================================

export const GOAL_STATUS = {

  NOT_STARTED:
    'Not Started',

  ON_TRACK:
    'On Track',

  COMPLETED:
    'Completed'
};

// =============================================
// APPROVAL STATUS
// =============================================

export const APPROVAL_STATUS = {

  PENDING: 'Pending',

  APPROVED: 'Approved',

  REJECTED: 'Rejected'
};

// =============================================
// UOM TYPES
// =============================================

export const UOM_TYPES = [

  'min',

  'max',

  'timeline',

  'zero'
];

// =============================================
// QUARTERS
// =============================================

export const QUARTERS = [

  'Q1',

  'Q2',

  'Q3',

  'Q4'
];

// =============================================
// LOCAL STORAGE KEYS
// =============================================

export const STORAGE_KEYS = {

  TOKEN: 'token',

  USER: 'user'
};

// =============================================
// API ENDPOINTS
// =============================================

export const API_ENDPOINTS = {

  LOGIN:
    '/auth/login',

  GOALS:
    '/goals',

  MY_GOALS:
    '/goals/my',

  TEAM_GOALS:
    '/goals/team',

  USERS:
    '/users',

  CYCLES:
    '/cycles',

  REPORTS:
    '/reports'
};

// =============================================
// PAGINATION
// =============================================

export const PAGINATION = {

  DEFAULT_PAGE: 1,

  DEFAULT_LIMIT: 10
};

// =============================================
// THEME COLORS
// =============================================

export const COLORS = {

  PRIMARY:
    '#2563eb',

  SUCCESS:
    '#16a34a',

  WARNING:
    '#f59e0b',

  DANGER:
    '#dc2626'
};