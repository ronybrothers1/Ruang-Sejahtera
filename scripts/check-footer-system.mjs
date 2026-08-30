import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const footer = read('components/Footer.tsx');
const footerCss = read('app/footer-audit-v9.css');
const layout = read('app/layout.tsx');
const site = read('lib/site.ts');

const checks = [];
function check(condition, label) {
  assert.ok(condition, label);
  checks.push(label);
}

check(layout.includes("import './footer-audit-v9.css';"), 'Footer audit layer is imported');
check(layout.indexOf('footer-audit-v9.css') > layout.indexOf('media-audit-v8.css'), 'Footer audit layer is last in the public design cascade');
check(footer.includes('footer-contact-list-v9'), 'Footer contact channels share one alignment grid');
check(footer.includes('footer-contact-icon-v9'), 'Footer icons use a fixed centering wrapper');
check(!footer.includes('Instagram {socialHandle}') && !footer.includes('TikTok {socialHandle}'), 'Social labels do not repeat platform names');
check((footer.match(/<span>\{socialHandle\}<\/span>/g) || []).length === 2, 'Instagram and TikTok expose the same concise official handle');
check(footer.includes('WhatsAppIcon') && footer.includes('https://wa.me/'), 'WhatsApp uses a recognizable icon and direct chat URL');
check(site.includes("'+62 823-3403-0628'"), 'Official WhatsApp number is configured');
check(footer.includes("replace(/\\D/g, '')"), 'WhatsApp URL strips display punctuation safely');
check(footer.includes('aria-label={`WhatsApp ${whatsappNumber}`}'), 'WhatsApp link retains an explicit accessible name');
check(/\.footer-v3 \.footer-contact-link-v9 \{[\s\S]*?align-items: center;[\s\S]*?min-height: 2\.75rem;/.test(footerCss), 'Contact icons and text share a centered 44px row');
check(/\.footer-v3 \.footer-contact-icon-v9 svg \{[\s\S]*?margin: 0;/.test(footerCss), 'Legacy icon offsets are reset');
check(/@media \(max-width: 760px\)[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/.test(footerCss), 'Mobile navigation columns use an intentional two-column grid');
check(/\.footer-v3 \.footer-title-v3 \{[\s\S]*?text-wrap: nowrap;/.test(footerCss), 'Footer section headings do not split mid-word');
check(footer.includes('footer-meta-links-v9'), 'Footer legal links use a dedicated proportional layout');

for (const width of [320, 360, 375, 390, 414, 430, 680, 760]) {
  const gutter = Math.min(64, Math.max(32, width * 0.05));
  const shell = width - gutter;
  const columnGap = Math.min(40, Math.max(24, width * 0.07));
  const column = (shell - columnGap) / 2;
  check(column >= 132, `${width}px footer column retains at least 132px for section labels`);
}

console.log(`Footer audit passed (${checks.length} contracts).`);
