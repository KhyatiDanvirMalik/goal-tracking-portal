// backend/routes/auth.routes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/db');

const {
  authMiddleware
} = require('../middleware/auth');

const router = express.Router();

// ============================================
// LOGIN
// ============================================

router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // ============================
    // FIND USER
    // ============================

    const users = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    const user = users[0];

    if (!user) {

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ============================
    // VERIFY PASSWORD
    // ============================

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ============================
    // GENERATE JWT TOKEN
    // ============================

    const token = jwt.sign(
      {
        id: user.id,
        employee_id: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || '1d'
      }
    );

    // ============================
    // RESPONSE
    // ============================

    res.status(200).json({
      success: true,
      message: 'Login successful',

      token,

      user: {
        id: user.id,
        employee_id: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        manager_id: user.manager_id
      }
    });

  } catch (error) {

    console.error('LOGIN ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Login failed',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined
    });
  }
});

// ============================================
// CURRENT USER PROFILE
// ============================================

router.get(
  '/me',
  authMiddleware,
  async (req, res) => {

    try {

      const users = await db.query(
        `
        SELECT
          id,
          employee_id,
          name,
          email,
          role,
          department,
          manager_id,
          created_at
        FROM users
        WHERE id = ?
        `,
        [req.user.id]
      );

      if (!users.length) {

        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        user: users[0]
      });

    } catch (error) {

      console.error('PROFILE ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile'
      });
    }
  }
);

// ============================================
// REGISTER USER (ADMIN ONLY)
// OPTIONAL ROUTE
// ============================================

router.post('/register', async (req, res) => {

  try {

    const {
      employee_id,
      name,
      email,
      password,
      role,
      department,
      manager_id
    } = req.body;

    // ============================
    // VALIDATION
    // ============================

    if (
      !employee_id ||
      !name ||
      !email ||
      !password ||
      !role
    ) {

      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // ============================
    // CHECK EXISTING USER
    // ============================

    const existingUser = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (existingUser.length > 0) {

      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // ============================
    // HASH PASSWORD
    // ============================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ============================
    // INSERT USER
    // ============================

    const result = await db.execute(
      `
      INSERT INTO users
      (
        employee_id,
        name,
        email,
        password,
        role,
        department,
        manager_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        employee_id,
        name,
        email,
        hashedPassword,
        role,
        department || null,
        manager_id || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: result.id
    });

  } catch (error) {

    console.error('REGISTER ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined
    });
  }
});

// ============================================
// VERIFY TOKEN
// ============================================

router.get(
  '/verify-token',
  authMiddleware,
  async (req, res) => {

    res.status(200).json({
      success: true,
      message: 'Token valid',
      user: req.user
    });
  }
);

// ============================================
// LOGOUT
// ============================================

router.post('/logout', authMiddleware, async (req, res) => {

  try {

    // JWT logout handled client-side
    // Optional blacklist implementation later

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

module.exports = router;