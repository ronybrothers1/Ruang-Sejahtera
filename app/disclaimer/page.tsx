import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DocumentLayout } from '@/components/DocumentLayout';
import { PageHero } from '@/components/PageHero';
import { createPageMetadata } from '@/lib/seo';
export const metadata: Metadata = createPageMetadata({ title: 'Disclaimer', description: 'Batas penggunaan informasi publik pada website Yayasan Ruang Sejahtera.', path: '/disclaimer' });
export default function DisclaimerPage() {
  const sections = [
    { id: 'kanal-resmi', title: 'Kanal resmi', content: 'Informasi kegiatan, program, dampak, organisasi, dan laporan hanya dianggap resmi setelah dipublikasikan melalui kanal yang dikelola yayasan.' },
    { id: 'konteks-data', title: 'Konteks data', content: 'Angka dampak dan keuangan harus dibaca sesuai periode, definisi, dan sumber yang menyertainya. Ketiadaan data tidak digantikan dengan estimasi dekoratif.' },
    { id: 'informasi-pembayaran', title: 'Informasi pembayaran', content: 'Informasi pembayaran hanya berlaku melalui kanal resmi yang dikonfigurasi yayasan. Halaman donasi V2 tidak menerima pembayaran sebelum sistem pembayaran resmi diaktifkan.' },
  ];

  return (
    <>
      <PageHero eyebrow="Informasi Publik" title="Disclaimer" description="Batas penggunaan informasi pada platform Yayasan Ruang Sejahtera." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Disclaimer' }]} />
      <DocumentLayout sections={sections} />
    </>
  );
}
