# Audit 03: Layout dan Visual Hierarchy

Tanggal audit: 29 Agustus 2026

Branch kumulatif: `codex/audit-series`

Basis: Audit 02 (`2134490`)

Status: selesai, belum digabungkan ke `main`

## A. Ringkasan eksekutif

Fondasi visual website sudah memiliki karakter yang jelas: kontras hitam–merah kuat, tipografi display konsisten, program mudah dikenali, foto contoh membantu mengevaluasi komposisi, dan urutan beranda sudah mengikuti alur memahami organisasi → melihat program → memeriksa bukti → bertindak. Audit tidak menemukan alasan untuk mengganti arah visual tersebut.

Masalah utama berada pada sistem komposisi. Hero internal memakai skala yang hampir sama dengan hero beranda sehingga mengambil 537–607 piksel pada desktop untuk judul dan deskripsi saja. Spasi section memakai satu rentang besar secara berulang, kartu kegiatan menghasilkan satu featured card sangat tinggi dengan satu sel grid kosong, dan berbagai kartu memakai minimum height yang menciptakan ruang kosong. Halaman kebijakan, pencarian, 404, error, dan loading masih terlihat seperti lapisan utilitas yang terpisah dari desain utama.

Pada mobile terdapat dua masalah lebih serius. Deskripsi program disembunyikan pada layar maksimum 460 piksel, bertentangan dengan prinsip retensi konten. Selain itu, `.trust-home { overflow: hidden; }` membentuk area clipping/compositing sebesar seluruh halaman, bersamaan dengan banyak gambar `fill`, mask, backdrop, dan transition. Kombinasi ini konsisten dengan kerusakan rendering setelah scroll pada screenshot Android. Perbaikan mempertahankan seluruh gambar dan konten, tetapi membatasi clipping pada sumbu horizontal, mematikan transform gambar mobile, dan memberi containment pada kartu media.

Hasil akhir menormalkan ritme vertikal, skala judul, panjang baris, grid kartu, komposisi lead story, layout dokumen, pencarian, state halaman, posisi optik logo, serta kontrak responsif 360–1920 piksel tanpa menghapus data atau foto contoh.

## B. Temuan audit

### Critical

Tidak ditemukan blocker kritis yang membuat seluruh situs tidak dapat digunakan. Build, struktur dokumen, dan seluruh rute publik utama tetap berfungsi.

### High

1. CSS mobile menyembunyikan deskripsi pada kartu program di layar maksimum 460 piksel. Informasi contoh hilang justru pada viewport yang paling membutuhkan hierarki eksplisit.
2. Wrapper beranda berubah menjadi `overflow: hidden` pada mobile. Bersama fixed header, gambar `fill`, mask, translucent layer, dan transform gambar, ini menciptakan compositing layer panjang yang sesuai dengan pola kerusakan rendering setelah halaman digulir pada screenshot Android.
3. Hero internal terlalu dominan. Pada baseline desktop, tinggi hero berada di rentang 537–607 piksel dan beberapa judul mencapai tiga baris sebelum pengguna melihat konten inti.
4. Grid kegiatan menggunakan empat kolom dengan featured card dua kolom × dua baris dan tiga kartu pendukung. Susunan tersebut menyisakan sel kosong serta membuat bobot featured image 455 piksel tidak seimbang terhadap informasi pendukung.
5. Halaman Privasi, Ketentuan, Aksesibilitas, Disclaimer, dan Kebijakan Donasi menggunakan blok teks utility yang berbeda dari design system utama. Hierarki, daftar isi, ritme, dan orientasi pengguna tidak konsisten.
6. Halaman pencarian memiliki form yang cukup fungsional tetapi hasil berupa persegi datar tanpa hierarchy of action, grouping, atau pemulihan kosong yang setara dengan halaman lain.

### Medium

1. Semua section utama memakai padding `clamp(5.2rem, 8vw, 8rem)`. Pada halaman panjang, ritme menjadi monoton dan terlalu longgar.
2. Skala H2 hingga 4.25rem dipakai luas pada konteks kartu dan section, sehingga subjudul dapat bersaing dengan H1.
3. Testimoni, accountability, nilai, impact, transparency, gallery, dan closing CTA memakai minimum height tinggi. Konten pendek menghasilkan area kosong, sedangkan mobile menjadi sangat panjang.
4. Closing CTA mencapai 620 piksel pada desktop dan 590 piksel pada mobile. CTA penutup terasa seperti hero kedua dan memperlambat akses ke footer.
5. Panjang baris belum memakai satu reading-width contract. Sebagian paragraf melebar hingga 760–780 piksel dan kurang nyaman dipindai.
6. Halaman 404, error, dan loading tidak mempertahankan bahasa visual publik sehingga perpindahan state terasa abrupt.
7. Kartu archive dan gallery mobile mengandalkan fixed minimum height, bukan rasio media. Proporsi foto tidak stabil ketika lebar layar berubah.
8. Metadata dan teks sekunder pada beberapa kartu terlalu kecil, memperlemah hierarki informasi.

### Low

1. Logo resmi memiliki kanvas intrinsik yang tinggi; pada header desktop jarak optik ke batas atas masih terlalu tipis meskipun secara matematis sudah center.
2. Link tindakan pada section heading compact belum selalu sejajar pada baseline yang sama.
3. Beberapa hover state masih mengandalkan transform, tetapi belum dinonaktifkan secara menyeluruh untuk konteks mobile yang bermasalah.
4. Anchor dokumen memerlukan scroll offset yang mengikuti tinggi header baru.

## C. Analisis alur perhatian

### Beranda

- Pola pemindaian awal tetap menyerupai pola Z: logo → navigasi → CTA dukungan → kicker/judul → visual program → CTA utama.
- Hero beranda dipertahankan sebagai titik perhatian nomor satu, tetapi tinggi minimum turun dari 760 menjadi 700 piksel dan gap antar kolom dipadatkan.
- Signal band tetap menjadi jembatan antara hero dan program. Tidak ada metrik contoh yang dihapus.
- Kegiatan sekarang memakai satu lead story horizontal penuh dan tiga kartu pendukung setara. Alur baca menjadi featured → comparison scan, tanpa sel kosong.
- Closing CTA dipadatkan agar berfungsi sebagai keputusan akhir, bukan mengulang dominasi hero.

### Halaman internal

- Pola F menjadi lebih jelas: eyebrow → H1 → deskripsi → breadcrumb/navigasi lokal → konten inti.
- H1 internal diturunkan dari maksimum 5.25rem menjadi 4.65rem dan padding hero dikurangi. H1 tetap dominan tetapi tidak menutupi konten inti.
- Heading section dibatasi hingga sekitar 18 karakter lebar visual dan paragraf utama dibatasi 68ch.
- Halaman dokumen memakai indeks kiri dan isi bernomor di kanan pada desktop; pada mobile urutan berubah linear tanpa sticky layout.

### Hierarki tindakan

- CTA primer tetap merah/putih sesuai konteks.
- CTA sekunder tidak dinaikkan menjadi kompetitor visual.
- Pencarian memiliki satu tombol primer yang menempel pada field, lalu result card menyediakan tindakan tersier “Buka informasi”.
- Empty search, 404, dan error menyediakan jalur pemulihan yang terlihat tanpa menambah klaim atau konten rekaan.

## D. Perubahan yang diterapkan

1. Menambah token Audit 03 untuk section spacing, reading width 68ch, dan gap kartu.
2. Menaikkan header desktop menjadi 98 piksel dan tablet/mobile menjadi 88/86 piksel, lalu memberi offset optik logo 5/4 piksel. Hero, drawer, dan page state mengikuti tinggi yang sama.
3. Memadatkan hero internal: padding, H1, deskripsi, dan line length dinormalisasi untuk desktop serta mobile.
4. Memadatkan hero beranda tanpa mengubah copy, kolase, CTA, assurance, foto, atau data contoh.
5. Menurunkan skala heading section dan mengatur panjang maksimum agar H2 tidak bersaing dengan H1.
6. Mengubah grid kegiatan menjadi satu featured story full-width dengan komposisi horizontal dan tiga kartu pendukung; tablet/mobile kembali menjadi dua/satu kolom.
7. Mengurangi minimum height pada testimoni, accountability, nilai, konten terbit, impact, transparency, gallery, dan closing CTA.
8. Mengubah media archive/gallery mobile menjadi rasio 4:3, bukan tinggi tetap.
9. Menambah komponen `DocumentLayout` untuk Kebijakan Donasi, Privasi, Ketentuan, Aksesibilitas, dan Disclaimer. Seluruh paragraf lama dipertahankan; hanya struktur, penomoran, anchor, dan heading yang diperjelas.
10. Menambah breadcrumb pada halaman kebijakan footer yang sebelumnya langsung melompat dari hero ke isi.
11. Mendesain ulang layout Pencarian dengan label terlihat, satu field primer, result cards dua/satu kolom, count summary, dan shared empty state.
12. Menambah `PageState` untuk 404 dan error serta skeleton loading yang konsisten dengan layout publik.
13. Membatalkan penghapusan deskripsi program di mobile. Seluruh deskripsi tetap tampil pada 360–460 piksel.
14. Mengganti overflow beranda mobile menjadi horizontal clip + vertical visible, menonaktifkan transform/transition gambar mobile, dan memberi layout/paint containment pada kartu media.
15. Menambah reduced-motion handling pada result card dan loading shimmer.

## E. Responsive matrix dan retensi

| Lebar | Header/hero offset | Grid kegiatan | Dokumen/pencarian | Retensi konten | Status |
|---:|---:|---|---|---|---|
| 1920, 1440, 1280, 1121 | 98px | 3 kolom; lead full-width | Indeks sticky + isi; hasil 2 kolom | Lengkap | Lulus |
| 1120, 1024 | 88px | 2 kolom; lead full-width | Indeks + isi; hasil 2 kolom | Lengkap | Lulus |
| 900, 768 | 88px | 2 kolom; lead vertikal | Indeks sempit + isi | Lengkap | Lulus |
| 680, 430, 420, 390, 360 | 86px | 1 kolom | Linear; hasil 1 kolom | Deskripsi program tetap terlihat | Lulus |

Kontrak logo, header, page hero, drawer, dan page state memakai offset yang sama pada setiap breakpoint. Closing CTA mobile turun dari 590 menjadi 470 piksel. Kartu gallery/archive menggunakan rasio 4:3. Program, kegiatan, berita, testimoni, statistik, laporan, foto, galeri, dan seluruh data contoh tetap tersedia.

## F. Validasi dan verdict

### Pemeriksaan teknis

- `npm run lint`: lulus tanpa warning.
- `npm run typecheck`: lulus.
- `npm run integrity`: lulus; data preview tetap terisolasi dan ditandai.
- `npm run build`: lulus; 36 halaman statis/dinamis selesai dibuat.
- Production-render crawl lokal: 31 variasi rute diperiksa, termasuk pencarian berisi/kosong dan 404.
- Pemeriksaan heading: tepat satu H1 pada 31 variasi rute.
- Pemeriksaan ID: tidak ada duplicate `id` pada rute yang diperiksa.
- Pemeriksaan tautan/anchor: 47 tautan internal unik diperiksa; tidak ada 4xx atau anchor hilang.
- Pemeriksaan retensi: lima program, judul kegiatan, cerita dampak, berita, dan copy hero tetap ditemukan pada output final.
- Pemeriksaan pencarian: kata kunci `air` tetap menemukan Program Berbagi Air Bersih.
- Cascade matrix CSS: 360, 390, 420, 430, 680, 768, 900, 1024, 1120, 1121, 1280, 1440, dan 1920 piksel diperiksa untuk geometri header, offset hero/drawer, overflow, deskripsi program, grid kegiatan, dan tinggi closing CTA.
- Checklist React/Next.js: tidak ada async Client Component baru, boundary client tidak diperluas, gambar tetap memakai `next/image` dengan `sizes`, key stabil, dan halaman baru tetap Server Component kecuali error boundary yang memang harus client-side.

Inspeksi visual baseline dilakukan pada deployment produksi untuk mengenali komposisi awal. Deployment branch Audit 03 belum diklaim sebagai pixel-diff nyata sampai preview Vercel branch tersedia; verifikasi build, render, DOM, link, anchor, retensi, dan cascade dilakukan terhadap source final Audit 03.

### Retensi konten

Tidak ada data atau gambar contoh yang dihapus, disembunyikan, atau diganti. Perubahan hanya menyusun ulang layout, hierarchy, spacing, responsive behavior, dan state presentation. Heading deskriptif pada halaman kebijakan menstrukturkan paragraf yang sama tanpa mengurangi isi.

### Final verdict

**OPTIMAL untuk ruang lingkup Audit 03: Layout dan Visual Hierarchy, dengan visual deployment branch tetap menjadi gate sebelum rangkaian audit dinyatakan final.**

Layout global, page hero, grid, alignment, whitespace, section rhythm, content density, text width, card proportion, image ratio, CTA hierarchy, F/Z scanning, responsive hierarchy, mobile content preservation, policy/search/state pages, dan stabilitas compositing telah diaudit dan diperbaiki. Branch belum digabungkan ke `main`, belum dibuatkan PR, dan harus tetap menjadi basis kumulatif untuk audit berikutnya.
