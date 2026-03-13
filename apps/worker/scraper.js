require('dotenv').config({ path: '../api/.env' });
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const db = require('@syncfy/database');

async function loginAndScrapeLog(jobUuid, ticketKey) {
    if (!jobUuid || !ticketKey) {
        console.error('❌ Error: Falta jobUuid o ticketKey. Uso: node scraper.js <jobUuid> <ticketKey>');
        process.exit(1);
    }

    console.log(`🤖 Iniciando Web Scraper Automático Híbrido para ${ticketKey} -> ${jobUuid}`);

    const username = process.env.PAYBOOK_ADMIN_USER;
    const password = process.env.PAYBOOK_ADMIN_PASS;

    if (!username || !password) {
        console.error('❌ Error: Faltan credenciales PAYBOOK_ADMIN_USER o PAYBOOK_ADMIN_PASS en apps/api/.env');
        process.exit(1);
    }

    console.log(`👤 Usuario detectado: ${username}. Generando sesión de red segura...`);

    // Ignoramos errores SSL porque la VPN interna no tiene certificados públicos validados
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();

    let internalHref = null;
    let consoleLogContent = '';

    try {
        console.log('1️⃣ Iniciando Sesión Explicita en Portal AWS...');
        await page.goto('https://admin.paybook.aws/sync/job/logs#/recent', { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('#user', { timeout: 15000 });
        await page.fill('#user', username);
        await page.fill('input[ng-model="data.password"]', password);
        await page.click('button[type="submit"]');

        // Esperamos un momento conservador para asegurar que la cookie de JWT/SSO se plante en el navegador
        console.log('⏳ Esperando 4 segundos a que se asiente la cookie de sesión...');
        await page.waitForTimeout(4000);

        // Navegamos al sistema de Logs interno. Paso 1: Entrar al Job UUID
        const logsBaseUrl = `http://daq3.paybook.aws/logs/${jobUuid}/`;
        console.log(`2️⃣ Navegando al Nginx Interno Base: ${logsBaseUrl}`);

        await page.goto(logsBaseUrl, { waitUntil: 'domcontentloaded' });

        // Función helper para sacar el primer href válido (que no vuelva atrás)
        const getFirstValidHref = async () => {
            return await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a'));
                const hrefs = links.map(a => a.getAttribute('href'));
                return hrefs.find(h => h && h !== '../' && h.endsWith('/'));
            });
        };

        // Extraer primera subcarpeta (ej. 69b2...41/)
        const firstFolderHref = await getFirstValidHref();
        if (!firstFolderHref) throw new Error(`Carpeta de Nivel 1 no encontrada para este UUID.`);
        console.log(`📂 Subdirectorio Nivel 1 detectado: ${firstFolderHref}`);

        // Paso 2: Entrar a la primera subcarpeta
        const level1Url = `${logsBaseUrl}${firstFolderHref}`;
        await page.goto(level1Url, { waitUntil: 'domcontentloaded' });

        // Extraer segunda subcarpeta (ej. 2026-03-12T16_25_15/)
        const secondFolderHref = await getFirstValidHref();
        if (!secondFolderHref) throw new Error(`Carpeta de Nivel 2 (Timestamp) no encontrada.`);
        console.log(`📂 Subdirectorio Nivel 2 detectado: ${secondFolderHref}`);

        // VISUAL NAVIGATION AL NIVEL 2 PARA QUE EL USUARIO LO VEA (y mantener sesión activa allí)
        const level2Url = `${level1Url}${secondFolderHref}`;
        await page.goto(level2Url, { waitUntil: 'domcontentloaded' });

        // Guardamos este folder compuesto para la referencia en Base de datos
        internalHref = `${firstFolderHref}${secondFolderHref}`;

        // Paso 3: Entrar y descargar console.log
        const fileUrl = `${level2Url}console.log`;
        console.log(`3️⃣ Ingresando y Extrayendo Log Final: ${fileUrl}`);

        // Como Nginx tiene comportamientos raros enviando logs como attachment que no lanzan eventos "download",
        // Extraeremos las cookies activas de Sesion (JWT/AWS) de Playwright para pasárselas a AXIOS 
        // y descargar el texto plano limpiamente por detrás via HTTP Node.js
        const cookies = await context.cookies(fileUrl);
        const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');

        const axios = require('axios');
        console.log(`📥 Pidiendo texto directamente con Axios HTTP usando Contexto Visual Autenticado...`);
        const res = await axios.get(fileUrl, {
            headers: { 'Cookie': cookieString },
            responseType: 'text',
            timeout: 20000
        });

        consoleLogContent = res.data;

        // =======================
        // GUARDADO EN FILE SYSTEM
        // =======================
        const folderName = `${ticketKey}_${jobUuid}`;
        const outputDir = path.join(__dirname, 'logs', folderName);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`📁 Carpeta Creada: ${outputDir}`);
        }

        const outputFilePath = path.join(outputDir, 'console.log');

        fs.writeFileSync(outputFilePath, consoleLogContent, 'utf-8');
        console.log(`📄 Archivo Guardado en disco local: ${outputFilePath}`);

        console.log(`✅ ¡Texto extraído exitosamente para BD! (Total: ${consoleLogContent.length} caracteres)`);

        // =======================
        // GUARDADO EN BASE DATOS
        // =======================
        await db.saveJobLog(ticketKey, jobUuid, internalHref, consoleLogContent);
        console.log(`💾 Archivo persistido con éxito en la base de datos MySQL (Tabla: job_logs)`);

        console.log('🎉 Extracción Total y Guardado Finalizado con Éxito!! La ventana se autodestruirá en 5s.');
        // Un poco de delay final para que puedas ver el texto cargado en pantalla antes de cerrar.
        await page.waitForTimeout(5000);

    } catch (error) {
        console.error('❌ Error Crítico durante la ejecución de la Cadena de Scraping:', error.message);
    } finally {
        console.log('🛑 Cerrando procesos y navegador...');
        await browser.close();
        process.exit();
    }
}

// Inicialización via Subproceso CLI:
// node scraper.js [jobUuid] [ticketKey]
const args = process.argv.slice(2);
if (args.length >= 2) {
    loginAndScrapeLog(args[0], args[1]);
} else if (require.main === module) {
    console.error('Modo aislado: Se deben proveer 2 argumentos. node scraper.js JOB_UUID TICKET_KEY');
    process.exit(1);
}

module.exports = { loginAndScrapeLog };
