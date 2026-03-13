CREATE DATABASE IF NOT EXISTS syncfy_triage;
USE syncfy_triage;

-- Tabla Principal (TICKETS)
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id VARCHAR(50) PRIMARY KEY,
    summary VARCHAR(255) NOT NULL,
    status_jira VARCHAR(50),
    job_uuid VARCHAR(24),
    sync_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Historial/Acciones (TICKET_ACTIONS)
CREATE TABLE IF NOT EXISTS ticket_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE
);

-- Tabla Histórica (Agregaciones / Métricas)
CREATE TABLE IF NOT EXISTS historical_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_date DATE NOT NULL UNIQUE,
    developer VARCHAR(100) DEFAULT 'marco',
    total_assigned INT DEFAULT 0,
    total_closed INT DEFAULT 0,
    success_rate DECIMAL(5,2) GENERATED ALWAYS AS (IF(total_assigned > 0, (total_closed / total_assigned) * 100, 0)) STORED
);

-- Tabla de Logs Extraídos (Scraping)
CREATE TABLE IF NOT EXISTS job_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_key VARCHAR(50) NOT NULL,
    job_uuid VARCHAR(100) NOT NULL UNIQUE,
    internal_href VARCHAR(100),
    console_log_content LONGTEXT,
    scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
