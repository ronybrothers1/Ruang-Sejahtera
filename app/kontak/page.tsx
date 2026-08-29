import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Kontak', description: 'Kanal kontak Yayasan Ruang Sejahtera.' };

export default function ContactPage() {
  const items = [[MapPin,'Alamat kantor','Jl. Kebaikan No. 10, Kabupaten Sampang, Jawa Timur'],[Phone,'WhatsApp','+62 812-0000-2026'],[Mail,'Email','halo@ruangsejahtera.org']] as const;
  return (
    <>
      <PageHero eyebrow="Kontak" title="Mari bicara, berkolaborasi, dan bergerak bersama." description="Seluruh alamat, nomor, dan email pada halaman ini adalah contoh draft. Kanal resmi akan menggantikannya sebelum website digunakan sebagai sumber kontak publik." />
      <div className="sample-note"><strong>KONTAK CONTOH</strong><span>Jangan gunakan alamat, nomor, atau email pada halaman ini untuk komunikasi nyata.</span></div>
      <section className="section-pad bg-[#f4f4f2]"><div className="shell contact-layout-v3"><div className="contact-info-v3"><span className="eyebrow-v3">Hubungi kami</span><h2 className="display-h2">Satu pintu untuk pertanyaan dan kolaborasi.</h2><p>Struktur ini disiapkan untuk pertanyaan program, kemitraan, relawan, media, dan dukungan publik.</p><div className="contact-items-v3">{items.map(([Icon,label,value])=><div key={label}><Icon size={20}/><span><small>{label} · CONTOH</small><strong>{value}</strong></span></div>)}</div></div><form className="contact-form-v3"><div className="form-grid"><label className="field-label">Nama<input type="text" placeholder="Nama lengkap" /></label><label className="field-label">Email<input type="email" placeholder="nama@email.com" /></label></div><label className="field-label">Topik<select defaultValue="program"><option value="program">Informasi program</option><option value="mitra">Kemitraan</option><option value="relawan">Relawan</option><option value="media">Media</option></select></label><label className="field-label">Pesan<textarea rows={6} placeholder="Tulis pesan Anda..." /></label><button type="button" disabled className="donation-disabled"><MessageCircle size={17}/> Kirim Pesan · SIMULASI</button><small>Form ini belum mengirim data. Endpoint kontak resmi akan diaktifkan pada fase produksi.</small></form></div></section>
    </>
  );
}
