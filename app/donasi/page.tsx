import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CreditCard, Heart, LockKeyhole, MessageCircle, ReceiptText, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { sampleDonationAmounts } from '@/lib/content';

export const metadata: Metadata = { title: 'Cara Mendukung', description: 'Informasi donasi dan standar keamanan Yayasan Ruang Sejahtera.' };
const safeguards = [[LockKeyhole, 'Data pembayaran sensitif tidak disimpan langsung.'], [CreditCard, 'Metode pembayaran harus berasal dari kanal resmi.'], [ReceiptText, 'Setiap transaksi memiliki referensi dan bukti.']] as const;

export default function DonationPage() {
  return (
    <>
      <PageHero eyebrow="Cara Mendukung" title="Satu tindakan baik, dibuat sederhana dan bertanggung jawab." description="Simulasi donasi dipertahankan agar alurnya dapat dievaluasi secara lengkap. Tidak ada transaksi nyata yang diproses." />
      <PreviewNotice label="Simulasi donasi">Nominal, rekening, QRIS, dan proses pembayaran belum aktif. Tombol transaksi sengaja dinonaktifkan.</PreviewNotice>
      <section className="trust-page-section trust-donation-preview">
        <div className="shell trust-donation-preview-layout">
          <div className="trust-donation-card">
            <span>Pilih dukungan</span><h2>Mulai dari niat baik.</h2><p>Gunakan formulir ini untuk menilai pengalaman donasi. Tidak ada data yang dikirim atau pembayaran yang dibuat.</p>
            <form className="trust-preview-form">
              <fieldset><legend>Pilih program</legend><div className="trust-option-grid"><label><input type="radio" name="program" defaultChecked /> Air Bersih</label><label><input type="radio" name="program" /> Sembako</label><label><input type="radio" name="program" /> Pendidikan</label><label><input type="radio" name="program" /> Kemanusiaan</label></div></fieldset>
              <fieldset><legend>Nominal donasi</legend><div className="trust-amount-grid">{sampleDonationAmounts.map((amount, index) => <button type="button" className={index === 2 ? 'is-active' : ''} key={amount}>{amount}</button>)}</div><label>Nominal lainnya<input type="text" inputMode="numeric" placeholder="Masukkan nominal" /></label></fieldset>
              <div className="trust-form-grid"><label>Nama<input type="text" placeholder="Nama donatur (contoh)" /></label><label>Email<input type="email" placeholder="nama@email.com" /></label></div>
              <button type="button" disabled><Heart size={17} aria-hidden="true" /> Lanjutkan Pembayaran · SIMULASI</button>
            </form>
          </div>
          <aside className="trust-donation-safeguards">
            <ShieldCheck size={34} aria-hidden="true" /><h2>Dirancang aman sejak awal.</h2><p>Ketika pembayaran resmi diaktifkan, transaksi harus melalui gateway tepercaya, memiliki referensi unik, bukti donasi, rekonsiliasi, dan pelaporan.</p>
            {safeguards.map(([Icon, text]) => <div key={text}><Icon size={19} aria-hidden="true" /><span>{text}</span></div>)}
            <div className="trust-support-links">
              <Link href="/kontak" className="trust-button trust-button-ink"><MessageCircle size={16} aria-hidden="true" /> Hubungi Yayasan</Link>
              <Link href="/kebijakan-donasi" className="trust-text-link">Baca kebijakan donasi <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
