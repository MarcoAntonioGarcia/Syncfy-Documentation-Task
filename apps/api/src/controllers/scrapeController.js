const { spawn } = require('child_process');
const path = require('path');

exports.runPartialScrape = (req, res) => {
    const { jobUuid, ticketKey } = req.body;

    if (!jobUuid || !ticketKey) {
        return res.status(400).json({ error: 'Job UUID y Ticket Key son requeridos.' });
    }

    console.log(`[API] Iniciando Scrapper Híbrido visual para Job UUID: ${jobUuid} (Ticket: ${ticketKey})`);

    const workerDir = path.resolve(__dirname, '../../../worker');
    const scriptPath = path.join(workerDir, 'scraper.js');

    // Lanzamos Playwright en su propio proceso Node visual
    const scraperProcess = spawn('node', [scriptPath, jobUuid, ticketKey], {
        cwd: workerDir,
        stdio: 'inherit' // Muestra el console.log del robot en la terminal de la API
    });

    return res.status(202).json({
        message: 'Robot Playwright iniciado en modo visual. Navegando al portal y extrayendo log...',
        jobUuid,
        status: 'processing'
    });
};

exports.runGeneralScrape = (req, res) => {
    const { ticketKey } = req.body;

    if (!ticketKey) {
        return res.status(400).json({ error: 'Ticket Key es requerido para el Análisis Total' });
    }

    return res.status(202).json({
        message: 'Bot de análisis total inicializado (mock).',
        ticketKey,
        status: 'processing'
    });
};
