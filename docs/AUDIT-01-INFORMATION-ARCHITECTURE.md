# Audit 01: Struktur Website dan Information Architecture

Tanggal audit: 29 Agustus 2026  
Branch kumulatif: `codex/audit-series`  
Status: selesai, belum digabungkan ke `main`

## A. Kondisi awal

Website memiliki fondasi IA yang cukup kuat: enam kelompok navigasi utama, URL publik yang dangkal, halaman hub untuk program dan kegiatan, halaman akuntabilitas, pencarian, sitemap, serta satu H1 pada setiap halaman publik. Urutan beranda juga sudah mendukung alur memahami organisasi, melihat program, memeriksa bukti, lalu bertindak.

Namun, beberapa hubungan antarkonten belum terbentuk secara konsisten. Program detail membutuhkan kunjungan ke halaman hub terlebih dahulu, halaman satu kelompok tidak memiliki navigasi lokal yang seragam, breadcrumb hanya tersedia pada sebagian detail, pencarian sulit ditemukan pada desktop dan indeksnya tidak merepresentasikan seluruh konten publik. Dua jalur penting juga bermasalah: tautan Dokumen Publik menuju anchor yang tidak ada, sedangkan halaman Cara Mendukung berakhir pada tombol simulasi yang dinonaktifkan tanpa alternatif tindakan.

## B. Temuan audit

### Critical

1. Canonical global mengarah ke `/` dan diwariskan dari root layout. Ini berisiko memberi sinyal bahwa halaman program, kegiatan, kebijakan, dan halaman publik lain merupakan salinan beranda.

### High

1. Menu `Dokumen Publik` mengarah ke `/transparansi#dokumen`, tetapi target `id="dokumen"` tidak tersedia.
2. Jalur dukungan berakhir pada tombol pembayaran simulasi yang dinonaktifkan tanpa jalur alternatif ke kontak yayasan.
3. Lima program tidak tersedia langsung dari navigasi global. Pengguna harus membuka halaman Program terlebih dahulu sebelum memilih program tertentu.
4. Pencarian hanya terlihat di menu mobile, tidak tersedia sebagai utilitas desktop, dan indeksnya melewatkan banyak halaman, kebijakan, serta konten contoh yang sudah terlihat.
5. Breadcrumb dan navigasi lokal tidak konsisten pada halaman Tentang Kami, Organisasi, Kebijakan Donasi, serta detail Berita dan Galeri.

### Medium

1. Label `Tentang`, `Tentang Kami`, `Berita`, dan `Berita & Cerita` digunakan tidak konsisten pada permukaan navigasi yang berbeda.
2. Footer tidak memiliki akses permanen ke Kontak, Cara Mendukung, dan Pencarian.
3. Kartu kegiatan dan berita contoh di beranda hanya menuju halaman arsip umum, bukan item yang dimaksud.
4. Menu mobile menampilkan seluruh turunan sekaligus. Penambahan program akan membuat daftar panjang dan sulit dipindai.
5. Breadcrumb detail Berita dan Galeri melewatkan induk konseptual Kegiatan.
6. Hasil pencarian tidak menunjukkan kategori, tidak menormalisasi aksen, dan tidak memberi jalur pemulihan ketika hasil kosong.

### Low

1. Deskripsi halaman pencarian memakai istilah implementasi seperti `V2` dan `registry publikasi`, bukan bahasa pengguna.
2. Status aktif pada tautan dropdown dapat ambigu antara halaman hub dan turunannya.
3. Dropdown desktop tetap terbuka setelah pengguna memilih tautan.

## C. Struktur yang dipertahankan

- Seluruh foto, angka, cerita, kegiatan, berita, testimoni, struktur organisasi, dokumen, dan data contoh tetap dipertahankan.
- Enam kelompok navigasi utama dipertahankan karena breadth masih dapat dipindai dengan baik.
- URL publik yang sudah singkat dan stabil dipertahankan. `/organisasi`, `/berita`, `/galeri`, dan `/donasi` tidak dipindahkan hanya demi keseragaman folder.
- Program, Kegiatan, Dampak, dan Transparansi tetap menjadi halaman hub yang berbeda karena memenuhi kebutuhan pengguna yang berbeda.
- Urutan informasi beranda dipertahankan: identitas dan program, aktivitas, prinsip, transparansi, cerita, berita, akuntabilitas, lalu CTA penutup.
- Status simulasi pada donasi, kontak, data dampak, laporan, dan dokumen tetap ditandai secara eksplisit.

## D. Perubahan yang dilakukan

1. Membentuk satu sumber data navigasi untuk kelompok Tentang Kami, Program, Kegiatan, dan Akuntabilitas.
2. Menambahkan lima program ke dropdown desktop dan grup mobile sehingga setiap program dapat dicapai langsung dari navigasi global.
3. Mengubah menu mobile menjadi kelompok disclosure yang dapat dibuka-tutup. Kelompok halaman aktif terbuka secara default.
4. Menambahkan akses pencarian pada header desktop, serta Pencarian, Kontak & Kolaborasi, dan Cara Mendukung pada footer.
5. Menambahkan komponen navigasi lokal yang dapat digunakan ulang pada halaman Tentang Kami, Program, Kegiatan, dan Akuntabilitas.
6. Menambahkan breadcrumb pada seluruh halaman Tentang Kami tingkat dua, Organisasi, Kebijakan Donasi, serta memperbaiki hierarki detail Berita dan Galeri.
7. Menambahkan target anchor Dokumen Publik yang valid dan `scroll-margin` untuk header tetap.
8. Menambahkan anchor unik pada kegiatan dan berita contoh, lalu mengarahkan kartu beranda dan hasil pencarian ke item yang tepat.
9. Memperluas indeks pencarian agar mencakup seluruh halaman publik penting, lima program, kegiatan dan berita contoh, cara mendukung, kontak, serta halaman kebijakan.
10. Menambahkan kategori hasil, normalisasi kata kunci, pengurutan judul yang paling relevan, deduplikasi, dan saran pemulihan ketika hasil kosong.
11. Menambahkan jalur `Hubungi Yayasan` pada halaman Cara Mendukung dan jalur Program/Cara Mendukung pada halaman Kontak.
12. Menghapus canonical global yang salah. Sitemap dan URL publik tetap dipertahankan.
13. Menambahkan status aktif yang presisi dan menutup dropdown desktop setelah tautan dipilih.

## E. Struktur final

```text
Beranda
├── Tentang Kami
│   ├── Profil Yayasan
│   ├── Visi & Misi
│   ├── Nilai Kami
│   ├── Sejarah
│   ├── Organisasi
│   └── Legalitas
├── Program
│   ├── Ikhtisar Program
│   ├── Berbagi Rasa
│   ├── Merakyat
│   ├── REHAT
│   ├── Berbagi Air Bersih
│   └── Berbagi Masa Depan
├── Kegiatan
│   ├── Arsip Kegiatan
│   ├── Berita & Cerita
│   └── Galeri Foto & Video
├── Dampak
├── Transparansi
│   ├── Ikhtisar Transparansi
│   ├── Dokumen Publik
│   └── Kebijakan Donasi
├── Cara Mendukung
├── Kontak & Kolaborasi
├── Pencarian
└── Kebijakan
    ├── Privasi
    ├── Ketentuan
    ├── Aksesibilitas
    └── Disclaimer
```

Kedalaman konseptual publik maksimum adalah tiga tingkat: kelompok, arsip, dan detail konten. Tidak ada halaman penting yang hanya dapat ditemukan melalui sitemap.

## F. Validasi

### Perjalanan pengguna

| Tujuan | Jalur final | Hasil |
|---|---|---|
| Memahami organisasi | Beranda → Tentang Kami → profil/visi/nilai/sejarah/organisasi/legalitas | Seluruh sibling terlihat dari navigasi lokal |
| Menemukan program tertentu | Navigasi → Program → nama program | Detail program dapat dicapai tanpa transit melalui hub |
| Memeriksa bukti | Navigasi → Transparansi → Dokumen Publik | Anchor valid dan kebijakan terkait tetap terlihat |
| Memberi dukungan saat pembayaran belum aktif | Cara Mendukung → Hubungi Yayasan | Tidak lagi menjadi dead end |
| Menawarkan kolaborasi | Footer → Kontak & Kolaborasi | Kanal selalu tersedia dari seluruh halaman |
| Menemukan item contoh | Pencarian atau kartu beranda → anchor arsip spesifik | Pengguna mendarat pada konten yang dimaksud |

### Pemeriksaan teknis

- `npm run integrity`: lulus.
- `npm run lint`: lulus tanpa warning.
- `npm run typecheck`: lulus.
- `npm run build`: lulus, 36 halaman statis/dinamis selesai dibuat.
- Crawl render produksi lokal: 27 rute publik diperiksa.
- Pemeriksaan tautan: 43 tautan internal unik diperiksa, tidak ada 4xx.
- Pemeriksaan anchor: Dokumen Publik, kegiatan contoh, dan berita contoh valid.
- Pemeriksaan heading: tepat satu H1 pada setiap halaman publik yang diuji.
- Pemeriksaan pencarian `air`: menemukan program, kegiatan contoh, dan berita contoh yang relevan.
- IA mobile: kelompok menu dapat dibuka-tutup, halaman aktif diberi konteks, seluruh item tetap tersedia, dan navigasi lokal menggunakan scroll horizontal pada viewport sempit tanpa menghapus item.

### Retensi konten

Tidak ada data atau gambar contoh yang dihapus. Semua koleksi contoh tetap digunakan untuk menilai struktur dan desain lengkap.

## G. Final verdict

**OPTIMAL untuk ruang lingkup Audit 01: Struktur Website dan Information Architecture.**

Hierarki, findability, hubungan antarkonten, jalur tindakan, pencarian, breadcrumb, mobile IA, URL, dan sinyal SEO struktural telah diperbaiki tanpa memperluas scope ke perubahan visual yang tidak terkait. Branch belum digabungkan ke `main` dan harus menjadi basis kumulatif untuk audit berikutnya.
