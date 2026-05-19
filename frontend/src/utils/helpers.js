// frontend/src/utils/helpers.js

// =============================================
// FORMAT DATE
// =============================================

export const formatDate = (
  date
) => {

  if (!date) {
    return '-';
  }

  return new Date(date)
    .toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
};

// =============================================
// FORMAT DATE & TIME
// =============================================

export const formatDateTime = (
  date
) => {

  if (!date) {
    return '-';
  }

  return new Date(date)
    .toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',

        hour: '2-digit',
        minute: '2-digit'
      }
    );
};

// =============================================
// CALCULATE PROGRESS
// =============================================

export const calculateProgress = (
  achievement = 0,
  target = 0
) => {

  if (!target || target <= 0) {
    return 0;
  }

  return Math.min(
    (
      (achievement / target) * 100
    ),
    100
  ).toFixed(0);
};

// =============================================
// CAPITALIZE
// =============================================

export const capitalize = (
  text = ''
) => {

  return text
    .charAt(0)
    .toUpperCase() +

    text.slice(1);
};

// =============================================
// GET STATUS COLOR
// =============================================

export const getStatusColor = (
  status
) => {

  switch (status) {

    case 'Completed':

      return `
        bg-green-100
        text-green-700
      `;

    case 'On Track':

      return `
        bg-blue-100
        text-blue-700
      `;

    case 'Not Started':

      return `
        bg-gray-100
        text-gray-700
      `;

    case 'Pending':

      return `
        bg-yellow-100
        text-yellow-700
      `;

    case 'Approved':

      return `
        bg-green-100
        text-green-700
      `;

    case 'Rejected':

      return `
        bg-red-100
        text-red-700
      `;

    default:

      return `
        bg-gray-100
        text-gray-700
      `;
  }
};

// =============================================
// TRUNCATE TEXT
// =============================================

export const truncateText = (
  text = '',
  maxLength = 50
) => {

  if (
    text.length <= maxLength
  ) {

    return text;
  }

  return (
    text.slice(
      0,
      maxLength
    ) + '...'
  );
};

// =============================================
// GENERATE INITIALS
// =============================================

export const getInitials = (
  name = ''
) => {

  return name
    .split(' ')
    .map(
      (word) =>
        word.charAt(0)
    )
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// =============================================
// FORMAT NUMBER
// =============================================

export const formatNumber = (
  number
) => {

  if (
    number === null ||
    number === undefined
  ) {

    return 0;
  }

  return new Intl.NumberFormat(
    'en-IN'
  ).format(number);
};

// =============================================
// GET COMPLETION RATE
// =============================================

export const getCompletionRate = (
  completed,
  total
) => {

  if (!total || total <= 0) {
    return 0;
  }

  return (
    (
      (completed / total) *
      100
    ).toFixed(0)
  );
};

// =============================================
// FILTER SEARCH
// =============================================

export const filterSearch = (
  items = [],
  search = '',
  fields = []
) => {

  if (!search) {
    return items;
  }

  const term =
    search.toLowerCase();

  return items.filter(
    (item) => {

      return fields.some(
        (field) =>

          item[field]
            ?.toString()
            .toLowerCase()
            .includes(term)
      );
    }
  );
};