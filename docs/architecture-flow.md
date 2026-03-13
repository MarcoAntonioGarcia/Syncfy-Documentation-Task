# Syncfy — Diagrama de Arquitectura

Diagrama de flujo de alto nivel según [REQ-DIAGRAMA-FLUJO-ARQUITECTURA.md](./REQ-DIAGRAMA-FLUJO-ARQUITECTURA.md).

## Vista de Componentes

![Diagrama de Arquitectura Syncfy](./diagrams/01-architecture-flow.png)

*[Ver SVG (vector)](./diagrams/01-architecture-flow.svg)*

### Código Mermaid (fuente)

```mermaid
flowchart TB
    subgraph USUARIO["👤 Capa de Usuario"]
        U[Usuario Final]
        NAV[Navegador Web<br/>localhost:5173]
    end

    subgraph APPS["🖥️ Capa de Aplicación"]
        FE[Frontend React + Vite<br/>/login, /dashboard, /historico, /database]
        API[API Express.js<br/>Puerto 3001]
        WRK[Worker Node.js<br/>Cron 23:55]
    end

    subgraph PKGS["📦 Paquetes"]
        JIRA_PKG[@syncfy/jira-client]
        PORTAL_PKG[@syncfy/portal-scraper]
        AI_PKG[@syncfy/ai-analyzer]
        DB_PKG[@syncfy/database]
    end

    subgraph INFRA["🗄️ Infraestructura"]
        MYSQL[(MySQL 8.0<br/>syncfy_triage<br/>:3306)]
    end

    subgraph EXT["☁️ Sistemas Externos"]
        JIRA[Jira Cloud<br/>REST API v3<br/>Proyecto SY / DAQ]
        ADMIN[admin.paybook.aws<br/>Portal SSO/JWT]
        DAQ[daq3.paybook.aws<br/>Logs Nginx]
        GEMINI[Google Gemini API<br/>Análisis IA]
    end

    U --> NAV
    NAV <-->|HTTP| FE
    FE <-->|REST + JWT| API
    API --> JIRA_PKG
    API --> DB_PKG
    JIRA_PKG --> JIRA
    DB_PKG --> MYSQL
    WRK -->|POST /api/stats/sync-daily| API
    API -.->|spawn scraper.js| WRK
    WRK -->|1. Login| ADMIN
    WRK -->|2. Descarga logs| DAQ
    AI_PKG -.->|Futuro| GEMINI
    PORTAL_PKG -.->|Alternativo HTTP| DAQ
```

## Modelo de Datos

```
tickets ───┬── ticket_actions
          └── job_logs

historical_stats (independiente)
```

## Puertos y Red

| Origen | Destino | Puerto/URL |
|--------|---------|------------|
| Frontend | API | localhost:3001 |
| API | MySQL | localhost:3306 |
| API | Jira | https://{domain}/rest/api/3/ |
| Worker | API | http://localhost:3001 |
| Scraper | admin.paybook.aws | 443 (HTTPS) |
| Scraper | daq3.paybook.aws | 80 (HTTP) |
