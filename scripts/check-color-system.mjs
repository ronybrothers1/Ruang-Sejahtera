import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const globals = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
const responsive = fs.readFileSync(path.join(root, 'app/responsive-preview-v8.css'), 'utf8');

const failures = [];
const requireContract = (condition, message) => {
  if (!condition) failures.push(message);
};

const rgb = (hex) => {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255);
};

const luminance = (hex) => rgb(hex)
  .map((channel) => channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4)
  .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);

const contrast = (foreground, background) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

const pairs = [
  ['Body text / page', '#111114', '#fbfaf7', 4.5],
  ['Secondary text / page', '#625e59', '#fbfaf7', 4.5],
  ['Primary CTA text / red', '#ffffff', '#d71920', 4.5],
  ['Primary CTA text / dark red', '#ffffff', '#9f0d12', 4.5],
  ['Text link / raised surface', '#9f0d12', '#ffffff', 4.5],
  ['Dark secondary text / dark surface', '#aaa6a4', '#101013', 4.5],
  ['Dark accent / dark surface', '#ff858a', '#101013', 4.5],
  ['Closing copy / primary red', '#ffffff', '#d71920', 4.5],
  ['Success text / success surface', '#23623b', '#edf8f0', 4.5],
  ['Warning text / warning surface', '#68400f', '#fff7dc', 4.5],
  ['Error text / error surface', '#9f0d12', '#fff0f0', 4.5],
  ['Info text / info surface', '#1f4f6f', '#eef6fb', 4.5],
  ['Disabled text / disabled surface', '#5f5a55', '#e1ddd7', 4.5],
  ['Program Berbagi Rasa / light stop', '#ffffff', '#7b1b24', 4.5],
  ['Program Merakyat / light stop', '#ffffff', '#744520', 4.5],
  ['Program REHAT / light stop', '#ffffff', '#4c315e', 4.5],
  ['Program Air Bersih / light stop', '#ffffff', '#14627c', 4.5],
  ['Program Masa Depan / light stop', '#ffffff', '#39613b', 4.5],
  ['Media chip / worst-case overlay', '#ffffff', '#383838', 4.5],
  ['Hero caption / worst-case overlay', '#ffffff', '#2e2e2e', 4.5],
  ['Control border / raised surface', '#8a8179', '#ffffff', 3],
  ['Focus ring / raised surface', '#ef3940', '#ffffff', 3],
  ['Focus ring / dark surface', '#ef3940', '#101013', 3],
  ['Success border / success surface', '#568466', '#edf8f0', 3],
  ['Warning border / warning surface', '#9a6d29', '#fff7dc', 3],
  ['Error border / error surface', '#c2484e', '#fff0f0', 3],
  ['Info border / info surface', '#4c7792', '#eef6fb', 3],
];

console.log('pair\tratio\tminimum\tresult');
for (const [label, foreground, background, minimum] of pairs) {
  const ratio = contrast(foreground, background);
  const pass = ratio >= minimum;
  console.log(`${label}\t${ratio.toFixed(2)}:1\t${minimum.toFixed(1)}:1\t${pass ? 'PASS' : 'FAIL'}`);
  if (!pass) failures.push(`${label} is ${ratio.toFixed(2)}:1; expected at least ${minimum}:1.`);
}

const requiredTokens = [
  '--palette-red-700: #d71920',
  '--color-surface-page:',
  '--color-text-primary:',
  '--color-text-secondary:',
  '--color-border-control: #8a8179',
  '--color-action-primary:',
  '--color-focus-ring: #ef3940',
  '--color-disabled-surface: #e1ddd7',
  '--color-media-placeholder: #d8d3cb',
  '--color-status-success:',
  '--color-status-warning:',
  '--color-status-error:',
  '--color-status-info:',
];

for (const token of requiredTokens) {
  requireContract(globals.includes(token), `Missing required color token: ${token}`);
}

requireContract(
  !/--color-brand-red:\s*var\(--color-brand-red\)/.test(globals),
  'Tailwind brand-red token must not self-reference.',
);
requireContract(
  !/--color-brand-red-dark:\s*var\(--color-brand-red-dark\)/.test(globals),
  'Tailwind brand-red-dark token must not self-reference.',
);
requireContract(
  /\.trust-preview-form :where\(input, select, textarea\):focus-visible \{ outline: 3px solid var\(--color-focus-ring\)/.test(responsive),
  'Public form fields must preserve an explicit focus-visible outline.',
);
requireContract(
  responsive.includes('border: 1px solid var(--color-border-control)'),
  'Active public controls must use the perceivable control-border token.',
);
requireContract(
  !/#(?:8b8580|7e7872|ffd9da|d5d1cc|76716c|d6d0c9)/i.test(responsive),
  'Active responsive layer still contains a superseded low-contrast color.',
);
requireContract(
  !/#(?:ffd4d5|ffe0e1)/i.test(globals),
  'Closing CTA still contains low-contrast red-on-red copy.',
);
requireContract(
  /\[data-admin-root\] :where\(input:not\(\[type="hidden"\]\), select, textarea\)/.test(globals),
  'Admin controls must inherit the shared control color contract.',
);

const adminRoot = path.join(root, 'app/admin');
const adminSource = fs.readdirSync(adminRoot, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
  .map((entry) => fs.readFileSync(path.join(entry.parentPath, entry.name), 'utf8'))
  .join('\n');

requireContract(
  !/(?:border|bg|text)-(?:red|amber|emerald)-\d+/.test(adminSource),
  'Admin feedback states must use semantic status classes, not palette utilities.',
);
for (const statusClass of ['status-message-success', 'status-message-warning', 'status-message-error']) {
  requireContract(adminSource.includes(statusClass), `Admin source does not consume ${statusClass}.`);
}

if (failures.length > 0) {
  console.error(`\nColor-system contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nColor-system contract passed across ${pairs.length} contrast pairs and all source invariants.`);
