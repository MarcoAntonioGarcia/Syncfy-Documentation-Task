require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user_syncfy',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'syncfy_triage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Inserta o ignora un ticket en la base de datos (Upsert/Skiping)
 */
async function insertTicketIgnore(ticket) {
  const query = `
    INSERT IGNORE INTO tickets (ticket_id, summary, status_jira, job_uuid)
    VALUES (?, ?, ?, ?)
  `;
  const values = [ticket.ticketKey, ticket.summary, ticket.jiraStatus || 'UNKNOWN', ticket.job_uuid];

  const [result] = await pool.execute(query, values);
  return result;
}

/**
 * Registra una nueva acción relacionada a un ticket
 */
async function addTicketAction(ticketId, actionType, comment) {
  const query = `
    INSERT INTO ticket_actions (ticket_id, action_type, comment)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(query, [ticketId, actionType, comment]);
  return result;
}

/**
 * Obtiene todos los tickets (opcionalmente filtrado por ticket_id parcial)
 */
async function getTicketsWithActions(searchId = null) {
  let query = `
    SELECT t.*, 
           (SELECT COUNT(*) FROM ticket_actions ta WHERE ta.ticket_id = t.ticket_id) as action_count
    FROM tickets t
  `;

  const params = [];
  if (searchId) {
    query += ` WHERE t.ticket_id LIKE ?`;
    params.push(`%${searchId}%`);
  }

  query += ` ORDER BY t.sync_date DESC`;

  const [rows] = await pool.execute(query, params);
  return rows;
}

/**
 * Agrega o actualiza las estadisticas de un dia en especifico.
 */
async function upsertDailyStats(dateString, developer, assigned, closed, totalBacklog = 0) {
  const query = `
    INSERT INTO historical_stats (record_date, developer, total_assigned, total_closed, total_backlog)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      total_assigned = VALUES(total_assigned),
      total_closed = VALUES(total_closed),
      total_backlog = VALUES(total_backlog)
  `;
  const [result] = await pool.execute(query, [dateString, developer, assigned, closed, totalBacklog]);
  return result;
}

/**
 * Obtiene el historial ordenado de forma cronologica (Dinamico desde tickets reales)
 */
async function getHistoricalStats() {
  const query = `
    SELECT 
      DATE(sync_date) as record_date,
      COUNT(ticket_id) as total_assigned,
      SUM(IF(status_jira LIKE '%Done%' OR status_jira = 'Finalizada' OR status_jira = 'Cerrada', 1, 0)) as total_closed,
      SUM(IF(status_jira NOT LIKE '%Done%' AND status_jira != 'Finalizada' AND status_jira != 'Cerrada', 1, 0)) as total_backlog
    FROM tickets
    GROUP BY DATE(sync_date)
    ORDER BY record_date ASC
    LIMIT 30
  `;
  const [rows] = await pool.execute(query);
  return rows.map((r, index) => ({
    id: index + 1,
    record_date: r.record_date,
    total_assigned: Number(r.total_assigned) || 0,
    total_closed: Number(r.total_closed) || 0,
    total_backlog: Number(r.total_backlog) || 0,
    success_rate: Number(r.total_assigned) > 0 ? ((Number(r.total_closed) / Number(r.total_assigned)) * 100).toFixed(2) : "0.00",
    developer: 'marco'
  }));
}

/**
 * Guarda o actualiza el log de consola extraído de un job_uuid
 */
async function saveJobLog(ticketKey, jobUuid, internalHref, consoleLogContent) {
  const query = `
    INSERT INTO job_logs (ticket_key, job_uuid, internal_href, console_log_content)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      internal_href = VALUES(internal_href),
      console_log_content = VALUES(console_log_content),
      scraped_at = CURRENT_TIMESTAMP
  `;
  const [result] = await pool.execute(query, [ticketKey, jobUuid, internalHref, consoleLogContent]);
  return result;
}

/**
 * Recupera un log guardado
 */
async function getJobLog(jobUuid) {
  const query = `SELECT * FROM job_logs WHERE job_uuid = ?`;
  const [rows] = await pool.execute(query, [jobUuid]);
  return rows[0] || null;
}

module.exports = {
  pool,
  insertTicketIgnore,
  addTicketAction,
  getTicketsWithActions,
  upsertDailyStats,
  getHistoricalStats,
  saveJobLog,
  getJobLog
};
