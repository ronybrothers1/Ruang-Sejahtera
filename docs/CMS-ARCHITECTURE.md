# CMS & Data Architecture V2

## Tujuan
Administrator nonteknis harus dapat memperbarui website tanpa menyentuh kode. CMS produksi wajib memisahkan konten editorial, data program, media, keuangan, pengguna, dan audit log.

## Entitas inti
- Program
- Activity/Kegiatan
- Article/Berita
- Media/Galeri
- Impact Metric
- Donation/Transaction
- Financial Report
- Organization Member
- Public Document
- User & Role
- Audit Log

## Relasi utama
`Program -> Activity -> Media -> Impact -> Funding/Report`

`Donation -> Transaction -> Allocation -> Program -> Disbursement -> Report`

## Role minimum
- `super_admin`: konfigurasi dan seluruh modul.
- `content_admin`: program, kegiatan, berita, media, halaman.
- `finance`: transaksi, alokasi, laporan keuangan, dokumen finansial.
- `editor`: review dan publikasi konten, tanpa akses transaksi.

## Workflow publikasi
Draft -> Review -> Published -> Archived.

Konten penerima manfaat yang mengandung anak atau pihak rentan harus memiliki metadata consent/restriction sebelum publikasi.

## Prinsip integritas
Tidak ada angka dampak, laporan keuangan, status terverifikasi, rekening, QRIS, legalitas, kontak, pengurus, atau mitra yang dibuat sebagai dummy publik.
