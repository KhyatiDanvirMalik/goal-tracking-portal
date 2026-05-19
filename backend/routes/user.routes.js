// backend/routes/user.routes.js

const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../config/db');

const {
  authMiddleware,
  authorize
} = require('../middleware/auth');

const router = express.Router();

// =============================================
// APPLY AUTH MIDDLEWARE
// =============================================

router.use(authMiddleware);

// =============================================
// GET ALL USERS
// Admin -> All users
// Manager -> Team members
// Employee -> Own profile only
// =============================================

router.get('/', async (req, res) => {

  try {

    let users = [];

    // ============================
    // ADMIN
    // ============================

    if (req.user.role === 'admin') {

      users = await db.query(`
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
        ORDER BY created_at DESC
      `);

    }

    // ============================
    // MANAGER
    // ============================

    else if (req.user.role === 'manager') {

      users = await db.query(
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
        WHERE manager_id = ?
        ORDER BY created_at DESC
        `,
        [req.user.id]
      );

    }

    // ============================
    // EMPLOYEE
    // ============================

    else {

      users = await db.query(
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
    }

    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {

    console.error('GET USERS ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// =============================================
// GET SINGLE USER
// =============================================

router.get('/:id', async (req, res) => {

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
      [req.params.id]
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

    console.error('GET USER ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// =============================================
// CREATE USER
// ADMIN ONLY
// =============================================

router.post(
  '/',
  authorize('admin'),
  async (req, res) => {

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
        message: 'User created successfully',
        userId: result.id
      });

    } catch (error) {

      console.error('CREATE USER ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }
  }
);

// =============================================
// UPDATE USER
// =============================================

router.put('/:id', async (req, res) => {

  try {

    const {
      name,
      department,
      manager_id
    } = req.body;

    // ============================
    // ACCESS CONTROL
    // ============================

    if (
      req.user.role !== 'admin' &&
      Number(req.params.id) !== req.user.id
    ) {

      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await db.execute(
      `
      UPDATE users
      SET
        name = ?,
        department = ?,
        manager_id = ?
      WHERE id = ?
      `,
      [
        name,
        department,
        manager_id,
        req.params.id
      ]
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully'
    });

  } catch (error) {

    console.error('UPDATE USER ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// =============================================
// UPDATE PASSWORD
// =============================================

router.put(
  '/:id/password',
  async (req, res) => {

    try {

      const {
        oldPassword,
        newPassword
      } = req.body;

      // ============================
      // ACCESS CONTROL
      // ============================

      if (
        req.user.role !== 'admin' &&
        Number(req.params.id) !== req.user.id
      ) {

        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      // ============================
      // GET USER
      // ============================

      const users = await db.query(
        `
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [req.params.id]
      );

      if (!users.length) {

        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = users[0];

      // ============================
      // VERIFY OLD PASSWORD
      // ============================

      if (req.user.role !== 'admin') {

        const isMatch = await bcrypt.compare(
          oldPassword,
          user.password
        );

        if (!isMatch) {

          return res.status(400).json({
            success: false,
            message: 'Old password incorrect'
          });
        }
      }

      // ============================
      // HASH NEW PASSWORD
      // ============================

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      // ============================
      // UPDATE PASSWORD
      // ============================

      await db.execute(
        `
        UPDATE users
        SET password = ?
        WHERE id = ?
        `,
        [
          hashedPassword,
          req.params.id
        ]
      );

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });

    } catch (error) {

      console.error('PASSWORD UPDATE ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to update password'
      });
    }
  }
);

// =============================================
// DELETE USER
// ADMIN ONLY
// =============================================

router.delete(
  '/:id',
  authorize('admin'),
  async (req, res) => {

    try {

      await db.execute(
        `
        DELETE FROM users
        WHERE id = ?
        `,
        [req.params.id]
      );

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error) {

      console.error('DELETE USER ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }
);

// =============================================
// GET TEAM MEMBERS
// Manager/Admin
// =============================================

router.get(
  '/manager/team',
  authorize('manager', 'admin'),
  async (req, res) => {

    try {

      let teamMembers = [];

      if (req.user.role === 'admin') {

        teamMembers = await db.query(`
          SELECT
            id,
            employee_id,
            name,
            email,
            department
          FROM users
          WHERE role = 'employee'
        `);

      } else {

        teamMembers = await db.query(
          `
          SELECT
            id,
            employee_id,
            name,
            email,
            department
          FROM users
          WHERE manager_id = ?
          `,
          [req.user.id]
        );
      }

      res.status(200).json({
        success: true,
        teamMembers
      });

    } catch (error) {

      console.error('TEAM FETCH ERROR:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to fetch team members'
      });
    }
  }
);

module.exports = router;