# Requerimiento de Diagrama de Flujo — Syncfy Support Automation

**Documento:** Especificación de Arquitectura  
**Versión:** 1.0  
**Fecha:** 2025-03-13  
**Autor:** Arquitecto de Infraestructura  
**Estado:** Aprobado para implementación  

---

## 1. Objetivo

Definir los requisitos técnicos y funcionales para la generación de un **diagrama de flujo de arquitectura** que documente de forma completa el sistema Syncfy Support Automation, alineado con el nivel de detalle del README principal y utilizable como referencia de infraestructura y operación.

---

## 2. Alcance

El diagrama debe cubrir:

- **Componentes del sistema** (aplicaciones, servicios, paquetes)
- **Flujos de datos** (request/response, sincronización, scraping)
- **Integraciones externas** (Jira, AWS, Gemini)
- **Persistencia** (MySQL, tablas y relaciones)
- **Autenticación y autorización**
- **Procesos programados** (cron, workers)
- **Dependencias de red** (puertos, VPN, dominios)

---

## 3. Especificación de Componentes

### 3.1 Capa de Usuario

| Componente | Tipo | Descripción | Puertos/URLs |
|------------|------|-------------|--------------|
| **Usuario Final** | Actor | Desarrollador L1 / Soporte | — |
| **Navegador Web** | Cliente | Acceso al dashboard React | `localhost:5173` |

### 3.2 Capa de Aplicación

| Componente | Stack | Descripción | Puerto |
|------------|-------|-------------|--------|
| **Frontend** | React 18 + Vite | SPA con rutas: `/login`, `/dashboard`, `/historico`, `/database` | 5173 |
| **API** | Express.js | Orquestador central, CORS, morgan, JWT | 3001 |
| **Worker** | Node.js + node-cron | Proceso independiente, sincronización diaria 23:55 | — |

### 3.3 Capa de Paquetes (Monorepo)

| Paquete | Función | Dependencias Externas |
|---------|---------|----------------------|
| `@syncfy/jira-client` | Búsqueda JQL, detalles de tickets, extracción UUID | Jira REST API v3 |
| `@syncfy/portal-scraper` | Descarga HTTP directa de logs (sin auth) | `daq3.paybook.aws` |
| `@syncfy/ai-analyzer` | Análisis de logs con Gemini 2.5 Flash | Google GenAI API |
| `@syncfy/database` | Pool MySQL, CRUD tickets, stats, job_logs | MySQL 8.0 |
| `@syncfy/config` | Variables de entorno centralizadas | — |
| `@syncfy/utils` | Utilidades compartidas | — |

### 3.4 Capa de Infraestructura

| Componente | Tecnología | Descripción |
|------------|------------|-------------|
| **MySQL** | Docker (mysql:8.0) | Base de datos `syncfy_triage` |
| **Docker Compose** | v3.8 | Orquestación MySQL, volumen `mysql_data` |

### 3.5 Sistemas Externos

| Sistema | Propósito | Requisitos |
|---------|-----------|------------|
| **Jira Cloud** | Proyecto SY, componente DAQ, tickets | API Token, dominio configurado |
| **admin.paybook.aws** | Portal de autenticación SSO/JWT | VPN interna, credenciales PAYBOOK |
| **daq3.paybook.aws** | Servidor de logs Nginx (listado HTML + descarga) | VPN interna, sesión autenticada (scraper híbrido) |
| **Google Gemini API** | Análisis IA de logs | API Key, kill switch 429/402 |

---

## 4. Flujos a Documentar

### 4.1 Flujo de Autenticación

```
Usuario → Frontend (Login) → POST /api/auth/login {username, password}
  → API (authController) → Validación test/test
  → JWT sign (8h) → Response {token, user}
  → Frontend almacena token en localStorage
  → Rutas protegidas: Header Authorization: Bearer <token>
```

**Nota:** Credenciales demo: `test` / `test`. En producción se requiere integración con IdP.

---

### 4.2 Flujo de Tickets (Dashboard)

```
Frontend (Dashboard) → GET /api/tickets?status=&errorStatus=&ticketId=
  → API (ticketsController.getTickets)
  → jira-client.searchTickets(JQL dinámico)
    → Jira REST API v3 (POST /rest/api/3/search/jql)
    → Filtros: project=SY, component=DAQ, assignee=currentUser()
  → insertTicketIgnore() por cada ticket (MySQL)
  → getTicketsWithActions() (MySQL)
  → Intersección: solo tickets devueltos por Jira
  → Response {count, data[]}
  → Frontend renderiza tabla con badges (507, 253, status)
```

**Subflujo — Detalle de Ticket:**

```
Frontend (click ticket) → GET /api/tickets/:id
  → jira-client.getTicketDetails(ticketId)
  → Jira REST API v3 (GET /rest/api/3/issue/:id)
  → Response (payload completo: fields, comments, ADF)
  → Frontend renderiza descripción ADF, comentarios
```

---

### 4.3 Flujo de Scraping Parcial (Híbrido)

```
Frontend (Análisis Parcial) → POST /api/scrape/partial {jobUuid, ticketKey}
  → API (scrapeController.runPartialScrape)
  → spawn('node', ['scraper.js', jobUuid, ticketKey]) en apps/worker
  → Proceso Playwright (Chromium headless: false):
    1. Navega a https://admin.paybook.aws/sync/job/logs#/recent
    2. Login: #user, input[ng-model="data.password"], submit
    3. Espera 4s (cookie JWT/SSO)
    4. Navega a http://daq3.paybook.aws/logs/{jobUuid}/
    5. Extrae subcarpetas (nivel 1, nivel 2) vía evaluate()
    6. Obtiene cookies de sesión de Playwright
    7. Axios.get(console.log) con Cookie header (bypass Nginx)
    8. Guarda en disco: worker/logs/{ticketKey}_{jobUuid}/console.log
    9. db.saveJobLog(ticketKey, jobUuid, internalHref, content)
  → API responde 202 {message, jobUuid, status: 'processing'}
  → Frontend muestra alert de éxito
```

**Dependencias:** VPN AWS, `PAYBOOK_ADMIN_USER`, `PAYBOOK_ADMIN_PASS`.

---

### 4.4 Flujo de Scraping General (Mock)

```
Frontend (Análisis Total) → POST /api/scrape/general {ticketKey}
  → API responde 202 {message: 'Bot de análisis total inicializado (mock).', ...}
  → Sin ejecución real actualmente
```

---

### 4.5 Flujo de Estadísticas Históricas

```
Frontend (Historico) → GET /api/stats/historical
  → API (statsController.getHistorical)
  → db.getHistoricalStats()
    → Query MySQL: tickets agrupados por DATE(sync_date)
    → Campos: total_assigned, total_closed, total_backlog, success_rate
  → Mapeo a formato Recharts {date, assigned, closed, totalBacklog}
  → Frontend: BarChart, KPI cards, filtros Día/Semana/Mes
```

---

### 4.6 Flujo de Sincronización Diaria (Worker Cron)

```
Worker (node-cron 55 23 * * *) → POST http://localhost:3001/api/stats/sync-daily
  → API (statsController.syncDailyStats)
  → jira-client.searchTickets (3 consultas JQL):
    1. Nuevos hoy: created >= startOfDay() AND created <= endOfDay()
    2. Resueltos hoy: resolved >= startOfDay() AND resolved <= endOfDay()
    3. Backlog activo: statusCategory != Done
  → upsertDailyStats(todayStr, 'marco.garcia', assigned, closed, totalBacklog)
  → MySQL: INSERT ... ON DUPLICATE KEY UPDATE (historical_stats)
  → Response {message, today, assigned, closed, total_backlog}
```

**Nota:** La tabla `historical_stats` requiere columna `total_backlog` (posible migración pendiente respecto a `init.sql`).

---

### 4.7 Flujo de Visor de Base de Datos

```
Frontend (DatabaseViewer) → GET /api/debug/db (Bearer token)
  → API (debugController.dumpDatabase)
  → pool.execute: SELECT * FROM tickets, ticket_actions, historical_stats, job_logs
  → Response JSON: {status, data: {tickets, ticket_actions, historical_stats, job_logs}}
  → Frontend: tabs, tabla dinámica, modal para console_log_content (LONGTEXT)
```

---

### 4.8 Flujo Alternativo: Portal-Scraper (HTTP Directo)

**Nota:** Existe `@syncfy/portal-scraper` que descarga logs vía HTTP sin autenticación (para entornos sin Nginx protegido):

```
fetchAndSaveJobLog(jobUuid, ticketKey)
  → axios.get(http://daq3.paybook.aws/logs/{jobUuid}/)
  → Regex: extrae href de subcarpeta
  → axios.get(console.log)
  → db.saveJobLog(...)
```

**Uso actual:** No invocado desde la API; el flujo activo es el scraper híbrido con Playwright.

---

## 5. Modelo de Datos (Para Diagrama ER Opcional)

```
tickets (ticket_id PK, summary, status_jira, job_uuid, sync_date)
  └── ticket_actions (id PK, ticket_id FK, action_type, comment, created_at)
  └── job_logs (id PK, ticket_key, job_uuid UK, internal_href, console_log_content, scraped_at)

historical_stats (id PK, record_date UK, developer, total_assigned, total_closed, total_backlog?, success_rate GENERATED)
```

---

## 6. Requisitos de Diagrama

### 6.1 Formato Recomendado

- **Herramienta:** Mermaid, PlantUML, draw.io o equivalente
- **Ubicación:** `docs/architecture-flow.md` o imagen en `docs/diagrams/`
- **Referencia en README:** Sección "System Architecture" con enlace al diagrama

### 6.2 Niveles de Vista

| Vista | Contenido |
|-------|-----------|
| **Vista de Alto Nivel** | Usuario → Frontend → API → (Jira, MySQL, Worker) |
| **Vista de Flujos** | Secuencias por caso de uso (auth, tickets, scraping, stats) |
| **Vista de Datos** | Tablas MySQL y relaciones |

### 6.3 Convenciones

- **Rectángulos:** Componentes/servicios
- **Cilindros:** Bases de datos
- **Nubes:** Sistemas externos
- **Flechas:** Dirección del flujo, etiquetadas con método/protocolo (GET, POST, JQL, etc.)
- **Líneas punteadas:** Dependencias opcionales o asíncronas
- **Colores:** Diferenciar capas (cliente, app, infra, externo)

### 6.4 Información de Red

| Origen | Destino | Puerto/URL |
|--------|---------|------------|
| Frontend | API | `localhost:3001` |
| API | MySQL | `localhost:3306` |
| API | Jira | `https://{JIRA_DOMAIN}/rest/api/3/` |
| Worker | API | `http://localhost:3001` |
| Scraper | admin.paybook.aws | 443 (HTTPS) |
| Scraper | daq3.paybook.aws | 80 (HTTP) |
| ai-analyzer | Google GenAI | API HTTPS |

---

## 7. Criterios de Aceptación

- [ ] El diagrama representa todos los componentes listados en la sección 3
- [ ] Los 8 flujos principales están documentados (auth, tickets, detalle, scraping parcial, scraping general, stats historical, sync-daily, debug db)
- [ ] Se identifican dependencias externas (Jira, AWS, Gemini)
- [ ] Se documenta la necesidad de VPN para daq3.paybook.aws y admin.paybook.aws
- [ ] El diagrama es legible en formato Markdown (Mermaid) o exportable a PNG/SVG
- [ ] El README incluye referencia al diagrama en la sección de arquitectura

---

## 8. Entregables

1. **Diagrama de flujo** (archivo fuente + exportación)
2. **Actualización del README** con enlace al diagrama
3. **Este documento** como especificación de referencia

---

## 9. Notas de Implementación

- El puerto de la API en el README indica 3000; en código es 3001. Unificar en documentación.
- `portal-scraper` (HTTP directo) no está integrado en la API actual; el flujo activo es Playwright.
- `ai-analyzer` (Gemini) está implementado pero no se invoca desde ningún endpoint actual; preparado para futura integración.
- La tabla `historical_stats` en `init.sql` no incluye `total_backlog`; `upsertDailyStats` lo utiliza. Verificar migración.

---

*Documento generado como requerimiento de arquitectura para el proyecto Syncfy Support Automation.*
