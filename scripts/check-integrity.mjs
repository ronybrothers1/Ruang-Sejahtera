import { promises as fs } from 'node:fs';
import path from 'node:path';

const roots = ['app', 'components', 'lib'];
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const checks = [
  ['random image placeholder', /picsum\.photos/i],
  ['legacy AI Studio reference', /@google\/genai|GEMINI_API_KEY|ai-studio-applet/i],
  ['dead placeholder link', /href=["']#["']/i],
  ['fabricated location from prototype', /Jakarta,\s*Indonesia/i],
  ['hardcoded public rupiah amount', /Rp\s*[0-9][0-9.,]*/i],
  ['known fabricated impact statistic', /12\.450\+|1\.200\+|450\+/i],
  ['known fabricated report label', /Laporan\s+Q2\s+Tersedia/i],
];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const violations = [];
for (const root of roots) {
  const files = await walk(root);
  for (const file of files) {
    const text = await fs.readFile(file, 'utf8');
    for (const [label, pattern] of checks) {
      if (pattern.test(text)) violations.push(`${file}: ${label}`);
    }
  }
}

if (violations.length) {
  console.error('Public-content integrity guard failed:\n' + violations.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log('Public-content integrity guard passed.');
