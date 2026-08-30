# Audit 08 — Gambar dan Integrasi Video

## Tujuan

Audit ini meningkatkan autentisitas gambar serta menambahkan dokumentasi video tanpa mengubah arsitektur, tipografi, sistem warna, navigasi, komponen formulir, maupun kontrak responsif hasil Audit 01–07.

## Temuan baseline

1. Seluruh visual program masih bergantung pada URL stok eksternal dan sebagian tidak memperlihatkan konteks Indonesia.
2. Foto air bersih berorientasi vertikal, sedangkan sebagian besar permukaan website berorientasi lanskap. Pemakaian langsung berisiko menghasilkan crop yang kehilangan subjek.
3. Galeri belum memiliki player video, meskipun kanal TikTok resmi dan empat dokumentasi program telah tersedia.
4. CSP belum mengizinkan frame TikTok. Menambahkan iframe tanpa memperbarui kebijakan ini akan menghasilkan embed kosong di production.
5. Empat player vertikal berpotensi memperpanjang halaman dan menambah beban awal bila semuanya dimuat secara eager.

## Implementasi

### Gambar

- Foto bantuan sembako dari pemilik situs digunakan sebagai dokumentasi asli dalam format WebP 1600 × 900.
- Foto penyaluran air bersih dibuat menjadi crop lanskap 720 × 540 untuk kartu dan hero, serta versi portrait yang tetap disimpan sebagai sumber dokumentasi.
- Visual pendukung Merakyat, REHAT, pendidikan, dan gotong royong diarahkan khusus ke konteks Indonesia/Madura, disimpan lokal sebagai WebP, serta selalu diberi label `VISUAL CONTOH`.
- Foto asli diberi label `DOKUMENTASI`; label tidak dicampur dengan status data contoh pada kartu.
- Alt text menjelaskan aksi dan konteks, bukan mengulang judul halaman.
- Semua URL gambar stok eksternal dihapus dari registry konten dan CSP.

### Video

- Empat post TikTok dirender melalui endpoint iframe resmi `https://www.tiktok.com/player/v1/{post_id}`.
- Player mempertahankan kontrol, deskripsi, fullscreen, dan rasio asli 9:16; autoplay dan loop dinonaktifkan.
- `loading="lazy"` mencegah player di bawah fold membebani pemuatan awal.
- Galeri menggunakan empat kolom pada desktop, dua kolom pada tablet, dan satu kolom pada mobile.
- Wrapper memiliki `min-width: 0`, `overflow: clip`, serta batas ukuran agar iframe tidak menimbulkan horizontal scrolling.
- CSP hanya menambahkan `frame-src https://www.tiktok.com`; tidak ada skrip TikTok global yang ditambahkan.

## Transparansi media

Dokumentasi asli dan visual contoh tidak boleh dipresentasikan sebagai jenis media yang sama. Label di permukaan gambar dipertahankan sampai seluruh visual contoh diganti dokumentasi kegiatan yang memiliki konteks, caption, alt text, dan izin publikasi yang memadai.

## Gate regresi

Audit ini dinyatakan lulus hanya jika:

- lint dan TypeScript lulus;
- integrity guard mempertahankan seluruh data contoh;
- kontrak responsive, color, typography, dan component Audit 01–07 tetap lulus;
- `npm run media:audit` memvalidasi tujuh aset WebP, empat video, lazy loading, fullscreen, rasio, CSP, dan containment;
- production build lulus;
- browser desktop dan mobile tidak memiliki overflow horizontal, error overlay, atau iframe yang keluar dari kartu.
