# Admin & CMS Control Plane

## Tujuan

Panel `/admin` adalah control plane terpisah dari website publik. Fitur yang
belum mempunyai backend, kredensial, atau sumber data resmi tetap fail-closed
dan tidak menyimpan data ke browser atau filesystem serverless sementara.

## Autentikasi

Production menggunakan Clerk dan PostgreSQL. Login tersedia di `/masuk`,
registrasi di `/daftar`, portal pengguna di `/akun`, serta control plane di
`/admin`.

Bootstrap HMAC lama tetap dipertahankan hanya untuk pengujian lokal/preview,
otomatis ditolak pada `VERCEL_ENV=production`, dan bukan alternatif identity
provider production.

## Role dan authority

- `super_admin`: seluruh control plane, kurasi, publikasi, pengguna, ujian,
  kartu anggota, sistem, serta laporan keuangan.
- `core_manager`: membuat dan mengubah konten miliknya sendiri, mengunggah
  media, lalu mengirim konten untuk kurasi.
- `member`: mengikuti proses keanggotaan serta membuat dan mengirim konten
  miliknya sendiri setelah mempunyai akun.

Pengurus inti dan anggota tidak memiliki `content.publish`, `finance.manage`,
atau `reports.publish`. Penyembunyian tombol bukan kontrol utama; permission
yang sama diperiksa kembali di server dan pada fungsi transisi status.

## Workflow konten

- `draft → pending_review`
- `pending_review → revision_required | approved | rejected`
- `revision_required → pending_review`
- `approved → published | revision_required`
- `published → archived`
- `archived → draft`

Pengajuan dilakukan pemilik konten. Keputusan kurasi, publikasi, dan arsip hanya
dapat dilakukan Super Admin. Website publik hanya menampilkan record
`published`.

## Database dan audit

Schema Drizzle berada di `lib/db/schema.ts`; SQL awal di
`db/migrations/0000_initial_auth_rbac.sql`. Database mencakup pengguna,
permohonan anggota, ujian, kartu, konten/revisi/review, media, laporan keuangan,
dan audit log.

Migrasi dan seed dijalankan secara eksplisit:

```bash
npm run db:migrate
npm run db:seed-super-admin
```

Nilai aktual hanya diberikan lewat secret manager/environment deployment.

## CMS sementara

Konten publik lama masih dibaca dari registry versioned:

- `content/cms/articles.json`
- `content/cms/activities.json`
- `content/cms/galleries.json`

Adapter tulis CMS tetap disabled sampai repository PostgreSQL, optimistic
concurrency, audit event, dan revalidation publik pada fase konten selesai.

## Gate production

1. Hubungkan Clerk dan Neon pada project Vercel yang benar.
2. Terapkan migrasi dan seed Super Admin.
3. Aktifkan email verification serta MFA.
4. Verifikasi signature dan delivery webhook Clerk.
5. Uji penolakan `/admin` untuk role anggota.
6. Uji bahwa tidak ada endpoint publish/finance untuk non-Super Admin.
7. Selesaikan preview browser desktop/mobile sebelum merge ke `main`.
