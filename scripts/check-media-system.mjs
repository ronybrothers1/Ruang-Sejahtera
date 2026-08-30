import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFile(path.join(root, file), 'utf8');
const failures = [];
const requireContract = (condition, message) => {
  if (!condition) failures.push(message);
};

const [content, media, component, gallery, layout, css, config] = await Promise.all([
  read('lib/content.ts'),
  read('lib/media.ts'),
  read('components/TikTokEmbed.tsx'),
  read('app/galeri/page.tsx'),
  read('app/layout.tsx'),
  read('app/media-audit-v8.css'),
  read('next.config.ts'),
]);

const localMedia = [
  'public/media/bantuan-sembako.webp',
  'public/media/penyaluran-air-bersih.webp',
  'public/media/penyaluran-air-bersih-portrait.webp',
  'public/media/visual-merakyat.webp',
  'public/media/visual-rehat.webp',
  'public/media/visual-pendidikan.webp',
  'public/media/visual-gotong-royong.webp',
];

for (const file of localMedia) {
  try {
    const stat = await fs.stat(path.join(root, file));
    requireContract(stat.size > 0, `${file} must not be empty.`);
    requireContract(stat.size <= 300 * 1024, `${file} exceeds the 300 KiB source budget.`);
  } catch {
    failures.push(`${file} is missing.`);
  }
}

requireContract(!content.includes('images.unsplash.com'), 'Preview content must not depend on remote stock imagery.');
requireContract(content.includes("image: '/media/bantuan-sembako.webp'"), 'Sembako documentation must use the supplied local image.');
requireContract(content.includes("image: '/media/penyaluran-air-bersih.webp'"), 'Water-distribution documentation must use the supplied local image.');
requireContract((content.match(/imageLabel: 'DOKUMENTASI'/g) || []).length >= 2, 'Supplied documentation must be identified transparently.');
requireContract((content.match(/imageLabel: 'VISUAL CONTOH'/g) || []).length >= 3, 'Generated supporting visuals must remain marked as examples.');

const requiredVideoIds = [
  '7679252181085687061',
  '7640060867538816276',
  '7660504027385433364',
  '7679426298216779029',
];
for (const id of requiredVideoIds) {
  requireContract(media.includes(id), `TikTok video ${id} is missing from the media registry.`);
}

requireContract(component.includes('https://www.tiktok.com/player/v1/'), 'TikTok videos must use the official iframe player endpoint.');
requireContract(component.includes('loading="lazy"'), 'TikTok iframes must lazy-load.');
requireContract(component.includes('allowFullScreen'), 'TikTok iframes must support fullscreen playback.');
requireContract(component.includes('referrerPolicy="strict-origin-when-cross-origin"'), 'TikTok iframes must use the project referrer policy.');
requireContract(gallery.includes('tiktokVideos.map'), 'Every registered TikTok video must render on the gallery page.');
requireContract(gallery.includes('@ruangsejahtera.idn'), 'The official TikTok profile must be visible beside the video collection.');
requireContract(layout.includes("import './media-audit-v8.css'"), 'The media layout layer must load after previous audit layers.');
requireContract(css.includes('aspect-ratio: 9 / 16'), 'TikTok player containers must preserve the vertical video ratio.');
requireContract(css.includes('grid-template-columns: minmax(0, 1fr)'), 'Mobile TikTok embeds must collapse to one shrinkable column.');
requireContract(css.includes('overflow: clip'), 'Media surfaces must contain visual overflow.');
requireContract(config.includes('frame-src https://www.tiktok.com'), 'CSP must permit only the required TikTok frame origin.');
requireContract(!config.includes('https://images.unsplash.com'), 'CSP must not retain the removed stock-image origin.');

if (failures.length) {
  console.error(`Media system audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Media system audit passed: ${localMedia.length} optimized local images and ${requiredVideoIds.length} responsive TikTok players verified.`);
