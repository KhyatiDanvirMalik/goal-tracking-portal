// backend/database/seed.js
// MySQL version for Railway deployment

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt  = require('bcryptjs');
const mysql   = require('mysql2/promise');
const fs      = require('fs');
const path    = require('path');

async function seedDatabase() {

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    multipleStatements: true
  });

  try {

    console.log('\n🌱 Starting database seeding...\n');

    // =====================================================
    // RUN SCHEMA FIRST
    // =====================================================

    const schema = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    await conn.query(schema);
    console.log('✅ Schema applied');

    // =====================================================
    // CREATE INDEXES (MySQL-safe: only if not exists)
    // =====================================================

    const indexes = [
      { name: 'idx_users_email',        table: 'users',      col: 'email' },
      { name: 'idx_goals_user',         table: 'goals',      col: 'user_id' },
      { name: 'idx_goals_cycle',        table: 'goals',      col: 'cycle_id' },
      { name: 'idx_checkins_goal',      table: 'checkins',   col: 'goal_id' },
      { name: 'idx_notifications_user', table: 'notifications', col: 'user_id' },
    ];

    for (const idx of indexes) {
      const [rows] = await conn.query(
        `SELECT COUNT(*) as cnt FROM information_schema.statistics
         WHERE table_schema = DATABASE()
         AND table_name = ? AND index_name = ?`,
        [idx.table, idx.name]
      );
      if (rows[0].cnt === 0) {
        await conn.query(
          `CREATE INDEX ${idx.name} ON ${idx.table}(${idx.col})`
        );
      }
    }

    // Composite index for audit_logs
    const [auditIdx] = await conn.query(
      `SELECT COUNT(*) as cnt FROM information_schema.statistics
       WHERE table_schema = DATABASE()
       AND table_name = 'audit_logs' AND index_name = 'idx_audit_logs_entity'`,
    );
    if (auditIdx[0].cnt === 0) {
      await conn.query(
        `CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id)`
      );
    }

    console.log('✅ Indexes created');


    // =====================================================
    // CLEAR OLD DATA (in FK-safe order)
    // =====================================================

    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    await conn.execute('DELETE FROM notifications');
    await conn.execute('DELETE FROM audit_logs');
    await conn.execute('DELETE FROM checkins');
    await conn.execute('DELETE FROM goals');
    await conn.execute('DELETE FROM shared_goals');
    await conn.execute('DELETE FROM cycles');
    await conn.execute('DELETE FROM users');
    // Reset auto-increment counters
    await conn.execute('ALTER TABLE notifications  AUTO_INCREMENT = 1');
    await conn.execute('ALTER TABLE audit_logs     AUTO_INCREMENT = 1');
    await conn.execute('ALTER TABLE checkins       AUTO_INCREMENT = 1');
    await conn.execute('ALTER TABLE goals          AUTO_INCREMENT = 1');
    await conn.execute('ALTER TABLE shared_goals   AUTO_INCREMENT = 1');
    await conn.execute('ALTER TABLE cycles         AUTO_INCREMENT = 1');
    await conn.execute('ALTER TABLE users          AUTO_INCREMENT = 1');
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Old data cleared');

    // =====================================================
    // PASSWORD
    // =====================================================

    const hashedPassword = await bcrypt.hash('password123', 10);

    // =====================================================
    // USERS
    // =====================================================

    await conn.execute(
      `INSERT INTO users (employee_id,name,email,password,role,department)
       VALUES (?,?,?,?,?,?)`,
      ['EMP001','System Admin','admin@portal.com',hashedPassword,'admin','Management']
    );

    await conn.execute(
      `INSERT INTO users (employee_id,name,email,password,role,department,manager_id)
       VALUES (?,?,?,?,?,?,?)`,
      ['EMP002','Team Manager','manager@portal.com',hashedPassword,'manager','Sales',1]
    );

    await conn.execute(
      `INSERT INTO users (employee_id,name,email,password,role,department,manager_id)
       VALUES (?,?,?,?,?,?,?)`,
      ['EMP003','John Employee','john@portal.com',hashedPassword,'employee','Operations',2]
    );

    console.log('✅ Users created');

    // =====================================================
    // CYCLE
    // =====================================================

    await conn.execute(
      `INSERT INTO cycles (name,quarter,start_date,end_date,is_active)
       VALUES (?,?,?,?,?)`,
      ['Q1 Performance Cycle','Q1','2026-01-01','2026-03-31',1]
    );

    console.log('✅ Active cycle created');

    // =====================================================
    // SHARED GOALS
    // =====================================================

    await conn.execute(
      `INSERT INTO shared_goals (title,description,target_value,uom_type,owner_id)
       VALUES (?,?,?,?,?)`,
      ['Increase Revenue','Improve company revenue',100000,'max',2]
    );

    console.log('✅ Shared goals created');

    // =====================================================
    // GOALS
    // =====================================================

    await conn.execute(
      `INSERT INTO goals
       (user_id,cycle_id,shared_goal_id,thrust_area,title,description,
        uom_type,target_value,achievement_value,weightage,status,
        approval_status,locked,deadline_date,completion_date)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [2,1,1,'Sales Growth','Increase Monthly Revenue',
       'Improve sales performance by 20%','max',100000,100000,
       40,'Completed','approved',1,'2026-03-31','2026-03-15']
    );

    await conn.execute(
      `INSERT INTO goals
       (user_id,cycle_id,shared_goal_id,thrust_area,title,description,
        uom_type,target_value,achievement_value,weightage,status,
        approval_status,locked,deadline_date,completion_date)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [2,1,null,'Customer Service','Reduce Complaint Rate',
       'Lower customer complaints','min',10,5,
       30,'On Track','approved',1,'2026-03-31',null]
    );

    await conn.execute(
      `INSERT INTO goals
       (user_id,cycle_id,shared_goal_id,thrust_area,title,description,
        uom_type,target_value,achievement_value,weightage,status,
        approval_status,locked,deadline_date,completion_date)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [3,1,null,'Security','Zero Security Incidents',
       'Maintain security compliance','zero',12,12,
       30,'Completed','approved',1,'2026-03-31','2026-03-20']
    );

    console.log('✅ Goals created');

    // =====================================================
    // CHECKINS
    // =====================================================

    await conn.execute(
      `INSERT INTO checkins
       (goal_id,quarter,achievement,progress_percentage,employee_comment,manager_comment,status)
       VALUES (?,?,?,?,?,?,?)`,
      [1,'Q1',45000,45,'Revenue steadily increasing','Good progress so far','On Track']
    );

    await conn.execute(
      `INSERT INTO checkins
       (goal_id,quarter,achievement,progress_percentage,employee_comment,manager_comment,status)
       VALUES (?,?,?,?,?,?,?)`,
      [3,'Q1',12,100,'No incidents reported','Excellent work','Completed']
    );

    console.log('✅ Checkins created');

    // =====================================================
    // AUDIT LOGS
    // =====================================================

    await conn.execute(
      `INSERT INTO audit_logs (user_id,action,entity_type,entity_id,old_value,new_value)
       VALUES (?,?,?,?,?,?)`,
      [1,'CREATE','goal',1,null,'Revenue goal created']
    );

    await conn.execute(
      `INSERT INTO audit_logs (user_id,action,entity_type,entity_id,old_value,new_value)
       VALUES (?,?,?,?,?,?)`,
      [2,'UPDATE','goal',1,'30000','45000']
    );

    console.log('✅ Audit logs created');

    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    await conn.execute(
      `INSERT INTO notifications (user_id,title,message,is_read)
       VALUES (?,?,?,?)`,
      [2,'Goal Approved','Your revenue goal has been approved',0]
    );

    await conn.execute(
      `INSERT INTO notifications (user_id,title,message,is_read)
       VALUES (?,?,?,?)`,
      [3,'Goal Completed','Congratulations on completing your goal',0]
    );

    console.log('✅ Notifications created');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('=================================');
    console.log('LOGIN CREDENTIALS');
    console.log('=================================\n');
    console.log('👑 ADMIN     admin@portal.com   / password123');
    console.log('🧑‍💼 MANAGER  manager@portal.com / password123');
    console.log('👨‍💻 EMPLOYEE  john@portal.com    / password123\n');

  } catch (error) {

    console.error('\n❌ DATABASE SEED ERROR:', error);
    process.exit(1);

  } finally {

    await conn.end();
    process.exit(0);
  }
}

seedDatabase();
