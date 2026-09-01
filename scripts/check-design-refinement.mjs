import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (file) => readFileSync(join(root, file), 'utf8');
const activities = read('app/kegiatan/page.tsx');
const sitemap = read('app/peta-situs/page.tsx');
const organization = read('app/organisasi/page.tsx');
const home = read('app/page.tsx');
const hero = read('components/PageHero.tsx');
const navbar = read('components/Navbar.tsx');
const content = read('lib/content.ts');
const globals = read('app/globals.css');
const responsive = read('app/responsive-preview-v8.css');

const checks = [];
function check(condition, label) {
  assert.ok(condition, label);
  checks.push(label);
}

check(!activities.includes('sampleActivities.slice'), 'Activity archive does not repeat sample records');
check(activities.includes('key={activity.slug}'), 'Activity archive uses stable unique keys');
check(!sitemap.includes('<main className="sitemap-page">'), 'Sitemap does not nest a second main landmark');
check(sitemap.includes('<div className="sitemap-page">'), 'Sitemap retains its layout wrapper without landmark duplication');
check(!organization.includes('<main className="organization-page">'), 'Organization page does not nest a second main landmark');
check(home.includes('trust-editorial-layout'), 'Homepage combines stories and news into one editorial journey');
check(!home.includes('trust-story-section') && !home.includes('trust-news-section'), 'Homepage removes the two repetitive standalone editorial sections');
check(home.includes('getPublishedActivities({ limit: 4 })'), 'Homepage fills the featured activity grid without an empty slot');
check(hero.includes('data-variant={variant}'), 'Internal heroes expose contextual visual variants');
check(responsive.includes('.page-hero-inner { padding-block: clamp(2.75rem, 4.25vw, 4.1rem); }'), 'Internal hero height follows the compact desktop contract');
check(navbar.includes('<span>Masuk</span>'), 'Desktop account trigger has a visible action label');
check((navbar.match(/className="nav-portal-group"/g) ?? []).length === 2, 'Desktop portal choices are grouped by audience');
check((navbar.match(/className="mobile-nav-portal-group"/g) ?? []).length === 2, 'Mobile portal choices are grouped by audience');
check(content.includes("detailImage: '/media/penyaluran-air-bersih-portrait.webp'"), 'Air program detail uses the portrait documentary source');
check(!globals.includes('Mobile footer and portal alignment'), 'Superseded mobile alignment block has been removed');

console.log(`Design refinement audit passed (${checks.length} contracts).`);
