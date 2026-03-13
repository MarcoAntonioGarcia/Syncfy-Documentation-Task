const { pool } = require('@syncfy/database');

exports.dumpDatabase = async (req, res) => {
    try {
        const [tickets] = await pool.execute('SELECT * FROM tickets ORDER BY sync_date DESC');
        const [actions] = await pool.execute('SELECT * FROM ticket_actions ORDER BY created_at DESC');
        const [stats] = await pool.execute('SELECT * FROM historical_stats ORDER BY record_date DESC');
        const [logs] = await pool.execute('SELECT * FROM job_logs ORDER BY scraped_at DESC');

        // Devolver JSON con sangría (pretty print) para lectura directa en el navegador
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            status: 'success',
            message: 'Database dump retrieved successfully',
            data: {
                tickets: { count: tickets.length, records: tickets },
                ticket_actions: { count: actions.length, records: actions },
                historical_stats: { count: stats.length, records: stats },
                job_logs: { count: logs.length, records: logs }
            }
        }, null, 4));
    } catch (error) {
        console.error('[API] Error dumping database:', error);
        res.status(500).json({ error: 'Failed to dump database schema', details: error.message });
    }
};
