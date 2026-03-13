const jiraService = require('@syncfy/jira-client');
const { insertTicketIgnore, getTicketsWithActions } = require('@syncfy/database');

exports.getTickets = async (req, res, next) => {
    try {
        const { status, errorStatus, ticketId } = req.query;

        // 1. Obtener desde Jira (Pasa ticketId para omitir los DONE de ser necesario)
        console.log(`[API] Solicitando tickets a Jira...`);
        const jiraTickets = await jiraService.searchTickets({ status, errorStatus, ticketId });

        // 2. Insertar omitiendo duplicados en la Base de Datos
        console.log(`[API] Guardando/Actualizando ${jiraTickets.length} tickets en MySQL...`);
        for (const t of jiraTickets) {
            await insertTicketIgnore(t);
        }

        // 3. Obtener el listado en base de datos (conteo de acciones)
        console.log(`[API] Recuperando estado real desde MySQL...`);
        const dbTickets = await getTicketsWithActions(ticketId);

        // 4. Mágico Intersect: Jira aplicó los filtros reales (JQL). 
        // Por tanto, la vista final SÓLO debe mostrar los tickets que Jira devolvió.
        const validJiraKeys = new Set(jiraTickets.map(t => t.ticketKey));
        const filteredDbTickets = dbTickets.filter(dbT => validJiraKeys.has(dbT.ticket_id));

        res.json({
            count: filteredDbTickets.length,
            data: filteredDbTickets.map(dbT => ({
                ticketKey: dbT.ticket_id,
                summary: dbT.summary,
                jiraStatus: dbT.status_jira,
                job_uuid: dbT.job_uuid,
                created: dbT.sync_date,
                action_count: dbT.action_count
            }))
        });
    } catch (error) {
        next(error);
    }
};

exports.getFilters = (req, res) => {
    res.json({
        jiraStatuses: [
            { id: 'ALL', label: 'All Statuses' },
            { id: 'TO DO', label: 'To Do' },
            { id: 'IN PROGRESS', label: 'In Progress' },
            { id: 'DONE', label: 'Done' }
        ],
        errorStatuses: [
            { id: 'ALL', label: 'All Errors' },
            { id: '507', label: '507 (Latency)' },
            { id: '253', label: '253 (Partial Pull)' },
            { id: '500', label: '500 (Internal Server)' },
            { id: '509', label: '509 (Bandwidth Limit)' },
            { id: '599', label: '599 (Network Connect)' }
        ]
    });
};

exports.getTicketDetails = async (req, res, next) => {
    try {
        const ticketId = req.params.id;
        const details = await jiraService.getTicketDetails(ticketId);

        if (!details) {
            return res.status(404).json({ error: 'Ticket no encontrado en Jira' });
        }
        res.json(details);
    } catch (error) {
        next(error);
    }
};
