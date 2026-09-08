import type { Metadata } from 'next';
import { FileCheck2, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { SectionNavigation } from '@/components/SectionNavigation';
import { sampleLegalDocuments } from '@/lib/content';
import { aboutNavItems } from '@/lib/navigation';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({ title: 'Legalitas', description: 'Dokumen legalitas Yayasan Ruang Sejahtera.', path: '/tentang-kami/legalitas' });

export default function LegalityPage() {
  return (
    <>
      <PageHero eyebrow="Tentang Kami" title="Identitas hukum harus jelas dan tetap aman." description="Rancangan presentasi legalitas dipertahankan secara lengkap. Nomor dan detail contoh akan diganti dengan metadata dokumen resmi yang layak dipublikasikan." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Tentang Kami', href: '/tentang-kami' }, { label: 'Legalitas' }]} />
      <SectionNavigation label="Jelajahi Tentang Kami" items={aboutNavItems} currentHref="/tentang-kami/legalitas" />
      <PreviewNotice label="Dokumen contoh">Nomor akta, pengesahan, perpajakan, dan metadata berikut bukan data resmi.</PreviewNotice>
      <section className="trust-page-section trust-legal-section"><div className="shell trust-legal-layout"><div className="trust-legal-intro"><ShieldCheck size={32} aria-hidden="true" /><span>Akuntabilitas institusi</span><h2>Legalitas perlu mudah diperiksa tanpa mengorbankan keamanan.</h2><p>Versi final hanya menampilkan data yang telah diverifikasi dan layak untuk akses publik. Dokumen sensitif dapat disajikan sebagai metadata atau salinan yang telah direduksi.</p></div><div className="trust-legal-grid">{sampleLegalDocuments.map((item) => <article key={item.title}><div><FileCheck2 size={22} aria-hidden="true" /><span>CONTOH</span></div><h2>{item.title}</h2><strong>{item.number}</strong><p>{item.issuer}</p><small>Belum dapat diunduh</small></article>)}</div></div></section>
    </>
  );
}
