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
      { name: 'Organisasi', href: '/organisasi' },
      { name: 'Kontak', href: '/kontak' },
    ],
  },
  { name: 'Program', href: '/program' },
  { name: 'Kegiatan', href: '/kegiatan' },
  { name: 'Dampak', href: '/dampak' },
  { name: 'Berita', href: '/berita' },
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
