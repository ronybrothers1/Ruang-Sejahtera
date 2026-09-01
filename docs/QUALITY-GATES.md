# Quality Gates — Ruang Sejahtera V2

Quality gate tidak hanya mengecek apakah halaman dapat dibangun. Tujuannya adalah mencegah regresi yang merusak integritas data, keamanan control plane, aksesibilitas, dan kesiapan deployment.

## Gate otomatis saat ini

Pipeline CI menjalankan:

1. `npm ci` untuk instalasi dependency yang reproducible;
2. `npm run integrity` untuk memeriksa pola data fiktif/placeholder dan struktur registry CMS;
3. `npm run lint` tanpa warning;
4. `npm run typecheck`;
5. `npm run build` production.

Audit desain tambahan dijalankan sebelum branch media dapat diajukan:
- `npm run responsive:audit` untuk kontrak 33 viewport;
- `npm run color:audit` dan `npm run typography:audit` untuk menjaga sistem visual;
- `npm run components:audit` untuk state dan semantik komponen;
- `npm run media:audit` untuk aset lokal, transparansi label, iframe resmi TikTok, lazy loading, CSP, rasio, dan containment responsif.

Integrity guard juga memvalidasi tiga registry editorial pada `content/cms/`:
- root harus array;
- id dan slug harus unik;
- slug harus mengikuti format URL aman;
- publication status harus valid;
- timestamp dasar dan `lastEditedBy` wajib tersedia;
- record `pending_review` wajib mempunyai provenance pengajuan kurasi;
- record `revision_required`, `approved`, dan `rejected` wajib mempunyai provenance keputusan kurasi;
- record `published` wajib mempunyai `publishedAt` dan `publishedBy`;
- record `archived` wajib mempunyai provenance archive.

## Gate deployment

Build hijau belum cukup. Preview deployment harus diverifikasi untuk:
- response HTTP berhasil;
- public page tidak menerima fake data;
- `/admin/*` tetap noindex + no-store;
- control plane tidak merender public navigation/footer sebagai UI;
- unauthenticated admin tidak membuka protected workspace;
- bootstrap auth tetap disabled pada production environment;
- health endpoint tidak mengungkap secret atau detail internal.

## Gate perubahan CMS

Perubahan pada model/editorial workflow harus memastikan:
- `editor` tidak memperoleh `content.publish` secara tidak sengaja;
- server route memeriksa permission, bukan hanya UI;
- mutation tetap same-origin dan memiliki request limit;
- data dari form tidak boleh menetapkan sendiri actor id atau timestamp workflow;
- persistence backend yang belum tersedia harus fail-closed.

## Gate manual sebelum go-live

- review konten dan legalitas data;
- keyboard-only + screen reader smoke test;
- audit WCAG 2.2 AA;
- Core Web Vitals pada domain nyata;
- security review termasuk CSP, session, MFA, rate limiting, upload pipeline, dan dependency vulnerabilities;
- backup/restore drill;
- payment E2E, webhook signature, idempotency, settlement reconciliation, refund/failed/expired flow;
- privacy review untuk donor dan penerima manfaat.

Status `production ready` hanya boleh diberikan setelah gate manual dan infrastruktur yang relevan mempunyai bukti pengujian, bukan berdasarkan keberhasilan build semata.
