// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

// =============================================
// VERIFY JWT TOKEN MIDDLEWARE
// =============================================

const authMiddleware = (req, res, next) => {

  try {

    // =========================================
    // GET AUTH HEADER
    // =========================================

    const authHeader = req.headers.authorization;

    // =========================================
    // CHECK HEADER EXISTS
    // =========================================

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {

      return res.status(401).json({
        success: false,
        message:
          'Access denied. Token not provided.'
      });
    }

    // =========================================
    // EXTRACT TOKEN
    // =========================================

    const token = authHeader.split(' ')[1];

    // =========================================
    // VERIFY TOKEN
    // =========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =========================================
    // ATTACH USER TO REQUEST
    // =========================================

    req.user = decoded;

    next();

  } catch (error) {

    console.error('AUTH ERROR:', error);

    // =========================================
    // TOKEN EXPIRED
    // =========================================

    if (error.name === 'TokenExpiredError') {

      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    // =========================================
    // INVALID TOKEN
    // =========================================

    if (error.name === 'JsonWebTokenError') {

      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // =========================================
    // DEFAULT AUTH ERROR
    // =========================================

    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// =============================================
// ROLE AUTHORIZATION MIDDLEWARE
// =============================================

const authorize = (...roles) => {

  return (req, res, next) => {

    try {

      // =======================================
      // CHECK USER EXISTS
      // =======================================

      if (!req.user) {

        return res.status(401).json({
          success: false,
          message: 'Unauthorized access'
        });
      }

      // =======================================
      // CHECK ROLE
      // =======================================

      if (!roles.includes(req.user.role)) {

        return res.status(403).json({
          success: false,
          message:
            'You do not have permission to access this resource'
        });
      }

      next();

    } catch (error) {

      console.error(
        'AUTHORIZATION ERROR:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Authorization middleware failed'
      });
    }
  };
};

// =============================================
// OPTIONAL AUTH MIDDLEWARE
// Useful for mixed public/private APIs
// =============================================

const optionalAuth = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    // =======================================
    // NO TOKEN -> CONTINUE
    // =======================================

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {

      return next();
    }

    // =======================================
    // EXTRACT TOKEN
    // =======================================

    const token = authHeader.split(' ')[1];

    // =======================================
    // VERIFY TOKEN
    // =======================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    // Ignore optional auth failures
    next();
  }
};

// =============================================
// ADMIN ONLY MIDDLEWARE
// =============================================

const adminOnly = (req, res, next) => {

  try {

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (req.user.role !== 'admin') {

      return res.status(403).json({
        success: false,
        message:
          'Admin access required'
      });
    }

    next();

  } catch (error) {

    console.error(
      'ADMIN AUTH ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Admin authorization failed'
    });
  }
};

// =============================================
// MANAGER OR ADMIN MIDDLEWARE
// =============================================

const managerOrAdmin = (
  req,
  res,
  next
) => {

  try {

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (
      req.user.role !== 'manager' &&
      req.user.role !== 'admin'
    ) {

      return res.status(403).json({
        success: false,
        message:
          'Manager/Admin access required'
      });
    }

    next();

  } catch (error) {

    console.error(
      'MANAGER AUTH ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Manager authorization failed'
    });
  }
};

// =============================================
// EXPORTS
// =============================================

module.exports = {
  authMiddleware,
  authorize,
  optionalAuth,
  adminOnly,
  managerOrAdmin
};