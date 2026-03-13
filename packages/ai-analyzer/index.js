const { GoogleGenAI } = require('@google/genai');
const env = require('@syncfy/config');

const ai = new GoogleGenAI({ apiKey: env.GEMINI.API_KEY });

async function analyzeLog(logText) {
    console.log('[AIService] Analizando log optimizado con Gemini...');

    const prompt = `
Analiza el siguiente registro (log) de error depurado de nuestro sistema y genera un resumen técnico conciso.
El resumen debe identificar la causa principal del error y posibles soluciones.
  
Log:
${logText}
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (response.usageMetadata) {
            console.log("\n📊 --- REPORTE DE TOKENS (GEMINI) ---");
            console.log(`Enviados (Prompt): ${response.usageMetadata.promptTokenCount}`);
            console.log(`Generados (Respuesta): ${response.usageMetadata.candidatesTokenCount}`);
            console.log(`TOTAL CONSUMIDO: ${response.usageMetadata.totalTokenCount}`);
            console.log("-------------------------------------\n");
        }

        return response.text;
    } catch (error) {
        console.error('[AIService] Error interactuando con la API de Gemini:', error.message || error);

        // KILL SWITCH FINANCIERO: Bloquea cobros imprevistos.
        const errString = String(error).toLowerCase() + String(error.message).toLowerCase();

        if (
            errString.includes('429') ||
            errString.includes('402') ||
            errString.includes('quota') ||
            errString.includes('billing') ||
            errString.includes('api key not valid')
        ) {
            console.error('\n');
            console.error('================================================================');
            console.error(' 🔥🔥🔥 KILL SWITCH ACTIVADO: LÍMITE DE IA O CREDENCIALES INVÁLIDAS 🔥🔥🔥');
            console.error(' Se detuvo el job inmediatamente para prevenir facturación excesiva.');
            console.error('================================================================');
            console.error('\n');
            process.exit(1);
        }

        throw error;
    }
}

module.exports = {
    analyzeLog
};
