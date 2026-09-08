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

## Role aplikasi
- `super_admin`: seluruh konten, kurasi, publikasi, keuangan, pengguna, dan sistem.
- `core_manager`: membuat, mengedit milik sendiri, dan mengirim konten untuk kurasi.
- `member`: membuat, mengedit milik sendiri, dan mengirim konten untuk kurasi setelah memiliki akun.

Tidak ada role selain `super_admin` yang memiliki publication authority atau akses mutasi laporan keuangan.

## Workflow publikasi
Draft -> Menunggu Kurasi -> Perlu Perbaikan/Disetujui/Ditolak -> Terbit -> Diarsipkan.

Konten penerima manfaat yang mengandung anak atau pihak rentan harus memiliki metadata consent/restriction sebelum publikasi.

## Prinsip integritas
Tidak ada angka dampak, laporan keuangan, status terverifikasi, rekening, QRIS, legalitas, kontak, pengurus, atau mitra yang dibuat sebagai dummy publik.
