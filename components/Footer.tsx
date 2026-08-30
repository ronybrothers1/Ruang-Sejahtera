import Link from 'next/link';
import { Heart, Instagram, Mail, MapPin, MessageCircle, Music2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { siteConfig } from '@/lib/site';

const socialHandle = '@ruangsejahtera.idn';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" focusable="false" height={size} viewBox="0 0 24 24" width={size}>
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.981.998-3.646-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.894 9.888-9.894 2.641 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.897 6.994c-.003 5.45-4.445 9.894-9.888 9.894m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.14 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Footer() {
  const whatsappNumber = siteConfig.contact.whatsapp;
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : null;

  return (
    <footer className="footer-v3">
      <div className="shell footer-grid-v3">
        <div className="footer-brand">
          <BrandLogo compact />
          <p>Menghubungkan kepedulian dengan program sosial yang terarah, terdokumentasi, dan terbuka untuk diperiksa publik.</p>
          <Link className="footer-primary-link" href="/program">Kenali lima program kami</Link>
        </div>

        <div>
          <h2 className="footer-title-v3">Jelajahi</h2>
          <div className="footer-links-v3">
            <Link href="/tentang-kami">Tentang Kami</Link>
            <Link href="/program">Program</Link>
            <Link href="/kegiatan">Kegiatan</Link>
            <Link href="/berita">Berita & Cerita</Link>
            <Link href="/galeri">Galeri</Link>
          </div>
        </div>

        <div>
          <h2 className="footer-title-v3">Akuntabilitas</h2>
          <div className="footer-links-v3">
            <Link href="/dampak">Dampak</Link>
            <Link href="/transparansi">Transparansi</Link>
            <Link href="/organisasi">Organisasi</Link>
            <Link href="/tentang-kami/legalitas">Legalitas</Link>
            <Link href="/kebijakan-donasi">Kebijakan Donasi</Link>
          </div>
        </div>

        <div className="footer-contact-v3">
          <h2 className="footer-title-v3">Terhubung</h2>
          <div className="footer-contact-list-v9">
            <Link className="footer-contact-link-v9" href="/donasi">
              <span className="footer-contact-icon-v9"><Heart aria-hidden="true" size={18} /></span>
              <span>Cara Mendukung</span>
            </Link>
            <Link className="footer-contact-link-v9" href="/kontak">
              <span className="footer-contact-icon-v9"><MessageCircle aria-hidden="true" size={18} /></span>
              <span>Kontak & Kolaborasi</span>
            </Link>
            {siteConfig.social.instagram ? (
              <a aria-label={`Instagram ${socialHandle}`} className="footer-contact-link-v9" href={siteConfig.social.instagram} rel="noreferrer" target="_blank">
                <span className="footer-contact-icon-v9"><Instagram aria-hidden="true" size={18} /></span>
                <span>{socialHandle}</span>
              </a>
            ) : null}
            {siteConfig.social.tiktok ? (
              <a aria-label={`TikTok ${socialHandle}`} className="footer-contact-link-v9" href={siteConfig.social.tiktok} rel="noreferrer" target="_blank">
                <span className="footer-contact-icon-v9"><Music2 aria-hidden="true" size={18} /></span>
                <span>{socialHandle}</span>
              </a>
            ) : null}
            {whatsappHref ? (
              <a aria-label={`WhatsApp ${whatsappNumber}`} className="footer-contact-link-v9" href={whatsappHref} rel="noreferrer" target="_blank">
                <span className="footer-contact-icon-v9"><WhatsAppIcon /></span>
                <span>{whatsappNumber}</span>
              </a>
            ) : null}
            {siteConfig.contact.email ? (
              <a className="footer-contact-link-v9" href={`mailto:${siteConfig.contact.email}`}>
                <span className="footer-contact-icon-v9"><Mail aria-hidden="true" size={18} /></span>
                <span>{siteConfig.contact.email}</span>
              </a>
            ) : null}
            {siteConfig.contact.address ? (
              <div className="footer-contact-link-v9 footer-contact-text-v9">
                <span className="footer-contact-icon-v9"><MapPin aria-hidden="true" size={18} /></span>
                <span>{siteConfig.contact.address}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="shell footer-bottom-v3">
        <p>© {new Date().getFullYear()} Yayasan Ruang Sejahtera.</p>
        <div className="footer-meta-links-v9">
          <Link href="/privasi">Privasi</Link>
          <Link href="/ketentuan">Ketentuan</Link>
          <Link href="/aksesibilitas">Aksesibilitas</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/cari">Pencarian</Link>
        </div>
      </div>
    </footer>
  );
}
