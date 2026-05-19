// backend/utils/validators.js

const {
  VALIDATION,
  UOM_TYPES,
  GOAL_STATUS,
  APPROVAL_STATUS
} = require('./constants');

// =============================================
// EMAIL VALIDATION
// =============================================

const isValidEmail = (email) => {

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

// =============================================
// PASSWORD VALIDATION
// =============================================

const isValidPassword = (
  password
) => {

  if (!password) {
    return false;
  }

  // Minimum 6 chars
  return password.length >= 6;
};

// =============================================
// ROLE VALIDATION
// =============================================

const isValidRole = (role) => {

  return [
    'employee',
    'manager',
    'admin'
  ].includes(role);
};

// =============================================
// UOM VALIDATION
// =============================================

const isValidUOM = (uom) => {

  return Object.values(
    UOM_TYPES
  ).includes(uom);
};

// =============================================
// GOAL STATUS VALIDATION
// =============================================

const isValidGoalStatus = (
  status
) => {

  return Object.values(
    GOAL_STATUS
  ).includes(status);
};

// =============================================
// APPROVAL STATUS VALIDATION
// =============================================

const isValidApprovalStatus = (
  status
) => {

  return Object.values(
    APPROVAL_STATUS
  ).includes(status);
};

// =============================================
// VALIDATE SINGLE GOAL
// =============================================

const validateGoal = (goal) => {

  const errors = [];

  // ============================
  // TITLE
  // ============================

  if (
    !goal.title ||
    goal.title.trim() === ''
  ) {

    errors.push(
      'Goal title is required'
    );
  }

  // ============================
  // THRUST AREA
  // ============================

  if (
    !goal.thrust_area ||
    goal.thrust_area.trim() === ''
  ) {

    errors.push(
      'Thrust area is required'
    );
  }

  // ============================
  // UOM TYPE
  // ============================

  if (
    !goal.uom_type ||
    !isValidUOM(goal.uom_type)
  ) {

    errors.push(
      'Invalid UOM type'
    );
  }

  // ============================
  // TARGET VALUE
  // ============================

  if (
    goal.target_value === null ||
    goal.target_value === undefined
  ) {

    errors.push(
      'Target value is required'
    );
  }

  // ============================
  // WEIGHTAGE
  // ============================

  if (
    goal.weightage === null ||
    goal.weightage === undefined
  ) {

    errors.push(
      'Weightage is required'
    );
  }

  else {

    const weightage =
      Number(goal.weightage);

    if (
      weightage <
      VALIDATION.MIN_WEIGHTAGE_PER_GOAL
    ) {

      errors.push(
        `Minimum weightage per goal is ${VALIDATION.MIN_WEIGHTAGE_PER_GOAL}%`
      );
    }
  }

  return errors;
};

// =============================================
// VALIDATE GOALS ARRAY
// =============================================

const validateGoals = (goals) => {

  const errors = [];

  // ============================
  // ARRAY CHECK
  // ============================

  if (!Array.isArray(goals)) {

    errors.push(
      'Goals must be an array'
    );

    return errors;
  }

  // ============================
  // EMPTY CHECK
  // ============================

  if (goals.length === 0) {

    errors.push(
      'At least one goal is required'
    );
  }

  // ============================
  // MAX GOALS CHECK
  // ============================

  if (
    goals.length >
    VALIDATION.MAX_GOALS_PER_EMPLOYEE
  ) {

    errors.push(
      `Maximum ${VALIDATION.MAX_GOALS_PER_EMPLOYEE} goals allowed`
    );
  }

  // ============================
  // INDIVIDUAL VALIDATION
  // ============================

  let totalWeightage = 0;

  goals.forEach((goal, index) => {

    const goalErrors =
      validateGoal(goal);

    if (goalErrors.length > 0) {

      goalErrors.forEach((err) => {

        errors.push(
          `Goal ${index + 1}: ${err}`
        );
      });
    }

    totalWeightage += Number(
      goal.weightage || 0
    );
  });

  // ============================
  // TOTAL WEIGHTAGE CHECK
  // ============================

  if (
    totalWeightage !==
    VALIDATION.TOTAL_WEIGHTAGE
  ) {

    errors.push(
      `Total weightage must equal ${VALIDATION.TOTAL_WEIGHTAGE}%`
    );
  }

  return errors;
};

// =============================================
// VALIDATE CHECK-IN
// =============================================

const validateCheckin = (
  checkin
) => {

  const errors = [];

  // ============================
  // QUARTER
  // ============================

  if (
    !checkin.quarter ||
    checkin.quarter.trim() === ''
  ) {

    errors.push(
      'Quarter is required'
    );
  }

  // ============================
  // STATUS
  // ============================

  if (
    checkin.status &&
    !isValidGoalStatus(
      checkin.status
    )
  ) {

    errors.push(
      'Invalid goal status'
    );
  }

  return errors;
};

// =============================================
// VALIDATE USER
// =============================================

const validateUser = (user) => {

  const errors = [];

  // ============================
  // NAME
  // ============================

  if (
    !user.name ||
    user.name.trim() === ''
  ) {

    errors.push(
      'Name is required'
    );
  }

  // ============================
  // EMAIL
  // ============================

  if (
    !user.email ||
    !isValidEmail(user.email)
  ) {

    errors.push(
      'Valid email is required'
    );
  }

  // ============================
  // PASSWORD
  // ============================

  if (
    user.password &&
    !isValidPassword(
      user.password
    )
  ) {

    errors.push(
      'Password must be at least 6 characters'
    );
  }

  // ============================
  // ROLE
  // ============================

  if (
    !user.role ||
    !isValidRole(user.role)
  ) {

    errors.push(
      'Invalid user role'
    );
  }

  return errors;
};

// =============================================
// VALIDATE CYCLE
// =============================================

const validateCycle = (
  cycle
) => {

  const errors = [];

  if (
    !cycle.name ||
    cycle.name.trim() === ''
  ) {

    errors.push(
      'Cycle name is required'
    );
  }

  if (
    !cycle.quarter ||
    cycle.quarter.trim() === ''
  ) {

    errors.push(
      'Quarter is required'
    );
  }

  if (!cycle.start_date) {

    errors.push(
      'Start date is required'
    );
  }

  if (!cycle.end_date) {

    errors.push(
      'End date is required'
    );
  }

  return errors;
};

// =============================================
// VALIDATE NOTIFICATION
// =============================================

const validateNotification = (
  notification
) => {

  const errors = [];

  if (!notification.user_id) {

    errors.push(
      'User ID is required'
    );
  }

  if (
    !notification.title ||
    notification.title.trim() === ''
  ) {

    errors.push(
      'Notification title is required'
    );
  }

  if (
    !notification.message ||
    notification.message.trim() === ''
  ) {

    errors.push(
      'Notification message is required'
    );
  }

  return errors;
};

// =============================================
// VALIDATE SHARED GOAL
// =============================================

const validateSharedGoal = (
  sharedGoal
) => {

  const errors = [];

  if (
    !sharedGoal.title ||
    sharedGoal.title.trim() === ''
  ) {

    errors.push(
      'Shared goal title is required'
    );
  }

  if (
    sharedGoal.target_value ===
      undefined ||
    sharedGoal.target_value ===
      null
  ) {

    errors.push(
      'Target value is required'
    );
  }

  if (
    !sharedGoal.uom_type ||
    !isValidUOM(
      sharedGoal.uom_type
    )
  ) {

    errors.push(
      'Invalid UOM type'
    );
  }

  if (
    !sharedGoal.employee_ids ||
    !Array.isArray(
      sharedGoal.employee_ids
    ) ||
    sharedGoal.employee_ids
      .length === 0
  ) {

    errors.push(
      'At least one employee must be assigned'
    );
  }

  return errors;
};

// =============================================
// EXPORTS
// =============================================

module.exports = {

  isValidEmail,

  isValidPassword,

  isValidRole,

  isValidUOM,

  isValidGoalStatus,

  isValidApprovalStatus,

  validateGoal,

  validateGoals,

  validateCheckin,

  validateUser,

  validateCycle,

  validateNotification,

  validateSharedGoal
};