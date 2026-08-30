# Audit 08 — UX & User Flow

Tanggal audit: 30 Agustus 2026

Branch: `codex/audit-08-ux-user-flow`

Status integrasi: branch audit / Draft PR — **tidak di-merge ke `main` dan tidak dipromosikan ke production**

## Ruang lingkup dan metode

Audit ini menilai tujuan pengguna, perjalanan, task completion, jumlah langkah, friction, CTA, expectation match, feedback, error recovery, dan completion state. Audit 01–07 diperlakukan final. Perubahan dibatasi pada minimum effective change dan tidak mengubah information architecture, menu, sistem navigasi, layout, breakpoint, warna, tipografi, atau desain komponen.

Bukti diperoleh dari penelusuran source, simulasi flow pada production sebelum perubahan, pengujian kontrak otomatis, render production lokal, pemeriksaan seluruh route publik, serta regresi audit 01–07 dan media/footer. Konten, data, gambar, dan form contoh tetap dipertahankan.

## A. User goal map

| Prioritas | User goal | Intent dan completion state |
|---|---|---|
| Critical / high value | Menghubungi yayasan | Menemukan saluran resmi aktif dan membuka percakapan dengan konteks yang jelas. |
| Critical / high value | Menanyakan cara mendukung | Berpindah dari minat dukungan ke saluran resmi tanpa halaman perantara yang tidak memberi nilai. |
| High frequency | Memahami program | Menemukan daftar program, memilih program, membaca detail, lalu memperoleh tindakan lanjutan yang relevan. |
| High frequency | Menemukan informasi tertentu | Mengirim query, memahami hasil atau no-result, memilih hasil, lalu mencapai halaman tujuan. |
| Medium | Melihat kegiatan dan berita | Menemukan arsip, membedakan konten contoh dengan terbitan, membaca preview/detail yang tersedia, lalu melanjutkan eksplorasi. |
| Medium | Memahami dampak dan transparansi | Membaca bukti/status yang tersedia tanpa mengira data contoh sebagai data final. |
| Medium | Memahami simulasi donasi | Mencoba nominal contoh tanpa mengira pembayaran aktif, lalu memakai jalur dukungan resmi yang tersedia. |
| Recovery | Pulih dari error atau hasil kosong | Mengetahui keadaan, memilih retry atau jalan keluar, dan tidak terjebak dalam loop. |

Task publik yang tidak tersedia pada baseline operasional tidak dinilai seolah-olah aktif: pembayaran online, pengiriman form kontak, pendaftaran akun publik, filter, upload, dan destructive action. API kontak dan donasi tetap fail-closed agar tidak menciptakan completion palsu.

## B. User flow map

| Goal | Starting point | Steps | CTA | Destination | Completion |
|---|---|---|---|---|---|
| Memahami program | Beranda atau `/program` | Pilih program → baca detail | `Kenali Program`, kartu program | `/program/[slug]` | Detail program terbaca; arsip kegiatan dan dukungan tersedia sebagai kelanjutan. |
| Menemukan informasi | Search global atau `/cari` | Masukkan query → tinjau hasil → pilih hasil | `Cari`, kartu hasil | Route hasil yang relevan | Halaman tujuan terbuka; no-result menyediakan jalur alternatif. |
| Menghubungi yayasan | `/kontak` atau footer | Pilih saluran resmi | `Chat WhatsApp Resmi` | WhatsApp resmi | Composer eksternal terbuka dengan konteks pesan. |
| Menanyakan dukungan | `/donasi` | Pahami status preview → pilih saluran resmi | `Tanya via WhatsApp Resmi` | WhatsApp resmi | Composer terbuka dengan intent dukungan yang sudah terisi. |
| Melihat kegiatan | Program, beranda, atau `/kegiatan` | Buka arsip → pilih konten yang tersedia | `Lihat arsip kegiatan` | `/kegiatan` | Arsip terbuka tanpa janji bahwa seluruh item sudah merupakan terbitan final. |
| Melihat berita contoh | Beranda | Pilih preview | `Lihat preview berita` | `#preview-berita` | Pengguna tiba pada preview yang sesuai dengan label CTA. |
| Pulih dari runtime error | Error boundary | Baca penjelasan → retry atau keluar | `Coba Lagi`, `Ke Beranda` | Retry route atau `/` | Pengguna dapat melanjutkan tanpa retry loop wajib. |
| Pulih dari no-result | `/cari` tanpa hasil | Pilih area alternatif atau ubah query | Program, Kegiatan, Transparansi, Kontak | Route pilihan | Journey berlanjut tanpa dead end. |

Journey utama tetap konsisten pada desktop, tablet, dan mobile: **Entry → Orientation → Exploration → Decision → Action → Completion**. Perbedaan presentasi antarlayar tidak mengubah tujuan atau destination.

## C. Before vs after

Langkah dihitung sebagai aksi pengguna setelah tiba pada starting point task. Membaca informasi yang diperlukan tidak dihitung sebagai redundant step.

| User flow | Before | After | Improvement |
|---|---:|---:|---|
| Menghubungi organisasi dari `/kontak` | 3 langkah: cari saluran aktif → berpindah area/halaman → buka WhatsApp | 1 langkah: buka CTA WhatsApp resmi | Menghapus 2 avoidable steps dan status BLOCKED pada main content. |
| Menanyakan cara mendukung dari `/donasi` | 3 langkah: buka kontak → mencari saluran aktif → buka WhatsApp | 1 langkah: buka WhatsApp resmi | Menghapus halaman perantara dan mempertahankan intent dalam pesan. |
| Pencarian dengan query berulang | 2 langkah lalu gagal: submit/akses URL → error boundary | 1 langkah: render hasil untuk nilai pertama | Menghilangkan runtime crash dan retry loop. |
| Recovery dari runtime error | 2+ langkah: retry; bila penyebab persisten kembali ke error | 1 langkah untuk memilih retry atau keluar ke beranda | Menambah user control dan jalan keluar eksplisit. |
| Membuka berita contoh | 1 langkah, tetapi label menjanjikan cerita penuh | 1 langkah dengan label preview yang akurat | Step count tetap optimal; expectation match meningkat. |
| Membuka kegiatan dari detail program | 1 langkah, tetapi label mengimplikasikan terbitan final | 1 langkah menuju arsip dengan label akurat | Step count tetap optimal; destination lebih predictable. |

Tidak ada optimized flow yang memperoleh langkah tambahan.

## D. Friction points

### Critical

| User goal → Friction point → Root cause → Impact → Fix | Status |
|---|---|
| Search → URL valid dengan `?q=air&q=program` memicu runtime error → server mengasumsikan `q` selalu string dan memanggil `.slice()` pada array → pencarian gagal total dan tombol retry mengulang kegagalan → terima `string | string[]`, pilih nilai pertama secara deterministik, lalu batasi 120 karakter. | Fixed |

### High

| User goal → Friction point → Root cause → Impact → Fix | Status |
|---|---|
| Contact organization → halaman kontak hanya menampilkan alamat/email/form contoh dan tidak memberi action aktif pada main task area → saluran aktif hanya dapat ditemukan secara tidak langsung → task utama tampak blocked dan drop-off tinggi → tambah CTA langsung ke WhatsApp resmi, pesan berkonteks, dan penanda transisi eksternal. | Fixed |
| Ask how to support → CTA dari donasi menuju halaman kontak yang tetap tidak menyelesaikan task → destination terlalu umum dan menambah pencarian ulang → pengguna backtrack atau berhenti → arahkan CTA langsung ke WhatsApp resmi dengan intent dukungan. | Fixed |

### Medium

| User goal → Friction point → Root cause → Impact → Fix | Status |
|---|---|
| Runtime recovery → hanya ada retry → error persisten menciptakan loop → pengguna tidak memiliki control untuk keluar → pertahankan retry dan tambahkan `Ke Beranda`. | Fixed |
| Open sample news → label `Baca cerita` menuju preview → expectation dan actual result tidak sama → kepercayaan CTA menurun → ubah label menjadi `Lihat preview berita`. | Fixed |
| Explore program activity → label `Lihat kegiatan terbit` menuju arsip campuran/preview → label menjanjikan status yang belum tersedia → pengguna harus menafsir ulang destination → ubah menjadi `Lihat arsip kegiatan`. | Fixed |

### Low

Tidak ditemukan low-severity flow issue yang layak diubah tanpa keluar dari scope. Flow yang sudah singkat dan predictable dipertahankan.

## E. CTA audit

| CTA | User intent | Destination | Status |
|---|---|---|---|
| `Kenali Program` | Mulai memahami program | `/program` | Sesuai dan dipertahankan. |
| `Cara Mendukung` | Memahami opsi dukungan | `/donasi` | Sesuai dan dipertahankan. |
| `Chat WhatsApp Resmi` | Menghubungi yayasan sekarang | `wa.me/6282334030628` dengan pesan kontak | Fixed; direct, aktif, predictable, external transition dijelaskan. |
| `Tanya via WhatsApp Resmi` | Bertanya sebelum mendukung | `wa.me/6282334030628` dengan pesan dukungan | Fixed; redundant contact-page step dihapus. |
| `Kebijakan Donasi` | Memahami ketentuan sebelum bertindak | `/kebijakan-donasi` | Relevant secondary action; dipertahankan. |
| `Lihat preview berita` | Membuka materi contoh | `#preview-berita` | Fixed; label sesuai actual result. |
| `Lihat arsip kegiatan` | Menjelajahi arsip dari konteks program | `/kegiatan` | Fixed; label sesuai destination. |
| `Coba Lagi` | Mengulang render setelah error sementara | Retry current route | Sesuai, tetap primary recovery. |
| `Ke Beranda` | Keluar dari error persisten | `/` | Fixed; loop-breaking secondary recovery. |
| `Lanjutkan Pembayaran · SIMULASI` | Memahami flow contoh | Tidak submit, disabled | Jujur terhadap status operasional; dipertahankan. |
| `Kirim Pesan · SIMULASI` | Memahami form contoh | Tidak submit, disabled | Jujur terhadap status operasional; saluran aktif kini tersedia terpisah. |

Decision load tetap proporsional: task kontak memiliki satu action aktif utama; task dukungan memiliki satu action langsung dan satu policy action; simulasi tidak dipresentasikan sebagai transaksi aktif.

## F. Task efficiency

Skor diberikan setelah perbaikan berdasarkan jumlah aksi, kesesuaian CTA-destination, adanya completion/recovery path, dan hasil kontrak runtime. `10` hanya diberikan bila faktor terkait memiliki bukti langsung dan tidak mempunyai friction tersisa pada scope.

| Task | Goal clarity | Discoverability | Flow clarity | Step efficiency | CTA clarity | Cognitive load | Error recovery | Completion clarity | Overall | Alasan ringkas |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Memahami program | 9 | 9 | 9 | 9 | 9 | 9 | 8 | 9 | 8.9 | Jalur detail dan kelanjutan jelas; konten final masih menunggu data resmi. |
| Mencari informasi | 9 | 9 | 9 | 10 | 9 | 9 | 9 | 9 | 9.1 | Query normal, panjang, berulang, dan no-result memiliki hasil deterministik atau next action. |
| Menghubungi yayasan | 10 | 9 | 10 | 10 | 10 | 9 | 8 | 9 | 9.4 | Satu action langsung ke kanal resmi; completion akhir terjadi di aplikasi eksternal. |
| Menanyakan dukungan | 9 | 9 | 10 | 10 | 10 | 9 | 8 | 9 | 9.3 | Intent dipertahankan dalam pesan; tidak ada halaman perantara. |
| Menjelajahi kegiatan/berita | 9 | 9 | 9 | 9 | 10 | 9 | 8 | 9 | 9.0 | Label membedakan preview dan arsip; CTA tidak menjanjikan konten yang belum terbit. |
| Memahami simulasi donasi | 9 | 9 | 9 | 9 | 10 | 9 | 8 | 9 | 9.0 | Batas simulasi eksplisit; real-payment completion memang tidak diaktifkan. |
| Pulih dari error/no-result | 9 | 9 | 9 | 9 | 9 | 9 | 10 | 9 | 9.1 | Retry, exit, alternative destinations, dan query correction tersedia. |

**Overall UX Flow Score: 9.1/10.** Nilai bukan penilaian estetika. Batas utama berasal dari fakta bahwa konfirmasi akhir WhatsApp berlangsung di platform eksternal dan submission/payment production belum diaktifkan.

## G. Perbaikan yang diterapkan

1. Membuat satu helper `whatsappUrl()` untuk menormalisasi nomor resmi dan meng-encode konteks pesan secara konsisten.
2. Menambahkan action kontak aktif langsung pada halaman kontak tanpa menghapus alamat, email, atau form contoh.
3. Mengarahkan pertanyaan dukungan langsung dari halaman donasi ke WhatsApp resmi tanpa halaman perantara.
4. Menangani `searchParams.q` sebagai string atau array, memilih nilai pertama, dan tetap menerapkan batas 120 karakter.
5. Menambahkan exit menuju beranda pada runtime error tanpa menghapus mekanisme retry.
6. Menyesuaikan dua label CTA agar actual destination sesuai dengan ekspektasi pengguna.
7. Menambahkan `scripts/check-ux-flow.mjs` sebagai quality gate berisi kontrak task, CTA, fail-closed API, dan step-count non-regression.
8. Memperluas production runtime smoke dengan repeated-query, active contact channel, direct support handoff, nomor resmi, dan recovery contracts.

Tidak ada program, berita, kegiatan, data, gambar, video, form, atau konten contoh yang dihapus.

## H. Regression result

| Pemeriksaan | Target | Hasil |
|---|---|---|
| UX source contracts | 26 kontrak pada 6 flow | PASS |
| Step-count regression | Tidak ada flow memperoleh langkah tambahan | PASS |
| Repeated-query runtime | `/cari?q=air&q=program` HTTP 200, memakai `air`, tanpa error boundary | PASS |
| Public route runtime | Seluruh route publik menghasilkan HTML non-empty | PASS |
| Contact/donation runtime | Preview tetap guarded; kanal resmi aktif dan nomor benar | PASS |
| Contact/payment APIs | Backend nonaktif mengembalikan 503 eksplisit, tidak menciptakan success palsu | PASS |
| ESLint | Zero warning | PASS |
| TypeScript | Zero type error | PASS |
| Production build | Seluruh route berhasil dibangun | PASS |
| Audit 01–03 | Information architecture, navigation, layout/integrity | PASS |
| Audit 04 | Responsive contract | PASS |
| Audit 05 | Color/contrast contract | PASS |
| Audit 06 | Typography contract | PASS |
| Audit 07 | UI component/state contract | PASS |
| Media/footer | Integrasi media dan sistem footer | PASS |
| Konten contoh | Tidak dihapus atau dikurangi | PASS |
| Main / production | Tidak diubah pada audit ini | PASS |

QA applicability:

- Filter flow: tidak ada filter publik pada baseline, sehingga tidak diuji seolah-olah tersedia.
- Success flow form/payment: belum aktif secara operasional; sistem tetap fail-closed dan mengarahkan task yang dapat diselesaikan ke kanal resmi.
- Destructive flow: tidak ada destructive action publik.
- Authentication: admin berada di scope operasional terpisah dan tidak diubah oleh audit user flow publik ini.
- Mobile/desktop: tujuan, label, destination, dan jumlah langkah sama; tidak ada breakpoint atau responsive architecture yang diubah.

## I. Final verdict

**UX & USER FLOW OPTIMAL** untuk baseline preview dan kanal operasional yang saat ini tersedia.

Verdict didasarkan pada perbaikan seluruh temuan Critical–Medium, pengurangan langkah yang terukur, expectation match CTA, recovery path, source contracts, production runtime smoke, serta regresi audit sebelumnya. Ini bukan klaim bahwa pembayaran atau pengiriman form production sudah aktif. Kedua fungsi tersebut tetap dinyatakan sebagai simulasi dan fail-closed sampai backend resmi tersedia.
