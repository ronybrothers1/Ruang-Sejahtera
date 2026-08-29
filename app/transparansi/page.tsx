import type { Metadata } from 'next';
import { Download, FileCheck2, Landmark, ReceiptText, WalletCards } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { sampleFinance } from '@/lib/content';

export const metadata: Metadata = { title: 'Transparansi', description: 'Laporan dan dokumen transparansi Yayasan Ruang Sejahtera.' };

export default function TransparencyPage() {
  const headline = [['Rp224,8 Jt','Total penerimaan'],['Rp186,5 Jt','Total penyaluran'],['Rp18,2 Jt','Operasional'],['Rp20,1 Jt','Saldo/alokasi']];
  return (
    <>
      <PageHero eyebrow="Transparansi" title="Kepercayaan tumbuh ketika informasi mudah diperiksa." description="Dashboard ini sengaja diisi data contoh agar desain transparansi dapat dinilai secara utuh. Seluruh nominal, periode, dokumen, dan status akan diganti dengan laporan resmi." />
      <div className="sample-note"><strong>SIMULASI LAPORAN</strong><span>Seluruh nominal dan dokumen pada halaman ini adalah contoh sementara.</span></div>
      <section className="section-pad bg-[#f4f4f2]"><div className="shell"><div className="transparency-metrics">{headline.map(([value,label],index)=>{const icons=[WalletCards,Landmark,ReceiptText,FileCheck2];const Icon=icons[index];return <article key={label}><Icon size={21}/><strong>{value}</strong><span>{label}</span><small>contoh sementara</small></article>})}</div><div className="transparency-dashboard"><div className="finance-panel light-panel"><div className="finance-head"><div><span>Komposisi Penyaluran</span><small>Periode contoh 2026</small></div><strong>Rp186,5 Juta</strong></div><div className="finance-content"><div className="donut light-donut"><div><b>100%</b><span>contoh</span></div></div><div className="finance-list">{sampleFinance.map(item=><div key={item.label}><span className="finance-dot"/><strong>{item.label}</strong><em>{item.value}%</em><small>{item.amount}</small></div>)}</div></div></div><div className="report-panel"><h2>Dokumen publik</h2>{['Laporan Penyaluran Mei 2026','Ringkasan Program Triwulan II','Kebijakan Donasi & Pengembalian','Dokumen Tata Kelola Yayasan'].map((name,index)=><div className="report-row" key={name}><div><FileCheck2 size={18}/><span><strong>{name}</strong><small>Dokumen contoh · belum resmi</small></span></div><button type="button" disabled aria-label={`Unduh ${name} belum aktif`}><Download size={16}/></button></div>)}</div></div></div></section>
    </>
  );
}
