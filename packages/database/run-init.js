const { pool } = require('./index');

async function run() {
    try {
        console.log('Borrando tabla job_logs vieja...');
        await pool.query(`DROP TABLE IF EXISTS job_logs;`);

        console.log('Creando tabla job_logs sin FK...');
        await pool.query(`
          CREATE TABLE job_logs (
              id INT AUTO_INCREMENT PRIMARY KEY,
              ticket_key VARCHAR(50) NOT NULL,
              job_uuid VARCHAR(100) NOT NULL UNIQUE,
              internal_href VARCHAR(100),
              console_log_content LONGTEXT,
              scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          );
        `);
        console.log('Tabla job_logs creada con éxito.');
    } catch (err) {
        console.error('Error al crear tabla:', err);
    } finally {
        process.exit();
    }
}

run();
