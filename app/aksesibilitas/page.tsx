import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DocumentLayout } from '@/components/DocumentLayout';
import { PageHero } from '@/components/PageHero';
export const metadata: Metadata = { title: 'Aksesibilitas', description: 'Komitmen aksesibilitas platform Yayasan Ruang Sejahtera.' };
export default function AccessibilityPage() {
  const sections = [
    { id: 'baseline', title: 'Baseline', content: 'Struktur semantik, navigasi keyboard, focus state yang terlihat, skip link, dukungan reduced motion, label formulir, teks alternatif, dan kontras warna menjadi bagian dari quality gate.' },
    { id: 'perbaikan-berkelanjutan', title: 'Perbaikan berkelanjutan', content: 'Audit otomatis tidak menggantikan pengujian manusia. Sebelum rilis produksi, halaman penting perlu diuji menggunakan keyboard, pembaca layar, zoom, perangkat seluler, dan kondisi koneksi yang beragam.' },
  ];

  return (
    <>
      <PageHero eyebrow="Aksesibilitas" title="Informasi sosial harus dapat diakses seluas mungkin." description="Platform V2 dibangun dengan target WCAG 2.2 AA sebagai baseline desain dan implementasi." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Aksesibilitas' }]} />
      <DocumentLayout sections={sections} />
    </>
  );
}
