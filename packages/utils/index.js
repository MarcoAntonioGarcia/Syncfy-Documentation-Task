/**
 * Limpia y optimiza el texto del log para ahorrar tokens en la IA.
 * 
 * Reglas:
 * 1. Separa por lineas (\n)
 * 2. Elimina líneas que contienen "fingerprint":{" o cadenas tipo base64.
 * 3. Elimina líneas > 300 caracteres, A MENOS que contengan "Error", "Exception", "Timeout" o "code:".
 * 4. Retorna únicamente los últimos 4,000 caracteres del string final.
 */
function cleanLog(rawLog) {
    if (!rawLog || typeof rawLog !== 'string') return '';

    const lines = rawLog.split(/\r?\n/);
    const cleanedLines = [];

    const exclusionList = [
        "Check if there are multiple",
        "Numero de",
        "Multiple currency",
        "Cuenta no agregada",
        "Account sent",
        "send data",
        "SEND ALL DATA",
        "shutting down",
        "closing server port"
    ];

    for (const line of lines) {
        // 2. Omitir basura conocida (fingerprints y hashes/base64 obvios)
        if (line.includes('"fingerprint":{') || line.match(/[A-Za-z0-9+/]{200,}/)) {
            continue;
        }

        // 3. Excluir líneas ruidosas operacionales
        if (exclusionList.some(phrase => line.includes(phrase))) {
            continue;
        }

        // 3. Filtrar líneas muy largas (ruido), excepto si mencionan errores clave
        if (line.length > 300) {
            if (!/(Error|Exception|Timeout|code:)/i.test(line)) {
                continue;
            }
        }

        cleanedLines.push(line);
    }

    // 4. Volver a unir y tomar los últimos 1500 caracteres
    const cleanedText = cleanedLines.join('\n');
    return cleanedText.slice(-1500);
}

module.exports = { cleanLog };
