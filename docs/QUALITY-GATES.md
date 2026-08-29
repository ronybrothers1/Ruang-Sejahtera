# Quality Gates V2

Pull request V2 tidak dianggap siap merge hanya karena tampilannya menarik.

## Otomatis di CI
1. `npm ci`: lockfile harus sinkron dan instalasi reproducible.
2. `npm run integrity`: menolak kembali placeholder gambar acak, link `#`, jejak AI Studio, lokasi prototipe, nilai rupiah hardcoded, dan statistik fiktif yang pernah ada.
3. `npm run lint`: zero warning.
4. `npm run typecheck`: TypeScript tanpa error.
5. `npm run build`: production build harus sukses.

## Wajib sebelum produksi
- Audit WCAG 2.2 AA dengan keyboard dan screen reader.
- Lighthouse/Core Web Vitals pada deployment nyata.
- Review CSP setelah domain CDN, CMS, analytics, atau payment gateway ditetapkan.
- Penetration/security review untuk auth, upload, form, dan payment.
- Verifikasi semua legalitas, kontak, pengurus, rekening/QRIS, laporan, dan statistik dengan sumber resmi.
- Review consent dokumentasi penerima manfaat.
- Uji alur donasi end-to-end termasuk webhook, idempotency, kegagalan, refund, dan rekonsiliasi.
