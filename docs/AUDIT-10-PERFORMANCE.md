# Audit 10 — Performance

Tanggal audit: 30 Agustus 2026  
Baseline produksi: `https://ruang-sejahtera-iota.vercel.app/`  
Branch implementasi: `codex/audit-10-performance`  
Ruang lingkup: performa saja; desain, isi, media, navigasi, responsivitas, dan kontrak Audit 01–09 dipertahankan.

## Ringkasan eksekutif

Baseline beranda sudah kuat, tetapi dua masalah terukur masih berdampak nyata:

1. boundary `app/loading.tsx` di root membuat halaman statis mengirim skeleton sebagai isi awal `<main>`. Pada pengukuran mobile, elemen LCP adalah judul beranda dan 770 ms berasal dari penundaan render, bukan pengunduhan gambar;
2. empat iframe TikTok di galeri tetap aktif terlalu awal meskipun memakai `loading="lazy"`. Audit galeri memindahkan 6.340 KiB, menghasilkan TBT 450 ms, 2,6 detik pekerjaan main thread, dan 12 long task.

Implementasi menghapus boundary loading dari rute publik statis, mempertahankannya secara khusus untuk control plane admin, serta mengaktifkan iframe TikTok melalui `IntersectionObserver` 600 px sebelum pemain memasuki viewport. Semua video tetap merupakan embed resmi yang dapat diputar di halaman, dengan rasio, judul, deskripsi, fallback teks, dan kebijakan no-autoplay tetap utuh.

## A. Performance baseline

Pengukuran lab memakai PageSpeed Insights/Lighthouse 13.4.1 pada 30 Agustus 2026. Mobile menggunakan emulasi Moto G Power dan Slow 4G. Tidak ada data CrUX/field untuk URL yang diuji, sehingga INP lapangan belum tersedia.

| Halaman / mode | Score | FCP | LCP | TBT | CLS | Speed Index | Payload | Catatan |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Beranda mobile | 97 | 1,4 dtk | 2,6 dtk | 60 md | 0 | 1,6 dtk | 399 KiB | LCP sedikit melewati ambang baik 2,5 dtk |
| Beranda desktop | 99 | 0,4 dtk | 0,6 dtk | 10 md | 0 | 1,0 dtk | — | Seluruh CWV lab baik |
| Galeri mobile | 81 | 1,1 dtk | 3,3 dtk | 450 md | 0 | 2,7 dtk | 6.340 KiB | Empat player TikTok aktif pada initial load |

Baseline tambahan:

- judul `h1#home-title` adalah elemen LCP beranda mobile;
- rincian LCP beranda menunjukkan 770 ms penundaan render;
- CSS render-blocking beranda: 46,2 KiB dengan potensi lab 620 ms;
- potensi penghematan gambar beranda: 27 KiB;
- unused JavaScript: 29 KiB; legacy JavaScript: 14 KiB;
- eksekusi JavaScript beranda: 0,3 dtk; pekerjaan main thread: 0,7 dtk;
- galeri: pekerjaan main thread 2,6 dtk dan 12 long task;
- satu origin TikTok CDN sendiri memindahkan 1.793,6 KiB; resource player yang sama diunduh berulang untuk empat iframe;
- INP: tidak tersedia karena tidak ada data pengguna nyata. TBT dipakai hanya sebagai proxy lab, bukan pengganti INP.

## B. Temuan dan prioritas

### P0 — Player TikTok dimuat sebelum dibutuhkan

`loading="lazy"` bawaan browser menggunakan ambang yang cukup jauh dari viewport. Karena seluruh grid video masih berada dalam ambang tersebut, keempat iframe membuat konteks dokumen, JavaScript, gambar poster, cookie banner, dan resource TikTok masing-masing saat initial load.

Perbaikan:

- server render kini menghasilkan empat kartu dengan placeholder berukuran tetap dan nol iframe;
- `IntersectionObserver` mengaktifkan player 600 px sebelum area video masuk viewport;
- iframe yang sudah aktif tetap memakai `loading="lazy"`, `autoplay=0`, `loop=0`, judul unik, dan `aria-describedby`;
- rasio 9:16 dan `contain-intrinsic-size` mencegah CLS;
- animasi placeholder dinonaktifkan saat `prefers-reduced-motion: reduce`.

### P1 — Boundary loading global menunda konten statis

Root loading boundary mengirim skeleton sebagai isi awal halaman statis. Konten nyata baru dipasang setelah stream mencapai payload berikutnya, sehingga teks LCP tertunda walaupun TTFB dan gambar hero sudah baik.

Perbaikan:

- `app/loading.tsx` dihapus dari root publik;
- loading state tetap tersedia sebagai `app/admin/loading.tsx` untuk rute admin yang dinamis;
- hasil build beranda kini menempatkan hero dan H1 langsung dalam `<main>` awal, tanpa skeleton publik.

### P2 — CSS kritis dan image headroom kecil

CSS blocking 46,2 KiB dan potensi image saving 27 KiB terdeteksi. Keduanya tidak diubah secara agresif karena:

- stylesheet berisi kontrak visual/responsif global Audit 01–09 dan menunda CSS akan menimbulkan FOUC atau regresi layout;
- semua media sudah melalui `next/image`, AVIF/WebP, responsive `sizes`, intrinsic ratio, dan lazy loading;
- menurunkan kualitas visual demi 27 KiB bertentangan dengan kebutuhan dokumentasi yayasan.

Keputusan: pertahankan sebagai minor residual optimization, bukan melakukan score chasing.

### P3 — Framework JavaScript residual

Unused JavaScript 29 KiB dan legacy JavaScript 14 KiB terutama berasal dari runtime/framework. Mengubah transpilation atau mengganti arsitektur navigasi akan memperbesar risiko terhadap Audit 07–09 dibanding nilai penghematannya.

## C. Core Web Vitals sebelum/sesudah

| Area | Sebelum | Sesudah implementasi | Status |
|---|---|---|---|
| LCP beranda mobile | 2,6 dtk; 770 md render delay | H1 hadir langsung di HTML awal; numeric public rerun menunggu production | Perbaikan struktural terverifikasi |
| LCP beranda desktop | 0,6 dtk | Jalur kritis hero tidak diubah | Tetap baik |
| TBT beranda mobile | 60 md | Initial JS beranda tidak bertambah | Tetap baik |
| CLS beranda | 0 | Semua dimensi dan layout dipertahankan | Tetap baik |
| LCP galeri mobile | 3,3 dtk | Root loading boundary tidak lagi menahan H1 | Perbaikan struktural terverifikasi |
| TBT galeri mobile | 450 md | Empat third-party execution context dihilangkan dari initial load | High-impact fix terverifikasi secara arsitektural |
| CLS galeri | 0 | Placeholder mempertahankan rasio 9:16 | Tetap baik |
| INP | Tidak ada field data | Tetap memerlukan RUM/CrUX setelah traffic mencukupi | Belum dapat dinilai |

Catatan pengukuran sesudah: Vercel menandai preview commit `5bbb036` sukses, tetapi preview dilindungi oleh Vercel Authentication pada workspace yang berbeda dari konektor audit. Karena user meminta tidak merge/deploy production, PageSpeed publik sesudah tidak dipaksakan dan angka CWV baru tidak direkayasa. Gate numeric harus dijalankan ulang pada artefak yang akhirnya dipromosikan.

## D. Resource optimization

| Resource | Kondisi sesudah | Keputusan |
|---|---|---|
| Gambar | `next/image`, AVIF/WebP, `sizes`, lazy loading, hero priority | Dipertahankan; tidak menurunkan kualitas visual |
| Font | `next/font`, self-hosted WOFF2, `display: swap` | Dipertahankan; tidak ada remote font blocking |
| CSS | 3 file critical, 39.007 byte gzip pada build | Tidak didefer untuk mencegah FOUC/regresi |
| JS beranda | 607.163 byte raw initial references; tidak berubah | Tidak ada biaya client baru pada beranda |
| JS galeri | Loader viewport menambah 1.812 byte raw pada total build | Diterima untuk menunda megabyte third-party resource |
| TikTok | 0 iframe pada SSR/initial render; 4 placeholder stabil | Player langsung dimuat menjelang viewport |
| Caching | Aset Next hashed/immutable; media melewati Image Optimization | Konfigurasi aman dipertahankan |
| Compression | Build Next minified; transfer Vercel dikompresi | Tidak ada kompresi manual duplikatif |

## E. Perbandingan sebelum/sesudah

| Indikator | Sebelum | Sesudah | Perubahan |
|---|---:|---:|---:|
| Root public loading boundary | 1 | 0 | Dihapus dari jalur LCP publik |
| TikTok iframe pada initial galeri | 4 | 0 | -100% initial iframe |
| Kartu/video yang tersedia | 4 | 4 | Konten utuh |
| Placeholder dengan rasio final | 0 | 4 | CLS tetap terlindungi |
| Total JS build | 612.690 B | 614.502 B | +1.812 B / +0,30% |
| Total CSS build | 204.063 B | 204.592 B | +529 B / +0,26% |
| Critical first-party galeri build | — | 303.604 B gzip + 9.600 B HTML gzip | Batas first-party terukur |
| Payload galeri PageSpeed | 6.340 KiB | Public rerun pending | Third-party initial request secara struktural menjadi nol |
| Main HTML beranda | Skeleton loading | Hero/H1 langsung | LCP tidak lagi menunggu stream fallback |

## F. Performance improvement

- 100% iframe TikTok dihapus dari initial render (4 menjadi 0), tanpa menghapus satu pun video;
- empat execution context pihak ketiga, request player, poster, cookie banner, dan duplikasi bundle TikTok ditunda sampai benar-benar mendekati viewport;
- judul LCP beranda kini berada langsung di HTML awal pada offset byte 8.039;
- initial JavaScript beranda tetap 607.163 byte raw;
- biaya loader galeri hanya 1.812 byte raw (+0,30% total JS build) untuk menunda payload third-party berukuran beberapa megabyte;
- CLS tetap 0 secara kontrak karena ukuran placeholder identik dengan frame akhir;
- tidak ada pengurangan kualitas gambar, penghapusan data contoh, perubahan hierarchy, atau redesign.

## G. Regression test

| Area | Hasil | Bukti |
|---|---|---|
| Functionality | PASS | 22 public routes serta donation/contact/search/recovery smoke |
| Responsive | PASS | 33 viewport dan breakpoint contract |
| Accessibility | PASS | 49 source contract + 15-route runtime smoke |
| Visual integrity | PASS (source/build) | Rasio player, grid, media, CSS Audit 01–09 dipertahankan |
| User flow | PASS | 26 contract pada 6 primary flow |
| Media | PASS | 7 gambar teroptimasi + 4 player responsif |
| Footer | PASS | 23 footer contract |
| Typography | PASS | 27 contract dan 15 viewport scale |
| Color | PASS | 27 contrast pair |
| Components | PASS | 44 UI component contract |
| Performance | PASS | 27 performance contract, production build sukses, Vercel preview status sukses |

Perintah yang lulus:

```text
npm run lint
npm run typecheck
npm run build
npm run integrity
npm run responsive:audit
npm run color:audit
npm run typography:audit
npm run components:audit
npm run media:audit
npm run footer:audit
npm run ux:audit
npm run accessibility:audit
npm run performance:audit
npm run components:runtime
npm run accessibility:runtime
```

## Residual risks dan gate berikutnya

1. Jalankan ulang PageSpeed mobile/desktop pada artefak yang akhirnya dipromosikan; gunakan median minimal tiga run.
2. Pantau INP melalui RUM ketika traffic cukup; lab TBT bukan pengganti INP.
3. TikTok tetap merupakan pihak ketiga berat saat pengguna memang mendekati video. Ini disengaja agar semua embed tetap langsung dapat diputar.
4. CSS critical dan penghematan gambar kecil dapat ditinjau lagi hanya jika evidence baru menunjukkan regresi nyata.

## Final verdict

**GOOD WITH MINOR OPTIMIZATION**

Perbaikan high-impact sudah diterapkan dan semua regression gate Audit 01–09 lulus. Verdict belum dinaikkan menjadi `PERFORMANCE OPTIMIZED` karena belum ada rerun PageSpeed publik pada artefak sesudah dan INP field data belum tersedia.
