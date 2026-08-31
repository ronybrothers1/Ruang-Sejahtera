import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2, Landmark, ReceiptText, WalletCards } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { SectionNavigation } from '@/components/SectionNavigation';
import { sampleFinance, sampleFinanceHeadline, sampleStats } from '@/lib/content';
import { getPublishedFinancialReports } from '@/lib/published-content';
import { formatRupiah } from '@/lib/finance';
import { accountabilityNavItems } from '@/lib/navigation';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({ title: 'Transparansi', description: 'Laporan dan dokumen transparansi Yayasan Ruang Sejahtera.', path: '/transparansi' });

const icons = [WalletCards, Landmark, ReceiptText, FileCheck2];

function percentage(value: number, base: number) {
  return base > 0 ? Math.max(0, Math.min(100, Math.round((value / base) * 100))) : 0;
}

export default async function TransparencyPage() {
  const reports = await getPublishedFinancialReports();
  const latest = reports[0] || null;
  const metrics = latest ? [
    { value: formatRupiah(latest.totalIncome), label: 'Total penerimaan' },
    { value: formatRupiah(latest.totalDisbursement), label: 'Total penyaluran' },
    { value: formatRupiah(latest.operationalCost), label: 'Operasional' },
    { value: formatRupiah(latest.balance), label: 'Saldo laporan' },
  ] : sampleFinanceHeadline;
  const liveBars = latest ? [
    { label: 'Total penerimaan', value: 100, amount: formatRupiah(latest.totalIncome) },
    { label: 'Total penyaluran', value: percentage(latest.totalDisbursement, latest.totalIncome), amount: formatRupiah(latest.totalDisbursement) },
    { label: 'Operasional', value: percentage(latest.operationalCost, latest.totalIncome), amount: formatRupiah(latest.operationalCost) },
    { label: 'Saldo laporan', value: percentage(Math.max(0, latest.balance), latest.totalIncome), amount: formatRupiah(latest.balance) },
  ] : sampleFinance;

  return (
    <>
      <PageHero eyebrow="Transparansi" title="Kepercayaan tumbuh ketika informasi mudah diperiksa." description={latest ? `${latest.title} untuk periode ${latest.period} telah diterbitkan pada ${latest.reportDate} dan menjadi ringkasan keuangan publik terbaru.` : 'Halaman ini akan menampilkan laporan resmi setelah Super Admin menerbitkan laporan pertama dari Control Plane.'} />
      <SectionNavigation label="Ruang Akuntabilitas" items={accountabilityNavItems} currentHref="/transparansi" />
      {!latest ? <PreviewNotice label="Menunggu laporan resmi">Belum ada laporan keuangan yang diterbitkan. Nominal contoh di bawah hanya menjaga rancangan halaman tetap dapat dievaluasi.</PreviewNotice> : null}
      <section className="trust-page-section trust-transparency-preview">
        <div className="shell">
          <div className="trust-transparency-metrics">{metrics.map((item, index) => { const Icon = icons[index]; return <article key={item.label}><Icon size={21} aria-hidden="true" /><strong>{item.value}</strong><span>{item.label}</span><small>{latest ? latest.period : 'contoh sementara'}</small></article>; })}</div>
          <div className="trust-transparency-dashboard">
            <div className="trust-finance-card trust-finance-card-light"><div className="trust-finance-head"><div><small>{latest ? `LAPORAN TERBIT · ${latest.period.toUpperCase()}` : 'PERIODE CONTOH 2026'}</small><strong>{latest?.title || 'Komposisi Penyaluran'}</strong></div><b>{latest ? formatRupiah(latest.balance) : sampleStats[3].value}</b></div><div className="trust-finance-bars">{liveBars.map((item) => <div key={item.label}><div><span>{item.label}</span><strong>{item.amount}</strong></div><div className="trust-finance-track"><span style={{ width: `${item.value}%` }} /></div><small>{item.value}%</small></div>)}</div><p>{latest ? 'Angka bersumber dari laporan yang diterbitkan Super Admin.' : 'Seluruh angka merupakan data desain contoh.'}</p></div>
            <div id="dokumen" className="trust-report-panel"><div><span>Laporan keuangan terbit</span><h2>Riwayat yang dapat diperiksa.</h2></div>{reports.length ? reports.slice(0, 6).map((report) => <div className="trust-report-row" key={report.id}><FileCheck2 size={19} aria-hidden="true" /><span><strong>{report.title}</strong><small>{report.reportDate} · {report.period} · Terbit {report.publishedAt ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(report.publishedAt)) : ''}</small><small>{report.description}</small></span><span className="text-xs font-bold text-green-700">TERBIT</span></div>) : <p className="mt-4 text-sm leading-6 text-neutral-500">Laporan terbit akan muncul di sini setelah dipublikasikan dari Control Plane.</p>}<Link href="/kebijakan-donasi" className="trust-text-link">Baca kebijakan donasi <ArrowRight size={16} aria-hidden="true" /></Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
