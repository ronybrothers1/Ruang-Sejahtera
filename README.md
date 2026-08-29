# Yayasan Ruang Sejahtera — Trust-First Public Platform

Rekonstruksi terbaru memindahkan proyek dari prototipe visual menjadi fondasi platform nonprofit yang mengutamakan **trust, transparency, humanity, impact, accountability, accessibility**, keamanan, dan integritas data.

## Perubahan utama

- Seluruh angka dampak dan laporan keuangan simulasi dihapus.
- Foto acak/stock placeholder dihapus dari halaman publik dan diganti sistem visual program berbasis identitas brand.
- Logo resmi digunakan sebagai identitas utama tanpa menggambar ulang.
- Homepage direkonstruksi sebagai humanitarian trust-first platform.
- Route publik mencakup Tentang, Program + detail, Kegiatan + detail, Berita + detail, Galeri + detail, Dampak, Transparansi, Organisasi, Donasi, Kontak, Pencarian, Privasi, Ketentuan, Kebijakan Donasi, Aksesibilitas, dan Disclaimer.
- Dynamic content registry berasal dari `content/cms/*.json` dan hanya record berstatus `published` yang masuk ke website publik.
- Control plane `/admin` dibangun terpisah dari chrome website publik dengan dashboard, CMS editorial, modul transparansi, dan observabilitas permission.
- Preview admin authentication memakai signed HttpOnly session, hashed access key, TTL terbatas, same-origin mutation guard, request limits, dan otomatis diblokir pada `VERCEL_ENV=production`.
- RBAC server-side menggunakan role `super_admin`, `content_admin`, `finance`, dan `editor`; role editor tidak memiliki authority publish.
- Workflow editorial dibatasi pada `draft → review → published → archived` dengan jalur kembali yang terkontrol dan metadata provenance aktor/waktu.
- Form Berita, Kegiatan, dan Galeri mempunyai server-side validation; backend tulis tetap **fail-closed** sampai persistence produksi tersedia.
- Design system, skip link, focus state, reduced motion, semantic landmark, error/loading/empty states.
- `robots`/`sitemap` bersifat aman: website tidak diindeks sampai `NEXT_PUBLIC_SITE_URL` resmi dikonfigurasi; control plane admin selalu noindex/no-store.
- Security headers baseline, fail-closed API untuk donasi/kontak/CMS mutation, serta health endpoint non-sensitif.
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

## Admin & CMS

Registry editorial versioned:

- `content/cms/articles.json`
- `content/cms/activities.json`
- `content/cms/galleries.json`

Status workflow: `draft → review → published → archived`. Public registry hanya membaca `published`. Record review/published/archived wajib membawa provenance yang sesuai dan CI akan menolak metadata workflow yang tidak lengkap.

Form dan mutation endpoint sudah disiapkan, tetapi persistence write adapter sengaja dinonaktifkan sampai backend produksi dipilih dan diaudit. Tidak ada fallback ke localStorage atau filesystem serverless sementara.

Bootstrap admin authentication hanya untuk local/preview dan bukan autentikasi production. Lihat `docs/ADMIN-CMS.md` untuk threat boundary, separation of duties, dan konfigurasi.

## Quality gates

CI menjalankan dependency install yang reproducible, public-content + CMS provenance integrity guard, lint, TypeScript typecheck, dan production build. Preview deployment tetap diuji karena keberhasilan CI tidak menggantikan verifikasi runtime/platform.

## Environment

Salin `.env.example` ke environment deployment. Jangan commit secret.

## Dokumen arsitektur

- `docs/ADMIN-CMS.md`
- `docs/CMS-ARCHITECTURE.md`
- `docs/DATA-GOVERNANCE.md`
- `docs/SECURITY-ARCHITECTURE.md`
- `docs/SEO-ARCHITECTURE.md`
- `docs/QUALITY-GATES.md`
- `docs/PRODUCTION-READINESS.md`
- `db/schema.sql`

## Tahap produksi berikutnya

1. Pilih dan deploy persistence CMS/database/storage produksi dengan backup, restore, concurrency control, dan audit trail.
2. Ganti preview bootstrap authentication dengan identity provider production + MFA + account/session lifecycle; pertahankan RBAC server-side dan separation of duties.
3. Hubungkan workflow draft/review/publish/archive ke persistence adapter dan immutable application audit log.
4. Migrasi data kegiatan, berita, galeri dan dokumentasi asli melalui workflow publikasi.
5. Konfigurasi domain resmi, kontak, legalitas, organisasi, dan akun sosial.
6. Implementasi payment gateway resmi, signature webhook, idempotency, reconciliation, dan finance approval flow.
7. Implementasi laporan keuangan dan impact metrics dari sumber data resmi.
8. Uji WCAG 2.2 AA, Core Web Vitals, security, privacy, SEO, restore drill, dan payment E2E sebelum go-live.
