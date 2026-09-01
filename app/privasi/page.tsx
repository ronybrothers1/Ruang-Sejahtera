import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DocumentLayout } from '@/components/DocumentLayout';
import { PageHero } from '@/components/PageHero';
import { createPageMetadata } from '@/lib/seo';
export const metadata: Metadata = createPageMetadata({ title: 'Kebijakan Privasi', description: 'Kebijakan perlindungan data pribadi dan privasi pengguna website Yayasan Ruang Sejahtera.', path: '/privasi' });
export default function PrivacyPage() {
  const sections = [
    { id: 'prinsip-minimum', title: 'Prinsip minimum', content: 'Website hanya boleh mengumpulkan data yang diperlukan untuk tujuan yang jelas, membatasi akses berdasarkan peran, menjaga keamanan, dan menghapus atau menganonimkan data sesuai kebijakan retensi.' },
    { id: 'kelompok-rentan', title: 'Penerima manfaat dan kelompok rentan', content: 'Foto, identitas, lokasi rinci, kondisi sosial, dan informasi penerima manfaat tidak boleh dipublikasikan secara berlebihan. Dokumentasi anak, lansia, korban bencana, atau pihak rentan harus memperhatikan persetujuan dan kepatutan publikasi.' },
    { id: 'analytics-formulir', title: 'Analytics dan formulir', content: 'Integrasi analytics harus privacy-conscious. Formulir kontak dan donasi belum dianggap aktif sampai endpoint, keamanan, tujuan pemrosesan, dan retensinya terdokumentasi.' },
  ];

  return (
    <>
      <PageHero eyebrow="Privasi" title="Data pribadi diperlakukan sebagai tanggung jawab, bukan aset pemasaran." description="Kebijakan ini merupakan baseline V2 dan harus diperbarui ketika formulir, analytics, CMS, atau pembayaran resmi diaktifkan." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Kebijakan Privasi' }]} />
      <DocumentLayout sections={sections} />
    </>
  );
}
