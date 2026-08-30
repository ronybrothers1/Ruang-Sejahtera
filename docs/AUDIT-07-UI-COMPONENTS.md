# Audit 07 — UI Components

Tanggal audit: 30 Agustus 2026

Branch: `codex/fix-mobile-menu-viewport`

Status integrasi: branch audit / Draft PR — **tidak di-merge ke `main` dan tidak dipromosikan ke production**

## Ruang lingkup dan batas perubahan

Audit ini memeriksa komponen UI yang benar-benar ada pada source, seluruh variant/state yang relevan, semantik, keyboard, focus, touch target, feedback, edge case, reuse, serta kontrak regresinya. Audit 01–06 diperlakukan final. Perubahan tidak menghapus data/foto contoh dan tidak mengubah information architecture, struktur navigasi, grid/container, breakpoint, sistem warna, sistem tipografi, atau isi halaman.

## A. Component inventory

| Keluarga | Implementasi aktual | Variant/state aktual |
|---|---|---|
| Navigation | `Navbar`, `AdminNav`, `SectionNavigation`, `Breadcrumbs`, `ContentContinuation` | desktop link, disclosure + popover, mobile drawer, accordion, current route, breadcrumb current, continuation card |
| Action | `.button-primary`, `.button-secondary`, `.cta-*`, `.trust-button-*`, `.trust-text-link`, `.icon-button` | primary, secondary, ink, outline, light, dark, icon-only; hover, focus, active, disabled/current sesuai penggunaan |
| Card/list item | program card, activity/news/archive card, published-content card, search-result card, accountability card, finance/status card | full-card link dan article non-interaktif; pointer/keyboard elevation pada kartu link |
| Badge/chip | `.preview-chip`, `.preview-article-label`, `.count-badge`, `StatusBadge` | preview, count, draft, review, published, archived |
| Form | pencarian, `PreviewForm`, `DonationPreviewForm`, login admin, form CMS | search GET, preview non-submit, radio, pressed amount, custom amount, text/email/select/textarea/date, required/invalid, disabled submit |
| Disclosure | desktop nav disclosure, mobile native `details/summary` | expanded/collapsed, active/current, Escape, arrow navigation pada popover desktop |
| Dialog/drawer | mobile navigation drawer | modal semantics, focus transfer, focus trap, Escape, scroll lock, close/route transition |
| Feedback | `PreviewNotice`, status message, `EmptyState`, `PageState`, loading skeleton | info/warning/error/success, empty, 404, runtime error, busy/loading, disabled-unavailable |
| Media/identity | `BrandLogo`, `ProgramMark`, image + preview chip, decorative Lucide icons | compact/full logo, program accents, sample-media label, decorative/icon-only behavior |
| Footer | `Footer` | internal links, optional external social links, mail/address states |

Komponen yang **tidak ada** pada produk saat audit dan karenanya tidak dinilai seolah-olah sudah tersedia: tabs, pagination, data table, carousel, tooltip, toast, modal selain drawer navigasi, avatar, checkbox/toggle, file upload, floating action button, dan back-to-top.

## B. Status component system

- Struktur reusable sudah memadai untuk komponen lintas halaman: shell, navigation, identity, heading, empty/error state, preview notice, published index, dan document layout.
- Perilaku form simulasi kini dipusatkan dalam `PreviewForm`; state khusus nominal dipusatkan dalam `DonationPreviewForm`.
- Status publikasi tidak lagi berupa markup badge ad hoc; variant dipusatkan dalam `StatusBadge`.
- Button-link tetap memakai class visual bersama tanpa dipaksa menjadi satu wrapper React. Keputusan ini mempertahankan semantik native `<a>` versus `<button>` dan menghindari abstraction yang tidak memberi nilai.
- Kartu konten yang hanya muncul pada satu konteks tetap page-local. Ekstraksi baru dilakukan bila ada behavior atau API lintas halaman, bukan hanya kemiripan visual.
- Semua state baru memakai semantic token yang sudah disahkan Audit 05 dan type scale yang disahkan Audit 06.

## C. Temuan berdasarkan severity

### Critical

Tidak ditemukan kegagalan komponen yang membuat seluruh situs tidak dapat digunakan, menghapus data, atau membuka aksi produksi yang tidak semestinya.

### High

| Component → Variant/State | Problem → Cause → Impact → Solution |
|---|---|
| Donation amount → selected | Satu nominal selalu terlihat aktif tetapi semua tombol tidak memiliki state handler → `.is-active` ditetapkan statis berdasarkan index → pilihan pengguna tidak pernah berubah dan state terpilih tidak diumumkan screen reader → pindahkan ke `DonationPreviewForm`, gunakan state React, `aria-pressed`, serta kosongkan preset saat nominal custom dipilih. |
| Preview form → keyboard submit | Form kontak/donasi diklaim tidak mengirim data tetapi Enter masih dapat memicu native form submission ke URL aktif → `<form>` tidak memiliki submit guard → query/reload yang tidak dimaksud dapat terjadi dan kontrak simulasi menjadi tidak jujur → pusatkan `preventDefault()` dalam `PreviewForm` dan gunakan pada kedua alur simulasi. |

### Medium

| Component → Variant/State | Problem → Cause → Impact → Solution |
|---|---|
| AdminNav → current | Navigasi admin tidak memiliki state halaman/section aktif → komponen server tidak membaca pathname dan tidak memberi `aria-current` → orientasi visual dan screen reader lemah → jadikan komponen client ringan, turunkan current state dari `usePathname`, tetapkan `aria-current="page"` atau `"location"` sesuai kedalaman route, dan variant `.is-active`. |
| Linked cards → focus | Beberapa full-card link hanya mendapatkan elevasi pada hover → state pointer tidak memiliki paritas komponen untuk keyboard → pengguna keyboard hanya mengandalkan outline global tanpa konteks kartu yang sama → tambahkan `:focus-visible` pada program, published, search, continuation, dan accountability cards. |
| PageState → runtime error | Runtime error tidak mempunyai live/error semantics dan landmark tidak terhubung eksplisit ke judul → API komponen tidak membawa role/heading association → feedback dapat terlambat atau kurang jelas bagi assistive technology → tambah role opsional, `aria-labelledby`, dan pakai `role="alert"` pada `app/error.tsx`. |
| Search input → long query/mobile action | Query diterima tanpa batas render server dan input masih berupa text generik → edge case string sangat panjang dapat menurunkan kualitas tampilan/pencarian; keyboard mobile tidak mendapat action hint → batasi 120 karakter pada UI dan server render, gunakan `type="search"` serta `enterKeyHint="search"`. |
| Publication badge → status variants | Status CMS dibentuk sebagai span generik per halaman → tidak ada API/naming/variant terpusat → mudah terjadi drift ketika status bertambah → buat `StatusBadge` dengan variant draft/review/published/archived berbasis token semantik. |

### Low

| Component → Variant/State | Problem → Cause → Impact → Solution |
|---|---|
| Decorative icons → accessibility tree | Beberapa ikon di navigation/footer/admin masih terekspos walau adjacent text/label sudah menjelaskan aksi → `aria-hidden` tidak konsisten → nama aksesibel dapat menjadi lebih berisik → tandai ikon dekoratif dengan `aria-hidden="true"`; icon-only control tetap mempunyai `aria-label`. |
| Preview fields → input purpose/edge | Field preview tidak mempunyai `name`, autocomplete hint, atau panjang maksimum → markup awal hanya untuk visual → keyboard/autofill dan behavior string panjang tidak konsisten → tambah purpose/name/autocomplete/maxLength tanpa mengaktifkan pengiriman data. |
| Admin warning → announcement | Notifikasi read-only pada form baru tidak mempunyai status role → styling tersedia tetapi semantics tidak → perubahan mode dapat kurang jelas → tambah `role="status"`. |
| Admin icon button → light surface | Variant icon-button berasal dari header gelap sehingga boundary hampir hilang di admin header putih → tidak ada contextual variant → affordance logout lemah → tambahkan variant scoped `[data-admin-root]` memakai token control/action yang sudah ada. |
| Button/card → pressed motion | Hover transform tidak selalu kembali konsisten pada active dan reduced-motion focus → state aktif diturunkan dari aturan hover terpisah → feedback terasa tidak seragam → normalisasi `:active`, disabled, dan reduced-motion di layer komponen. |

## D. Perubahan yang diterapkan

1. Menambahkan `PreviewForm` sebagai satu guard non-submit untuk seluruh form simulasi publik.
2. Menambahkan `DonationPreviewForm` dengan state nominal nyata, `aria-pressed`, radio values, custom-amount reset, field purpose, dan batas input.
3. Memperbaiki search control menjadi native search dengan action hint dan kontrak panjang query 120 karakter pada client/server render.
4. Menambahkan current route state pada `AdminNav` tanpa mengubah item atau arsitektur navigasi.
5. Menambahkan `StatusBadge` dan `count-badge` pada collection admin.
6. Menambahkan role/heading association pada `PageState` dan alert semantics pada runtime error.
7. Menormalkan decorative icons, admin warning status, dan icon-button light-context.
8. Menambahkan `components-audit-v7.css` sebagai layer terakhir khusus state komponen.
9. Menambahkan `scripts/check-ui-components.mjs` dan command `npm run components:audit`.

## E. Hasil accessibility

- Current state tersedia secara visual dan programmatic (`aria-current="page|location"`, `aria-pressed`, native `checked`, native `disabled`).
- Drawer tetap mempertahankan dialog semantics, fokus awal, Tab loop, Escape, focus return, route close, dan scroll lock dari audit navigation sebelumnya.
- Desktop disclosure tetap memakai `aria-expanded`/`aria-controls`; popover mempertahankan Arrow Up/Down, Home/End, Escape, click-outside, dan focus return.
- Full-card links memperoleh focus-visible yang setara dengan hover tanpa menghapus outline global 3 px.
- Form memakai native label/fieldset/legend/radio dan touched-invalid state `:user-invalid`; tidak ada custom control yang menggantikan semantik native.
- Icon-only action tetap memiliki accessible name; ikon dekoratif tidak lagi menambah nama ganda.
- Touch target komponen penting tetap minimal 44–50 px sesuai kontrak responsive terdahulu.
- Motion state baru menghormati `prefers-reduced-motion`.

## F. Hasil consistency

- State naming yang dipakai: `.is-active`, `[aria-current]`, `[aria-pressed="true"]`, `:disabled`, `:user-invalid`, `:focus-visible`.
- Status memakai pola `status-badge-{status}`; feedback memakai token `--color-status-*`.
- Preview behavior tidak lagi tersebar pada halaman kontak dan donasi.
- CSS baru tidak memperkenalkan breakpoint, type scale, layout primitive, atau palette baru.
- Tidak ada konten contoh, foto, nominal, statistik, testimonial, kartu, atau bagian halaman yang dihapus.

## G. Final component system

| Component | Variants | States | Usage |
|---|---|---|---|
| `Navbar` | desktop disclosure, desktop CTA/search, mobile drawer/accordion | default, current, expanded, focused, open/closed | seluruh halaman publik |
| `AdminNav` | permission-filtered links | default, hover, focus, current | protected admin shell |
| `SectionNavigation` | page/location | default, focus, current | sibling/subsection navigation |
| `Breadcrumbs` | linked/current item | default, focus, current | detail/document routes |
| Buttons/CTAs | primary, secondary, ink, outline, light, dark, icon | default, hover, focus, active, disabled/current where applicable | public/admin actions |
| Linked cards | program, search, published, continuation, accountability | default, hover, focus | navigation-heavy card collections |
| `PreviewForm` | contact/donation wrapper | editing, invalid-after-use, guarded submit | public simulation forms |
| `DonationPreviewForm` | preset/custom amount | checked, pressed, focused, disabled transaction | donation preview |
| Search form | native GET search | empty, filled, result, no-result | `/cari` |
| `StatusBadge` | draft, review, published, archived | static status | admin content collections |
| `PreviewNotice`/status messages | preview, success, warning, error, info | static/live role per context | public/admin feedback |
| `EmptyState`/`PageState` | empty, 404, runtime error | status/alert/action | zero-result and system states |
| Loading skeleton | route loading | `aria-busy`, polite live label | App Router loading boundary |

## H. Regression result

| Pemeriksaan | Hasil |
|---|---|
| ESLint (`--max-warnings=0`) | PASS |
| TypeScript (`tsc --noEmit`) | PASS |
| Production build, 36 static/dynamic route outputs | PASS |
| Audit 07 component contracts | PASS — 39 checks |
| Production SSR smoke | PASS — 22 public routes + donation/contact/search contracts |
| Audit 01–03 content/integrity | PASS |
| Audit 04 responsive, 33 viewport cases | PASS |
| Audit 05 color, 27 contrast pairs + invariants | PASS |
| Audit 06 typography, 27 checks + 15 viewport hierarchy cases | PASS |
| Local browser target | Tidak dapat dijadikan bukti — cloud browser memblokir loopback (`ERR_BLOCKED_BY_CLIENT`) |
| Branch preview deployment | PASS — Vercel `Ready` pada commit Audit 07 terbaru |
| Branch preview interaction | Tidak dapat dijadikan bukti — deployment dilindungi Vercel SSO dan koneksi browser tidak memiliki scope login project |

## I. Verdict

**UI COMPONENTS OPTIMAL** untuk scope komponen yang benar-benar tersedia, berdasarkan source review, semantic/keyboard contract, lint, typecheck, build produksi, production SSR smoke, serta seluruh audit otomatis. Verifikasi klik visual branch preview belum dapat dijadikan bukti karena deployment dilindungi Vercel SSO dan browser cloud tidak dapat mengakses loopback; keterbatasan tersebut tidak disamarkan sebagai hasil lulus.
