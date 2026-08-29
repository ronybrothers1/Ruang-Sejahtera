export type Program = {
  slug: string;
  name: string;
  summary: string;
  focus: string;
};

export const programs: Program[] = [
  {
    slug: 'bantuan-sembako',
    name: 'Bantuan Sembako',
    summary: 'Dukungan kebutuhan pokok bagi masyarakat yang membutuhkan berdasarkan asesmen dan prioritas lapangan.',
    focus: 'Kebutuhan dasar',
  },
  {
    slug: 'bantuan-pendidikan',
    name: 'Bantuan Pendidikan',
    summary: 'Dukungan pendidikan yang dapat dikembangkan sesuai kebutuhan penerima manfaat dan kapasitas yayasan.',
    focus: 'Pendidikan',
  },
  {
    slug: 'air-bersih',
    name: 'Distribusi Air Bersih',
    summary: 'Respons kebutuhan air bersih bagi wilayah yang mengalami kesulitan akses, termasuk pada periode kekeringan.',
    focus: 'Air dan kebutuhan dasar',
  },
  {
    slug: 'tanggap-bencana',
    name: 'Tanggap Bencana',
    summary: 'Dukungan kemanusiaan dalam situasi darurat dan bencana sesuai kebutuhan yang telah diverifikasi.',
    focus: 'Kebencanaan',
  },
  {
    slug: 'bedah-rumah',
    name: 'Bedah Rumah',
    summary: 'Dukungan perbaikan rumah agar lebih layak, aman, dan sehat sesuai kriteria program yang ditetapkan.',
    focus: 'Hunian layak',
  },
  {
    slug: 'program-sosial',
    name: 'Program Sosial & Pemberdayaan',
    summary: 'Program sosial dan pemberdayaan yang dikembangkan berdasarkan kebutuhan masyarakat dan evaluasi yayasan.',
    focus: 'Pemberdayaan',
  },
];

export const trustPrinciples = [
  ['Kegiatan nyata', 'Publikasi dirancang untuk menghubungkan program dengan kegiatan, waktu, lokasi, dan dokumentasi.'],
  ['Data yang dapat ditelusuri', 'Angka dampak hanya ditampilkan setelah memiliki sumber data internal yang dapat dipertanggungjawabkan.'],
  ['Transparansi', 'Laporan dipisahkan menurut periode dan program, tanpa angka simulasi atau status verifikasi yang dibuat-buat.'],
  ['Martabat penerima manfaat', 'Dokumentasi dan data pribadi dipublikasikan secara proporsional dengan memperhatikan persetujuan dan kerentanan.'],
] as const;

export const publicSearchIndex = [
  { title: 'Tentang Kami', description: 'Profil, nilai, fokus kegiatan, dan komitmen yayasan.', href: '/tentang-kami' },
  { title: 'Program', description: 'Seluruh fokus program sosial Yayasan Ruang Sejahtera.', href: '/program' },
  { title: 'Kegiatan', description: 'Arsip kegiatan sosial berdasarkan data yang telah dipublikasikan.', href: '/kegiatan' },
  { title: 'Dampak', description: 'Metodologi dan data dampak yang hanya dipublikasikan setelah sumber, periode, dan definisinya tersedia.', href: '/dampak' },
  { title: 'Transparansi', description: 'Laporan keuangan, program, dan dokumen publik yang tersedia dari sumber resmi.', href: '/transparansi' },
  { title: 'Berita', description: 'Berita kegiatan, cerita dampak, dan pengumuman yang telah melalui proses editorial.', href: '/berita' },
  { title: 'Galeri', description: 'Dokumentasi foto dan video kegiatan yang telah memenuhi aturan publikasi.', href: '/galeri' },
  { title: 'Organisasi', description: 'Struktur organisasi dan pengurus berdasarkan data resmi yang dipublikasikan.', href: '/organisasi' },
  { title: 'Kontak', description: 'Kanal komunikasi resmi yayasan ketika telah dikonfigurasi.', href: '/kontak' },
  ...programs.map((program) => ({
    title: program.name,
    description: program.summary,
    href: `/program/${program.slug}`,
  })),
];
