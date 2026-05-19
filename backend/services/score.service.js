// backend/services/score.service.js

// =============================================
// MIN TYPE
// Higher is better
// Formula:
// Achievement / Target
// =============================================

const calculateMinScore = (
  target,
  achievement
) => {

  if (
    target === 0 ||
    target === null ||
    target === undefined
  ) {
    return 0;
  }

  const score =
    (achievement / target) * 100;

  return Number(score.toFixed(2));
};

// =============================================
// MAX TYPE
// Lower is better
// Formula:
// Target / Achievement
// =============================================

const calculateMaxScore = (
  target,
  achievement
) => {

  if (
    achievement === 0 ||
    achievement === null ||
    achievement === undefined
  ) {
    return 0;
  }

  const score =
    (target / achievement) * 100;

  return Number(score.toFixed(2));
};

// =============================================
// ZERO TYPE
// Zero = Success
// =============================================

const calculateZeroScore = (
  achievement
) => {

  return achievement === 0
    ? 100
    : 0;
};

// =============================================
// TIMELINE TYPE
// Deadline-based scoring
// =============================================

const calculateTimelineScore = ({
  deadlineDate,
  completionDate
}) => {

  try {

    if (
      !deadlineDate ||
      !completionDate
    ) {
      return 0;
    }

    const deadline =
      new Date(deadlineDate);

    const completed =
      new Date(completionDate);

    // Completed on/before deadline
    if (completed <= deadline) {
      return 100;
    }

    // Delay calculation
    const diffTime =
      completed - deadline;

    const delayDays =
      Math.ceil(
        diffTime /
        (1000 * 60 * 60 * 24)
      );

    // Deduct 2% per delayed day
    let score =
      100 - (delayDays * 2);

    if (score < 0) {
      score = 0;
    }

    return Number(score.toFixed(2));

  } catch (error) {

    console.error(
      'TIMELINE SCORE ERROR:',
      error
    );

    return 0;
  }
};

// =============================================
// MAIN PROGRESS CALCULATOR
// =============================================

const calculateProgress = ({
  uom_type,
  target_value,
  achievement_value,
  deadline_date,
  completion_date
}) => {

  try {

    switch (
      String(uom_type).toLowerCase()
    ) {

      // ==========================
      // MIN
      // ==========================

      case 'min':

        return calculateMinScore(
          Number(target_value),
          Number(achievement_value)
        );

      // ==========================
      // MAX
      // ==========================

      case 'max':

        return calculateMaxScore(
          Number(target_value),
          Number(achievement_value)
        );

      // ==========================
      // ZERO
      // ==========================

      case 'zero':

        return calculateZeroScore(
          Number(achievement_value)
        );

      // ==========================
      // TIMELINE
      // ==========================

      case 'timeline':

        return calculateTimelineScore({
          deadlineDate: deadline_date,
          completionDate: completion_date
        });

      // ==========================
      // DEFAULT
      // ==========================

      default:
        return 0;
    }

  } catch (error) {

    console.error(
      'PROGRESS CALCULATION ERROR:',
      error
    );

    return 0;
  }
};

// =============================================
// CALCULATE WEIGHTED SCORE
// =============================================

const calculateWeightedScore = ({
  progress,
  weightage
}) => {

  try {

    if (
      progress === null ||
      progress === undefined
    ) {
      return 0;
    }

    if (
      weightage === null ||
      weightage === undefined
    ) {
      return 0;
    }

    const weighted =
      (progress * weightage) / 100;

    return Number(weighted.toFixed(2));

  } catch (error) {

    console.error(
      'WEIGHTED SCORE ERROR:',
      error
    );

    return 0;
  }
};

// =============================================
// CALCULATE OVERALL EMPLOYEE SCORE
// =============================================

const calculateOverallScore = (
  goals = []
) => {

  try {

    if (
      !Array.isArray(goals) ||
      goals.length === 0
    ) {
      return 0;
    }

    let totalScore = 0;

    for (const goal of goals) {

      const progress =
        calculateProgress({
          uom_type: goal.uom_type,
          target_value:
            goal.target_value,
          achievement_value:
            goal.achievement_value,
          deadline_date:
            goal.deadline_date,
          completion_date:
            goal.completion_date
        });

      const weighted =
        calculateWeightedScore({
          progress,
          weightage:
            goal.weightage
        });

      totalScore += weighted;
    }

    return Number(
      totalScore.toFixed(2)
    );

  } catch (error) {

    console.error(
      'OVERALL SCORE ERROR:',
      error
    );

    return 0;
  }
};

// =============================================
// GOAL STATUS HELPER
// =============================================

const getGoalStatus = (
  progress
) => {

  try {

    if (progress >= 100) {
      return 'Completed';
    }

    if (progress >= 50) {
      return 'On Track';
    }

    return 'Not Started';

  } catch (error) {

    return 'Not Started';
  }
};

// =============================================
// QUARTERLY SUMMARY
// =============================================

const generateQuarterSummary = (
  goals = []
) => {

  try {

    const totalGoals =
      goals.length;

    let completed = 0;

    let onTrack = 0;

    let notStarted = 0;

    for (const goal of goals) {

      const progress =
        calculateProgress({
          uom_type: goal.uom_type,
          target_value:
            goal.target_value,
          achievement_value:
            goal.achievement_value,
          deadline_date:
            goal.deadline_date,
          completion_date:
            goal.completion_date
        });

      const status =
        getGoalStatus(progress);

      if (status === 'Completed') {
        completed++;
      }

      else if (
        status === 'On Track'
      ) {
        onTrack++;
      }

      else {
        notStarted++;
      }
    }

    return {

      total_goals: totalGoals,

      completed_goals: completed,

      on_track_goals: onTrack,

      not_started_goals: notStarted,

      overall_score:
        calculateOverallScore(goals)
    };

  } catch (error) {

    console.error(
      'QUARTER SUMMARY ERROR:',
      error
    );

    return {
      total_goals: 0,
      completed_goals: 0,
      on_track_goals: 0,
      not_started_goals: 0,
      overall_score: 0
    };
  }
};

// =============================================
// EXPORTS
// =============================================

module.exports = {

  calculateMinScore,

  calculateMaxScore,

  calculateZeroScore,

  calculateTimelineScore,

  calculateProgress,

  calculateWeightedScore,

  calculateOverallScore,

  getGoalStatus,

  generateQuarterSummary
};