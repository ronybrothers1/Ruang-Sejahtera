export type Program = {
  slug: string;
  name: string;
  summary: string;
  focus: string;
  accent: string;
};

export const programs: Program[] = [
  {
    slug: 'berbagi-rasa',
    name: 'Berbagi Rasa',
    summary: 'Berbagi Rasa (Rakyat Sejahtera): bantuan sembako dan uang tunai bagi masyarakat yang membutuhkan.',
    focus: 'Rakyat Sejahtera',
    accent: '01',
  },
  {
    slug: 'merakyat',
    name: 'Merakyat',
    summary: 'Merakyat (Mabecce’ Usahanah Rakyat): bantuan renovasi serta modal bagi usaha mikro dan kecil.',
    focus: 'Usaha rakyat',
    accent: '02',
  },
  {
    slug: 'rehat',
    name: 'REHAT',
    summary: 'REHAT (Renovasi Rumah Rakyat): bedah dan renovasi rumah agar menjadi hunian yang lebih layak.',
    focus: 'Renovasi Rumah Rakyat',
    accent: '03',
  },
  {
    slug: 'berbagi-air-bersih',
    name: 'Berbagi Air Bersih',
    summary: 'Bantuan air bersih untuk masyarakat di wilayah yang terdampak kekeringan.',
    focus: 'Air bersih',
    accent: '04',
  },
  {
    slug: 'berbagi-masa-depan',
    name: 'Berbagi Masa Depan',
    summary: 'Bantuan pendidikan berupa peralatan sekolah dan dukungan biaya pendidikan.',
    focus: 'Pendidikan',
    accent: '05',
  },
];


export const trustPrinciples = [
  ['Transparan', 'Informasi kegiatan dan penggunaan dana perlu disiapkan agar dapat dipantau publik.'],
  ['Akuntabel', 'Setiap program perlu memiliki penanggung jawab dan jejak dokumentasi.'],
  ['Tepat sasaran', 'Prioritas bantuan perlu ditetapkan melalui asesmen kebutuhan.'],
  ['Berintegritas', 'Keputusan program harus ditempatkan di atas kepentingan pribadi.'],
] as const;

export const publicSearchIndex = [
  { title: 'Tentang Kami', description: 'Profil, nilai, fokus kegiatan, dan komitmen yayasan.', href: '/tentang-kami' },
  { title: 'Program', description: 'Seluruh fokus program sosial Yayasan Ruang Sejahtera.', href: '/program' },
  { title: 'Kegiatan', description: 'Arsip kegiatan sosial dan dokumentasi lapangan.', href: '/kegiatan' },
  { title: 'Dampak', description: 'Ringkasan dampak dan indikator program.', href: '/dampak' },
  { title: 'Transparansi', description: 'Laporan keuangan, program, dan dokumen publik.', href: '/transparansi' },
  { title: 'Berita', description: 'Berita kegiatan, cerita dampak, dan pengumuman.', href: '/berita' },
  { title: 'Galeri', description: 'Dokumentasi foto dan video kegiatan.', href: '/galeri' },
  { title: 'Organisasi', description: 'Struktur organisasi dan pengurus.', href: '/organisasi' },
  { title: 'Kontak', description: 'Kanal komunikasi Yayasan Ruang Sejahtera.', href: '/kontak' },
  ...programs.map((program) => ({ title: program.name, description: program.summary, href: `/program/${program.slug}` })),
];
