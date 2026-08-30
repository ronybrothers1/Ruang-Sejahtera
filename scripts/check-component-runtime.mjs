import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const host = '127.0.0.1';
const port = 3017;
const baseUrl = `http://${host}:${port}`;
const publicRoutes = [
  '/',
  '/tentang-kami',
  '/tentang-kami/visi-misi',
  '/tentang-kami/nilai',
  '/tentang-kami/sejarah',
  '/tentang-kami/legalitas',
  '/program',
  '/program/berbagi-rasa',
  '/kegiatan',
  '/berita',
  '/galeri',
  '/dampak',
  '/transparansi',
  '/donasi',
  '/kontak',
  '/cari',
  '/organisasi',
  '/kebijakan-donasi',
  '/privasi',
  '/ketentuan',
  '/aksesibilitas',
  '/disclaimer',
];

let output = '';
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', host, '--port', String(port)],
  { env: { ...process.env, NODE_ENV: 'production' }, stdio: ['ignore', 'pipe', 'pipe'] },
);
server.stdout.on('data', (chunk) => { output += chunk; });
server.stderr.on('data', (chunk) => { output += chunk; });

async function waitForServer() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Production server exited early.\n${output}`);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Production server did not become ready.\n${output}`);
}

try {
  await waitForServer();

  for (const route of publicRoutes) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route} renders with HTTP 200`);
    assert.ok((await response.text()).trim().length > 0, `${route} renders non-empty HTML`);
  }

  const donation = await (await fetch(`${baseUrl}/donasi`)).text();
  assert.match(donation, /data-preview-form/, 'Donation preview renders the guarded form');
  assert.match(donation, /aria-pressed="true"/, 'Donation preview renders one selected amount');
  assert.match(donation, /Lanjutkan Pembayaran · SIMULASI/, 'Donation transaction remains explicitly disabled preview content');

  const contact = await (await fetch(`${baseUrl}/kontak`)).text();
  assert.match(contact, /data-preview-form/, 'Contact preview renders the guarded form');
  assert.match(contact, /aria-describedby="contact-preview-helper"/, 'Contact form helper is associated programmatically');
  assert.match(contact, /Kirim Pesan · SIMULASI/, 'Contact submission remains explicitly disabled preview content');

  const longQuery = 'x'.repeat(140);
  const search = await (await fetch(`${baseUrl}/cari?q=${longQuery}`)).text();
  assert.match(search, /type="search"/, 'Search renders as a native search control');
  assert.match(search, /maxlength="120"/i, 'Search renders its maximum-length contract');
  assert.match(search, /enterkeyhint="search"/i, 'Search renders its mobile keyboard action');
  const renderedQuery = search.match(/<input[^>]+id="search"[^>]+value="([^"]*)"/)?.[1];
  assert.equal(renderedQuery?.length, 120, 'Search bounds the visible query before rendering it');

  const repeatedSearchResponse = await fetch(`${baseUrl}/cari?q=air&q=program`);
  const repeatedSearch = await repeatedSearchResponse.text();
  assert.equal(repeatedSearchResponse.status, 200, 'Repeated search parameters render with HTTP 200');
  assert.match(repeatedSearch, /value="air"/, 'Repeated search parameters deterministically keep the first value');
  assert.doesNotMatch(repeatedSearch, /Halaman belum dapat dimuat/, 'Repeated search parameters do not enter the runtime error boundary');

  assert.match(contact, /Chat WhatsApp Resmi/, 'Contact page renders an active official channel');
  assert.match(contact, /wa\.me\/6282334030628/, 'Contact page uses the normalized official WhatsApp number');
  assert.match(donation, /Tanya via WhatsApp Resmi/, 'Donation page renders a direct support handoff');
  assert.match(donation, /wa\.me\/6282334030628/, 'Donation support handoff uses the official WhatsApp number');

  console.log(`Production component smoke passed (${publicRoutes.length} routes + donation/contact/search/recovery contracts).`);
} finally {
  server.kill('SIGTERM');
}
