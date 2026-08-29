# Security Architecture V2

## Baseline publik
- HTTPS wajib pada deployment.
- Security headers melalui `next.config.ts`.
- CSP membatasi resource ke origin sendiri pada baseline.
- Tidak ada payment credential atau secret di repository.
- Halaman admin tidak dibangun sebagai route publik sebelum autentikasi dan RBAC tersedia.

## CMS & autentikasi
- Session cookie `HttpOnly`, `Secure`, dan `SameSite` yang sesuai.
- Password hashing modern bila password lokal digunakan.
- MFA untuk role dengan akses finansial/super admin.
- CSRF protection untuk operasi state-changing.
- Rate limiting untuk login, form, search berat, dan endpoint pembayaran.
- Audit log append-oriented untuk perubahan konten sensitif dan finansial.

## Upload
- Validasi MIME dan magic bytes.
- Batas ukuran dan dimensi.
- Nama file acak/non-user-controlled.
- Malware scanning bila infrastruktur mendukung.
- Media private/restricted tidak boleh memiliki URL publik permanen.

## Payment
- Gunakan gateway resmi Indonesia.
- Jangan menyimpan data kartu.
- Verifikasi signature webhook.
- Idempotency untuk callback.
- Rekonsiliasi sebelum transaksi masuk laporan publik.
- Pisahkan `pending`, `paid`, `failed`, `expired`, `refunded`.

## Data pribadi
- Data minimization dan purpose limitation.
- Retention policy.
- Consent/restriction metadata untuk dokumentasi pihak rentan.
- Akses internal berbasis least privilege.
