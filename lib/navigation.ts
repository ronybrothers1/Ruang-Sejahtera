export type NavItem = {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
};

export const navItems: NavItem[] = [
  { name: 'Beranda', href: '/' },
  {
    name: 'Tentang',
    href: '/tentang-kami',
    children: [
      { name: 'Profil Yayasan', href: '/tentang-kami' },
      { name: 'Visi & Misi', href: '/tentang-kami/visi-misi' },
      { name: 'Nilai Kami', href: '/tentang-kami/nilai' },
      { name: 'Sejarah', href: '/tentang-kami/sejarah' },
      { name: 'Legalitas', href: '/tentang-kami/legalitas' },
      { name: 'Organisasi', href: '/organisasi' },
    ],
  },
  { name: 'Program', href: '/program' },
  {
    name: 'Kegiatan',
    href: '/kegiatan',
    children: [
      { name: 'Semua Kegiatan', href: '/kegiatan' },
      { name: 'Berita & Cerita', href: '/berita' },
      { name: 'Galeri Foto & Video', href: '/galeri' },
    ],
  },
  { name: 'Dampak', href: '/dampak' },
  {
    name: 'Transparansi',
    href: '/transparansi',
    children: [
      { name: 'Ringkasan', href: '/transparansi' },
      { name: 'Dokumen Publik', href: '/transparansi#dokumen' },
      { name: 'Kebijakan Donasi', href: '/kebijakan-donasi' },
    ],
  },
];
