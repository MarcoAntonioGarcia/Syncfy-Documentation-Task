const env = require('../config/env');
const { cleanLog } = require('../utils/logCleaner');
const { logsArray } = require('../mocks/sampleLogs');

/**
 * Descarga el log del portal usando logs simulados y el log cleaner de la iteración 2.
 */
async function getLogByJobUuid(uuid) {
  console.log(`[PortalService] Obteniendo log simulado para el job_uuid ${uuid}...`);

  let mockLogString = "";
  if (logsArray && logsArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * logsArray.length);
    mockLogString = logsArray[randomIndex];
  }

  // Limpiar el texto antes de mandarlo a la IA
  console.log(`[PortalService] Aplicando logCleaner sobre el mock text...`);
  const finalCleaned = cleanLog(mockLogString);

  // Simular un delay de espera asíncrono de 1 segundo para emular conexión
  console.log(`[PortalService] Esperando descarga asíncrona simulada (1s)...`);
  await new Promise(resolve => setTimeout(resolve, 1000));

  return finalCleaned;
}

module.exports = {
  getLogByJobUuid
};
