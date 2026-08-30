import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Heart, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { PreviewForm } from '@/components/PreviewForm';
import { sampleContact } from '@/lib/content';

export const metadata: Metadata = { title: 'Kontak', description: 'Kanal kontak Yayasan Ruang Sejahtera.' };
const contactIcons = [MapPin, Phone, Mail];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Kontak" title="Mari bicara, berkolaborasi, dan bergerak bersama." description="Alamat, nomor, email, dan formulir contoh dipertahankan agar alur kontak terlihat utuh sebelum kanal resmi diaktifkan." />
      <PreviewNotice label="Kontak contoh">Jangan gunakan alamat, nomor, atau email berikut untuk komunikasi nyata. Formulir tidak mengirim data.</PreviewNotice>
      <section className="trust-page-section trust-contact-preview">
        <div className="shell trust-contact-preview-layout">
          <div>
            <span>Hubungi kami</span><h2>Satu pintu untuk pertanyaan dan kolaborasi.</h2><p>Struktur ini disiapkan untuk pertanyaan program, kemitraan, relawan, media, dan dukungan publik.</p>
            <div className="trust-contact-preview-items">{sampleContact.map((item, index) => { const Icon = contactIcons[index]; return <div key={item.label}><Icon size={20} aria-hidden="true" /><span><small>{item.label} · CONTOH</small><strong>{item.value}</strong></span></div>; })}</div>
            <div className="trust-actions"><Link href="/program" className="trust-button trust-button-outline">Kenali Program <ArrowRight size={16} aria-hidden="true" /></Link><Link href="/donasi" className="trust-button trust-button-ink"><Heart size={16} aria-hidden="true" /> Cara Mendukung</Link></div>
          </div>
          <PreviewForm className="trust-preview-form" ariaLabel="Formulir kontak simulasi" describedBy="contact-preview-helper">
            <div className="trust-form-grid"><label>Nama<input type="text" name="name" autoComplete="name" maxLength={120} placeholder="Nama lengkap" /></label><label>Email<input type="email" name="email" autoComplete="email" maxLength={254} placeholder="nama@email.com" /></label></div>
            <label>Topik<select name="topic" defaultValue="program"><option value="program">Informasi program</option><option value="mitra">Kemitraan</option><option value="relawan">Relawan</option><option value="media">Media</option></select></label>
            <label>Pesan<textarea name="message" rows={6} maxLength={2000} placeholder="Tulis pesan Anda..." /></label>
            <button type="button" disabled><MessageCircle size={17} aria-hidden="true" /> Kirim Pesan · SIMULASI</button>
            <small id="contact-preview-helper">Form ini belum mengirim data. Endpoint kontak resmi akan diaktifkan pada fase produksi.</small>
          </PreviewForm>
        </div>
      </section>
    </>
  );
}
