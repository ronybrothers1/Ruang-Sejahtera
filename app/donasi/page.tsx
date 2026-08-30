import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CreditCard, LockKeyhole, MessageCircle, ReceiptText, ShieldCheck } from 'lucide-react';
import { DonationPreviewForm } from '@/components/DonationPreviewForm';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { sampleDonationAmounts } from '@/lib/content';
import { whatsappUrl } from '@/lib/site';

export const metadata: Metadata = { title: 'Cara Mendukung', description: 'Informasi donasi dan standar keamanan Yayasan Ruang Sejahtera.' };
const safeguards = [[LockKeyhole, 'Data pembayaran sensitif tidak disimpan langsung.'], [CreditCard, 'Metode pembayaran harus berasal dari kanal resmi.'], [ReceiptText, 'Setiap transaksi memiliki referensi dan bukti.']] as const;

export default function DonationPage() {
  const supportWhatsApp = whatsappUrl('Halo Yayasan Ruang Sejahtera, saya ingin mengetahui cara mendukung program.');

  return (
    <>
      <PageHero eyebrow="Cara Mendukung" title="Satu tindakan baik, dibuat sederhana dan bertanggung jawab." description="Untuk dukungan saat ini, hubungi yayasan melalui WhatsApp resmi. Simulasi donasi tetap dipertahankan untuk evaluasi dan tidak memproses transaksi nyata." />
      <PreviewNotice label="Simulasi donasi">Nominal, rekening, QRIS, dan proses pembayaran belum aktif. Tombol transaksi sengaja dinonaktifkan.</PreviewNotice>
      <section className="trust-page-section trust-donation-preview">
        <div className="shell trust-donation-preview-layout">
          <div className="trust-donation-card">
            <span>Pilih dukungan</span><h2>Mulai dari niat baik.</h2><p>Gunakan formulir ini untuk menilai pengalaman donasi. Tidak ada data yang dikirim atau pembayaran yang dibuat.</p>
            <DonationPreviewForm amounts={sampleDonationAmounts} />
          </div>
          <aside className="trust-donation-safeguards">
            <ShieldCheck size={34} aria-hidden="true" /><h2>Dirancang aman sejak awal.</h2><p>Ketika pembayaran resmi diaktifkan, transaksi harus melalui gateway tepercaya, memiliki referensi unik, bukti donasi, rekonsiliasi, dan pelaporan.</p>
            {safeguards.map(([Icon, text]) => <div key={text}><Icon size={19} aria-hidden="true" /><span>{text}</span></div>)}
            <div className="trust-support-links">
              {supportWhatsApp ? <a href={supportWhatsApp} target="_blank" rel="noreferrer" className="trust-button trust-button-ink" aria-label="Tanyakan cara mendukung melalui WhatsApp resmi, dibuka di tab baru"><MessageCircle size={16} aria-hidden="true" /> Tanya via WhatsApp Resmi</a> : null}
              <Link href="/kebijakan-donasi" className="trust-text-link">Baca kebijakan donasi <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
