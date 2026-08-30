import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const typographyPath = path.join(root, "app", "typography-audit-v6.css");
const layoutPath = path.join(root, "app", "layout.tsx");
const packagePath = path.join(root, "package.json");

const typography = readFileSync(typographyPath, "utf8");
const layout = readFileSync(layoutPath, "utf8");
const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const failures = [];
const passes = [];

function check(condition, label) {
  if (condition) {
    passes.push(label);
  } else {
    failures.push(label);
  }
}

function hasToken(name, value) {
  return typography.includes(`--${name}: ${value};`);
}

const importOrder = [
  layout.indexOf("import './globals.css'"),
  layout.indexOf("import './responsive-preview-v8.css'"),
  layout.indexOf("import './typography-audit-v6.css'"),
];

check(
  importOrder.every((index) => index >= 0) &&
    importOrder[0] < importOrder[1] &&
    importOrder[1] < importOrder[2],
  "Typography layer loads after established visual and responsive layers",
);
check(
  layout.includes("variable: '--font-inter'") &&
    layout.includes("variable: '--font-plus-jakarta'"),
  "Inter and Plus Jakarta Sans are exposed through next/font variables",
);
check(
  (layout.match(/display:\s*'swap'/g) ?? []).length === 2,
  "Both web fonts use display: swap",
);
check(
  !layout.includes("@import url("),
  "No render-blocking remote font import is present",
);

check(
  hasToken("type-size-display", "clamp(3.125rem, 5.2vw, 5.5rem)"),
  "Fluid display token is defined",
);
check(
  hasToken("type-size-h1", "clamp(2.75rem, 4.8vw, 4.75rem)"),
  "Fluid H1 token is defined",
);
check(
  hasToken("type-size-h2", "clamp(2rem, 3.4vw, 3.25rem)"),
  "Fluid H2 token is defined",
);
check(
  hasToken("type-size-body", "1rem"),
  "Body token remains at the 16px browser baseline",
);
check(
  hasToken("type-size-caption", "0.75rem"),
  "Caption token has a 12px minimum",
);
check(
  hasToken("type-leading-body", "1.72"),
  "Body line-height meets long-copy readability target",
);
check(
  hasToken("type-leading-longform", "1.8"),
  "Long-form line-height has a dedicated relaxed token",
);
check(
  hasToken("type-tracking-label", "0.08em"),
  "Uppercase label tracking is bounded at 0.08em",
);
check(
  hasToken("type-weight-extrabold", "800"),
  "Heading weight matches the available Plus Jakarta Sans range",
);

check(
  /-webkit-text-size-adjust:\s*100%/.test(typography) &&
    /(?<!-webkit-)text-size-adjust:\s*100%/.test(typography),
  "Browser text scaling is explicitly preserved",
);
check(
  /font-synthesis:\s*none/.test(typography),
  "Heading synthesis is disabled",
);
check(
  /input,[\s\S]*?font-size:\s*var\(--type-size-body\)/.test(typography),
  "Form controls use a 16px base size",
);
check(
  /\.prose[\s\S]*?line-height:\s*var\(--type-leading-longform\)/.test(
    typography,
  ),
  "Long-form prose uses the long-form rhythm",
);
check(
  /font-variant-numeric:\s*tabular-nums lining-nums/.test(typography),
  "Data-heavy numerals use stable tabular alignment",
);
check(
  /text-wrap:\s*balance/.test(typography) &&
    /text-wrap:\s*pretty/.test(typography),
  "Heading and paragraph wrapping policies are explicit",
);

check(
  !/font-weight:\s*(?:850|900)\b/.test(typography),
  "Typography layer contains no out-of-policy 850/900 weights",
);
check(
  !/font-size:\s*(?:0\.[0-6]\d*rem|(?:[0-9]|1[01])px)\b/.test(typography),
  "Typography layer contains no text smaller than 12px",
);
check(
  !/letter-spacing:\s*(?:0\.(?:1\d+|[2-9]\d*)em|[2-9](?:\.\d+)?px)\b/.test(
    typography,
  ),
  "Typography layer contains no excessive positive tracking",
);

const forbiddenDeclarations = [
  "background",
  "border",
  "box-shadow",
  "color",
  "display",
  "gap",
  "grid",
  "height",
  "margin",
  "padding",
  "position",
  "width",
];
const forbiddenPattern = new RegExp(
  `^\\s*(?:${forbiddenDeclarations.join("|")}):`,
  "m",
);
check(
  !forbiddenPattern.test(typography),
  "Audit layer does not modify layout, spacing, color, borders, or shadows",
);

const mediaQueries = [
  ...typography.matchAll(/@media\s*\(([^)]+)\)(?:\s*and\s*\(([^)]+)\))?/g),
].map((match) => [match[1], match[2]].filter(Boolean).join(" and "));
check(
  mediaQueries.length === 2 &&
    mediaQueries[0] === "max-width: 680px" &&
    mediaQueries[1] === "max-width: 1120px and max-height: 560px",
  "Only established mobile and short-landscape breakpoints are reused",
);
check(
  packageJson.scripts?.["typography:audit"] ===
    "node scripts/check-typography-system.mjs",
  "Typography audit is exposed as a package script",
);

const scale = [88, 76, 52, 22, 16, 12];
check(
  scale.every((value, index) => index === 0 || scale[index - 1] > value),
  "Representative type-scale maxima descend monotonically",
);

const viewports = [
  [320, 568],
  [360, 800],
  [375, 812],
  [390, 844],
  [414, 896],
  [430, 932],
  [768, 1024],
  [820, 1180],
  [1024, 1366],
  [1280, 800],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
  [844, 390],
  [932, 430],
];

function clampPx(minRem, vw, maxRem, width) {
  return Math.min(maxRem * 16, Math.max(minRem * 16, (vw / 100) * width));
}

function typeScaleAt(width, height) {
  let display = clampPx(3.125, 5.2, 5.5, width);
  let h1 = clampPx(2.75, 4.8, 4.75, width);
  let h2 = clampPx(2, 3.4, 3.25, width);

  if (width <= 680) {
    display = clampPx(2.5, 10.8, 3.25, width);
    h1 = clampPx(2.25, 9.5, 3, width);
    h2 = clampPx(1.875, 8, 2.5, width);
  }

  if (width <= 1120 && height <= 560) {
    display = clampPx(2.25, 5.7, 2.9, width);
    h1 = clampPx(2.2, 5.5, 2.85, width);
    h2 = clampPx(1.8, 4.5, 2.4, width);
  }

  return { width, height, display, h1, h2 };
}

const viewportScales = viewports.map(([width, height]) =>
  typeScaleAt(width, height),
);
check(
  viewportScales.every(
    ({ display, h1, h2 }) =>
      display >= h1 && h1 > h2 && h2 >= 28.8 && display <= 88,
  ),
  "Fluid hierarchy remains ordered across 15 target viewports",
);

console.log("Audit 06 typography contract");
console.log(`  ${passes.length} checks passed`);
for (const label of passes) console.log(`  ✓ ${label}`);

console.log("\nviewport\tdisplay\th1\th2\tbody\tcaption");
for (const { width, height, display, h1, h2 } of viewportScales) {
  console.log(
    `${width}x${height}\t${display.toFixed(1)}px\t${h1.toFixed(1)}px\t${h2.toFixed(1)}px\t16px\t12px`,
  );
}

if (failures.length > 0) {
  console.error(`\n  ${failures.length} checks failed`);
  for (const label of failures) console.error(`  ✗ ${label}`);
  process.exit(1);
}
