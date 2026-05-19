// backend/config/db.js
// MySQL version for Railway deployment

const mysql = require('mysql2/promise');

// =============================================
// CREATE CONNECTION POOL
// =============================================

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

// =============================================
// TEST CONNECTION ON STARTUP
// =============================================

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL database connected');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err.message);
    process.exit(1);
  });

// =============================================
// QUERY HELPER  (returns rows array)
// =============================================

const query = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

// =============================================
// EXECUTE HELPER  (returns { id, changes })
// =============================================

const execute = async (sql, params = []) => {
  const [result] = await pool.execute(sql, params);
  return {
    id:      result.insertId,
    changes: result.affectedRows
  };
};

// =============================================
// EXPORTS
// =============================================

module.exports = { pool, query, execute };
