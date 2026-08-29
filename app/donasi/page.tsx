import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CreditCard, LockKeyhole, ReceiptText, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Cara Mendukung',
  description: 'Informasi dukungan dan standar keamanan donasi Yayasan Ruang Sejahtera.',
};

const safeguards = [
  [LockKeyhole, 'Kanal resmi', 'Rekening, QRIS, atau tautan pembayaran harus dapat dikonfirmasi sebagai milik atau kanal resmi yayasan.'],
  [CreditCard, 'Proses aman', 'Pembayaran digital harus menggunakan penyedia tepercaya tanpa menyimpan data sensitif kartu pada website.'],
  [ReceiptText, 'Jejak transaksi', 'Setiap transaksi memerlukan referensi, bukti, rekonsiliasi, serta status yang dapat ditelusuri.'],
] as const;

export default function DonationPage() {
  return (
    <>
      <PageHero
        eyebrow="Cara Mendukung"
        title="Niat baik perlu disalurkan melalui kanal yang benar."
        description="Kami tidak menampilkan nomor rekening, QRIS, nominal, atau formulir pembayaran sebelum kanal donasi resmi dan kontrol keamanannya aktif."
      />
      <section className="trust-page-section">
        <div className="shell trust-donation-layout">
          <div className="trust-donation-status">
            <ShieldCheck size={32} aria-hidden="true" />
            <span>Status kanal donasi</span>
            <h2>Pembayaran daring belum diaktifkan.</h2>
            <p>Form simulasi telah dihapus agar pengunjung tidak mengetik nama, email, atau nominal pada alur yang tidak memproses transaksi. Informasi resmi akan ditampilkan setelah rekening atau payment gateway, kebijakan, bukti pembayaran, webhook, rekonsiliasi, dan kewenangan pengelolaannya siap.</p>
            <div className="trust-actions">
              <Link href="/kontak" className="trust-button trust-button-ink">Tanyakan cara mendukung <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="/kebijakan-donasi" className="trust-button trust-button-outline">Baca kebijakan donasi <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="trust-safeguard-list">
            <span>Standar sebelum aktivasi</span>
            {safeguards.map(([Icon, title, description]) => (
              <article key={title}><Icon size={22} aria-hidden="true" /><div><h2>{title}</h2><p>{description}</p></div></article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
