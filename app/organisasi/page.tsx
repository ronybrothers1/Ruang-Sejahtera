import type { Metadata } from 'next';
import { UsersRound } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionNavigation } from '@/components/SectionNavigation';
import { sampleOrganization } from '@/lib/content';
import { aboutNavItems } from '@/lib/navigation';

export const metadata: Metadata = { title: 'Organisasi', description: 'Struktur organisasi Yayasan Ruang Sejahtera.' };

export default function OrganizationPage() {
  const leader = sampleOrganization.find((item) => item.role === 'Ketua')!;
  const team = sampleOrganization.filter((item) => item.role !== 'Ketua');
  return (
    <>
      <PageHero eyebrow="Organisasi" title="Kerja bersama membutuhkan tanggung jawab yang terlihat." description="Struktur dan nama contoh dipertahankan untuk memperlihatkan hierarki organisasi yang lengkap sebelum data pengurus resmi menggantikannya." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Tentang Kami', href: '/tentang-kami' }, { label: 'Organisasi' }]} />
      <SectionNavigation label="Jelajahi Tentang Kami" items={aboutNavItems} currentHref="/organisasi" />
      <PreviewNotice label="Struktur contoh">Nama pengurus berikut adalah placeholder yang sengaja ditandai, bukan identitas resmi.</PreviewNotice>
      <section className="trust-page-section trust-org-section"><div className="shell trust-org-chart"><article className="trust-org-leader"><span><UsersRound size={23} aria-hidden="true" /></span><small>PIMPINAN YAYASAN · CONTOH</small><h2>{leader.name}</h2><p>{leader.role}</p></article><div className="trust-org-line" aria-hidden="true" /><div className="trust-org-grid">{team.map((item, index) => <article key={item.role}><span>{String(index + 1).padStart(2, '0')}</span><small>{item.role}</small><h2>{item.name}</h2><p>Data identitas sementara</p></article>)}</div></div></section>
    </>
  );
}
