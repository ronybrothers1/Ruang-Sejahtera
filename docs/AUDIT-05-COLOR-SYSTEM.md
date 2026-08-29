# Audit 05: Color System

Tanggal audit: 29 Agustus 2026

Branch kumulatif: `codex/audit-series`

Basis: Audit 04 (`faa813f`)

Status: selesai secara source, contrast contract, build, dan SSR; belum digabungkan ke `main`

## A. Kondisi awal dan batas audit

Audit ini hanya menilai color system: inventaris warna, peran semantik, harmoni, kontras WCAG, focus/hover/disabled state, status feedback, form, card, gradient, overlay media, hubungan warna dengan identitas program, color-vision deficiency, konsistensi lintas halaman, serta penggunaan token.

Audit tidak mengubah information architecture, menu, layout, grid, spacing, ukuran komponen, posisi, breakpoint, struktur section, copy, data, foto, atau jumlah konten yang telah disahkan pada Audit 01–04. Seluruh foto dan data contoh dipertahankan. Tidak ada PR, merge ke `main`, atau promosi production.

Kondisi awal memiliki fondasi visual yang baik: merah merek kuat, neutral hangat cukup tenang, section gelap memiliki kontras tinggi, dan lima warna program membantu orientasi. Namun implementasinya belum menjadi sistem yang aman. Token Tailwind merah bersifat self-reference, beberapa warna aktif hanya berupa literal tanpa peran, form publik menghapus outline keyboard, batas input terlalu samar, copy pada CTA merah berada di bawah ambang AA, dan status admin memakai palette utility yang terpisah dari sistem publik.

## B. Inventaris warna final

### B1. Primitive palette

| Kelompok | Token | Nilai | Fungsi |
|---|---|---:|---|
| Brand | `--palette-red-700` | `#d71920` | Merah resmi, CTA, tanda aktif |
| Brand dark | `--palette-red-900` | `#9f0d12` | Hover, link, aksen teks di permukaan terang |
| Brand soft | `--palette-red-050` | `#fff0f0` | Permukaan aksen/error lembut |
| Ink | `--palette-ink-950` | `#111114` | Teks utama |
| Ink soft | `--palette-ink-900` | `#1b1a1d` | Permukaan gelap sekunder |
| Warm paper | `--palette-sand-050` | `#fbfaf7` | Background halaman |
| Warm paper | `--palette-sand-100` | `#f6f3ed` | Background section |
| Warm paper | `--palette-sand-150` | `#f0eee9` | Background muted |
| Warm neutral | `--palette-sand-600` | `#625e59` | Teks sekunder |
| White | `--palette-white` | `#ffffff` | Raised surface dan teks inverse |

### B2. Semantic roles

| Peran | Nilai final | Kontrak penggunaan |
|---|---:|---|
| Page / section / muted surface | `#fbfaf7` / `#f6f3ed` / `#f0eee9` | Ritme surface terang |
| Raised surface | `#ffffff` | Card dan field |
| Dark / raised-dark surface | `#101013` / `#18171a` | Finance, accountability, panel dark |
| Primary / secondary text | `#111114` / `#625e59` | Copy pada permukaan terang |
| Text on dark / brand | `#ffffff` | Copy inverse |
| Secondary text on dark | `#aaa6a4` | Copy pendukung pada permukaan gelap |
| Subtle border | `rgba(17,17,20,.11)` | Pemisah non-interaktif |
| Control border | `#8a8179` | Batas input dan kontrol interaktif |
| Primary / hover action | `#d71920` / `#9f0d12` | CTA dan state hover |
| Focus ring | `#ef3940` | Fokus keyboard lintas surface |
| Disabled surface / text | `#e1ddd7` / `#5f5a55` | Kontrol nonaktif yang tetap terbaca |
| Media placeholder | `#d8d3cb` / `#272427` | Transisi sebelum gambar selesai dirender |

### B3. Semantic feedback

| Status | Text | Surface | Border | Rasio text/surface |
|---|---:|---:|---:|---:|
| Success | `#23623b` | `#edf8f0` | `#568466` | 6.69:1 |
| Warning | `#68400f` | `#fff7dc` | `#9a6d29` | 8.41:1 |
| Error | `#9f0d12` | `#fff0f0` | `#c2484e` | 7.47:1 |
| Info | `#1f4f6f` | `#eef6fb` | `#4c7792` | 7.98:1 |

### B4. Warna program yang dipertahankan

| Program | Gradient | Kontras putih pada stop paling terang |
|---|---|---:|
| Berbagi Rasa | `#7b1b24 → #1b1115` | 10.37:1 |
| Merakyat | `#744520 → #1b1510` | 8.03:1 |
| REHAT | `#4c315e → #18121d` | 11.00:1 |
| Berbagi Air Bersih | `#14627c → #0e171b` | 6.85:1 |
| Berbagi Masa Depan | `#39613b → #111b13` | 7.13:1 |

Warna program tidak disamakan dengan merah merek karena fungsinya adalah secondary identity. Setiap hue selalu didampingi nama program dan ikon, sehingga informasi tidak bergantung pada warna saja.

## C. Temuan berdasarkan severity

### Critical

Tidak ditemukan warna aktif yang membuat seluruh situs tidak dapat dibaca atau dioperasikan.

### High

| Element → Color → Problem → Impact → Solution |
|---|
| Tailwind brand utility → `--color-brand-red: var(--color-brand-red)` → token melakukan self-reference → `text-brand-red`/`bg-brand-red` dapat menjadi invalid pada computed value dan identitas merek tidak konsisten → tetapkan `#d71920` dan `#9f0d12` langsung pada `@theme`, lalu hubungkan layer komponen melalui semantic token. |
| Input publik → `#d6d0c9` pada putih → rasio batas sekitar 1.5:1 dan `outline:none` menimpa focus ring → batas field sulit dikenali dan fokus keyboard dapat hilang → gunakan control border `#8a8179` (3.82:1) dan focus-visible `#ef3940` (3.94:1 pada putih). |
| Input admin → Tailwind `neutral-300` pada putih → rasio boundary sekitar 1.47:1 → kontrol tidak cukup terdefinisi bagi low-vision user → terapkan kontrak field semantik melalui `[data-admin-root]` tanpa mengubah ukuran atau layout input. |
| Closing CTA → `#ffd4d5`/`#ffe0e1` pada `#d71920` → 3.86:1/4.20:1 → eyebrow dan paragraph kecil gagal WCAG AA normal text pada stop gradient terburuk → gunakan text-on-brand putih, 5.19:1. |
| Values band → `#ffd9da` pada `#d71920` → sekitar 4.00:1 → copy kecil gagal AA → gunakan text-on-brand putih, 5.19:1. |

### Medium

| Element → Color → Problem → Impact → Solution |
|---|
| Stat metadata → `#8b8580` pada putih → 3.64:1 → label kecil kurang terbaca → gunakan secondary text `#625e59`, lebih dari 6:1 pada surface aktif. |
| News metadata → `#7e7872` pada putih → 4.36:1 → berada sedikit di bawah AA → gunakan secondary text token yang sama. |
| Success/warning/error admin → utility emerald/amber/red tersebar → peran semantik tidak terhubung dengan sistem publik → drift lintas halaman dan maintenance lebih sulit → gunakan `status-message-*` dan `status-icon-*` dengan text, surface, serta border terukur. |
| Disabled controls → `#76716c` pada `#d5d1cc` → 3.18:1 → walau disabled dikecualikan WCAG, label tetap terlalu lemah → ubah ke `#5f5a55` pada `#e1ddd7`, 5.04:1. |
| Clickable donation options → subtle border transparan → boundary kontrol tidak selalu mencapai 3:1 → affordance pilihan kurang jelas → gunakan control-border token; selected state tetap memakai merah + background soft. |

### Low

| Element → Color → Problem → Impact → Solution |
|---|
| Placeholder media → beberapa beige/gray literal → transisi loading gambar kurang seragam → flash antar-card dapat berbeda → sediakan token placeholder light/dark. |
| Banyak warna literal pada layer CSS historis → primitive dan role bercampur → biaya refactor tinggi → Audit 05 hanya memigrasikan layer V7/V8 aktif; layer historis tidak dibongkar agar tidak membuka ulang layout Audit 01–04. |
| Visited link → tidak memiliki hue terpisah → riwayat pada action/card link tidak dibedakan → konsekuensi rendah dan state terpisah dapat merusak hierarchy CTA → dipertahankan; link konten tetap memiliki context dan hover underline. |

## D. Warna yang dipertahankan

1. Merah resmi `#d71920` dipertahankan karena memiliki identitas kuat dan lulus 5.19:1 dengan teks putih.
2. Dark red `#9f0d12` dipertahankan untuk hover dan text link karena memberi 8.27:1 pada putih.
3. Warm paper system dipertahankan karena mengurangi silau dibanding putih penuh dan tetap memberi kontras teks tinggi.
4. Section gelap dipertahankan sebagai penanda accountability/finance; secondary text dan accent di dalamnya lulus AA.
5. Lima gradient program dipertahankan; semuanya lulus untuk teks putih dan selalu didukung ikon serta label.
6. Overlay media dipertahankan. Chip media memberi rasio worst-case 11.73:1 dan caption hero 13.58:1 walaupun gambar di bawahnya putih.
7. Merah pada bar finance dipertahankan karena bar didukung label, nominal, dan persentase; bukan encoding kategori berbasis hue saja.

## E. Perubahan yang diterapkan

1. Memperbaiki dua token `@theme` yang self-reference.
2. Membentuk alur primitive palette → semantic role → component alias.
3. Mempertahankan alias `--trust-*` agar seluruh komponen aktif tetap kompatibel tanpa refactor layout.
4. Menambah token action, surface, text, border, focus, disabled, media placeholder, dan empat status feedback.
5. Mengganti low-contrast copy pada closing CTA dan values band.
6. Mengganti metadata statistik/berita dengan secondary text token.
7. Memperjelas boundary input publik, admin, pilihan program, nominal donasi, dan tombol report disabled.
8. Memulihkan focus-visible field publik dan admin dengan outline yang terukur.
9. Menyatukan feedback admin ke kelas success/warning/error semantik; semua pesan tetap memiliki teks dan icon/context.
10. Menghubungkan accountability dan finance aktif ke semantic dark-surface, inverse-text, dark-secondary, dan dark-accent roles.
11. Menambah `npm run color:audit` sebagai regression gate.

## F. Hasil accessibility

### F1. WCAG contrast

`npm run color:audit` memeriksa 27 pasangan. Seluruh pasangan lulus ambang masing-masing:

- normal text: minimum 4.5:1;
- interactive boundary/focus indicator: minimum 3:1;
- primary action: 5.19:1 normal, 8.27:1 hover;
- secondary body text: 6.16:1;
- focus ring: 3.94:1 pada putih dan 4.82:1 pada dark surface;
- semantic feedback text: 6.69–8.41:1;
- semantic feedback border: 3.95–4.41:1;
- program gradient: 6.85–11.00:1;
- media overlay: 11.73–13.58:1.

### F2. Keyboard dan interactive states

- Focus-visible tidak lagi dihapus oleh public form selector.
- Admin dan public field memakai outline yang sama serta border merah saat fokus.
- Primary hover berpindah dari `#d71920` ke `#9f0d12`; kontras meningkat.
- Selected donation amount memiliki tiga sinyal: border, surface, dan text color.
- Disabled controls tetap memiliki affordance disabled, tetapi copy sekarang terbaca.
- Link utama memakai dark red pada surface terang dan merah lebih terang pada hover; keduanya lulus AA.

### F3. Color-vision deficiency

- Deuteranopia/protanopia: success, warning, dan error tidak dibedakan dengan hue saja; pesan selalu membawa label, copy, dan pada status card juga ikon berbeda.
- Tritanopia: lima program selalu membawa nama dan ikon, bukan swatch tanpa label.
- Finance bars memakai satu hue dengan label dan persentase, sehingga tidak meminta pengguna membedakan kategori lewat warna.
- Navigation active state memakai kombinasi warna, background/inset marker, dan `aria-current` dari Audit 02.

### F4. Dark/light mode

Situs secara eksplisit memakai `color-scheme: light` dengan localized dark surfaces. Automatic dark mode tidak ditambahkan karena belum memiliki requirement produk dan dapat mengubah brand, foto, serta hierarchy yang telah disahkan. Semua localized dark surface memiliki pasangan text/accent sendiri dan diuji terpisah.

## G. Sistem warna final

Alur konsumsi warna final adalah:

1. Primitive menyimpan nilai merek dan neutral stabil.
2. Semantic role menjelaskan tujuan: surface, text, action, border, focus, disabled, status, dan media.
3. Alias `--trust-*` menjaga kompatibilitas layer komponen aktif.
4. Component/status class hanya memilih role; layout tetap berada pada rule yang sudah ada.
5. Kontrak otomatis memblokir self-reference, kembalinya warna low-contrast aktif, feedback palette utility, focus outline yang hilang, dan rasio di bawah ambang.

Distribusi visual tetap terkendali: warm neutral menjadi dasar, ink/white menangani keterbacaan, merah dipakai untuk action dan brand emphasis, sedangkan warna program dibatasi pada identity block. Tidak ada hue dekoratif baru yang ditambahkan.

Perubahan berbasis CSS custom property tidak menambah request jaringan, JavaScript runtime, image asset, atau dependency. Dampak performance praktis hanya beberapa deklarasi CSS kecil.

## H. Validasi dan verdict

- `npm run color:audit`: lulus 27 pasangan dan seluruh source invariant.
- `npm run lint`: lulus tanpa warning.
- `npm run typecheck`: lulus.
- `npm run integrity`: lulus; seluruh data/foto contoh tetap dipertahankan dan ditandai.
- `npm run responsive:audit`: lulus 33 viewport; Audit 05 tidak mengubah kontrak responsive.
- `npm run build`: lulus; 36 halaman berhasil dibuat.
- Production SSR crawl lokal: 26 rute publik mengembalikan 200, unknown route mengembalikan 404, dan `/api/health` berstatus `ok`.
- React review: perubahan TSX hanya mengganti color class; tidak ada perubahan hooks, data fetching, rendering flow, atau bundle behavior.
- Cloud browser tidak dapat membuka loopback (`ERR_BLOCKED_BY_CLIENT`); visual preview branch tetap dicatat sebagai deployment gate, bukan dinyatakan lulus tanpa bukti.

**Verdict: COLOR SYSTEM OPTIMAL SECARA SOURCE, KONTRAS, BUILD, DAN SSR; VISUAL PREVIEW BRANCH TETAP MENJADI GATE.**

Sistem final konsisten dan accessible untuk scope Audit 05 tanpa mengubah keputusan Audit 01–04. Klaim ini tidak berarti desain selesai 100%; branch tetap menjadi basis untuk audit berikutnya dan tidak boleh digabungkan ke `main` sebelum audit terakhir.
