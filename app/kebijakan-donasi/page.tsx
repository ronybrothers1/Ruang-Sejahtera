import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { SectionNavigation } from '@/components/SectionNavigation';
import { accountabilityNavItems } from '@/lib/navigation';

export const metadata: Metadata = { title: 'Kebijakan Donasi', description: 'Prinsip pencatatan, privasi, dan keamanan donasi Yayasan Ruang Sejahtera.' };

export default function DonationPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Kebijakan Donasi" title="Donasi harus dapat dilacak dari transaksi ke pelaporan." description="Kebijakan operasional final harus disahkan yayasan sebelum pembayaran publik diaktifkan." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Transparansi', href: '/transparansi' }, { label: 'Kebijakan Donasi' }]} />
      <SectionNavigation label="Ruang Akuntabilitas" items={accountabilityNavItems} currentHref="/kebijakan-donasi" />
      <section className="py-18 md:py-24">
        <div className="shell max-w-4xl space-y-8 leading-8 text-neutral-700">
          <section><h2 className="font-heading text-2xl font-extrabold text-brand-ink">Pencatatan</h2><p className="mt-3">Setiap transaksi online harus memiliki identitas transaksi, status pembayaran, waktu, nominal, program/alokasi jika dipilih, serta jejak rekonsiliasi.</p></section>
          <section><h2 className="font-heading text-2xl font-extrabold text-brand-ink">Privasi donatur</h2><p className="mt-3">Donatur dapat diberi pilihan tampil dengan nama atau anonim. Data pribadi yang tidak diperlukan untuk transaksi, bukti donasi, komunikasi, atau kewajiban hukum tidak boleh diminta.</p></section>
          <section><h2 className="font-heading text-2xl font-extrabold text-brand-ink">Keamanan</h2><p className="mt-3">Data kartu pembayaran tidak disimpan langsung oleh yayasan. Integrasi payment gateway harus menggunakan verifikasi webhook, idempotency, validasi server, pengelolaan secret yang aman, dan proses rekonsiliasi.</p></section>
        </div>
      </section>
    </>
  );
}
