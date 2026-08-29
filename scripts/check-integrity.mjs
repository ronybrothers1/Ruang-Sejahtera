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
const draftDisclosure = /MODE DRAFT|CONTOH SEMENTARA|SIMULASI|sampleMode\s*=\s*true|data contoh/i;
const cmsFiles = [
  ['articles', 'content/cms/articles.json'],
  ['activities', 'content/cms/activities.json'],
  ['galleries', 'content/cms/galleries.json'],
];
const validStatuses = new Set(['draft', 'review', 'published', 'archived']);

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
    const explicitlyDraft = draftDisclosure.test(text);
    for (const [label, pattern] of checks) {
      if (label === 'hardcoded public rupiah amount' && explicitlyDraft) continue;
      if (pattern.test(text)) violations.push(`${file}: ${label}`);
    }
  }
}

for (const [collection, file] of cmsFiles) {
  let records;
  try {
    records = JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    violations.push(`${file}: invalid JSON`);
    continue;
  }
  if (!Array.isArray(records)) {
    violations.push(`${file}: root must be an array`);
    continue;
  }
  const ids = new Set();
  const slugs = new Set();
  for (const record of records) {
    if (!record || typeof record !== 'object') { violations.push(`${file}: record must be an object`); continue; }
    if (typeof record.id !== 'string' || !record.id) violations.push(`${file}: record id required`);
    if (ids.has(record.id)) violations.push(`${file}: duplicate id ${record.id}`); else ids.add(record.id);
    if (typeof record.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)) violations.push(`${file}: invalid slug`);
    if (slugs.has(record.slug)) violations.push(`${file}: duplicate slug ${record.slug}`); else slugs.add(record.slug);
    if (!validStatuses.has(record.status)) violations.push(`${file}: invalid publication status`);
    if (typeof record.title !== 'string' || !record.title.trim()) violations.push(`${file}: title required`);
    if (typeof record.createdAt !== 'string' || Number.isNaN(Date.parse(record.createdAt))) violations.push(`${file}: valid createdAt required`);
    if (typeof record.updatedAt !== 'string' || Number.isNaN(Date.parse(record.updatedAt))) violations.push(`${file}: valid updatedAt required`);
    if (typeof record.lastEditedBy !== 'string' || !record.lastEditedBy) violations.push(`${file}: lastEditedBy required`);
    if (record.status === 'review' && (!record.reviewRequestedAt || !record.reviewRequestedBy)) violations.push(`${file}: review provenance required for ${collection}`);
    if (record.status === 'published' && (!record.publishedAt || !record.publishedBy)) violations.push(`${file}: publication provenance required for ${collection}`);
    if (record.status === 'archived' && (!record.archivedAt || !record.archivedBy)) violations.push(`${file}: archive provenance required for ${collection}`);
  }
}

if (violations.length) {
  console.error('Public-content integrity guard failed:\n' + violations.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log('Public-content integrity guard passed. Draft/sample rupiah values are only permitted in files carrying an explicit draft disclosure.');
