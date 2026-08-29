# Yayasan Ruang Sejahtera — V2

Rekonstruksi V2 memindahkan proyek dari prototipe visual menjadi fondasi platform nonprofit yang mengutamakan **trust, transparency, humanity, impact, accountability, accessibility**, keamanan, dan integritas data.

## Perubahan utama

- Seluruh angka dampak dan laporan keuangan simulasi dihapus.
- Foto acak/stock placeholder dihapus dari halaman publik.
- Logo resmi digunakan sebagai identitas utama tanpa menggambar ulang.
- Homepage direkonstruksi sebagai humanitarian editorial platform.
- Route publik mencakup Tentang, Program + detail, Kegiatan + detail, Berita + detail, Galeri + detail, Dampak, Transparansi, Organisasi, Donasi, Kontak, Pencarian, Privasi, Ketentuan, Kebijakan Donasi, Aksesibilitas, dan Disclaimer.
- Dynamic content registry dimulai kosong dan hanya boleh diisi dari record berstatus publikasi yang sah.
- Design system, skip link, focus state, reduced motion, semantic landmark, error/loading/empty states.
- `robots`/`sitemap` bersifat aman: website tidak diindeks sampai `NEXT_PUBLIC_SITE_URL` resmi dikonfigurasi.
- Security headers baseline, fail-closed API untuk donasi/kontak, serta health endpoint non-sensitif.
- Data model, PostgreSQL reference schema, CMS architecture, RBAC, payment contract, data governance, SEO, security, dan production-readiness terdokumentasi.

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

Gunakan CMS dan sumber resmi. Jika data belum ada, tampilkan empty state yang jujur.

## Quality gates

CI menjalankan dependency install yang reproducible, public-content integrity guard, lint, TypeScript typecheck, dan production build. Preview deployment tetap harus diuji karena keberhasilan CI tidak menggantikan verifikasi runtime/platform.

## Environment

Salin `.env.example` ke environment deployment. Jangan commit secret.

## Dokumen arsitektur

- `docs/CMS-ARCHITECTURE.md`
- `docs/DATA-GOVERNANCE.md`
- `docs/SECURITY-ARCHITECTURE.md`
- `docs/SEO-ARCHITECTURE.md`
- `docs/QUALITY-GATES.md`
- `docs/PRODUCTION-READINESS.md`
- `db/schema.sql`

## Tahap produksi berikutnya

1. Pilih dan deploy CMS/database/storage produksi.
2. Implementasi authentication, session, MFA, dan RBAC server-side.
3. Migrasi data kegiatan, berita, galeri dan dokumentasi asli melalui workflow publikasi.
4. Konfigurasi domain resmi, kontak, legalitas, organisasi, dan akun sosial.
5. Implementasi payment gateway resmi, signature webhook, idempotency, dan reconciliation.
6. Implementasi laporan keuangan dan impact metrics dari sumber data resmi.
7. Uji WCAG 2.2 AA, Core Web Vitals, security, privacy, SEO, dan payment E2E sebelum go-live.
