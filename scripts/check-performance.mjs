import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
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

const config = read('next.config.ts');
const layout = read('app/layout.tsx');
const home = read('app/page.tsx');
const gallery = read('app/galeri/page.tsx');
const tiktok = read('components/TikTokEmbed.tsx');
const mediaCss = read('app/media-audit-v8.css');

check(!existsSync(join(root, 'app/loading.tsx')), 'Public static routes are not delayed by a root loading boundary');
check(existsSync(join(root, 'app/admin/loading.tsx')), 'The dynamic admin control plane retains a scoped loading state');
check(config.includes("formats: ['image/avif', 'image/webp']"), 'Next Image negotiates AVIF and WebP output');
check(layout.includes("from 'next/font/google'"), 'Fonts are self-hosted and optimized through next/font');
check(home.includes('fill priority sizes="(max-width: 900px) 100vw, 42vw"'), 'The homepage LCP image is preloaded with responsive sizing');

check(tiktok.includes("'use client'"), 'TikTok activation is isolated to a client boundary');
check(tiktok.includes('new IntersectionObserver'), 'Off-screen TikTok players activate through viewport observation');
check(tiktok.includes("rootMargin: '600px 0px'"), 'TikTok players begin loading shortly before entering the viewport');
check(tiktok.includes('loading="lazy"'), 'Activated TikTok iframes retain native lazy loading');
check(tiktok.includes('autoplay=0&loop=0'), 'TikTok players do not autoplay or loop');
check(tiktok.includes('<iframe') && tiktok.includes('playerUrl'), 'Deferred media remains a direct TikTok player embed');
check(gallery.includes('tiktokVideos.map((video) => <TikTokEmbed'), 'All configured TikTok videos remain present in the gallery');
check(mediaCss.includes('aspect-ratio: 9 / 16'), 'Player placeholders reserve the final responsive aspect ratio');
check(mediaCss.includes('.trust-tiktok-placeholder { animation: none; }'), 'Deferred media animation honors reduced-motion preferences');

for (const file of [...sourceFiles('app'), ...sourceFiles('components')]) {
  const source = read(file);
  for (const match of source.matchAll(/<Image\b[\s\S]*?\/>/g)) {
    if (/\bfill\b/.test(match[0])) check(/\bsizes=/.test(match[0]), `${file}: fill image declares responsive sizes`);
  }
}

console.log(`Performance source audit passed (${checks.length} contracts).`);
