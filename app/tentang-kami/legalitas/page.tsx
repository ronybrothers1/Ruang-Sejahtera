import type { Metadata } from 'next';
import { FileCheck2, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Legalitas', description: 'Dokumen legalitas Yayasan Ruang Sejahtera.' };

export default function LegalityPage() {
  const docs = [
    ['Akta Pendirian Yayasan','Nomor XX / Tahun 20XX','Notaris · contoh sementara'],
    ['Keputusan Pengesahan','AHU-XXXX.XX.XX.20XX','Kementerian terkait · contoh sementara'],
    ['NPWP Yayasan','XX.XXX.XXX.X-XXX.XXX','Nomor contoh sementara'],
    ['Dokumen Domisili / Administrasi','Nomor XXX/20XX','Dokumen contoh sementara'],
  ] as const;
  return <>
    <PageHero eyebrow="Tentang Kami" title="Legalitas" description="Halaman ini memperlihatkan rancangan presentasi dokumen legal. Seluruh nomor dan detail di bawah adalah placeholder yang akan diganti dengan dokumen resmi yang boleh dipublikasikan." />
    <div className="sample-note"><strong>DOKUMEN CONTOH</strong><span>Nomor akta, AHU, NPWP, dan identitas legal di bawah bukan data resmi.</span></div>
    <section className="section-pad section-white"><div className="shell legal-layout"><div className="legal-intro"><ShieldCheck size={32}/><span className="eyebrow-v3">Akuntabilitas institusi</span><h2 className="display-h2">Identitas hukum harus jelas, tetapi tetap aman untuk dipublikasikan.</h2><p>Versi final hanya akan menampilkan data yang telah diverifikasi dan memang layak untuk akses publik. Dokumen sensitif dapat ditampilkan dalam bentuk metadata atau salinan yang telah direduksi bila diperlukan.</p></div><div className="legal-doc-grid">{docs.map(([title,number,issuer])=><article key={title}><div><FileCheck2 size={22}/><span>CONTOH</span></div><h2>{title}</h2><strong>{number}</strong><p>{issuer}</p><small>Belum dapat diunduh</small></article>)}</div></div></section>
  </>;
}
