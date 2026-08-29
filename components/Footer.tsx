import Link from 'next/link';
import { Instagram, Music2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

const socialHandle = '@ruangsejahtera.idn';

export function Footer() {
  return (
    <footer className="footer-v3">
      <div className="shell footer-grid-v3">
        <div className="footer-brand">
          <BrandLogo compact />
          <p>Yayasan Ruang Sejahtera berkomitmen menghadirkan ruang kepedulian yang terukur, transparan, dan dekat dengan kebutuhan masyarakat.</p>
        </div>

        <div>
          <h2 className="footer-title-v3">Jelajahi</h2>
          <div className="footer-links-v3">
            <Link href="/tentang-kami">Tentang Kami</Link>
            <Link href="/program">Program</Link>
            <Link href="/kegiatan">Kegiatan</Link>
            <Link href="/berita">Berita</Link>
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
          <h2 className="footer-title-v3">Media Sosial Resmi</h2>
          <p>
            <Instagram size={16} />
            <a href="https://www.instagram.com/ruangsejahtera.idn" target="_blank" rel="noreferrer">Instagram {socialHandle}</a>
          </p>
          <p>
            <Music2 size={16} />
            <a href="https://www.tiktok.com/@ruangsejahtera.idn" target="_blank" rel="noreferrer">TikTok {socialHandle}</a>
          </p>
        </div>
      </div>

      <div className="shell footer-bottom-v3">
        <p>© {new Date().getFullYear()} Yayasan Ruang Sejahtera.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privasi">Privasi</Link>
          <Link href="/ketentuan">Ketentuan</Link>
          <Link href="/aksesibilitas">Aksesibilitas</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
