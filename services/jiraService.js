const env = require('../config/env');

/**
 * Convierte las credenciales de Jira en el header Authorization de formato Basic
 */
function getBasicAuthHeader() {
    // Codificar a base64 email:token
    const authString = `${env.JIRA.EMAIL}:${env.JIRA.API_TOKEN}`;
    return `Basic ${Buffer.from(authString).toString('base64')}`;
}

/**
 * Conecta con la API REST V2 de Jira para obtener tickets que requieren documentación.
 */
async function getPendingTickets() {
    console.log('[JiraService] Conectando a Jira REST API V2 para buscar tickets...');

    const domain = env.JIRA.DOMAIN.replace(/^https?:\/\//, '');
    const url = `https://${process.env.JIRA_DOMAIN || domain}/rest/api/3/search/jql`;

    // JSON Request especifico solicitado por el usuario
    const requestBody = {
        "jql": "project = SY AND assignee = currentUser() AND status = \"TO DO\" AND (summary ~ \"507\" OR summary ~ \"253\")",
        "fields": ["summary", "description"]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': getBasicAuthHeader(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            console.warn(`[JiraService] Fallo conectando a Jira (HTTP ${response.status}). Validar credenciales o dominio.`);
            console.warn(await response.text());
            return [];
        }

        const data = await response.json();
        console.log(`[JiraService] Jira devolvió ${data.issues.length} posibles tickets.`);

        // Mapear e iterar extrayendo el UUID de 24 caracteres hexadecimales
        const processedTickets = data.issues.map(issue => {
            const descString = JSON.stringify(issue.fields.description || "");
            const uuidMatch = descString.match(/[0-9a-f]{24}/);
            const extractedUuid = uuidMatch ? uuidMatch[0] : null;

            return {
                ticketKey: issue.key,
                summary: issue.fields.summary,
                job_uuid: extractedUuid || "uuid-no-encontrado"
            };
        });

        // Filtra los que no tengan un UUID válido
        const validTickets = processedTickets.filter(ticket => ticket.job_uuid !== "uuid-no-encontrado");

        console.log(`[JiraService] Tickets válidos con UUID listos para procesar: ${validTickets.length}`);
        return validTickets;

    } catch (error) {
        console.error('[JiraService] Error grave ejecutando fetch contra Jira:', error);
        throw error;
    }
}

/**
 * Añade un comentario y hace la transición para cerrar el ticket (Simulado)
 */
async function addCommentAndTransition(ticketId, comment) {
    console.log(`[JiraService] Agregando comentario al ticket ${ticketId}:`);
    console.log('--- REPORTE GEMINI ---');
    console.log(comment);
    console.log('----------------------');

    return true;
}

module.exports = {
    getPendingTickets,
    addCommentAndTransition
};
