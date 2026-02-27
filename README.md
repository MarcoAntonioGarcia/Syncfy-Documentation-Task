# Syncfy-Documentation-Task
Node.js automation agent designed to manage Level 1 support. It connects to the Jira API and internal portal to download logs of latency failures (507) or partial pulls (253).


## Auto Triage AI Agent 🤖📊

This repository contains a pure Node.js batch process pipeline designed to eliminate manual work in documenting known extraction errors (Status 507 and 253).

### 🚀 Workflow
1. **Fetch:** Query the Jira API for pending tickets with latency or partial extraction status.

2. **Extract:** Obtain the `job_uuid` of the ticket and download the raw log from the internal portal.

3. **Analyze:** Clean and send the log to the Gemini API (Google) for analysis.

4. **Action:** Publish the AI-generated diagnosis as a comment in Jira and transition the ticket to "Ready to Release".

**Stack:** Node.js (v18+), native Fetch API, Google Generate AI SDK.
