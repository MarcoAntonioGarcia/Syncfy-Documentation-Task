const cron = require('node-cron');
const axios = require('axios');

console.log('👷 Syncfy Worker iniciado.');
console.log('⏰ Esperando para ejecutar sincronización diaria a las 23:55 hrs...');

// Programar tarea para que corra todos los días a las 23:55 (11:55 PM)
cron.schedule('55 23 * * *', async () => {
    console.log('=== Iniciando Sincronización Diaria de Estadísticas ===');
    try {
        // LLamar al nuevo endpoint en apps/api
        const response = await axios.post('http://localhost:3001/api/stats/sync-daily');
        console.log(`✅ Éxito: ${JSON.stringify(response.data)}`);
    } catch (error) {
        console.error('❌ Error al sincronizar estadísticas:');
        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
});

// Para propósitos de demostración, imprimimos esto, pero si quieres probarlo YA
// Descomenta la siguiente línea para que se ejecute una vez al iniciar el worker:

// axios.post('http://localhost:3001/api/stats/sync-daily').then(r => console.log(r.data)).catch(console.error);
