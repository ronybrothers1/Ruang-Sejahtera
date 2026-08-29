import type { Metadata } from 'next';
import { CreditCard, Heart, LockKeyhole, ReceiptText, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Donasi', description: 'Informasi donasi dan standar keamanan Yayasan Ruang Sejahtera.' };

export default function DonationPage() {
  return (
    <>
      <PageHero eyebrow="Donasi" title="Satu tindakan baik, dibuat sederhana dan tetap bertanggung jawab." description="Form berikut adalah simulasi visual draft. Tidak ada transaksi nyata yang diproses sampai payment gateway dan kanal pembayaran resmi diaktifkan." />
      <div className="sample-note"><strong>SIMULASI DONASI</strong><span>Nominal, rekening, QRIS, dan proses pembayaran belum aktif. Tombol transaksi sengaja dinonaktifkan.</span></div>
      <section className="section-pad bg-[#f4f4f2]"><div className="shell donation-layout"><div className="donation-card"><span className="eyebrow-v3">Pilih dukungan</span><h2 className="display-h2">Mulai dari niat baik.</h2><p>Gunakan formulir ini untuk menilai pengalaman donasi. Tidak ada data yang dikirim atau pembayaran yang dibuat.</p><form className="donation-form"><fieldset><legend>Pilih program</legend><div className="option-grid"><label><input type="radio" name="program" defaultChecked/> Air Bersih</label><label><input type="radio" name="program"/> Sembako</label><label><input type="radio" name="program"/> Pendidikan</label><label><input type="radio" name="program"/> Kemanusiaan</label></div></fieldset><fieldset><legend>Nominal donasi</legend><div className="amount-grid">{['Rp25.000','Rp50.000','Rp100.000','Rp250.000'].map((amount,index)=><button type="button" className={index===2?'amount-active':''} key={amount}>{amount}</button>)}</div><label className="field-label">Nominal lainnya<input type="text" inputMode="numeric" placeholder="Rp 0" /></label></fieldset><div className="form-grid"><label className="field-label">Nama<input type="text" placeholder="Nama donatur (contoh)" /></label><label className="field-label">Email<input type="email" placeholder="nama@email.com" /></label></div><button type="button" disabled className="donation-disabled"><Heart size={17}/> Lanjutkan Pembayaran · SIMULASI</button></form></div><aside className="donation-trust"><ShieldCheck size={34}/><h2>Dirancang aman sejak awal.</h2><p>Ketika pembayaran resmi diaktifkan, transaksi harus melalui gateway tepercaya, memiliki referensi unik, webhook terverifikasi, bukti donasi, rekonsiliasi, dan pelaporan.</p>{[[LockKeyhole,'Data pembayaran sensitif tidak disimpan langsung.'],[CreditCard,'Metode pembayaran berasal dari kanal resmi.'],[ReceiptText,'Setiap transaksi memiliki referensi dan bukti.']].map(([Icon,text])=>{const I=Icon as typeof LockKeyhole;return <div key={text as string}><I size={19}/><span>{text as string}</span></div>})}</aside></div></section>
    </>
  );
}
