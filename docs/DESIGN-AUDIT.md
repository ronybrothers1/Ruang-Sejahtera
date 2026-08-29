# Audit Desain dan Frontend Ruang Sejahtera

Tanggal audit: 29 Agustus 2026

## Ringkasan

Fondasi proyek sudah lebih matang daripada tampilan awalnya: Next.js App Router, pemisahan situs publik dan panel admin, alur publikasi CMS, header keamanan, metadata, sitemap, skip link, focus state, dan quality gates sudah tersedia. Masalah terbesar justru muncul pada lapisan presentasi publik: situs terlihat penuh karena memakai foto stok, angka, nominal, testimoni, tanggal, alamat, legalitas, dan identitas contoh. Hal itu bertentangan dengan README yang menyatakan data contoh tidak boleh ditampilkan pada halaman publik.

Rekonstruksi ini mengubah arah desain dari “demo yang tampak lengkap” menjadi platform humanitarian trust-first: tetap kuat secara visual, tetapi tidak mengarang bukti kerja.

## Temuan Prioritas

### Kritis: kredibilitas informasi

- Beranda menampilkan angka penerima manfaat, jumlah kegiatan, desa, dan dana tersalurkan yang seluruhnya contoh.
- Terdapat testimoni dengan nama orang yang bukan sumber terverifikasi.
- Halaman kontak memuat alamat, nomor telepon, dan email contoh.
- Halaman legalitas dan organisasi menampilkan nomor serta nama placeholder.
- Halaman transparansi menampilkan nominal dan komposisi keuangan simulasi.
- Halaman kegiatan, berita, galeri, dampak, sejarah, visi-misi, dan nilai memakai konten simulasi agar desain terlihat penuh.

Risikonya bukan hanya estetika. Pengunjung dapat menangkap cuplikan, mesin pencari dapat mengindeksnya, dan informasi contoh dapat terlepas dari label pengamannya saat dibagikan.

### Tinggi: pengalaman dan privasi

- Form donasi simulasi meminta nama, email, pilihan program, dan nominal meskipun tidak memproses transaksi.
- Form kontak simulasi mengundang pengunjung mengisi data pribadi pada alur yang sengaja tidak aktif.
- Foto stok eksternal memberi kesan dokumentasi lapangan, meskipun diberi label sementara.

### Tinggi: sistem desain

- Sembilan stylesheet versi lama dimuat bersamaan dan saling menimpa.
- Warna brand berulang sebagai nilai hardcoded.
- Tombol hamburger tampil bersamaan dengan menu desktop karena deklarasi icon-button mengalahkan utilitas responsif.
- Hero terlalu besar dan memaksa judul terpecah menjadi terlalu banyak baris.
- Banyak komponen kartu memiliki kepadatan, ukuran teks, dan hierarki yang berbeda.

### Menengah: arsitektur konten

- Registri CMS publik sebenarnya sudah benar dan kosong, tetapi halaman publik mengabaikannya lalu membaca data sampel dari lib/content.ts.
- Beberapa tautan kartu menuju halaman daftar, bukan halaman detail.
- README dan implementasi publik tidak konsisten.

## Perbaikan yang Diterapkan

- Menghapus seluruh angka, nominal, testimoni, alamat, identitas, legalitas, tanggal, dan dokumen fiktif dari halaman publik.
- Menghapus seluruh ketergantungan gambar Unsplash dan izin host eksternal dari CSP serta konfigurasi gambar.
- Mengganti fotografi stok dengan sistem visual program berbasis ikon, nomor, warna, dan pola brand.
- Menghubungkan kegiatan, berita, dan galeri langsung ke registri konten berstatus published.
- Mendesain empty state institusional yang menjelaskan syarat publikasi tanpa membuat website terlihat rusak.
- Menghapus form donasi dan kontak simulasi agar tidak mengundang pengisian data pribadi pada endpoint yang belum aktif.
- Merekonstruksi beranda menjadi alur: nilai utama → lima program → prinsip kerja → jejak publik → ruang akuntabilitas → cara terlibat.
- Merekonstruksi halaman program, detail program, kegiatan, berita, galeri, dampak, transparansi, organisasi, kontak, donasi, profil, visi-misi, nilai, sejarah, dan legalitas.
- Memperbaiki breakpoint navigasi secara eksplisit agar desktop dan hamburger tidak muncul bersamaan.
- Menggabungkan sembilan stylesheet menjadi satu sumber cascade.
- Memperbaiki warna teks muted yang sebelumnya gagal rasio kontras WCAG AA.
- Memperketat integrity guard agar build gagal jika menemukan foto stok, identitas fiktif yang dikenal, atau nominal rupiah hardcoded pada kode publik.

## Prinsip Desain Akhir

1. Tidak ada bukti semu untuk membuat halaman terlihat penuh.
2. Visual brand menggantikan foto stok sampai dokumentasi asli siap.
3. Informasi yang belum tersedia dijelaskan dengan bahasa yang tenang dan spesifik.
4. Data publik berasal dari registri berstatus published, bukan array contoh.
5. Kanal donasi, kontak, dan dokumen hanya aktif setelah konfigurasi resminya tersedia.
6. Navigasi, tipografi, kontras, target sentuh, focus state, dan reduced motion tetap menjadi bagian dari desain.

## Data yang Masih Dibutuhkan dari Pemilik Yayasan

- dokumentasi asli beserta caption, alt text, dan status persetujuan publikasi;
- profil, visi, misi, nilai, dan sejarah yang telah disahkan;
- struktur pengurus dan periode yang boleh ditampilkan;
- metadata legalitas yang aman untuk publik;
- alamat, WhatsApp, email, dan peta resmi;
- laporan keuangan dan dampak beserta sumber, periode, definisi, dan status pemeriksaan;
- kanal donasi resmi serta kontrol pembayaran, rekonsiliasi, dan pengembalian.

Data tersebut sebaiknya dimasukkan melalui alur editorial yang sudah tersedia, bukan di-hardcode ke komponen halaman.
