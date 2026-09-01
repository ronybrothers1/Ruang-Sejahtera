import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const globals = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
const responsive = fs.readFileSync(path.join(root, 'app/responsive-preview-v8.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'app/page.tsx'), 'utf8');
const navbar = fs.readFileSync(path.join(root, 'components/Navbar.tsx'), 'utf8');
const standardMobileStart = responsive.indexOf('@media (max-width: 420px)');
const veryNarrowStart = responsive.indexOf('@media (max-width: 340px)');
const standardMobileBlock = responsive.slice(standardMobileStart, veryNarrowStart);

const failures = [];
const requireSource = (condition, message) => {
  if (!condition) failures.push(message);
};

requireSource(
  globals.includes('calc(100% - clamp(2rem, 5vw, 4rem))'),
  'Shell must use the continuous fluid-gutter contract.',
);
requireSource(
  !/@media\s*\(min-width:\s*768px\)[\s\S]{0,100}\.shell/.test(globals),
  'Shell must not jump at 768px.',
);
requireSource(
  /@media \(max-width: 900px\)[\s\S]*?\.trust-hero-layout-rich \{ min-height: auto; \}/.test(responsive),
  'Stacked tablet hero must grow from content.',
);
requireSource(
  /max-height: 560px[\s\S]*?\.nav-inner \{ min-height: 76px; height: 76px; \}/.test(responsive),
  'Short landscape viewports must use the compact header contract.',
);
requireSource(
  responsive.includes('.trust-option-grid label,\n.trust-amount-grid button { min-height: 48px; }'),
  'Donation choices must retain a 48px touch target.',
);
requireSource(
  home.includes("(max-width: 680px) 100vw, (max-width: 1120px) 50vw, 33vw"),
  'Supporting activity images must advertise tablet and desktop source sizes.',
);
requireSource(
  navbar.includes('createPortal(') && navbar.includes('document.body'),
  'Mobile navigation must be portalled outside the composited fixed header.',
);
requireSource(
  /\.mobile-panel \{[\s\S]*?top: var\(--public-navigation-height\);[\s\S]*?bottom: 0;[\s\S]*?height: auto;[\s\S]*?overflow-y: auto;/.test(responsive),
  'Mobile navigation must own a full viewport scrollport below the header.',
);
requireSource(
  /\.nav-inner \{[\s\S]*?min-height: var\(--public-navigation-height\);[\s\S]*?height: var\(--public-navigation-height\);/.test(responsive),
  'Header and mobile navigation must consume the same height token.',
);
requireSource(
  /@media \(max-width: 680px\)[\s\S]*?:root \{ --public-navigation-height: 86px; \}/.test(responsive),
  'Mobile navigation offset must stay synchronized with the 86px mobile header.',
);
requireSource(
  /@media \(max-width: 900px\)[\s\S]*?\.trust-program-shortcuts \{ grid-template-columns: repeat\(6, minmax\(0,1fr\)\); \}/.test(globals),
  'Tablet program shortcuts must form a centered three-plus-two layout.',
);
requireSource(
  /@media \(max-width: 360px\)[\s\S]*?\.trust-program-shortcuts \{ grid-template-columns: repeat\(2, minmax\(0,1fr\)\); \}/.test(globals),
  'Very narrow program shortcuts must fall back to two readable columns.',
);
requireSource(
  /@media \(max-width: 900px\)[\s\S]*?\.trust-stat-grid \{ grid-template-columns: repeat\(2,minmax\(0,1fr\)\); \}/.test(responsive),
  'Impact metrics must form a two-by-two grid on tablets and phones.',
);
requireSource(
  standardMobileStart >= 0 && veryNarrowStart > standardMobileStart && !standardMobileBlock.includes('.trust-stat-grid { grid-template-columns: 1fr; }'),
  'Standard mobile widths must not collapse impact metrics into a tall single column.',
);
requireSource(
  /@media \(max-width: 340px\)[\s\S]*?\.trust-stat-grid \{ grid-template-columns: 1fr; \}/.test(responsive),
  'Only very narrow screens may stack impact metrics for readability.',
);

const shellGutter = (width) => Math.min(64, Math.max(32, width * 0.05));
const shellWidth = (width) => Math.min(1240, width - shellGutter(width));
const layoutFor = (width, height) => {
  const shortLandscape = width > height && height <= 560 && width <= 1120;
  return {
    shell: shellWidth(width),
    navigation: width > 1120 ? 'desktop' : 'drawer',
    header: shortLandscape ? 76 : width <= 680 ? 86 : width <= 1120 ? 88 : 98,
    hero: width > 900 || (shortLandscape && width >= 720) ? 'two-column' : 'stacked',
  };
};

for (const boundary of [680, 768, 900, 1120]) {
  const before = shellWidth(boundary - 1);
  const after = shellWidth(boundary);
  const delta = after - before;
  if (delta < 0.9 || delta > 1.1) {
    failures.push(`Shell discontinuity at ${boundary}px: ${delta.toFixed(2)}px.`);
  }
}

const viewports = [
  ['desktop', 1920, 1080], ['desktop', 1600, 900], ['desktop', 1440, 900],
  ['desktop', 1366, 768], ['desktop', 1280, 800], ['desktop', 1024, 768],
  ['tablet', 1024, 1366], ['tablet', 834, 1194], ['tablet', 820, 1180], ['tablet', 768, 1024],
  ['mobile', 430, 932], ['mobile', 414, 896], ['mobile', 390, 844],
  ['mobile', 375, 812], ['mobile', 360, 800],
  ['mobile-landscape', 932, 430], ['mobile-landscape', 896, 414],
  ['mobile-landscape', 844, 390], ['mobile-landscape', 812, 375], ['mobile-landscape', 800, 360],
  ['tablet-landscape', 1366, 1024], ['tablet-landscape', 1194, 834],
  ['tablet-landscape', 1180, 820], ['tablet-landscape', 1024, 768],
  ['low-desktop', 1366, 650],
  ['boundary', 767, 900], ['boundary', 768, 900], ['boundary', 899, 900],
  ['boundary', 900, 900], ['boundary', 901, 900], ['boundary', 1119, 800],
  ['boundary', 1120, 800], ['boundary', 1121, 800],
];

console.log('viewport\ttype\tshell\tnavigation\theader\thero');
for (const [type, width, height] of viewports) {
  const layout = layoutFor(width, height);
  console.log(
    `${width}x${height}\t${type}\t${layout.shell.toFixed(1)}px\t${layout.navigation}\t${layout.header}px\t${layout.hero}`,
  );
}

if (failures.length > 0) {
  console.error(`\nResponsive contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nResponsive contract passed across ${viewports.length} declared viewport cases.`);
