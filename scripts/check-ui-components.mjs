import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const layout = read('app/layout.tsx');
const componentCss = read('app/components-audit-v7.css');
const navbar = read('components/Navbar.tsx');
const adminNav = read('components/admin/AdminNav.tsx');
const previewForm = read('components/PreviewForm.tsx');
const donationForm = read('components/DonationPreviewForm.tsx');
const contactPage = read('app/kontak/page.tsx');
const donationPage = read('app/donasi/page.tsx');
const searchPage = read('app/cari/page.tsx');
const pageState = read('components/PageState.tsx');
const errorPage = read('app/error.tsx');

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

check(layout.includes("import './components-audit-v7.css';"), 'Component audit layer is imported last');
check(layout.indexOf('components-audit-v7.css') > layout.indexOf('typography-audit-v6.css'), 'Component states do not override the prior audit order accidentally');

check(previewForm.includes('event.preventDefault()'), 'PreviewForm prevents native keyboard submission');
check(previewForm.includes('data-preview-form'), 'Preview forms expose a stable behavior contract');
check(contactPage.includes('<PreviewForm'), 'Contact preview uses the guarded shared form');
check(donationPage.includes('<DonationPreviewForm'), 'Donation preview uses the interactive shared form');
check(!contactPage.includes('<form'), 'Contact preview has no unguarded raw form');
check(!donationPage.includes('<form'), 'Donation preview has no unguarded raw form');

check(donationForm.includes('aria-pressed={selected}'), 'Donation amount exposes selected state to assistive technology');
check(donationForm.includes('setSelectedAmount(amount)'), 'Donation amount selection updates from user input');
check(donationForm.includes('setSelectedAmount(null)'), 'Custom donation amount clears the preset selection');
check(componentCss.includes('button[aria-pressed="true"]'), 'Pressed donation amount has a tokenized visual state');
check(componentCss.includes('label:has(input:checked)'), 'Checked donation program has a visible label state');

check(searchPage.includes('type="search"'), 'Search uses the native search control role');
check(searchPage.includes('enterKeyHint="search"'), 'Search communicates the mobile keyboard action');
check(searchPage.includes('rawQuery.slice(0, 120)'), 'Search query rendering is bounded after resolving repeated parameters');
check(searchPage.includes('maxLength={120}'), 'Search input and server rendering share a length contract');

check(navbar.includes('role="dialog"') && navbar.includes('aria-modal="true"'), 'Mobile drawer retains dialog semantics');
check(navbar.includes("event.key === 'Escape'") && navbar.includes("event.key !== 'Tab'"), 'Mobile drawer retains Escape and focus-trap keyboard behavior');
check(navbar.includes('aria-expanded={activeDesktopMenu === item.name}'), 'Desktop disclosure exposes expanded state');
check(navbar.includes('aria-hidden="true"'), 'Navigation decorative icons are hidden from the accessibility tree');

check(adminNav.startsWith('"use client";'), 'AdminNav is a route-aware client component');
check(adminNav.includes('usePathname()'), 'AdminNav derives its current route without server prop duplication');
check(adminNav.includes("pathname === href ? 'page' : 'location'"), 'AdminNav distinguishes the current page from its current section');
check(adminNav.includes('aria-current={currentType}'), 'AdminNav announces the current page or location');
check(componentCss.includes('.admin-nav-link[aria-current]'), 'AdminNav current state has a visual variant');

check(pageState.includes('aria-labelledby="page-state-title"'), 'PageState associates its landmark with its heading');
check(errorPage.includes('role="alert"'), 'Runtime error feedback is announced assertively');
check(componentCss.includes(':user-invalid'), 'Touched invalid fields have a semantic error state');
check(componentCss.includes(':focus-visible'), 'Interactive components have explicit keyboard focus parity');
check(componentCss.includes(':disabled'), 'Buttons have an explicit disabled state contract');
check(componentCss.includes('@media (prefers-reduced-motion: reduce)'), 'Component focus motion honors reduced-motion preference');

for (const file of [...sourceFiles('app'), ...sourceFiles('components')]) {
  const source = read(file);
  for (const match of source.matchAll(/<form\b[^>]*>/gs)) {
    check(/\baction=/.test(match[0]) || /data-preview-form/.test(match[0]), `${file}: raw form has an action or preview guard`);
  }
  for (const match of source.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gs)) {
    check(/\brel="[^"]*(noreferrer|noopener)[^"]*"/.test(match[0]), `${file}: external new-tab link blocks opener access`);
  }
}

console.log(`UI component audit passed (${checks.length} contracts).`);
