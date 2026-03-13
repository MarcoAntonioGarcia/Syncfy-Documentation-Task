const { getHistoricalStats, upsertDailyStats } = require('@syncfy/database');
const jiraService = require('@syncfy/jira-client');

exports.getHistorical = async (req, res, next) => {
    try {
        const stats = await getHistoricalStats();
        // Mapear al formato que espera Recharts en la UI
        const formatted = stats.map(st => {
            const dateObj = new Date(st.record_date);
            const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
            return {
                id: st.id,
                date: `${days[dateObj.getUTCDay()]} ${dateObj.getUTCDate()}`,
                fechaOriginal: st.record_date,
                assigned: st.total_assigned,
                closed: st.total_closed,
                totalBacklog: st.total_backlog,
                successRate: st.success_rate
            };
        });
        res.json(formatted);
    } catch (error) {
        next(error);
    }
};

exports.syncDailyStats = async (req, res, next) => {
    try {
        console.log('[Stats] Calculando creados hoy vs resueltos hoy en Jira...');

        // 1. Nuevos hoy (del dia exacto) para el panel DAQ Workload
        const newTickets = await jiraService.searchTickets({
            rawJql: 'project = SY AND assignee = currentUser() AND component = "DAQ" AND created >= startOfDay() AND created <= endOfDay()'
        });
        const assigned = newTickets.length;

        // 2. Resueltos hoy (del dia exacto) para el panel DAQ Workload
        const closedTickets = await jiraService.searchTickets({
            rawJql: 'project = SY AND assignee = currentUser() AND component = "DAQ" AND resolved >= startOfDay() AND resolved <= endOfDay()'
        });
        const closed = closedTickets.length;

        // Extra: Total "Activos" u "Acarreados" del backlog general actual para el panel DAQ
        const allActiveTickets = await jiraService.searchTickets({
            rawJql: 'project = SY AND assignee = currentUser() AND component = "DAQ" AND statusCategory != Done'
        });
        const totalBacklogToday = allActiveTickets.length;

        // 3. Generar el Dia de hoy en formato 'YYYY-MM-DD'
        const todayStr = new Date().toISOString().split('T')[0];

        // 4. Upsert en DB
        await upsertDailyStats(todayStr, 'marco.garcia', assigned, closed, totalBacklogToday);

        res.json({ message: 'Stats synced successfully', today: todayStr, assigned, closed, total_backlog: totalBacklogToday });
    } catch (error) {
        next(error);
    }
};
// Trigger nodemon
