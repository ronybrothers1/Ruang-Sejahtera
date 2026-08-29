import type { Metadata } from 'next';
import { Instagram, Mail, MapPin, Music2, Phone } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Kanal komunikasi resmi Yayasan Ruang Sejahtera.',
};

const contactRows = [
  siteConfig.contact.address ? { label: 'Alamat', value: siteConfig.contact.address, href: siteConfig.contact.mapUrl, icon: MapPin } : null,
  siteConfig.contact.whatsapp ? { label: 'WhatsApp', value: siteConfig.contact.whatsapp, href: `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}`, icon: Phone } : null,
  siteConfig.contact.email ? { label: 'Email', value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}`, icon: Mail } : null,
].filter((item): item is NonNullable<typeof item> => Boolean(item));

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Gunakan kanal yang dapat dipastikan keasliannya."
        description="Halaman ini hanya menampilkan alamat, nomor, email, dan akun sosial yang dikonfigurasi sebagai kanal resmi."
      />
      <section className="trust-page-section">
        <div className="shell trust-contact-layout">
          <div className="trust-contact-copy">
            <span>Hubungi kami</span>
            <h2>Satu pintu untuk pertanyaan, kolaborasi, dan klarifikasi.</h2>
            <p>Form simulasi dan identitas kontak contoh telah dihapus agar tidak ada data pribadi yang diketik atau dikirim ke kanal yang belum aktif.</p>
            <div className="trust-social-links">
              {siteConfig.social.instagram ? <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer"><Instagram size={19} aria-hidden="true" /><span><small>Instagram</small><strong>@ruangsejahtera.idn</strong></span></a> : null}
              {siteConfig.social.tiktok ? <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer"><Music2 size={19} aria-hidden="true" /><span><small>TikTok</small><strong>@ruangsejahtera.idn</strong></span></a> : null}
            </div>
          </div>
          {contactRows.length ? (
            <div className="trust-contact-list">
              {contactRows.map(({ label, value, href, icon: Icon }) => href ? (
                <a href={href} key={label} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
                  <Icon size={21} aria-hidden="true" /><span><small>{label}</small><strong>{value}</strong></span>
                </a>
              ) : (
                <div key={label}><Icon size={21} aria-hidden="true" /><span><small>{label}</small><strong>{value}</strong></span></div>
              ))}
            </div>
          ) : (
            <EmptyState
              eyebrow="Kontak resmi"
              title="Alamat, WhatsApp, dan email resmi belum dipublikasikan."
              description="Gunakan akun media sosial resmi yang tercantum di halaman ini. Kanal lain akan ditampilkan setelah identitas dan pengelolaannya dapat diverifikasi."
            />
          )}
        </div>
      </section>
    </>
  );
}
