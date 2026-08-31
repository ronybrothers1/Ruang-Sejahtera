import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, HeartHandshake, Home, Info, Landmark, Search, ShieldCheck, UsersRound } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { aboutNavItems, programNavItems } from '@/lib/navigation';
import { getPublishedActivities, getPublishedArticles, getPublishedGalleries } from '@/lib/published-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Peta Situs',
  description: 'Peta situs HTML Yayasan Ruang Sejahtera untuk menemukan program, kegiatan, informasi, dan layanan publik.',
  path: '/peta-situs',
});

type SitemapLink = { name: string; href: string; description?: string };
type SitemapSection = { title: string; description: string; icon: typeof Home; links: SitemapLink[] };

const aboutLinks: SitemapLink[] = aboutNavItems.map((item, index) => ({
  ...item,
  name: index === 0 ? 'Tentang Kami' : item.name,
}));

const coreSections: SitemapSection[] = [
  {
    title: 'Beranda',
    description: 'Titik awal untuk mengenal Yayasan Ruang Sejahtera.',
    icon: Home,
    links: [{ name: 'Beranda', href: '/' }],
  },
  {
    title: 'Tentang Yayasan',
    description: 'Profil, arah gerak, nilai, organisasi, dan legalitas yayasan.',
    icon: Info,
    links: aboutLinks,
  },
  {
    title: 'Program',
    description: 'Lima ruang kerja sosial yang tersedia di Ruang Sejahtera.',
    icon: HeartHandshake,
    links: programNavItems,
  },
  {
    title: 'Kegiatan, Berita & Galeri',
    description: 'Arsip aksi, cerita, foto, dan video yang dapat ditelusuri publik.',
    icon: BookOpen,
    links: [
      { name: 'Arsip Kegiatan', href: '/kegiatan' },
      { name: 'Berita & Cerita', href: '/berita' },
      { name: 'Galeri Foto & Video', href: '/galeri' },
    ],
  },
  {
    title: 'Donasi & Kontak',
    description: 'Cara mendukung kerja sosial dan kanal komunikasi yayasan.',
    icon: UsersRound,
    links: [
      { name: 'Donasi', href: '/donasi' },
      { name: 'Kontak & Kolaborasi', href: '/kontak' },
      { name: 'Kebijakan Donasi', href: '/kebijakan-donasi' },
    ],
  },
  {
    title: 'Akuntabilitas',
    description: 'Informasi dampak, transparansi, dan penggunaan sumber daya.',
    icon: Landmark,
    links: [
      { name: 'Dampak', href: '/dampak' },
      { name: 'Transparansi', href: '/transparansi' },
    ],
  },
  {
    title: 'Bantuan & Kebijakan',
    description: 'Pencarian informasi dan dokumen kebijakan publik.',
    icon: ShieldCheck,
    links: [
      { name: 'Pencarian', href: '/cari' },
      { name: 'Kebijakan Privasi', href: '/privasi' },
      { name: 'Ketentuan Penggunaan', href: '/ketentuan' },
      { name: 'Aksesibilitas', href: '/aksesibilitas' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

export default async function SitemapPage() {
  const [publishedArticles, publishedActivities, publishedGalleries] = await Promise.all([
    getPublishedArticles(),
    getPublishedActivities(),
    getPublishedGalleries(),
  ]);
  const publishedLinks: SitemapLink[] = [
    ...publishedArticles.map((item) => ({ name: item.title, href: `/berita/${item.slug}`, description: 'Berita & Cerita' })),
    ...publishedActivities.map((item) => ({ name: item.title, href: `/kegiatan/${item.slug}`, description: 'Kegiatan' })),
    ...publishedGalleries.map((item) => ({ name: item.title, href: `/galeri/${item.slug}`, description: 'Galeri' })),
  ];
  const sections = publishedLinks.length
    ? [...coreSections, { title: 'Konten Terbit', description: 'Halaman konten yang telah dipublikasikan dan tersedia untuk dibaca.', icon: Search, links: publishedLinks }]
    : coreSections;

  return (
    <>
      <PageHero eyebrow="Peta Situs" title="Temukan informasi yang Anda perlukan." description="Peta situs ini merangkum halaman publik Yayasan Ruang Sejahtera berdasarkan kelompok informasi agar mudah dipindai dan ditelusuri." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Peta Situs' }]} />

      <main className="sitemap-page">
        <section className="sitemap-intro" aria-labelledby="sitemap-intro-heading">
          <div className="shell sitemap-intro-inner">
            <div>
              <p className="sitemap-kicker">Navigasi publik</p>
              <h2 id="sitemap-intro-heading">Satu halaman untuk melihat seluruh ruang informasi.</h2>
            </div>
            <p>Gunakan daftar di bawah untuk berpindah langsung ke halaman yang tersedia. Halaman administratif dan area internal tidak ditampilkan di sini.</p>
          </div>
        </section>

        <section className="sitemap-directory" aria-labelledby="sitemap-directory-heading">
          <div className="shell">
            <div className="sitemap-directory-heading">
              <div>
                <p className="sitemap-kicker">Direktori halaman</p>
                <h2 id="sitemap-directory-heading">Jelajahi berdasarkan kebutuhan.</h2>
              </div>
              <p>{sections.length} kelompok informasi publik</p>
            </div>
            <div className="sitemap-section-grid">
              {sections.map(({ title, description, icon: Icon, links }, index) => (
                <section key={title} className="sitemap-section-card" aria-labelledby={`sitemap-section-${index}`}>
                  <div className="sitemap-section-card-heading">
                    <span className="sitemap-section-icon"><Icon size={20} aria-hidden="true" /></span>
                    <div>
                      <p className="sitemap-section-number">{String(index + 1).padStart(2, '0')}</p>
                      <h3 id={`sitemap-section-${index}`}>{title}</h3>
                    </div>
                  </div>
                  <p className="sitemap-section-description">{description}</p>
                  <ul className="sitemap-link-list">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>
                          <span>
                            <strong>{link.name}</strong>
                            {link.description ? <small>{link.description}</small> : null}
                          </span>
                          <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
