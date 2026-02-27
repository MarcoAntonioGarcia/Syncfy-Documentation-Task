// Validar el entorno antes de iniciar
require('./config/env');

const jiraService = require('./services/jiraService');
const portalService = require('./services/portalService');
const aiService = require('./services/aiService');

async function main() {
    console.log('--- INICIANDO AUTOMATION PIPELINE ---');

    try {
        // 1. Obtener tickets pendientes de Jira
        const tickets = await jiraService.getPendingTickets();

        if (tickets.length === 0) {
            console.log('No hay tickets pendientes para procesar.');
            return;
        }

        console.log("\n=== 🎫 TICKETS ENCONTRADOS ===");
        console.log(`Cantidad de tickets: ${tickets.length}`);
        console.dir(tickets, { depth: null });

        // Por ahora, procesar ÚNICAMENTE el primer ticket para evitar spam
        const ticket = tickets[0];
        console.log(`\nProcesando único ticket (1 de ${tickets.length}): ${ticket.ticketKey}`);

        try {
            // 2. Descargar log del portal interno usando el UUID del job
            const logText = await portalService.getLogByJobUuid(ticket.job_uuid);

            console.log("\n=== 🧹 LOG LIMPIO (Listo para la IA) ===");
            console.log(logText);

            // 3. Analizar log con Gemini
            const analysisResult = await aiService.analyzeLog(logText);

            console.log("\n=== 🤖 COMENTARIO GENERADO POR GEMINI ===");
            console.log(analysisResult);

            // 4. Documentar en Jira
            await jiraService.addCommentAndTransition(ticket.ticketKey, analysisResult);

            console.log(`Ticket ${ticket.ticketKey} procesado exitosamente.`);
        } catch (ticketError) {
            console.error(`Error procesando el ticket ${ticket.ticketKey}:`, ticketError.message);
        }
        console.log('\n--- AUTOMATION PIPELINE FINALIZADO ---');
    } catch (error) {
        console.error('Error crítico en la ejecución del pipeline:', error);
        process.exit(1);
    }
}

main();
