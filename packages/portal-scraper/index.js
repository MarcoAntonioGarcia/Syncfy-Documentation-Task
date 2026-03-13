const axios = require('axios');
const db = require('@syncfy/database');

/**
 * Descarga el log del portal haciendo peticiones HTTP GET y extrayendo las subcarpetas con Regex.
 * Luego lo guarda en la base de datos mysql_triage relacionándolo con el ticket.
 */
async function fetchAndSaveJobLog(jobUuid, ticketKey) {
  console.log(`[PortalScraper] Iniciando extracción directa para job_uuid: ${jobUuid}...`);

  try {
    const baseUrl = `http://daq3.paybook.aws/logs/${jobUuid}/`;

    // Paso 1: Obtener índice del HTML base
    console.log(`[PortalScraper] GET -> ${baseUrl}`);
    const resBase = await axios.get(baseUrl, { timeout: 10000 });

    // Extraer el href usando Regex: busca <a href="XXXXX/"> donde no sea "../"
    const hrefMatches = resBase.data.match(/<a\s+href="([^"]+\/)"\s*>/g);

    let internalHref = null;
    if (hrefMatches) {
      for (const matchStr of hrefMatches) {
        const href = matchStr.match(/href="([^"]+)"/)[1];
        if (href !== '../') {
          internalHref = href;
          break; // Tomamos el primer subdirectorio disponible que no sea de retroceso
        }
      }
    }

    if (!internalHref) {
      throw new Error(`[PortalScraper] No se encontró ninguna subcarpeta generada para el Job UUID ${jobUuid}`);
    }

    // Paso 2: Descargar el archivo console.log
    const logUrl = `${baseUrl}${internalHref}console.log`;
    console.log(`[PortalScraper] Subcarpeta encontrada: ${internalHref}`);
    console.log(`[PortalScraper] GET -> ${logUrl}`);

    const resLog = await axios.get(logUrl, { timeout: 15000 });
    const consoleLogContent = resLog.data;

    console.log(`[PortalScraper] Log descargado con éxito. Letras recuperadas: ${consoleLogContent.length}`);

    // Paso 3: Guardar en Base de Datos (sobreescribe si existe por el ON DUPLICATE)
    console.log(`[PortalScraper] Guardando en Base de Datos para Ticket: ${ticketKey}`);
    await db.saveJobLog(ticketKey, jobUuid, internalHref, consoleLogContent);

    console.log(`[PortalScraper] ✅ Extracción completada para job_uuid: ${jobUuid}!`);

    return { success: true, internalHref, jobUuid, logLength: consoleLogContent.length };
  } catch (error) {
    console.error(`[PortalScraper] ❌ Error extrayendo log HTTP:`, error.message);
    throw error;
  }
}

module.exports = {
  fetchAndSaveJobLog
};
