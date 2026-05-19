// backend/server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// =============================================
// DATABASE
// =============================================

require('./config/db');

// =============================================
// ROUTES
// =============================================

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cycleRoutes = require('./routes/cycle.routes');
const goalRoutes = require('./routes/goal.routes');
const reportRoutes = require('./routes/report.routes');
const adminRoutes = require('./routes/admin.routes');

// =============================================
// MIDDLEWARE
// =============================================

const errorHandler = require(
  './middleware/errorHandler'
);

// =============================================
// APP
// =============================================

const app = express();

// =============================================
// SECURITY HEADERS
// =============================================

app.use(helmet());

// =============================================
// CORS
// =============================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      '*',

    credentials: true
  })
);

// =============================================
// BODY PARSER
// =============================================

app.use(
  express.json({
    limit: '10mb'
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

// =============================================
// LOGGER
// =============================================

app.use(morgan('dev'));

// =============================================
// RATE LIMITER
// =============================================

const limiter = rateLimit({

  windowMs:
    Number(
      process.env
        .RATE_LIMIT_WINDOW_MS
    ) || 15 * 60 * 1000,

  max:
    Number(
      process.env
        .RATE_LIMIT_MAX_REQUESTS
    ) || 200,

  message: {
    success: false,
    message:
      'Too many requests. Please try again later.'
  }
});

app.use(limiter);

// =============================================
// STATIC FILES
// =============================================

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'uploads')
  )
);

// =============================================
// ROOT ROUTE
// =============================================

app.get('/', (req, res) => {

  res.status(200).json({

    success: true,

    message:
      'Goal Tracking Portal API Running',

    version: '2.0.0',

    timestamp: new Date()
  });
});

// =============================================
// HEALTH CHECK
// =============================================

app.get(
  '/api/health',
  (req, res) => {

    res.status(200).json({

      success: true,

      status: 'healthy',

      environment:
        process.env.NODE_ENV,

      timestamp: new Date()
    });
  }
);

// =============================================
// API ROUTES
// =============================================

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/users',
  userRoutes
);

app.use(
  '/api/cycles',
  cycleRoutes
);

app.use(
  '/api/goals',
  goalRoutes
);

app.use(
  '/api/reports',
  reportRoutes
);

app.use(
  '/api/admin',
  adminRoutes
);

// =============================================
// 404 HANDLER
// =============================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message:
      'API route not found'
  });
});

// =============================================
// GLOBAL ERROR HANDLER
// =============================================

app.use(errorHandler);

// =============================================
// SERVER START
// =============================================

const PORT =
  process.env.PORT || 4000;

app.listen(PORT, () => {

  console.log(`
================================================
🚀 Goal Tracking Portal API Started
================================================

🌐 Server Running On:
http://localhost:${PORT}

📅 Started At:
${new Date().toLocaleString()}

🌍 Environment:
${process.env.NODE_ENV}

================================================
  `);
});