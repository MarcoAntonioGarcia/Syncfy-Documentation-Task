require('dotenv').config({ path: './apps/api/.env' });

async function test() {
  const domain = process.env.JIRA_DOMAIN || 'paybook.atlassian.net';
  const url = `https://${domain}/rest/api/3/search/jql`;
  console.log('URL:', url);
  console.log('Email:', process.env.JIRA_EMAIL);
  console.log('');

  const auth = Buffer.from(process.env.JIRA_EMAIL + ':' + process.env.JIRA_API_TOKEN).toString('base64');

  // JQL actual de la app (con DAQ y sin Done)
  const jqlApp = 'project = SY AND assignee = currentUser() AND component = "DAQ" AND statusCategory != Done';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + auth,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jql: jqlApp,
      fields: ['summary', 'description', 'status', 'created'],
    }),
  });

  console.log('=== JQL de la app (DAQ + no Done) ===');
  console.log('HTTP Status:', res.status);
  const data = await res.json();
  if (data.errorMessages) {
    console.log('Jira Error:', data.errorMessages);
    return;
  }
  console.log('Tickets encontrados:', data.issues?.length ?? 0);
  if (data.issues?.length > 0) {
    data.issues.forEach((i) => console.log(' -', i.key, i.fields.summary));
  }

  // JQL mas amplio: solo project + assignee
  console.log('\n=== JQL amplio (solo SY + asignados a ti) ===');
  const res2 = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + auth,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jql: 'project = SY AND assignee = currentUser()',
      fields: ['summary', 'status', 'components'],
      maxResults: 10,
    }),
  });
  const data2 = await res2.json();
  console.log('HTTP Status:', res2.status);
  console.log('Tickets encontrados:', data2.issues?.length ?? 0);
  if (data2.issues?.length > 0) {
    data2.issues.forEach((i) => {
      const comps = i.fields.components?.map((c) => c.name).join(', ') || 'sin componente';
      console.log(' -', i.key, '|', i.fields.status?.name, '| components:', comps, '|', i.fields.summary?.substring(0, 50));
    });
  }
}

test().catch(console.error);
