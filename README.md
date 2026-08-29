# Yayasan Ruang Sejahtera — V2

Rekonstruksi V2 memindahkan proyek dari prototipe visual menjadi fondasi platform nonprofit yang mengutamakan **trust, transparency, humanity, impact, accountability, accessibility**, dan integritas data.

## Perubahan utama
- Seluruh angka dampak dan laporan keuangan simulasi dihapus.
- Foto acak/stock placeholder dihapus dari halaman publik.
- Logo resmi digunakan sebagai identitas utama tanpa menggambar ulang.
- Homepage direkonstruksi sebagai humanitarian editorial platform.
- Route inti dibangun: Tentang, Program, Kegiatan, Berita, Galeri, Dampak, Transparansi, Organisasi, Donasi, Kontak, Pencarian, Privasi, Ketentuan, Kebijakan Donasi.
- Design system, skip link, focus state, reduced motion, semantic landmark, error/loading/empty states.
- robots/sitemap bersifat aman: website tidak diindeks sampai `NEXT_PUBLIC_SITE_URL` resmi dikonfigurasi.
- Security headers baseline.
- Data model dan CMS/security architecture terdokumentasi.

## Integritas data
Jangan memasukkan data contoh ke halaman publik untuk:
- penerima manfaat;
- jumlah kegiatan/donatur;
- nilai donasi/keuangan;
- rekening/QRIS;
- alamat/kontak;
- legalitas;
- pengurus;
- mitra;
- status verifikasi/audit.

Gunakan CMS dan sumber resmi.

## Environment
Salin `.env.example` ke environment deployment. Jangan commit secret.

## Tahap produksi berikutnya
1. Pilih CMS/database/storage produksi.
2. Implementasi auth + RBAC.
3. Migrasi data kegiatan dan dokumentasi asli.
4. Konfigurasi domain resmi, kontak, legalitas, organisasi.
5. Implementasi payment gateway + webhook + reconciliation.
6. Implementasi laporan keuangan dan impact metrics dari sumber data.
7. Test WCAG 2.2 AA, Core Web Vitals, security, dan SEO sebelum rilis.
