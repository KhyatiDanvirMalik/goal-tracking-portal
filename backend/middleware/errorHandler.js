// =====================================
// GLOBAL ERROR HANDLER
// =====================================

const errorHandler = (err, req, res, next) => {

  console.error('ERROR:', err);

  // SQLite Errors
  if (err.code === 'SQLITE_CONSTRAINT') {

    return res.status(400).json({
      success: false,
      message: 'Database constraint violation.',
      error: err.message
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {

    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }

  if (err.name === 'TokenExpiredError') {

    return res.status(401).json({
      success: false,
      message: 'Token expired.'
    });
  }

  // Validation Errors
  if (err.name === 'ValidationError') {

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Default Error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack:
      process.env.NODE_ENV === 'development'
        ? err.stack
        : undefined
  });
};

module.exports = errorHandler;