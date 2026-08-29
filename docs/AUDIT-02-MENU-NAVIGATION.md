# Audit 02: Menu dan Navigation

Tanggal audit: 29 Agustus 2026

Branch kumulatif: `codex/audit-series`

Basis: Audit 01 (`cb7039d`)

Status: selesai, belum digabungkan ke `main`

## A. Kondisi awal

Audit 01 sudah membentuk hierarki navigasi yang sehat: enam kelompok menu utama, dropdown program, navigasi lokal antarsibling, breadcrumb, pencarian desktop/mobile, serta footer yang mencakup jalur dukungan, kontak, dan kebijakan. Breadth menu, urutan, label, dan kedalaman URL tidak memerlukan redesign.

Audit perilaku menemukan bahwa fondasi tersebut belum sepenuhnya aman ketika digunakan. Dropdown desktop masih mengandalkan elemen `details` tanpa pengelolaan satu-menu-terbuka, klik di luar, `Escape`, atau navigasi panah. Drawer mobile memakai beberapa aturan `top`, `inset`, dan `height` dari lapisan CSS berbeda; kombinasi itu dapat membuat panel melampaui viewport. Drawer juga dapat tetap aktif dan mempertahankan body lock ketika viewport diubah dari mobile ke desktop.

Temuan lain berada pada findability setelah pengguna masuk lebih dalam. Kategori berita sudah terlihat tetapi belum dapat dipakai untuk menavigasi arsip. Detail artikel, kegiatan, dan galeri tidak memiliki jalur lanjutan di bagian bawah. Data CMS berstatus terbit memiliki detail route, sitemap, dan hasil pencarian, tetapi belum ditampilkan dari halaman arsip sehingga berisiko menjadi orphan content saat data resmi mulai dimasukkan. Kartu berita contoh juga menampilkan ikon panah dan label “Preview artikel” seperti affordance tautan, padahal sengaja tidak memiliki halaman detail.

Screenshot awal memperlihatkan logo desktop terlalu dekat dengan batas atas dan kerusakan rendering setelah scroll pada mobile. Guard rendering Android dari Audit 01 tetap dipertahankan; Audit 02 menormalkan geometri header/drawer yang masih bertentangan dan memberi ruang vertikal logo yang lebih proporsional.

## B. Temuan audit

### Critical

Tidak ditemukan blocker kritis baru setelah fondasi Audit 01. Seluruh halaman utama masih dapat dicapai dan tidak ada loop navigasi atau link global yang membawa pengguna ke 4xx.

### High

1. Dropdown desktop tidak memiliki kontrak interaksi lengkap: beberapa dropdown dapat terbuka bersamaan, klik di luar dan `Escape` tidak menutup menu, fokus tidak dikembalikan ke trigger, dan tombol panah tidak dapat memindahkan fokus submenu.
2. Drawer mobile memiliki konflik tinggi panel dari beberapa breakpoint (`72`, `76`, `82`, dan `84` piksel). Ketika `top` berubah tetapi `height: calc(...)` lama tetap menang, batas bawah panel dapat melampaui viewport.
3. Drawer tidak ditutup secara defensif ketika breakpoint berubah ke desktop. Hamburger dapat menghilang sementara body tetap terkunci dan panel masih hidup di DOM.
4. Focus trap drawer menghitung semua tautan submenu, termasuk tautan di dalam `details` tertutup. Fokus keyboard berpotensi berpindah ke elemen yang tidak terlihat.
5. Tautan detail CMS yang diterbitkan belum memiliki jalur masuk dari arsip Kegiatan, Berita, dan Galeri. Begitu data resmi ditambahkan, detail tersebut berisiko hanya ditemukan melalui pencarian atau sitemap.
6. Label berita contoh menggunakan panah seperti tautan tetapi tidak interaktif. Ini menimbulkan false affordance dan click expectation yang gagal.

### Medium

1. Active state untuk `/transparansi#dokumen` tidak membedakan halaman ikhtisar dan anchor Dokumen Publik.
2. Navigasi lokal pada detail konten memakai `aria-current="page"` untuk halaman arsip induk, padahal pengguna sedang berada pada detail. Semantik yang tepat adalah current location.
3. Tautan submenu mobile, navigasi lokal, breadcrumb, dan sebagian link footer berada di bawah target sentuh 44 piksel.
4. Active state mobile terlalu bergantung pada perubahan warna, tanpa penanda bentuk yang cukup jelas.
5. Kategori Berita belum menjadi navigasi/filter, sehingga perjalanan Berita → Kategori → Artikel tidak tersedia dan arsip sulit diskalakan.
6. Detail artikel, kegiatan, dan galeri berakhir tanpa navigasi kontekstual ke arsip, program terkait, dokumentasi, atau pencarian.
7. Kontak Yayasan tidak tersedia di kelompok utilitas drawer mobile meskipun merupakan salah satu perjalanan pengguna utama.
8. Body scroll lock menghapus nilai `overflow` sebelumnya dan tidak mengompensasi scrollbar, sehingga penutupan drawer berpotensi menimbulkan horizontal layout shift.

### Low

1. Chevron dropdown desktop tidak mencerminkan status buka/tutup secara visual.
2. CTA Cara Mendukung belum memiliki active state yang setara dengan menu lain.
3. Logo header desktop selebar 180 piksel menyisakan ruang vertikal yang terlalu tipis pada header 92 piksel.
4. Label current breadcrumb belum memiliki area baca/sentuh yang konsisten ketika judul panjang membungkus.

## C. Elemen yang dipertahankan

- Seluruh foto, berita, kegiatan, program, angka, laporan, testimoni, galeri, dan data contoh tetap dipertahankan. Tidak ada kartu atau koleksi contoh yang dihapus.
- Enam kelompok menu utama dan urutannya dipertahankan: Beranda, Tentang Kami, Program, Kegiatan, Dampak, dan Transparansi.
- Lima program tetap dapat dicapai langsung dari dropdown Program.
- Cara Mendukung tetap menjadi CTA primer, sedangkan Pencarian tetap menjadi utilitas global.
- Navigasi lokal, breadcrumb, footer, URL publik, dan kedalaman maksimum tiga tingkat dari Audit 01 dipertahankan.
- Drawer tetap memakai pola accordion/disclosure karena lebih mudah dipindai daripada daftar panjang yang selalu terbuka.
- Status “contoh”, “preview”, dan “belum diterbitkan” tetap eksplisit agar materi staging tidak disalahartikan sebagai data resmi.

## D. Perubahan yang diterapkan

1. Mengganti dropdown desktop berbasis `details` dengan disclosure button yang memiliki `aria-expanded` dan `aria-controls`.
2. Membatasi dropdown desktop menjadi satu menu terbuka pada satu waktu; klik di luar, memilih tautan, pergantian route, dan `Escape` menutup menu.
3. Menambahkan navigasi keyboard submenu: `ArrowDown`, `ArrowUp`, `Home`, `End`, serta pengembalian fokus ke trigger setelah `Escape`.
4. Membuat active state hash-aware sehingga Ikhtisar Transparansi dan Dokumen Publik tidak ditandai bersamaan.
5. Menjadikan drawer mobile controlled accordion. Hanya satu kelompok terbuka, kelompok route aktif dibuka saat drawer dipanggil, dan hanya elemen yang benar-benar terlihat masuk focus trap.
6. Menutup drawer otomatis pada breakpoint desktop, mengembalikan nilai body style sebelumnya, dan menambah kompensasi scrollbar saat body lock aktif.
7. Menghapus ketergantungan pada rumus tinggi drawer. Panel sekarang terikat oleh `top` dan `bottom: 0` dengan `height: auto`, overflow vertikal mandiri, overscroll containment, dan safe-area padding.
8. Menambah Kontak Yayasan pada utilitas drawer mobile serta active state yang tidak hanya mengandalkan warna.
9. Menaikkan target sentuh submenu, navigasi lokal, kategori, breadcrumb mobile, dan footer menjadi minimum 44–48 piksel.
10. Mengubah lebar logo header desktop dari 180 menjadi 170 piksel dan memusatkannya dengan offset dua piksel agar tidak menempel ke batas atas. Ukuran mobile tetap adaptif pada 162, 150, dan 144 piksel.
11. Menambahkan navigasi kategori Berita berbasis query parameter. Kategori tidak valid kembali aman ke tampilan Semua dan tidak menghasilkan halaman kosong.
12. Mengganti false affordance kartu contoh dengan label noninteraktif “Preview artikel · belum diterbitkan”. Foto dan data contoh tetap utuh.
13. Menambahkan indeks kondisional untuk artikel, kegiatan, dan galeri CMS yang berstatus terbit. Komponen tidak menampilkan ruang kosong ketika belum ada konten resmi.
14. Menambahkan navigasi lanjutan pada detail artikel, kegiatan, dan galeri menuju arsip, program terkait, dokumentasi, atau pencarian.
15. Mengubah semantik navigasi lokal pada detail dari current page menjadi current location.
16. Menambahkan reduced-motion handling untuk animasi chevron dan kartu navigasi baru.

## E. Struktur menu final

```text
Header desktop
├── Logo → Beranda
├── Beranda
├── Tentang Kami (disclosure)
│   ├── Ikhtisar Tentang Kami
│   ├── Visi & Misi
│   ├── Nilai Kami
│   ├── Sejarah
│   ├── Organisasi
│   └── Legalitas
├── Program (disclosure)
│   ├── Ikhtisar Program
│   └── 5 program
├── Kegiatan (disclosure)
│   ├── Arsip Kegiatan
│   ├── Berita & Cerita
│   └── Galeri Foto & Video
├── Dampak
├── Transparansi (disclosure)
│   ├── Ikhtisar Transparansi
│   ├── Dokumen Publik
│   └── Kebijakan Donasi
├── Pencarian
└── Cara Mendukung

Drawer mobile
├── Kelompok menu yang sama, satu accordion terbuka
├── Cari Informasi
├── Kontak Yayasan
└── Cara Mendukung

Navigasi kontekstual
├── Navigasi lokal antarsibling
├── Breadcrumb pada halaman tingkat dua/detail
├── Filter kategori Berita
├── Indeks konten resmi terbit
└── Lanjutkan menjelajah pada akhir detail
```

Tidak ada perubahan URL atau penghapusan cabang. Kedalaman maksimum publik tetap tiga tingkat: kelompok, arsip, dan detail.

## F. Validasi

### Perjalanan pengguna

| Tujuan | Jalur final | Hasil |
|---|---|---|
| Pengunjung baru memahami organisasi | Header → Tentang Kami → Ikhtisar/Visi/Nilai/Sejarah/Organisasi/Legalitas | Satu dropdown terkelola dan seluruh sibling tetap terlihat |
| Menemukan program tertentu | Header → Program → nama program | Maksimum dua interaksi dari halaman mana pun |
| Membaca berita berdasarkan kategori | Kegiatan → Berita & Cerita → kategori → artikel terbit | Filter memiliki URL yang dapat dibagikan; kategori tidak valid kembali ke Semua |
| Melanjutkan dari detail kegiatan | Detail → program terkait/arsip/galeri | Tidak berhenti pada akhir konten |
| Memberi dukungan | Header/drawer/footer → Cara Mendukung | CTA tersedia pada semua ukuran dan memiliki current state |
| Menghubungi yayasan | Drawer/footer → Kontak Yayasan | Jalur kontak tersedia tanpa harus membuka halaman lain terlebih dahulu |
| Memeriksa dokumen | Transparansi → Dokumen Publik | Active state mengikuti hash dan anchor valid |

### Perilaku input

| Input/kondisi | Hasil re-audit |
|---|---|
| Klik trigger dropdown | Membuka menu yang dipilih dan menutup menu sebelumnya |
| Klik di luar dropdown | Menutup dropdown |
| `Escape` desktop | Menutup dropdown dan mengembalikan fokus ke trigger |
| `ArrowDown` pada trigger | Membuka submenu dan memindahkan fokus ke tautan pertama |
| `ArrowUp`/`ArrowDown`/`Home`/`End` di submenu | Fokus bergerak dan membungkus dalam submenu aktif |
| `Escape` drawer | Menutup drawer dan mengembalikan fokus ke hamburger |
| `Tab`/`Shift+Tab` drawer | Fokus terperangkap hanya pada kontrol yang terlihat |
| Resize mobile → desktop | Drawer ditutup, body lock dilepas, dan panel dipaksa tersembunyi di atas 1120 piksel |
| Route berubah saat menu terbuka | State menu lama tidak ditampilkan pada route baru |

### Responsive matrix

| Lebar | Sistem navigasi | Geometri drawer | Status |
|---:|---|---|---|
| 1920, 1440, 1280 | Desktop | Drawer `display: none` | Lulus |
| 1024, 834, 768 | Mobile/tablet | `top: 84px; bottom: 0; height: auto` | Lulus |
| 430, 414, 390, 375, 360 | Mobile | `top: 82px; bottom: 0; height: auto` | Lulus |

Breakpoint batas 1121/1120 dan 680 juga diperiksa. Target sentuh: dropdown desktop 44 piksel, menu/submenu mobile 48 piksel, navigasi lokal dan kategori 44 piksel.

### Pemeriksaan teknis

- `npm run integrity`: lulus.
- `npm run lint`: lulus tanpa warning.
- `npm run typecheck`: lulus.
- `npm run build`: lulus; 36 halaman statis/dinamis selesai dibuat.
- Production-render crawl: 31 variasi rute publik diperiksa, termasuk filter valid/tidak valid dan 404.
- Pemeriksaan tautan: 42 tautan internal unik diperiksa; tidak ada 4xx.
- Pemeriksaan anchor: seluruh hash internal yang dirender memiliki target.
- Pemeriksaan DOM: tidak ada duplicate `id` pada 31 variasi rute.
- Pemeriksaan filter: kategori valid menyaring contoh dan konten resmi; kategori tidak valid kembali ke Semua.
- Pemeriksaan retensi: judul dan kartu contoh utama tetap ditemukan pada render final.
- Checklist React: client boundary tetap terbatas pada Navbar, tidak ada fetch waterfall baru, key stabil, efek memiliki cleanup, dan komponen indeks/continuation tetap berupa Server Component.

Automasi Chromium tidak tersedia di runtime audit ini, sehingga laporan tidak mengklaim pixel-diff perangkat dari branch lokal. Sebagai pengganti, verifikasi menggunakan production build/render, pemeriksaan DOM/tautan/anchor, inspeksi screenshot awal, dan evaluasi cascade CSS pada seluruh lebar target. Preview branch tetap perlu menjadi titik pemeriksaan visual nyata sebelum rangkaian audit dinyatakan final.

### Retensi konten

Tidak ada data atau gambar contoh yang dihapus. Filter hanya mengubah subset yang terlihat ketika pengguna memilih kategori; tampilan Semua tetap memuat koleksi contoh lengkap. Data resmi yang belum tersedia tidak digantikan dengan konten rekaan baru.

## G. Final verdict

**OPTIMAL untuk ruang lingkup Audit 02: Menu dan Navigation, dengan validasi visual deployment tetap menjadi gate rangkaian audit berikutnya.**

Breadth, urutan, label, depth, findability, active state, dropdown behavior, keyboard navigation, drawer mobile, touch target, breadcrumb, footer, contextual navigation, internal linking, discovery, CTA, responsive behavior, edge case, scalability, dan navigation SEO telah diaudit dan diperbaiki tanpa redesign yang tidak perlu. Branch belum digabungkan ke `main`, belum dibuatkan PR, dan harus tetap menjadi basis kumulatif untuk audit selanjutnya.
