import { programs } from '@/lib/content';

export type NavLink = {
  name: string;
  href: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export const aboutNavItems: NavLink[] = [
  { name: 'Profil Yayasan', href: '/tentang-kami' },
  { name: 'Visi & Misi', href: '/tentang-kami/visi-misi' },
  { name: 'Nilai Kami', href: '/tentang-kami/nilai' },
  { name: 'Sejarah', href: '/tentang-kami/sejarah' },
  { name: 'Organisasi', href: '/organisasi' },
  { name: 'Legalitas', href: '/tentang-kami/legalitas' },
];

export const programNavItems: NavLink[] = [
  { name: 'Ikhtisar Program', href: '/program' },
  ...programs.map((program) => ({ name: program.name, href: `/program/${program.slug}` })),
];

export const activityNavItems: NavLink[] = [
  { name: 'Arsip Kegiatan', href: '/kegiatan' },
  { name: 'Berita & Cerita', href: '/berita' },
  { name: 'Galeri Foto & Video', href: '/galeri' },
];

export const accountabilityNavItems: NavLink[] = [
  { name: 'Dampak', href: '/dampak' },
  { name: 'Transparansi', href: '/transparansi' },
  { name: 'Organisasi', href: '/organisasi' },
  { name: 'Legalitas', href: '/tentang-kami/legalitas' },
  { name: 'Kebijakan Donasi', href: '/kebijakan-donasi' },
];

export const navItems: NavItem[] = [
  { name: 'Beranda', href: '/' },
  {
    name: 'Tentang Kami',
    href: '/tentang-kami',
    children: [
      { name: 'Ikhtisar Tentang Kami', href: '/tentang-kami' },
      ...aboutNavItems.slice(1),
    ],
  },
  { name: 'Program', href: '/program', children: programNavItems },
  {
    name: 'Kegiatan',
    href: '/kegiatan',
    children: [
      ...activityNavItems,
    ],
  },
  { name: 'Dampak', href: '/dampak' },
  {
    name: 'Transparansi',
    href: '/transparansi',
    children: [
      { name: 'Ikhtisar Transparansi', href: '/transparansi' },
      { name: 'Dokumen Publik', href: '/transparansi#dokumen' },
      { name: 'Kebijakan Donasi', href: '/kebijakan-donasi' },
    ],
  },
];
