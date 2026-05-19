const { validationResult } = require('express-validator');

// =====================================
// VALIDATION RESULT HANDLER
// =====================================

const validate = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  next();
};

// =====================================
// GOAL VALIDATION
// =====================================

const validateGoalPayload = (goals) => {

  if (!Array.isArray(goals)) {
    throw new Error('Goals must be an array.');
  }

  if (goals.length === 0) {
    throw new Error('At least one goal is required.');
  }

  if (goals.length > 8) {
    throw new Error('Maximum 8 goals allowed.');
  }

  let totalWeightage = 0;

  for (const goal of goals) {

    if (!goal.title || goal.title.trim() === '') {
      throw new Error('Goal title is required.');
    }

    if (!goal.thrust_area) {
      throw new Error('Thrust area is required.');
    }

    if (!goal.uom_type) {
      throw new Error('UoM type is required.');
    }

    if (
      ![
        'min',
        'max',
        'timeline',
        'zero'
      ].includes(goal.uom_type)
    ) {
      throw new Error(
        'Invalid UoM type.'
      );
    }

    if (
      goal.weightage === undefined ||
      goal.weightage === null
    ) {
      throw new Error(
        'Weightage is required.'
      );
    }

    const weightage = Number(goal.weightage);

    if (weightage < 10) {
      throw new Error(
        'Minimum weightage per goal is 10%.'
      );
    }

    totalWeightage += weightage;
  }

  if (totalWeightage !== 100) {
    throw new Error(
      'Total weightage must equal 100%.'
    );
  }

  return true;
};

// =====================================
// CHECK-IN VALIDATION
// =====================================

const validateCheckin = (data) => {

  const allowedStatus = [
    'Not Started',
    'On Track',
    'Completed'
  ];

  if (
    data.status &&
    !allowedStatus.includes(data.status)
  ) {
    throw new Error(
      'Invalid goal status.'
    );
  }

  return true;
};

module.exports = {
  validate,
  validateGoalPayload,
  validateCheckin
};