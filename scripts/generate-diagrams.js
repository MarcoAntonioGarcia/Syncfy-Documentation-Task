#!/usr/bin/env node
/**
 * Regenera los diagramas PNG y SVG desde los archivos .mmd
 * Uso: node scripts/generate-diagrams.js
 * O: npm run diagrams
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const diagramsDir = path.join(__dirname, '../docs/diagrams');
const files = fs.readdirSync(diagramsDir).filter((f) => f.endsWith('.mmd'));

for (const file of files) {
  const base = path.join(diagramsDir, file.replace('.mmd', ''));
  const input = base + '.mmd';
  console.log(`Generating ${file}...`);
  execSync(`npx mmdc -i "${input}" -o "${base}.png" -b transparent`, {
    stdio: 'inherit',
  });
  execSync(`npx mmdc -i "${input}" -o "${base}.svg" -b transparent`, {
    stdio: 'inherit',
  });
}
console.log('Done.');
