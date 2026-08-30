# Audit 09 — Accessibility

Tanggal audit: 30 Agustus 2026

Branch: `codex/audit-09-accessibility`

Status integrasi: branch audit / Draft PR bertumpuk di atas Audit 08 — **tidak di-merge ke `main` dan tidak dipromosikan ke production**

## Ruang lingkup, target, dan metode

Baseline audit adalah **WCAG 2.2 Level A dan AA** dengan empat prinsip Perceivable, Operable, Understandable, dan Robust. Audit 01–08 diperlakukan final; perubahan dibatasi pada aksesibilitas dan tidak mengubah information architecture, menu, layout, breakpoint, warna, tipografi, desain komponen, CTA strategy, maupun konten contoh.

Bukti diperoleh melalui inspeksi source, accessibility tree browser, penelusuran keyboard pada production sebelum perbaikan, pemeriksaan computed focus style, pengujian kontrak otomatis, build production lokal, serta runtime smoke pada 15 route/template: beranda, informasi, program, detail program, kegiatan, berita, galeri, kontak, donasi, dua state pencarian, transparansi, aksesibilitas, admin login, dan 404. Pengujian perangkat lunak screen reader nyata (NVDA/VoiceOver/TalkBack), zoom browser nyata 200%, dan caption/transkrip yang dikendalikan player TikTok tidak tersedia di environment audit; area tersebut dicatat sebagai keterbatasan, bukan diasumsikan lulus.

## A. WCAG coverage

| WCAG criterion | Status | Evidence | Action |
|---|---|---|---|
| 1.1.1 Non-text Content (A) | Pass untuk konten yang diuji | Seluruh `Image` memiliki `alt`; ikon dekoratif tersembunyi; 4 iframe memiliki title dan ringkasan tekstual terkait. Runtime 15 route tidak menemukan image tanpa alt. | Relasi ringkasan video ditambahkan dengan `aria-describedby`. |
| 1.2.2 Captions (Prerecorded) (A) | Belum terverifikasi | Caption berada di player TikTok pihak ketiga dan tidak dapat dipastikan dari DOM aplikasi. | Verifikasi setiap video di akun sumber sebelum pernyataan kesiapan final; sediakan caption/transkrip lokal bila sumber tidak memadai. |
| 1.2.3 Audio Description or Media Alternative (A) | Partial | Setiap video memiliki ringkasan konteks, tetapi bukan transkrip lengkap atau audio description. | Jadikan transkrip/deskripsi lengkap sebagai gate konten final. |
| 1.3.1 Info and Relationships (A) | Pass | Landmark, heading, form label, article label, page-state label/description, dan relasi error-input teridentifikasi secara programatik. | Memperbaiki relasi PageState, video, dan admin error. |
| 1.3.2 Meaningful Sequence (A) | Pass | Urutan DOM mengikuti urutan baca; nav desktop dan dialog mobile mempertahankan urutan fokus yang deterministik. | Tidak perlu perubahan struktur. |
| 1.4.3 Contrast Minimum (AA) | Pass | Regresi Audit 05 lulus pada 27 pasangan warna; focus outline tetap terlihat. | Tidak mengubah sistem warna. |
| 1.4.4 Resize Text (AA) | Partial | CSS tidak mengunci text scaling dan kontrak tipografi/responsif lulus; zoom browser nyata 200% belum dapat divalidasi di environment ini. | Lakukan validasi manual 200% pada browser/perangkat target sebelum rilis final. |
| 1.4.10 Reflow (AA) | Pass untuk viewport yang diuji | Kontrak responsif lulus pada 33 viewport dan runtime tidak menemukan horizontal overflow pada route yang diuji. | Tidak perlu mengubah breakpoint. |
| 1.4.11 Non-text Contrast (AA) | Pass | Regresi 27 pasangan termasuk boundary/control state lulus. | Tidak mengubah visual system. |
| 1.4.12 Text Spacing (AA) | Partial | Layout menggunakan sizing fleksibel dan tidak memotong teks pada viewport uji; override text-spacing ekstrem belum diuji dengan ekstensi khusus. | Uji bookmarklet text-spacing sebelum rilis final. |
| 2.1.1 Keyboard (A) | Pass | Link/button native; nav dapat dibuka Enter, Arrow Down memindah fokus, Escape menutup dan mengembalikan fokus; modal memiliki focus trap. | Mempertahankan native controls dan keyboard contract. |
| 2.1.2 No Keyboard Trap (A) | Pass | Escape recovery pada dropdown dan dialog; source/runtime contract memastikan jalur keluar. | Tidak diperlukan perubahan flow. |
| 2.4.1 Bypass Blocks (A) | Pass setelah perbaikan | Sebelum perbaikan hash berubah tetapi fokus tetap di `body`; kini target `main` memiliki `tabIndex={-1}` dan runtime memverifikasinya pada 15 route. | Memperbaiki target skip link publik dan admin. |
| 2.4.2 Page Titled (A) | Pass | Semua route memiliki title; 404 kini memiliki title dan description khusus. | Menambahkan metadata 404. |
| 2.4.3 Focus Order (A) | Pass | Urutan fokus mengikuti DOM dan dropdown mengembalikan fokus ke trigger saat Escape. | Tidak perlu perubahan layout. |
| 2.4.4 Link Purpose in Context (A) | Pass | Tautan kegiatan, berita, profil, dan video berulang sekarang memiliki accessible name yang spesifik. | Menambahkan `aria-label` kontekstual. |
| 2.4.7 Focus Visible (AA) | Pass | Pemeriksaan computed style menunjukkan outline 3 px dengan offset 3 px; global source contract tetap aktif. | Tidak mengubah focus design. |
| 2.4.11 Focus Not Obscured Minimum (AA) | Pass untuk state yang diuji | Header/dialog mengelola fokus dan scrolling; focus indicator tidak tertutup pada alur desktop yang diuji. | Pertahankan kontrak focus management. |
| 2.5.8 Target Size Minimum (AA) | Pass untuk kontrol utama | Kontrak komponen mempertahankan target interaktif utama 44–50 px; link inline/terpisah memiliki pengecualian spacing/context yang relevan. | Tidak mengubah dimensi komponen. |
| 3.1.1 Language of Page (A) | Pass | `<html lang="id">` terdeteksi pada seluruh route runtime. | Tidak diperlukan perubahan. |
| 3.2.1 On Focus (A) | Pass | Tidak ada navigasi atau submit otomatis ketika elemen menerima fokus. | Tidak diperlukan perubahan. |
| 3.2.2 On Input (A) | Pass | Input tidak memicu perpindahan context tanpa aksi eksplisit. | Tidak diperlukan perubahan. |
| 3.3.1 Error Identification (A) | Pass setelah perbaikan | Admin error memakai `role="alert"`; input memiliki `aria-invalid` dan `aria-describedby` saat kredensial salah. Error/recovery state publik tetap eksplisit. | Menghubungkan error dengan field yang relevan. |
| 3.3.2 Labels or Instructions (A) | Pass | Input pencarian/admin dan form preview memiliki label/instruksi; required state menggunakan native attribute. | Tidak diperlukan perubahan form flow. |
| 4.1.2 Name, Role, Value (A) | Pass setelah perbaikan | Audit awal menemukan `aria-controls` menuju elemen yang belum dirender. Kini atribut hanya ada saat panel terpasang; semua IDREF runtime ter-resolve. | Memperbaiki state/relationship nav dan accessible names. |
| 4.1.3 Status Messages (AA) | Pass | Status/error memakai live semantics (`role=status`/`alert`) tanpa memaksa perpindahan fokus. | Mempertahankan mekanisme announcement. |

Status `Partial` berarti bukti yang tersedia belum cukup untuk menyatakan Pass, bukan kegagalan task utama yang sudah teridentifikasi.

## B. Accessibility issues

### Critical

Tidak ditemukan hambatan Critical pada route dan task yang diuji.

### High

| Criterion → element → problem → evidence → impact → fix | Status |
|---|---|
| 2.4.1 → skip link / `#main-content` → aktivasi hanya mengubah hash, fokus tetap pada `body` → pengujian keyboard production sebelum perbaikan → pengguna keyboard/screen reader harus menelusuri header berulang → tambahkan `tabIndex={-1}` pada `main` publik dan admin. | Fixed |

### Medium

| Criterion → element → problem → evidence → impact → fix | Status |
|---|---|
| 4.1.2 → tombol dropdown dan menu mobile → `aria-controls` menunjuk panel yang belum ada ketika tertutup → cross-page DOM/IDREF audit pada seluruh template → teknologi bantu menerima relationship rusak → render atribut hanya ketika panel terkait terpasang. | Fixed |
| 1.3.1 / 4.1.2 → trigger dropdown aktif → current section hanya dikomunikasikan secara visual → inspeksi accessibility tree/source → pengguna screen reader kehilangan konteks lokasi → tambah `aria-current="location"`. | Fixed |
| 3.3.1 / 4.1.2 → input kunci admin → pesan invalid tidak terkait langsung dengan field → source inspection → pengguna dapat mendengar error tanpa mengetahui field terkait → tambah `aria-invalid` dan conditional `aria-describedby`. | Fixed |
| 2.4.2 → halaman 404 → title generik organisasi → runtime/title audit → tab/history tidak menjelaskan state error → metadata 404 khusus. | Fixed |

### Low

| Criterion → element → problem → evidence → impact → fix | Status |
|---|---|
| 2.4.4 → tautan kartu kegiatan/berita/video → accessible name berulang dan terlalu umum dalam daftar link → link-list inspection → navigasi link screen reader kurang efisien → label kontekstual berbasis judul konten. | Fixed |
| 1.3.1 → kartu TikTok dan PageState → judul/ringkasan terlihat tetapi relasi programatik belum eksplisit → accessibility-tree inspection → konteks iframe/article kurang kuat → tambah `aria-labelledby`/`aria-describedby`. | Fixed |

### Keterbatasan yang masih terbuka

- Caption, transkrip lengkap, dan audio description video TikTok belum dapat diverifikasi dari aplikasi karena dikendalikan platform pihak ketiga.
- Pengujian dengan NVDA, VoiceOver, atau TalkBack nyata belum dilakukan; hasil screen reader di bawah menggunakan browser accessibility tree dan semantic inspection.
- Zoom browser nyata 200% dan override text-spacing ekstrem belum tervalidasi di environment browser audit.

## C. Keyboard test result

| Test | Result |
|---|---|
| Tab navigation | Pass — skip link menjadi elemen pertama dan kontrol native dapat dicapai. |
| Shift+Tab | Pass — urutan balik mengikuti DOM; source contract focus trap mempertahankan siklus dialog. |
| Enter | Pass — membuka dropdown dan menjalankan link/button native. |
| Space | Pass — button, radio, dan kontrol native mempertahankan perilaku browser. |
| Escape | Pass — dropdown menutup dan fokus kembali ke trigger; dialog mobile memiliki recovery yang sama. |
| Arrow keys | Pass — Arrow Down dari trigger dropdown memindahkan fokus ke item pertama. |
| Focus visibility | Pass — outline 3 px dengan offset 3 px terukur. |
| Focus order | Pass — urutan DOM, panel, dan recovery fokus deterministik. |
| Keyboard trap | Pass — tidak ditemukan trap tanpa jalan keluar. |

Interaksi dropdown desktop diuji langsung pada production sebelum perbaikan. Perilaku modal mobile pascaperubahan divalidasi melalui source contract dan regression suite karena preview PR dilindungi autentikasi deployment.

## D. Screen reader test result

| Area | Result |
|---|---|
| Page title | Pass — title spesifik per route dan 404. |
| Headings | Pass — satu `h1` per template runtime dengan struktur heading semantik. |
| Landmarks | Pass — satu `main`, header/navigation, dan footer/contentinfo yang konsisten. |
| Links | Pass — tujuan dapat dipahami; link berulang memiliki nama kontekstual. |
| Buttons | Pass — elemen native memiliki name dan expanded state. |
| Forms | Pass — label, required state, invalid state, dan error relationship tersedia. |
| Images | Pass — alt tersedia; ikon dekoratif disembunyikan. |
| Dialogs | Pass berdasarkan accessibility tree/source — name, modal state, focus containment, Escape, dan focus return tersedia. |
| Dynamic content | Pass — status memakai live semantics tanpa focus hijack. |
| Error messages | Pass — alert, description, retry, dan recovery path dapat dikenali. |

Hasil ini bukan klaim validasi dengan perangkat lunak screen reader nyata. Metode yang digunakan adalah browser accessibility tree, semantic source inspection, keyboard interaction, dan runtime DOM contracts. Timed-media TikTok tetap `Partial` sebagaimana dicatat pada bagian A dan B.

## E. Semantic HTML result

- **Correct semantics:** header, nav, main, section, article, footer, heading, list, link, button, form, label, fieldset/legend yang relevan, dan native input digunakan sesuai fungsi.
- **Incorrect semantics:** tidak ditemukan custom clickable `div`/`span`; relasi semantik yang kurang pada PageState dan kartu TikTok sudah diperbaiki.
- **Unnecessary custom controls:** tidak ditemukan; interaksi utama memakai elemen native.
- **Unnecessary ARIA:** tidak ditemukan ARIA yang menggantikan semantic native. Penggunaan ARIA dibatasi pada state, relationship, current location, dialog, status, dan error yang tidak cukup diekspresikan oleh HTML native saja.

## F. ARIA audit

- **ARIA yang benar:** `aria-expanded`, conditional `aria-controls`, `aria-current`, dialog name/modal relationship, `aria-live`, `role=status/alert`, `aria-invalid`, `aria-describedby`, dan decorative `aria-hidden`.
- **ARIA yang tidak diperlukan:** tidak ada temuan yang perlu dipertahankan; kontrol native tidak diberi role duplikat.
- **ARIA yang salah:** IDREF `aria-controls` menuju panel yang tidak terpasang telah diperbaiki.
- **Missing state:** current dropdown section dan invalid admin input telah ditambahkan.
- **Missing relationship:** PageState title-description, TikTok article-description, dan admin input-error telah ditambahkan.
- Runtime gate memastikan seluruh ARIA IDREF yang dirender menunjuk ID yang tersedia.

## G. Fixes implemented

1. Membuat target skip link benar-benar focusable pada seluruh route publik dan admin.
2. Menghindari broken ARIA IDREF dengan hanya merender `aria-controls` ketika panel nav terpasang.
3. Mengkomunikasikan current section pada trigger dropdown menggunakan `aria-current="location"`.
4. Menghubungkan PageState dengan judul dan deskripsinya secara eksplisit.
5. Menghubungkan invalid credential alert dengan input admin dan menandai invalid state.
6. Memberi article name, iframe description, dan link name unik pada seluruh video TikTok.
7. Memberi accessible name kontekstual pada link kegiatan, berita contoh, dan profil TikTok.
8. Menambahkan title dan description khusus untuk halaman 404.
9. Menambahkan 49 source accessibility contracts dan runtime cross-page gate untuk semantic/ARIA/media/link invariants.

Tidak ada konten, data, gambar, video, CTA, atau form contoh yang dihapus. Tidak ada layout, breakpoint, warna, tipografi, maupun desain komponen yang diubah.

## H. Regression result

| Pemeriksaan | Target | Hasil |
|---|---|---|
| Accessibility source | 49 semantic, focus, ARIA, form, media, dan naming contracts | PASS |
| Accessibility runtime | 15 route/template + 404/media/link contracts | PASS |
| Cross-page landmarks | `lang=id`, satu `main`, satu `h1`, title, skip target, alt, iframe relation | PASS |
| Rendered ARIA IDREF | Seluruh reference menunjuk ID yang tersedia | PASS |
| Component runtime | 22 route + donation/contact/search/recovery contracts | PASS |
| ESLint | Zero warning | PASS |
| TypeScript | Zero type error | PASS |
| Production build | 36 output berhasil dibangun | PASS |
| Audit 01 / integrity | IA/content guard | PASS |
| Audit 02–03 | Navigation, layout, dan visual structure | PASS |
| Audit 04 | 33 responsive viewport cases | PASS |
| Audit 05 | 27 contrast pairs | PASS |
| Audit 06 | Typography contracts | PASS |
| Audit 07 | 44 UI component contracts | PASS |
| Audit 08 | 26 UX flow contracts | PASS |
| Media/footer | 7 local images, 4 TikTok players, 23 footer contracts | PASS |
| Konten contoh | Tidak dihapus atau dikurangi | PASS |
| Main / production | Tidak diubah pada audit ini | PASS |

## Final verdict

**ACCESSIBILITY IMPROVED**

Seluruh temuan High–Low yang dapat direproduksi pada aplikasi telah diperbaiki dan tidak ditemukan hambatan Critical pada task yang diuji. Verdict belum dinaikkan menjadi `ACCESSIBILITY READY` karena caption/transkrip media pihak ketiga, penggunaan screen reader nyata, zoom browser 200%, dan override text-spacing ekstrem masih memerlukan validasi manual pada perangkat target. Tidak ada klaim “100% WCAG compliant”.
