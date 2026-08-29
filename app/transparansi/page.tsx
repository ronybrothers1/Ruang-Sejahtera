import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Download, FileCheck2, Landmark, ReceiptText, WalletCards } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { sampleFinance, sampleFinanceHeadline, sampleStats } from '@/lib/content';

export const metadata: Metadata = { title: 'Transparansi', description: 'Laporan dan dokumen transparansi Yayasan Ruang Sejahtera.' };

const reportNames = ['Laporan Penyaluran Mei 2026', 'Ringkasan Program Triwulan II', 'Kebijakan Donasi & Pengembalian', 'Dokumen Tata Kelola Yayasan'];

export default function TransparencyPage() {
  const icons = [WalletCards, Landmark, ReceiptText, FileCheck2];
  return (
    <>
      <PageHero eyebrow="Transparansi" title="Kepercayaan tumbuh ketika informasi mudah diperiksa." description="Dashboard ini sengaja mempertahankan data simulasi agar desain pelaporan dapat dinilai secara utuh sebelum angka, periode, dan dokumen resmi menggantikannya." />
      <PreviewNotice label="Simulasi laporan">Seluruh nominal dan dokumen pada halaman ini merupakan contoh desain, bukan laporan resmi yayasan.</PreviewNotice>
      <section className="trust-page-section trust-transparency-preview">
        <div className="shell">
          <div className="trust-transparency-metrics">{sampleFinanceHeadline.map((item, index) => { const Icon = icons[index]; return <article key={item.label}><Icon size={21} aria-hidden="true" /><strong>{item.value}</strong><span>{item.label}</span><small>contoh sementara</small></article>; })}</div>
          <div className="trust-transparency-dashboard">
            <div className="trust-finance-card trust-finance-card-light"><div className="trust-finance-head"><div><small>PERIODE CONTOH 2026</small><strong>Komposisi Penyaluran</strong></div><b>{sampleStats[3].value}</b></div><div className="trust-finance-bars">{sampleFinance.map((item) => <div key={item.label}><div><span>{item.label}</span><strong>{item.amount}</strong></div><div className="trust-finance-track"><span style={{ width: `${item.value}%` }} /></div><small>{item.value}%</small></div>)}</div><p>Seluruh angka merupakan data desain contoh.</p></div>
            <div className="trust-report-panel"><div><span>Dokumen publik</span><h2>Ruang unduh laporan.</h2></div>{reportNames.map((name) => <div className="trust-report-row" key={name}><FileCheck2 size={19} aria-hidden="true" /><span><strong>{name}</strong><small>Dokumen contoh · belum resmi</small></span><button type="button" disabled aria-label={`Unduh ${name} belum aktif`}><Download size={16} aria-hidden="true" /></button></div>)}<Link href="/kebijakan-donasi" className="trust-text-link">Baca kebijakan donasi <ArrowRight size={16} aria-hidden="true" /></Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
