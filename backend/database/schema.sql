-- backend/database/schema.sql
-- MySQL version for Railway deployment

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50)  NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('employee','manager','admin') NOT NULL,
    department  VARCHAR(255),
    manager_id  INT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- CYCLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS cycles (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    quarter    VARCHAR(10)  NOT NULL,
    start_date DATE         NOT NULL,
    end_date   DATE         NOT NULL,
    is_active  TINYINT(1)   DEFAULT 0,
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- SHARED GOALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS shared_goals (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    target_value DOUBLE       NOT NULL,
    uom_type     ENUM('min','max','timeline','zero') NOT NULL,
    owner_id     INT,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- GOALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS goals (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT    NOT NULL,
    cycle_id          INT,
    shared_goal_id    INT,
    thrust_area       VARCHAR(255) NOT NULL,
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    uom_type          ENUM('min','max','timeline','zero') NOT NULL,
    target_value      DOUBLE       NOT NULL,
    achievement_value DOUBLE       DEFAULT 0,
    weightage         INT          NOT NULL,
    status            ENUM('Not Started','On Track','Completed') DEFAULT 'Not Started',
    approval_status   ENUM('draft','submitted','approved','rejected') DEFAULT 'draft',
    locked            TINYINT(1)   DEFAULT 0,
    deadline_date     DATE,
    completion_date   DATE,
    created_at        DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)        REFERENCES users(id)        ON DELETE CASCADE,
    FOREIGN KEY (cycle_id)       REFERENCES cycles(id)       ON DELETE SET NULL,
    FOREIGN KEY (shared_goal_id) REFERENCES shared_goals(id) ON DELETE SET NULL
);

-- =====================================================
-- CHECKINS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS checkins (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    goal_id             INT    NOT NULL,
    quarter             VARCHAR(10)  NOT NULL,
    achievement         DOUBLE       DEFAULT 0,
    progress_percentage DOUBLE       DEFAULT 0,
    employee_comment    TEXT,
    manager_comment     TEXT,
    status              ENUM('Not Started','On Track','Completed') DEFAULT 'On Track',
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id   INT,
    old_value   TEXT,
    new_value   TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT          NOT NULL,
    title      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    is_read    TINYINT(1)   DEFAULT 0,
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);
CREATE INDEX IF NOT EXISTS idx_goals_user         ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_cycle        ON goals(cycle_id);
CREATE INDEX IF NOT EXISTS idx_checkins_goal      ON checkins(goal_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity  ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

SET FOREIGN_KEY_CHECKS = 1;
