import Link from 'next/link';
import { Heart, Instagram, Mail, MapPin, MessageCircle, Music2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { siteConfig } from '@/lib/site';

const socialHandle = '@ruangsejahtera.idn';

export function Footer() {
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
          <p><Heart size={16} /><Link href="/donasi">Cara Mendukung</Link></p>
          <p><MessageCircle size={16} /><Link href="/kontak">Kontak & Kolaborasi</Link></p>
          {siteConfig.social.instagram ? <p><Instagram size={16} /><a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">Instagram {socialHandle}</a></p> : null}
          {siteConfig.social.tiktok ? <p><Music2 size={16} /><a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer">TikTok {socialHandle}</a></p> : null}
          {siteConfig.contact.email ? <p><Mail size={16} /><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></p> : null}
          {siteConfig.contact.address ? <p><MapPin size={16} /><span>{siteConfig.contact.address}</span></p> : null}
        </div>
      </div>

      <div className="shell footer-bottom-v3">
        <p>© {new Date().getFullYear()} Yayasan Ruang Sejahtera.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
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
