# Audit 04: Responsive Design

Tanggal audit: 29 Agustus 2026

Branch kumulatif: `codex/audit-series`

Basis: Audit 03 (`3869ee1`)

Status: selesai, belum digabungkan ke `main`

## A. Ruang lingkup dan batas perubahan

Audit ini hanya menilai perilaku responsive: fluidity, breakpoint, orientasi, tinggi viewport, overflow, grid/flex, media, teks panjang, zoom/text scaling, form, touch target, serta kesinambungan desktop–tablet–mobile.

Audit tidak mengubah information architecture, menu, urutan section, hierarchy konten, copy, data, foto, atau keputusan layout yang telah disahkan pada Audit 01–03. Seluruh data dan foto contoh dipertahankan. Tidak ada PR, merge ke `main`, atau promosi production.

## B. Ringkasan eksekutif

Audit menemukan tiga masalah responsive berdampak tinggi.

Pertama, primitive `.shell` memakai gutter total 32 piksel hingga 767 piksel lalu langsung berubah menjadi 64 piksel pada 768 piksel. Akibatnya, container menyusut dari sekitar 735 menjadi 704 piksel ketika viewport justru bertambah satu piksel. Diskontinuitas ini memengaruhi semua halaman.

Kedua, hero memiliki minimum height 700 piksel tetapi hanya dibebaskan pada lebar maksimum 680 piksel. Pada tablet 768–900 piksel layout sudah menjadi satu kolom, namun floor desktop tetap aktif. Pada mobile landscape 800–896 piksel, hero menjadi tumpukan panjang; pada 932 piksel hero tetap dua kolom tetapi masih membawa tinggi desktop. Ini adalah penyebab utama komposisi yang tidak proporsional pada short viewport.

Ketiga, aturan responsive belum memiliki kontrak khusus untuk orientasi landscape dan low-height desktop pada komponen `.trust-*` yang aktif. Header, hero, page hero, kolase, dan closing CTA menggunakan ukuran portrait/desktop biasa walaupun tinggi layar hanya 360–430 piksel.

Perbaikan mengganti gutter diskret menjadi gutter fluid 32–64 piksel, membebaskan tinggi hero ketika layout bertumpuk, menambah mode compact berdasarkan tinggi/orientasi, mempertahankan hero dua kolom pada mobile landscape yang cukup lebar, memperkuat shrink behavior dan long-text wrapping, memperbesar target sentuh form, serta memperbaiki `sizes` untuk gambar tablet. Seluruh perubahan bersifat responsive dan content-preserving.

## C. Temuan prioritas

### Critical

Tidak ditemukan kerusakan source atau breakpoint yang selalu membuat seluruh situs tidak dapat digunakan. Korupsi visual Android pada bukti screenshot diperlakukan sebagai risiko tinggi karena muncul setelah scroll, tetapi tidak dikategorikan critical tanpa reproduksi browser branch yang deterministik.

### High

| Viewport | Masalah | Penyebab | Efek | Solusi |
|---|---|---|---|---|
| 767 → 768px, seluruh halaman | Container menyusut saat viewport membesar | `.shell` berubah dari gutter 32px ke 64px tepat pada 768px | Alignment bergeser, card reflow mendadak, transisi tablet terasa patah | Satu rumus `clamp(2rem, 5vw, 4rem)` untuk gutter total kontinu |
| 768×1024, 820×1180, 834×1194 | Hero sudah satu kolom tetapi tetap memiliki floor 700px | Breakpoint grid berada di 900px, reset `min-height` sebelumnya baru aktif di 680px | Ruang vertikal berlebih dan first screen terlalu panjang | Reset `min-height:auto` pada seluruh viewport ≤900px |
| 800×360, 812×375, 844×390, 896×414 | Hero menjadi tumpukan portrait panjang pada layar sangat pendek | Responsive hanya mempertimbangkan width, bukan height/orientation | Konten utama dan kolase membutuhkan scroll berlebihan; tekanan compositing meningkat | Kontrak landscape ≤560px; header 76px, rhythm compact, dan hero dua kolom pada width 720–900px |
| 932×430 dan short tablet landscape | Hero dua kolom tetap memakai min-height/padding desktop | Tidak ada override komponen aktif untuk short viewport | Hero mendominasi layar dan konten berikutnya terlambat terlihat | Lepas floor height, kecilkan padding/media secara proporsional tanpa menyembunyikan konten |

### Medium

| Viewport | Masalah | Penyebab | Efek | Solusi |
|---|---|---|---|---|
| 1366×650 dan desktop low-height | Hero dipaksa minimal 700px di bawah header 98px | Height desktop tidak mempertimbangkan tinggi jendela | First section selalu melebihi viewport walau lebarnya cukup | Gunakan `calc(100svh - 98px)` sebagai floor adaptif dan compact media/padding |
| 681–1120px, grid kegiatan | Browser diberi ukuran sumber 25vw untuk kartu yang tampil sekitar 50vw | Atribut `sizes` masih mengikuti grid lama empat kolom | Gambar tablet dapat dipilih terlalu kecil dan terlihat kurang tajam | Tambah sumber 50vw hingga 1120px dan 33vw di atasnya |
| 681–900px, mini hero | Browser diberi 20vw saat dua mini-image tampil sekitar setengah kolom penuh | Kondisi `sizes` berhenti pada 680px | Kandidat gambar berpotensi terlalu kecil pada tablet stacked hero | Perluas kondisi 50vw hingga 900px |
| Form donasi, seluruh touch viewport | Radio label dan amount button dapat kurang dari 44px | Padding menentukan tinggi tanpa minimum touch target | Area sentuh kurang konsisten pada ponsel dan text scaling | Tetapkan minimum 48px; report control minimum 44px |
| Zoom/text scaling dan data panjang | Sebagian grid/flex child belum memiliki `min-width:0`; wrapping tidak dinyatakan di semua shell aktif | Default min-content sizing dapat menahan kolom | Teks panjang, email, role, atau heading dapat mendorong lebar halaman | Tambah shrink contract, `overflow-wrap:anywhere`, dan batas media/form 100% |

### Low

| Viewport | Masalah | Penyebab | Efek | Solusi |
|---|---|---|---|---|
| ≤680px | Cascade terakhir mengembalikan `overflow-x:hidden` | Hotfix lama menutup overflow secara global | Sumber overflow sulit didiagnosis dan scroll containment lebih agresif | Gunakan `clip` hanya sebagai guard; perbaiki child width/min-width sebagai sumber utama |
| 901px dan 1121px | Grid/navigation berubah tepat pada breakpoint | Perubahan mode memang diskret | Perubahan terlihat, tetapi container tidak boleh ikut meloncat | Pertahankan mode breakpoint; fluid gutter memastikan width tetap kontinu |
| Stylesheet responsive | Terdapat 69 blok `@media` dari layer historis | Stylesheet lama dikonsolidasikan dengan cascade order lama | Biaya pemeliharaan lebih tinggi dan risiko override berulang | Audit 04 menempatkan kontrak aktif dalam satu blok dan test otomatis; refactor besar ditahan agar tidak membuka ulang keputusan Audit 01–03 |

## D. Perubahan yang diterapkan

1. Mengganti dua aturan `.shell` dengan satu gutter fluid `clamp(2rem, 5vw, 4rem)` serta `min-width:0`.
2. Menghapus floor 700 piksel pada hero stacked di seluruh viewport maksimum 900 piksel.
3. Menambah kontrak low-height desktop maksimum 720 piksel tanpa fixed clipping.
4. Menambah kontrak mobile/tablet landscape maksimum 560 piksel: header 76 piksel, offset hero/drawer/page state yang sama, padding hero/page hero lebih ringkas, dan media lebih proporsional.
5. Mempertahankan komposisi hero dua kolom pada landscape 720–900 piksel karena ruang inline mencukupi; seluruh copy, CTA, assurance, dan tiga foto tetap tampil.
6. Menurunkan minimum closing CTA menjadi 360 piksel hanya pada short landscape; konten tetap dapat memperbesar section secara alami.
7. Menambah `min-width:0` pada child layout utama, wrapping teks panjang, serta batas inline untuk gambar, SVG, input, select, dan textarea.
8. Mengubah guard mobile dari `overflow-x:hidden` menjadi `overflow-x:clip` pada cascade terakhir. Guard tidak dipakai sebagai pengganti perbaikan sumber overflow.
9. Menetapkan target sentuh 48 piksel pada pilihan program/nominal dan 44 piksel pada report control.
10. Mengoreksi `sizes` kolase hero dan kegiatan agar sesuai dengan grid tablet/desktop final.
11. Menambah `npm run responsive:audit` sebagai pemeriksaan kontrak yang dapat diulang pada audit berikutnya.

## E. Matriks viewport final

Status “lulus kontrak” berarti source final, cascade, gutter, mode navigation, tinggi header, dan mode hero telah diperiksa oleh test otomatis. Ini bukan klaim pixel-diff browser.

| Viewport | Shell final | Navigation/header | Hero final | Verdict |
|---|---:|---|---|---|
| 1920×1080 | 1240px | desktop / 98px | 2 kolom | Lulus kontrak |
| 1600×900 | 1240px | desktop / 98px | 2 kolom | Lulus kontrak |
| 1440×900 | 1240px | desktop / 98px | 2 kolom | Lulus kontrak |
| 1366×768 | 1240px | desktop / 98px | 2 kolom | Lulus kontrak |
| 1280×800 | 1216px | desktop / 98px | 2 kolom | Lulus kontrak |
| 1024×768 | 972.8px | drawer / 88px | 2 kolom | Lulus kontrak |
| 1024×1366 | 972.8px | drawer / 88px | 2 kolom | Lulus kontrak |
| 834×1194 | 792.3px | drawer / 88px | stacked, height auto | Lulus kontrak |
| 820×1180 | 779px | drawer / 88px | stacked, height auto | Lulus kontrak |
| 768×1024 | 729.6px | drawer / 88px | stacked, height auto | Lulus kontrak |
| 430×932 | 398px | drawer / 86px | stacked, height auto | Lulus kontrak |
| 414×896 | 382px | drawer / 86px | stacked, height auto | Lulus kontrak |
| 390×844 | 358px | drawer / 86px | stacked, height auto | Lulus kontrak |
| 375×812 | 343px | drawer / 86px | stacked, height auto | Lulus kontrak |
| 360×800 | 328px | drawer / 86px | stacked, height auto | Lulus kontrak |
| 932×430 | 885.4px | drawer / 76px | 2 kolom compact | Lulus kontrak |
| 896×414 | 851.2px | drawer / 76px | 2 kolom compact | Lulus kontrak |
| 844×390 | 801.8px | drawer / 76px | 2 kolom compact | Lulus kontrak |
| 812×375 | 771.4px | drawer / 76px | 2 kolom compact | Lulus kontrak |
| 800×360 | 760px | drawer / 76px | 2 kolom compact | Lulus kontrak |
| 1366×1024, 1194×834, 1180×820 | 1121–1240px | desktop / 98px | 2 kolom | Lulus kontrak |
| 1366×650 | 1240px | desktop / 98px | 2 kolom low-height | Lulus kontrak |

### Transisi breakpoint

| Transisi | Shell sebelum | Shell sesudah | Hasil |
|---|---:|---:|---|
| 767 → 768px | 728.65px | 729.60px | Kontinu; naik 0.95px |
| 899 → 900px | 854.05px | 855px | Kontinu; mode tetap stacked |
| 900 → 901px | 855px | 855.95px | Kontinu; hero berubah ke 2 kolom tanpa width jump |
| 1119 → 1120px | 1063.05px | 1064px | Kontinu; drawer tetap aktif |
| 1120 → 1121px | 1064px | 1064.95px | Kontinu; navigation berubah ke desktop |

## F. Regresi dan retensi

- Seluruh lima program, empat kegiatan contoh, berita, testimoni, statistik, foto, laporan simulasi, form, CTA, dan copy lama tetap berada di source.
- Tidak ada `display:none`, conditional rendering, pemotongan array, atau penghapusan item yang ditambahkan oleh Audit 04.
- Header desktop tetap 98 piksel dengan optical logo offset dari Audit 03; keluhan logo terlalu dekat ke atas tidak dibuka ulang.
- Drawer, hero, page hero, dan page state memakai offset header yang sama pada tiap mode.
- Fixed/sticky behavior tetap: drawer scrollable, navigation fixed, dan sticky card dinonaktifkan oleh breakpoint yang sudah ada ketika layout menjadi satu kolom.
- Gallery/archive mobile tetap memakai rasio 4:3 dari Audit 03; Audit 04 tidak mengubah crop atau menghapus foto.
- Form tetap satu/dua kolom sesuai ruang tersedia; field dapat shrink dan tidak bergantung pada fixed width.

## G. Validasi teknis

- `npm run responsive:audit`: lulus pada 33 kasus deklaratif, termasuk semua viewport wajib, landscape, low-height, dan titik sebelum/sesudah breakpoint.
- `npm run lint`: lulus tanpa warning.
- `npm run typecheck`: lulus.
- `npm run integrity`: lulus; data preview tetap terisolasi dan ditandai.
- `npm run build`: lulus; 36 halaman statis/dinamis berhasil dibuat oleh Next.js 16.3.3.
- Production SSR crawl lokal: 26 rute publik mengembalikan 200, halaman tidak dikenal mengembalikan 404, dan `/api/health` mengembalikan status `ok`.
- CSS syntax/cascade dikompilasi oleh production build; tidak ada warning CSS atau kegagalan Turbopack.
- Next Image review: seluruh media yang diubah tetap memakai `next/image`, `fill`, `alt`, dan responsive `sizes`.

Browser visual branch multi-viewport belum dinyatakan lulus pixel-level. Runner Chrome lokal tidak dapat diunduh karena validasi sertifikat `UnknownIssuer`; validasi TLS tidak dinonaktifkan. Bukti screenshot pengguna, source final, cascade contract, build, dan SSR digunakan untuk Audit 04. Preview deployment branch tetap menjadi visual gate pada akhir rangkaian audit atau segera setelah URL preview yang dapat diakses tersedia.

## H. RESPONSIVE AUDIT RESULT

**Verdict: LULUS SECARA SOURCE, CASCADE, BUILD, DAN SSR untuk ruang lingkup Audit 04; VISUAL PREVIEW BRANCH MASIH MENJADI GATE.**

Masalah responsif yang teridentifikasi telah diperbaiki tanpa menghapus atau menyembunyikan konten contoh. Width flow sekarang kontinu, tablet stacked hero tidak lagi membawa floor desktop, short landscape memiliki komposisi khusus, low-height desktop lebih proporsional, target sentuh dan long-text resilience diperkuat, dan source image selection mengikuti grid final.

Branch tetap `codex/audit-series`, belum digabungkan ke `main`, belum dibuatkan PR, dan siap menjadi basis kumulatif Audit 05.
