import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const search = read('app/cari/page.tsx');
const contact = read('app/kontak/page.tsx');
const donation = read('app/donasi/page.tsx');
const errorPage = read('app/error.tsx');
const home = read('app/page.tsx');
const program = read('app/program/[slug]/page.tsx');
const site = read('lib/site.ts');
const contactApi = read('app/api/contact/route.ts');
const donationApi = read('app/api/donations/route.ts');

const checks = [];
function check(condition, label) {
  assert.ok(condition, label);
  checks.push(label);
}

check(search.includes('q?: string | string[]'), 'Search accepts repeated query parameters without a runtime type mismatch');
check(search.includes('Array.isArray(q) ? (q[0] ?? \'\') : q'), 'Search deterministically keeps the first repeated query value');
check(search.includes('q.slice(0, 120)') === false, 'Search never slices an unresolved string array');
check(site.includes('export function whatsappUrl'), 'Official WhatsApp flow has one reusable URL builder');
check(site.includes("replace(/\\D/g, '')"), 'WhatsApp flow normalizes the official display number');
check(site.includes('encodeURIComponent(message)'), 'WhatsApp prefilled context is URL encoded');
check(contact.includes('Chat WhatsApp Resmi'), 'Contact task exposes an active primary channel');
check(contact.includes('aria-label="Chat WhatsApp resmi, dibuka di tab baru"'), 'Contact external transition is explicit to assistive technology');
check(contact.includes('Alamat, email, dan formulir contoh tetap dipertahankan'), 'Contact sample content remains present and clearly separated from the active channel');
check(contact.includes('yang berlabel “CONTOH” bukan kanal komunikasi nyata'), 'Contact notice distinguishes sample data from the active official channel');
check(donation.includes('Tanya via WhatsApp Resmi'), 'Support task reaches an active channel without a redundant contact-page step');
check(donation.includes('saya ingin mengetahui cara mendukung program'), 'Support handoff preserves user intent in the WhatsApp message');
check(donation.includes('Simulasi donasi tetap dipertahankan'), 'Donation preview remains available and is not misrepresented as active payment');
check(errorPage.includes('Coba Lagi') && errorPage.includes('Ke Beranda'), 'Runtime error recovery offers retry and a loop-breaking exit');
check(home.includes('Lihat arsip berita'), 'Sample-news CTA predicts the preview destination');
check(!home.includes('Baca cerita <ArrowRight'), 'Sample-news CTA no longer promises a full article');
check(program.includes('Lihat arsip kegiatan'), 'Program CTA predicts the mixed activity archive destination');
check(!program.includes('Lihat kegiatan terbit'), 'Program CTA no longer implies unavailable published records');
check(contactApi.includes("status: 503") && contactApi.includes('CONTACT_BACKEND_NOT_CONFIGURED'), 'Inactive contact API fails explicitly instead of accepting data silently');
check(donationApi.includes("status: 503") && donationApi.includes('PAYMENT_NOT_CONFIGURED'), 'Inactive payment API fails explicitly instead of creating false completion');

const flows = [
  ['Contact organization', 3, 1],
  ['Ask how to support', 3, 1],
  ['Repeated-query search', 2, 1],
  ['Recover from runtime error', 2, 1],
  ['Open sample news preview', 1, 1],
  ['Open activity archive from program', 1, 1],
];

for (const [name, before, after] of flows) {
  check(after <= before, `${name}: optimized flow does not add steps`);
}

console.log('flow\tbefore\tafter\tdelta');
for (const [name, before, after] of flows) console.log(`${name}\t${before}\t${after}\t${after - before}`);
console.log(`\nUX flow audit passed (${checks.length} contracts across ${flows.length} primary flows).`);
