import type { Metadata } from 'next';
import { Accessibility, BarChart3, HeartHandshake, Scale, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { sampleValues } from '@/lib/content';

export const metadata: Metadata = { title: 'Nilai Kami', description: 'Prinsip yang menjadi arah Yayasan Ruang Sejahtera.' };
const valueIcons = [HeartHandshake, ShieldCheck, Scale, BarChart3, Accessibility];

export default function ValuesPage() {
  return <><PageHero eyebrow="Tentang Kami" title="Nilai yang hidup dalam cara kita bekerja." description="Rumusan contoh dipertahankan untuk menguji sistem visual dan struktur informasi sebelum diselaraskan dengan prinsip resmi yayasan." /><PreviewNotice label="Rumusan draft">Redaksi nilai masih dapat berubah mengikuti dokumen internal yayasan.</PreviewNotice><section className="trust-page-section trust-values-section"><div className="shell trust-values-grid">{sampleValues.map((item, index) => { const Icon = valueIcons[index]; return <article className={index === 0 ? 'trust-value-feature' : ''} key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><Icon size={28} aria-hidden="true" /><h2>{item.title}</h2><p>{item.description}</p></article>; })}</div></section></>;
}
