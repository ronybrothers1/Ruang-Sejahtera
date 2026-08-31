import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const host = '127.0.0.1';
const port = 3019;
const baseUrl = `http://${host}:${port}`;
const routes = [
  '/',
  '/tentang-kami',
  '/program',
  '/program/berbagi-rasa',
  '/kegiatan',
  '/berita',
  '/galeri',
  '/dampak',
  '/transparansi',
  '/donasi',
  '/kontak',
  '/cari?q=air',
  '/cari?q=hasil-yang-tidak-ada',
  '/organisasi',
  '/aksesibilitas',
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

function tags(html) {
  return html.match(/<[^!][^>]*>/g) ?? [];
}

function idSet(html) {
  return new Set(tags(html).flatMap((tag) => [...tag.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])));
}

function ariaReferences(html) {
  return tags(html).flatMap((tag) => [...tag.matchAll(/\baria-(?:controls|labelledby|describedby)="([^"]+)"/g)]
    .flatMap((match) => match[1].split(/\s+/).filter(Boolean).map((id) => ({ id, tag }))));
}

try {
  await waitForServer();
  const titles = new Map();

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route}: renders with HTTP 200`);
    const html = await response.text();
    const documentTags = tags(html);
    const ids = idSet(html);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const routeKey = route.split('?')[0];

    assert.match(html, /<html[^>]+lang="id"/, `${route}: declares Indonesian as the page language`);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${route}: renders one main landmark`);
    assert.match(html, /<main[^>]+id="main-content"[^>]+tabindex="-1"/, `${route}: main landmark is a focusable skip target`);
    assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#main-content"/, `${route}: renders the skip link`);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: renders one primary heading`);
    assert.ok(title?.trim(), `${route}: renders a non-empty page title`);
    if (!titles.has(routeKey)) titles.set(routeKey, title);

    assert.equal(documentTags.filter((tag) => /<img\b/.test(tag) && !/\balt="[^"]*"/.test(tag)).length, 0, `${route}: every rendered image declares alt`);
    assert.equal(documentTags.filter((tag) => /<iframe\b/.test(tag) && !/\btitle="[^"]+"/.test(tag)).length, 0, `${route}: every rendered iframe has a title`);
    assert.equal(documentTags.filter((tag) => /<iframe\b/.test(tag) && !/\baria-describedby="[^"]+"/.test(tag)).length, 0, `${route}: every rendered iframe has a text-summary relationship`);
    assert.doesNotMatch(html, /autoplay=1/, `${route}: no embedded media autoplays`);

    const brokenRefs = ariaReferences(html).filter(({ id }) => !ids.has(id));
    assert.deepEqual(brokenRefs, [], `${route}: all rendered ARIA ID references resolve`);
  }

  assert.notEqual(titles.get('/'), titles.get('/program'), 'Home and program page titles are unique');
  assert.notEqual(titles.get('/program'), titles.get('/kontak'), 'Program and contact page titles are unique');
  assert.notEqual(titles.get('/kontak'), titles.get('/aksesibilitas'), 'Contact and accessibility page titles are unique');

  const notFoundResponse = await fetch(`${baseUrl}/halaman-yang-tidak-ada`);
  const notFound = await notFoundResponse.text();
  assert.equal(notFoundResponse.status, 404, 'Unknown route renders with HTTP 404');
  assert.match(notFound, /<title>Halaman Tidak Ditemukan \| Ruang Sejahtera<\/title>/, '404 renders a meaningful unique title');
  assert.match(notFound, /aria-describedby="page-state-description"/, '404 state exposes its description relationship');

  const gallery = await (await fetch(`${baseUrl}/galeri`)).text();
  assert.equal((gallery.match(/trust-tiktok-card/g) ?? []).length, 4, 'Gallery renders all four TikTok video regions');
  assert.equal((gallery.match(/trust-tiktok-placeholder/g) ?? []).length, 4, 'Deferred players expose stable placeholders before entering the viewport');
  assert.equal((gallery.match(/<iframe\b/g) ?? []).length, 0, 'Off-screen TikTok players do not create third-party iframes during initial rendering');
  assert.equal((gallery.match(/aria-labelledby="tiktok-title-/g) ?? []).length, 4, 'Every video article exposes its heading relationship');
  assert.equal((gallery.match(/id="tiktok-description-/g) ?? []).length, 4, 'Every deferred video region retains its text summary');

  const home = await (await fetch(baseUrl)).text();
  assert.equal((home.match(/aria-label="Lihat kegiatan:/g) ?? []).length, 4, 'Repeated activity links have unique accessible names');
  assert.equal((home.match(/aria-label="Lihat (?:arsip berita contoh|berita):/g) ?? []).length, 4, 'Repeated preview links have unique accessible names');

  console.log(`Accessibility production smoke passed (${routes.length} cross-page routes + 404/media/link contracts).`);
} finally {
  server.kill('SIGTERM');
}
