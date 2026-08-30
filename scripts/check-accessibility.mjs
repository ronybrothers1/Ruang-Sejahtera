import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const layout = read('app/layout.tsx');
const routeShell = read('components/RouteShell.tsx');
const navbar = read('components/Navbar.tsx');
const pageState = read('components/PageState.tsx');
const tiktok = read('components/TikTokEmbed.tsx');
const gallery = read('app/galeri/page.tsx');
const home = read('app/page.tsx');
const adminLogin = read('app/admin/login/page.tsx');
const notFound = read('app/not-found.tsx');
const globalCss = read('app/globals.css');
const typographyCss = read('app/typography-audit-v6.css');
const media = read('lib/media.ts');

const checks = [];
function check(condition, label) {
  assert.ok(condition, label);
  checks.push(label);
}

function sourceFiles(directory) {
  return readdirSync(join(root, directory)).flatMap((entry) => {
    const absolute = join(root, directory, entry);
    const scoped = relative(root, absolute);
    if (statSync(absolute).isDirectory()) return sourceFiles(scoped);
    return /\.(tsx|ts)$/.test(entry) ? [scoped] : [];
  });
}

check(layout.includes('<html lang="id">'), 'WCAG 3.1.1: the document language is Indonesian');
check(routeShell.includes('href="#main-content"'), 'WCAG 2.4.1: public pages expose a skip link');
check((routeShell.match(/<main id="main-content" tabIndex=\{-1\}/g) ?? []).length === 2, 'WCAG 2.4.1: public and admin main targets accept programmatic focus');
check(globalCss.includes('.skip-link:focus'), 'WCAG 2.4.1: the skip link becomes visible on focus');
check(globalCss.includes('*:focus-visible { outline: 3px solid var(--color-focus-ring)'), 'WCAG 2.4.7/2.4.11: focus visibility has a site-wide high-contrast indicator');
check(globalCss.includes('@media (prefers-reduced-motion: reduce)'), 'WCAG 2.3.3: user reduced-motion preference is honored');
check(typographyCss.includes('text-size-adjust: 100%'), 'WCAG 1.4.4: browser text scaling remains enabled');

check(navbar.includes("aria-controls={activeDesktopMenu === item.name ? menuId(item.name) : undefined}"), 'WCAG 4.1.2: desktop disclosure references exist only while mounted');
check(navbar.includes("aria-controls={mobileMenuOpen ? 'mobile-navigation' : undefined}"), 'WCAG 4.1.2: mobile dialog reference exists only while mounted');
check(navbar.includes("aria-current={isItemActive(item) ? 'location' : undefined}"), 'WCAG 1.3.1/4.1.2: the current desktop section is programmatically exposed');
check(navbar.includes('role="dialog"') && navbar.includes('aria-modal="true"') && navbar.includes('aria-label="Menu navigasi"'), 'WCAG 4.1.2: the mobile drawer has dialog role, modality, and an accessible name');
check(navbar.includes("event.key === 'Escape'") && navbar.includes("event.key !== 'Tab'"), 'WCAG 2.1.1/2.1.2: the mobile drawer supports Escape and focus containment');
check(navbar.includes("['ArrowDown', 'ArrowUp', 'Home', 'End']"), 'WCAG 2.1.1: desktop disclosure links support expected keyboard navigation');

check(pageState.includes('aria-labelledby="page-state-title"') && pageState.includes('aria-describedby="page-state-description"'), 'WCAG 1.3.1/4.1.2: page states expose name and description relationships');
check(pageState.includes('id="page-state-description"'), 'WCAG 3.3.1: page-state explanation has a stable description target');
check(adminLogin.includes('id="admin-login-error"') && adminLogin.includes("aria-describedby={error === 'invalid' ? 'admin-login-error' : undefined}"), 'WCAG 3.3.1: the invalid admin credential is associated with its field');
check(adminLogin.includes("aria-invalid={error === 'invalid'}"), 'WCAG 3.3.1: invalid credential state is programmatically exposed');

check(tiktok.includes('title={`Video TikTok: ${video.title}`}'), 'WCAG 4.1.2: each embedded player has a meaningful title');
check(tiktok.includes('aria-describedby={descriptionId}') && tiktok.includes('id={descriptionId}'), 'WCAG 1.1.1: each embedded player is related to its text summary');
check(tiktok.includes('aria-labelledby={titleId}') && tiktok.includes('id={titleId}'), 'WCAG 1.3.1: each video article has a programmatic name');
check(tiktok.includes('aria-label={`Buka video ${video.title} di TikTok, dibuka di tab baru`}'), 'WCAG 2.4.4/3.2.5: repeated TikTok links have unique purpose and external-window context');
check(gallery.includes('aria-label="Buka profil TikTok resmi @ruangsejahtera.idn, dibuka di tab baru"'), 'WCAG 2.4.4/3.2.5: the external TikTok profile transition is explicit');
check(media.includes('autoplay=1') === false && tiktok.includes('autoplay=0&loop=0'), 'WCAG 1.4.2/2.2.2: embedded media does not autoplay or loop');

check(home.includes('aria-label={`Lihat kegiatan: ${activity.title}`}'), 'WCAG 2.4.4: repeated activity links expose a unique purpose');
check(home.includes('aria-label={`Lihat preview berita: ${item.title}`}'), 'WCAG 2.4.4: repeated preview links expose a unique purpose');
check(notFound.includes("title: 'Halaman Tidak Ditemukan'"), 'WCAG 2.4.2: the 404 state has a meaningful page title');

for (const file of [...sourceFiles('app'), ...sourceFiles('components')]) {
  const source = read(file);
  for (const match of source.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gs)) {
    check(/\brel="[^"]*(noreferrer|noopener)[^"]*"/.test(match[0]), `${file}: new-tab link blocks opener access`);
  }
  for (const match of source.matchAll(/tabIndex=\{(-?\d+)\}/g)) {
    check(Number(match[1]) <= 0, `${file}: no positive tabindex disrupts logical focus order`);
  }
  for (const match of source.matchAll(/<Image\b[\s\S]*?\/>/g)) {
    check(/\balt=/.test(match[0]), `${file}: Next.js image declares alternative text`);
  }
}

console.log(`Accessibility source audit passed (${checks.length} contracts).`);
