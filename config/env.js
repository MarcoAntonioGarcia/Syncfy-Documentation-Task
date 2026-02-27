require('dotenv').config();

const requiredEnvVars = [
  'JIRA_API_TOKEN',
  'JIRA_EMAIL',
  'JIRA_DOMAIN',
  'PORTAL_USERNAME',
  'PORTAL_PASSWORD',
  'PORTAL_URL',
  'GEMINI_API_KEY'
];

function validateEnv() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
  }
}

validateEnv();

module.exports = {
  JIRA: {
    API_TOKEN: process.env.JIRA_API_TOKEN,
    EMAIL: process.env.JIRA_EMAIL,
    DOMAIN: process.env.JIRA_DOMAIN
  },
  PORTAL: {
    USERNAME: process.env.PORTAL_USERNAME,
    PASSWORD: process.env.PORTAL_PASSWORD,
    URL: process.env.PORTAL_URL
  },
  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY
  }
};

