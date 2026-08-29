import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DocumentLayout } from '@/components/DocumentLayout';
import { PageHero } from '@/components/PageHero';
import { SectionNavigation } from '@/components/SectionNavigation';
import { accountabilityNavItems } from '@/lib/navigation';

export const metadata: Metadata = { title: 'Kebijakan Donasi', description: 'Prinsip pencatatan, privasi, dan keamanan donasi Yayasan Ruang Sejahtera.' };

export default function DonationPolicyPage() {
  const sections = [
    { id: 'pencatatan', title: 'Pencatatan', content: 'Setiap transaksi online harus memiliki identitas transaksi, status pembayaran, waktu, nominal, program/alokasi jika dipilih, serta jejak rekonsiliasi.' },
    { id: 'privasi-donatur', title: 'Privasi donatur', content: 'Donatur dapat diberi pilihan tampil dengan nama atau anonim. Data pribadi yang tidak diperlukan untuk transaksi, bukti donasi, komunikasi, atau kewajiban hukum tidak boleh diminta.' },
    { id: 'keamanan', title: 'Keamanan', content: 'Data kartu pembayaran tidak disimpan langsung oleh yayasan. Integrasi payment gateway harus menggunakan verifikasi webhook, idempotency, validasi server, pengelolaan secret yang aman, dan proses rekonsiliasi.' },
  ];

  return (
    <>
      <PageHero eyebrow="Kebijakan Donasi" title="Donasi harus dapat dilacak dari transaksi ke pelaporan." description="Kebijakan operasional final harus disahkan yayasan sebelum pembayaran publik diaktifkan." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Transparansi', href: '/transparansi' }, { label: 'Kebijakan Donasi' }]} />
      <SectionNavigation label="Ruang Akuntabilitas" items={accountabilityNavItems} currentHref="/kebijakan-donasi" />
      <DocumentLayout sections={sections} />
    </>
  );
}
