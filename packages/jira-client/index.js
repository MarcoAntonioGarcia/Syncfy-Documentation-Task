const env = require('@syncfy/config');

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
 * Conecta con Jira de forma dinámica permitiendo buscar por status y tipo de error
 */
async function searchTickets({ status, errorStatus, ticketId, rawJql }) {
    console.log(`[JiraService] Buscando tickets con filtros... Status: ${status}, Error: ${errorStatus}, TicketId: ${ticketId}, RawJQL: ${rawJql}`);

    const domain = env.JIRA.DOMAIN.replace(/^https?:\/\//, '');
    const url = `https://${process.env.JIRA_DOMAIN || domain}/rest/api/3/search/jql`;

    // Armar el JQL Dinámico, restringiendo específicamente al panel (componente) DAQ
    let jql = 'project = SY AND assignee = currentUser() AND component = "DAQ"';

    if (rawJql) {
        jql = rawJql;
    } else {
        // Nueva regla: Si el usuario NO busca por TicketID especifico, ocultamos los DONE por default
        // Usamos statusCategory != Done para soportar "Cerrada", "Finalizada", "Done", etc en español o inglés.
        if (!ticketId) {
            if (status && status !== 'ALL') {
                jql += ` AND status = "${status}"`;
            } else {
                jql += ` AND statusCategory != Done`;
            }
        } else {
            // Obvio, si introducen el ticketID, también puede buscar por DONE
            jql += ` AND issueKey = "${ticketId}"`;
        }

        if (errorStatus && errorStatus !== 'ALL') {
            jql += ` AND summary ~ "${errorStatus}"`;
        }
    }

    const requestBody = {
        "jql": jql,
        "fields": ["summary", "description", "status", "created"]
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
            console.warn(`[JiraService] Fallo conectando a Jira para búsqueda. HTTP ${response.status}`);
            return [];
        }

        const data = await response.json();

        return data.issues.map(issue => {
            const descString = JSON.stringify(issue.fields.description || "");
            const uuidMatch = descString.match(/[0-9a-f]{24}/);
            const extractedUuid = uuidMatch ? uuidMatch[0] : null;

            return {
                ticketKey: issue.key,
                summary: issue.fields.summary,
                jiraStatus: issue.fields.status.name,
                created: issue.fields.created,
                job_uuid: extractedUuid || "uuid-no-encontrado"
            };
        });

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

}

/**
 * Obtiene los detalles extendidos de un ticket específico (comentarios, descripción completa, autor, etc.)
 */
async function getTicketDetails(ticketId) {
    console.log(`[JiraService] Obteniendo detalles extendidos para ticket: ${ticketId}`);

    const domain = env.JIRA.DOMAIN.replace(/^https?:\/\//, '');
    const url = `https://${process.env.JIRA_DOMAIN || domain}/rest/api/3/issue/${ticketId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': getBasicAuthHeader(),
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.warn(`[JiraService] Fallo obteniendo detalles del ticket ${ticketId}. HTTP ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data; // Retorna el payload entero de V3 de Jira
    } catch (error) {
        console.error(`[JiraService] Error grave obteniendo detalles del ticket ${ticketId}:`, error);
        throw error;
    }
}

module.exports = {
    getPendingTickets,
    searchTickets,
    addCommentAndTransition,
    getTicketDetails
};
