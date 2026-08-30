# Audit 06 — Typography

Tanggal audit: 30 Agustus 2026  
Ruang lingkup: tipografi publik dan komponen bersama  
Status: diterapkan pada branch audit; **belum digabungkan ke `main`**

Audit ini bersifat murni tipografi. Struktur informasi, navigasi, layout, grid, container, spacing, breakpoint, warna, branding, isi, data contoh, dan gambar contoh tidak dihapus atau didesain ulang.

## A. Kondisi awal

Sistem awal sudah memiliki arah visual yang baik: Inter dipakai untuk body/UI dan Plus Jakarta Sans untuk display/judul. Keduanya dimuat melalui `next/font/google` dengan `display: "swap"`, subset Latin, CSS variable, dan fallback sistem. Masalah utama bukan pemilihan font, melainkan skala dan penerapannya yang terfragmentasi pada banyak generasi stylesheet.

Baseline produksi diperiksa pada halaman beranda, berita, donasi, aksesibilitas/dokumen, dan footer. Contoh nilai computed sebelum perbaikan:

| Permukaan | Nilai awal | Dampak |
| --- | ---: | --- |
| H1 beranda desktop | 74.97 px / weight 900 / tracking -4.8 px | Terlalu rapat dan memakai bobot di luar kebijakan heading |
| H1 halaman berita | 62 px / weight 900 | Hierarki kuat, tetapi tidak memakai token bersama |
| Body hero | 16.36 px / line-height 28.95 px | Sudah cukup terbaca dan dipertahankan secara konseptual |
| Eyebrow hero | 10.24 px / weight 850 / tracking 1.33 px | Terlalu kecil dan terlalu renggang |
| Body kartu program | 12.16 px | Terlalu kecil untuk teks informatif |
| Metadata kegiatan | 9.12 px | Sulit dibaca pada mobile dan layar beresolusi tinggi |
| Metadata berita | 8.8 px | Di bawah ambang mikro-teks yang layak |
| Tautan footer | 12.48 px | Kurang nyaman untuk pemindaian cepat |
| Footer bottom | 10.56 px | Terlalu kecil |
| Input donasi | 10.24 px / weight 800 | Kritis: sulit dibaca dan berisiko memicu zoom otomatis iOS |
| Label form | 10.24 px | Terlalu kecil untuk informasi transaksi |
| Body dokumen | 14.72 px / line-height 26.79 px | Ritme cukup, tetapi ukuran dasar belum ideal |
| Body dokumen mobile | 13.76 px | Terlalu kecil untuk bacaan panjang |

Inventaris source awal juga menunjukkan akumulasi deklarasi dari audit sebelumnya:

- 98 deklarasi `font-weight: 900`/shorthand 900.
- 50 deklarasi `font-weight: 850`/shorthand 850.
- 149 deklarasi `font-size` di bawah `0.7rem` pada dua stylesheet visual utama.
- 34 deklarasi tracking positif `0.10em` atau lebih.
- Ukuran teks tersebar dari `0.46rem` sampai display `clamp(...)` tanpa satu kontrak semantik yang mengikat seluruh permukaan.

## B. Typography inventory

### Font family dan loading

| Peran | Family | Sumber | Status |
| --- | --- | --- | --- |
| Body, UI, form, navigasi | Inter | `next/font/google` → `--font-inter` | Dipertahankan |
| Display, H1–H6, angka sorotan | Plus Jakarta Sans | `next/font/google` → `--font-plus-jakarta` | Dipertahankan |
| Fallback | `ui-sans-serif`, `system-ui`, `sans-serif` | Sistem operasi | Dipertahankan |

Jumlah family utama tetap dua. Tidak ada font dekoratif tambahan, `@import` remote, atau aset font yang tidak dipakai. `display: "swap"` tetap aktif untuk kedua family agar teks tidak menunggu font selesai dimuat.

### Weight awal

Weight yang muncul di source: 400, 500, 600, 650, 700, 750, 800, 850, dan 900. Variasi 650/750/850 digunakan langsung pada banyak komponen, sehingga role yang sama dapat terlihat berbeda dan sulit dijaga. Sistem final membatasi token ke 400, 500, 600, 700, dan 800.

### Role yang diaudit

- Display dan hero.
- H1, H2, H3, H4–H6.
- Lead, body, body-small, long-form.
- Eyebrow, overline, chip, caption, metadata.
- Navigasi desktop, drawer mobile, popover, breadcrumb, section/category navigation.
- Tombol, CTA, text link, status action.
- Label, legend, input, select, textarea, placeholder.
- Kartu program, kegiatan, berita, galeri, dampak, transparansi, organisasi, pencarian, empty state.
- Dokumen kebijakan, daftar, quote, blockquote, caption gambar.
- Angka dampak, persentase, nominal, urutan dokumen, dan metrik.
- Footer brand, link, kontak, dan legal bottom.

## C. Temuan audit

### Critical

1. Input donasi dan beberapa kontrol form tampil sekitar 10–14 px. Selain sulit dibaca, nilai di bawah 16 px berisiko memicu zoom otomatis pada Safari iOS.
2. Tidak ada kontrak yang memastikan kontrol form publik tetap 16 px ketika rule komponen yang lebih spesifik diterapkan.

### High

1. Judul memakai 850/900 secara luas, sementara sistem heading tidak menetapkan satu batas bobot. Pada Plus Jakarta Sans hal ini dapat menghasilkan clamping atau sintesis yang tidak konsisten antar-browser.
2. Caption dan metadata penting berada pada 7.36–11.84 px. Informasi tanggal, kategori, status, sumber, dan catatan menjadi terlalu lemah.
3. Teks informatif kartu umumnya 10.88–12.8 px. Ukurannya tidak sebanding dengan kepadatan konten.
4. Type scale responsif tersebar di banyak selector; role yang sama memiliki rumus `clamp()` berbeda.
5. Body dokumen mobile turun ke 13.76 px, tidak ideal untuk materi kebijakan dan aksesibilitas.

### Medium

1. Label uppercase memakai tracking hingga 0.16em pada ukuran sangat kecil, membuat bentuk kata terpecah secara visual.
2. CTA dan text link berada pada rentang 10.4–13.12 px dengan weight 800–900, sehingga hierarkinya lebih bergantung pada ketebalan daripada ukuran dan konteks.
3. Angka data belum konsisten memakai lining/tabular numerals; kolom persentase dan indeks dapat bergeser saat nilainya berubah.
4. Kebijakan wrapping belum merata. Judul panjang dan kata Indonesia yang panjang lebih mudah menghasilkan baris janggal.
5. Browser text scaling belum dinyatakan sebagai kontrak eksplisit.

### Low

1. Belum ada token tipografi semantik yang terdokumentasi.
2. Font pairing, fallback, dan loading sudah baik, tetapi belum dilindungi regression check.
3. Weight tidak terpakai dan weight role-specific sulit dibedakan karena banyak nilai literal.

### Pemisahan dari masalah non-tipografi

Temuan mengenai header geometry, drawer mobile, susunan grid, jarak section, warna, kontras, gambar, dan konten tidak ditangani di audit ini. Perbaikan drawer mobile dari audit sebelumnya tetap ada pada branch yang sama, tetapi Audit 06 tidak mengubah mekanismenya.

## D. Typography yang dipertahankan

- Inter sebagai body/UI karena netral, jelas, dan cocok untuk interface serta teks Indonesia.
- Plus Jakarta Sans sebagai heading karena karakter visualnya sudah selaras dengan identitas Ruang Sejahtera.
- Dua-family system; tidak menambah font baru.
- Kapitalisasi yang berasal dari isi tetap utuh. Hanya transformasi CSS pada elemen interaktif yang dinormalisasi bila mengganggu keterbacaan.
- Hierarki editorial besar pada hero dan section heading tetap kuat.
- Lebar baca 68ch yang sudah dimiliki layout dokumen tidak diubah.
- Semua konten, data contoh, gambar contoh, navigasi, dan branding dipertahankan.

## E. Perubahan yang diterapkan

1. Menambahkan lapisan khusus `typography-audit-v6.css` setelah stylesheet visual dan responsive yang sudah ada.
2. Menetapkan token font, weight, size, line-height, dan letter-spacing semantik.
3. Menormalisasi heading ke Plus Jakarta Sans weight 800 serta menonaktifkan font synthesis pada heading.
4. Menetapkan body 16 px / line-height 1.72 dan long-form 17 px / line-height 1.8 pada layar besar.
5. Menetapkan minimum caption/metadata 12 px dan body kartu informatif 15 px.
6. Menetapkan UI/action 14 px dengan weight 700 dan line-height 1.4.
7. Menetapkan semua input/select/textarea publik ke minimum 16 px, termasuk selector form yang sebelumnya lebih spesifik.
8. Membatasi tracking label uppercase ke 0.08em dan display tracking ke -0.045em.
9. Menambahkan `text-wrap: balance` pada heading, `text-wrap: pretty` pada body, dan `overflow-wrap: break-word` untuk ketahanan string panjang.
10. Menambahkan `tabular-nums lining-nums` pada nominal, statistik, persentase, urutan, dan metrik.
11. Menjaga browser text scaling dengan `text-size-adjust: 100%` dan `-webkit-text-size-adjust: 100%`.
12. Menggunakan breakpoint yang sudah ada (`680px` dan short landscape `1120px/560px`), tanpa menambah arsitektur responsive baru.
13. Menambahkan regression contract `npm run typography:audit`.

Lapisan baru tidak mendeklarasikan properti layout, spacing, color, border, shadow, atau positioning. Hal ini dilindungi oleh regression check.

## F. Readability & accessibility result

| Area | Sebelum | Sesudah | Hasil |
| --- | --- | --- | --- |
| Body utama | Tidak konsisten, banyak 12–15 px | 16 px / 1.72 | Lebih nyaman untuk baca berkelanjutan |
| Long-form desktop | 14.72 px | 17 px / 1.8 | Ritme dokumen lebih tenang |
| Long-form mobile | 13.76 px | 16 px / 1.72 | Tidak lagi mengecil di mobile |
| Caption/metadata | 7.36–11.84 px | Minimum 12 px / 1.5 | Informasi sekunder tetap terbaca |
| Body kartu | Umumnya 10.88–12.8 px | 15 px / 1.6 | Scanning dan comprehension membaik |
| Form control | Sekitar 10.24–13.76 px | 16 px / 1.5 | Mengurangi risiko auto-zoom iOS |
| UI/CTA | 10.4–13.12 px, sangat berat | 14 px / 700 / 1.4 | Label lebih jelas dan stabil |
| Tracking uppercase | Hingga 0.16em | Maksimum token 0.08em | Kata tidak terlalu terpecah |
| Angka/data | Proportional default | Tabular lining | Kolom dan perubahan nilai lebih stabil |
| Text scaling | Tidak eksplisit | 100% browser scaling dipertahankan | Mendukung preferensi pengguna |

Bahasa halaman tetap `id`, fallback sistem tersedia, dan tidak ada truncation baru. Wrapping dibuat tahan terhadap judul, label, URL, dan kata panjang tanpa mengubah lebar container.

Regression contract menguji 15 viewport sasaran:

- Mobile: 320×568, 360×800, 375×812, 390×844, 414×896, 430×932.
- Tablet: 768×1024, 820×1180, 1024×1366.
- Desktop: 1280×800, 1366×768, 1440×900, 1920×1080.
- Landscape pendek: 844×390 dan 932×430.

Pada seluruh viewport tersebut, urutan display > H1 > H2 tetap terjaga, body tetap 16 px, dan caption tetap 12 px.

## G. Final typography system

### Token utama

| Role | Family | Size | Weight | Line-height | Tracking |
| --- | --- | --- | ---: | ---: | ---: |
| Display | Plus Jakarta Sans | `clamp(3.125rem, 5.2vw, 5.5rem)` | 800 | 1.0 | -0.045em |
| H1 | Plus Jakarta Sans | `clamp(2.75rem, 4.8vw, 4.75rem)` | 800 | 1.04 | -0.045em |
| H2 | Plus Jakarta Sans | `clamp(2rem, 3.4vw, 3.25rem)` | 800 | 1.10 | -0.025em |
| H3 | Plus Jakarta Sans | `clamp(1.125rem, 1.6vw, 1.375rem)` | 800 | 1.30 | -0.015em |
| H4–H6 | Plus Jakarta Sans | 1rem | 800 | 1.40 | -0.01em |
| Lead | Inter | `clamp(1rem, 1.1vw, 1.125rem)` | 400 | 1.70 | -0.005em |
| Body | Inter | 1rem | 400 | 1.72 | 0 |
| Long-form desktop | Inter | 1.0625rem | 400 | 1.80 | 0 |
| Body small/kartu | Inter | 0.9375rem | 400 | 1.60 | 0 |
| UI/action | Inter | 0.875rem | 700 | 1.40 | 0.01em |
| Caption/metadata | Inter | 0.75rem | 600–700 | 1.45–1.50 | 0.02–0.08em |
| Form control | Inter | 1rem | 400 | 1.50 | 0 |

### Mobile

| Role | Formula mobile |
| --- | --- |
| Display | `clamp(2.5rem, 10.8vw, 3.25rem)` |
| H1 | `clamp(2.25rem, 9.5vw, 3rem)` |
| H2 | `clamp(1.875rem, 8vw, 2.5rem)` |
| H3 | `clamp(1.125rem, 4.8vw, 1.3rem)` |
| Body/long-form | 1rem / 1.72 |
| Mobile navigation | 1rem / 700 / 1.4 |

### Governance

- Allowed weight tokens: 400, 500, 600, 700, 800.
- Minimum governed text: 12 px; body dan input: 16 px.
- Uppercase hanya untuk label pendek; tracking maksimum 0.08em.
- Tidak memakai font shorthand baru agar family, weight, size, dan line-height tetap dapat diaudit.
- Seluruh penambahan tipografi baru harus menggunakan token role, bukan nilai literal bebas.

## H. Final verdict

**Verdict: PASS WITH DOCUMENTED GUARDRAILS.**

Sistem tipografi setelah perbaikan sudah konsisten, responsif, lebih terbaca, dan memiliki perlindungan regresi yang dapat dijalankan otomatis. Masalah kritis ukuran form, mikro-teks, weight heading, long-form mobile, wrapping, dan angka sudah ditangani tanpa mengubah desain di luar tipografi.

Verdict ini tidak menyatakan website “sempurna” dan tidak menutup audit berikutnya. Audit 06 dinyatakan selesai pada scope tipografi setelah lint, typecheck, integrity, responsive contract, color contract, typography contract, dan production build lulus. Branch tetap terpisah dari `main` sampai rangkaian audit yang diminta pengguna selesai.
