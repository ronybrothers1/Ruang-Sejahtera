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
const heroCarousel = read('components/HeroGalleryCarousel.tsx');
const content = read('lib/content.ts');
const publishedContent = read('lib/published-content.ts');
const globals = read('app/globals.css');
const responsive = read('app/responsive-preview-v8.css');
const typography = read('app/typography-audit-v6.css');

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
check(home.includes('getPublishedActivities({ limit: 5 })') && home.includes('publishedActivities.slice(0, 4)'), 'Homepage shares five latest activities with the carousel while keeping the featured grid complete');
check(hero.includes('data-variant={variant}'), 'Internal heroes expose contextual visual variants');
check(responsive.includes('.page-hero-inner { padding-block: clamp(2.75rem, 4.25vw, 4.1rem); }'), 'Internal hero height follows the compact desktop contract');
check(navbar.includes('<span>Masuk</span>'), 'Desktop account trigger has a visible action label');
check((navbar.match(/className="nav-portal-group"/g) ?? []).length === 2, 'Desktop portal choices are grouped by audience');
check((navbar.match(/className="mobile-nav-portal-group"/g) ?? []).length === 2, 'Mobile portal choices are grouped by audience');
check(content.includes("detailImage: '/media/penyaluran-air-bersih-portrait.webp'"), 'Air program detail uses the portrait documentary source');
check(!globals.includes('Mobile footer and portal alignment'), 'Superseded mobile alignment block has been removed');
check(home.includes('<ul className="trust-program-shortcuts"'), 'Homepage presents programs as a semantic shortcut navigator');
check(!home.includes('trust-program-grid-photo') && !home.includes('trust-program-card-photo'), 'Homepage program navigator no longer repeats photo cards');
check(home.includes('programs.map((program)') && home.includes('<ProgramMark slug={program.slug}'), 'Every official program receives its matching icon');
check(globals.includes('grid-template-columns: repeat(5, minmax(0, 1fr));'), 'Program shortcuts use five equal desktop columns');
check(globals.includes('.trust-program-shortcuts > li:nth-child(4) { grid-column: 2 / span 2; }'), 'Program shortcuts center the second responsive row');
check(home.includes('aria-label={`${program.name}: ${program.summary}`}'), 'Program shortcuts expose their full purpose to assistive technology');
check(home.includes('const impactIcons = [UsersRound, HeartHandshake, MapPinned, HandCoins]'), 'Impact summary uses four purpose-specific icons');
check(home.includes('<ul className="shell trust-stat-grid">'), 'Impact summary is exposed as a semantic list');
check((home.match(/item\.value|item\.label|item\.note/g) ?? []).length >= 3, 'Impact summary preserves every value, label, and sample note');
check(responsive.includes('.trust-stat-grid > li {\n  position: relative;'), 'Impact metrics use independent compact cards');
check(!responsive.includes('.trust-stat-grid article:nth-child(2)'), 'Legacy table-like impact dividers are removed');
check(home.includes('<span className="trust-hero-title-line">Kepedulian perlu</span>') && home.includes('<span className="trust-hero-title-line">sampai ke tempat</span>') && home.includes('<span className="trust-hero-title-line">yang tepat'), 'Homepage hero locks the intended three-line editorial statement');
check(home.includes('trust-hero-title-dot') && responsive.includes('.trust-hero-title-dot { color: #ff4f57; }'), 'Homepage statement ends with a restrained brand-red punctuation accent');
check(typography.includes('.trust-home .trust-hero-copy > h1') && typography.includes('text-transform: uppercase;'), 'Homepage statement is capitalized through presentation only');
check(globals.includes('linear-gradient(112deg, #060607 0%, #08080a 62%, #28090f 100%)'), 'Desktop hero uses a black-dominant burgundy gradient');
check(responsive.includes('linear-gradient(165deg,#060607 0%,#08080a 70%,#28090f 100%)'), 'Mobile hero preserves the black-dominant gradient with a vertical flow');
check(home.includes('<HeroGalleryCarousel slides={heroSlides} />'), 'Homepage delegates documentary interaction to an isolated carousel boundary');
check(!responsive.includes('trust-hero-mini-grid'), 'Superseded static hero collage styles have been removed');
check(heroCarousel.startsWith("'use client';") && heroCarousel.includes('useState(0)'), 'Carousel state is isolated to a small client component');
check(!heroCarousel.includes('setInterval') && !heroCarousel.includes('autoPlay') && !heroCarousel.includes('autoplay'), 'Documentary carousel never auto-rotates');
check(heroCarousel.includes('onPointerDown={handlePointerDown}') && heroCarousel.includes('SWIPE_THRESHOLD = 44'), 'Carousel supports deliberate mobile swiping without hijacking vertical scroll');
check(publishedContent.includes('imageUrl?: string;') && publishedContent.includes('mapGallery(content, groupedMedia.get(content.id) || [])'), 'Published gallery data carries validated public media into the latest-documentation carousel');
check(home.indexOf('<HeroGalleryCarousel slides={heroSlides} />') < home.indexOf('<div className="trust-hero-assurance">'), 'Mobile source order presents documentary evidence before the preview assurance');

console.log(`Design refinement audit passed (${checks.length} contracts).`);
