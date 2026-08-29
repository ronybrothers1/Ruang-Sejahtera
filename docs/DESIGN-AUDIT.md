# Design & Frontend Audit — 2026-08-29

Dilakukan oleh Claude atas permintaan pemilik repo, di branch `redesign/claude-refine`.
Fokus ronde ini: **kebersihan struktural yang aman diverifikasi tanpa render visual**
(sandbox kerja tidak punya akses ke `fonts.googleapis.com`, sehingga build/preview
penuh tidak bisa dijalankan di sini — verifikasi visual final disarankan lewat
Vercel preview deployment dari branch ini).

## Temuan #1 (utama): CSS bertumpuk 9 file, tidak pernah dikonsolidasi

`app/layout.tsx` sebelumnya mengimpor **9 file CSS sekaligus**:
`globals.css`, `v3.css`, `v31.css`, `v4.css`, `v41.css`, `v42.css`, `v43.css`,
`v5.css`, `v51.css` (total ±1500 baris). Setiap iterasi redesign ("V3", "V4",
"V5", dst.) rupanya ditambahkan sebagai *layer override baru*, bukan
menggantikan versi sebelumnya. Contoh konkret: `v42.css` dan `v51.css`
sama-sama mendefinisikan `.brand-logo-link` / `.brand-logo-image` dengan
`!important` yang saling menimpa.

**Risiko:** perang spesifisitas CSS, kode mati yang sudah dioverride tapi
tetap dikirim ke browser, sulit melacak aturan mana yang benar-benar aktif,
dan bundle lebih besar dari perlunya.

**Tindakan:** digabung menjadi satu `app/globals.css`, urutan cascade
dipertahankan **persis sama** dengan urutan import lama → perubahan ini
murni struktural, tidak mengubah tampilan.

**Rekomendasi lanjutan (belum dikerjakan ronde ini, butuh verifikasi visual):**
- Audit selector per selector untuk menghapus aturan yang benar-benar mati
  (contoh: bagian `.brand-logo-link` di layer V4.2 yang sudah sepenuhnya
  ditimpa V5.1).
- Pertimbangkan migrasi ke CSS Modules atau Tailwind utility murni supaya
  histori "versi" seperti ini tidak terulang.

## Temuan #2: Warna brand di-hardcode, bukan pakai design token

`@theme` di `globals.css` sudah mendefinisikan `--color-brand-red` (#e20d16)
dan `--color-brand-red-dark` (#b40810), tapi kode hex-nya di-hardcode ulang
51+ kali di seluruh file alih-alih memakai token tersebut.

**Tindakan:** seluruh kemunculan `#e20d16` → `var(--color-brand-red)` dan
`#b40810` → `var(--color-brand-red-dark)`. Nilai computed identik, jadi ini
juga tidak mengubah tampilan — tapi sekarang kalau brand color pernah perlu
diubah, cukup di satu tempat.

## Belum diaudit ronde ini (di luar cakupan "aman tanpa preview visual")

- Konsistensi skala tipografi/spacing antar section
- Kontras warna teks abu-abu (`#777`, `#888`, dst.) terhadap WCAG AA di
  berbagai background
- Kemungkinan duplikasi class antar halaman yang bisa disatukan jadi
  komponen React reusable
- Optimasi gambar/asset

## Cara verifikasi sebelum merge ke `main`

1. Vercel akan membuat preview deployment otomatis untuk branch
   `redesign/claude-refine` (asalkan integrasi GitHub↔Vercel aktif).
2. Bandingkan preview tersebut dengan `main` saat ini secara visual —
   seharusnya identik untuk perubahan di ronde ini.
3. Setelah dikonfirmasi identik, aman untuk merge.
