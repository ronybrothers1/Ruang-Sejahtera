import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer-v3">
      <div className="shell footer-grid-v3">
        <div className="footer-brand">
          <BrandLogo compact />
          <p>Yayasan Ruang Sejahtera berkomitmen menghadirkan ruang kepedulian yang terukur, transparan, dan dekat dengan kebutuhan masyarakat.</p>
          <div className="mt-5 flex gap-2"><span className="icon-button" aria-label="Instagram contoh"><Instagram size={16}/></span><span className="icon-button" aria-label="Facebook contoh"><Facebook size={16}/></span><span className="icon-button" aria-label="YouTube contoh"><Youtube size={16}/></span></div>
        </div>
        <div><h2 className="footer-title-v3">Jelajahi</h2><div className="footer-links-v3"><Link href="/tentang-kami">Tentang Kami</Link><Link href="/program">Program</Link><Link href="/kegiatan">Kegiatan</Link><Link href="/berita">Berita</Link><Link href="/galeri">Galeri</Link></div></div>
        <div><h2 className="footer-title-v3">Akuntabilitas</h2><div className="footer-links-v3"><Link href="/dampak">Dampak</Link><Link href="/transparansi">Transparansi</Link><Link href="/organisasi">Organisasi</Link><Link href="/tentang-kami/legalitas">Legalitas</Link><Link href="/kebijakan-donasi">Kebijakan Donasi</Link></div></div>
        <div className="footer-contact-v3"><h2 className="footer-title-v3">Kontak · contoh sementara</h2><p><MapPin size={16}/> Jl. Kebaikan No. 10, Kabupaten Sampang, Jawa Timur</p><p><Phone size={16}/> +62 812-0000-2026</p><p><Mail size={16}/> halo@ruangsejahtera.org</p><small className="mt-3 block text-[10px] leading-5 text-neutral-600">Alamat, nomor, email, dan akun sosial pada draft ini adalah contoh desain dan wajib diganti sebelum publikasi resmi.</small></div>
      </div>
      <div className="shell footer-bottom-v3"><p>© {new Date().getFullYear()} Yayasan Ruang Sejahtera · Draft visual V3.</p><div className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/privasi">Privasi</Link><Link href="/ketentuan">Ketentuan</Link><Link href="/aksesibilitas">Aksesibilitas</Link><Link href="/disclaimer">Disclaimer</Link></div></div>
    </footer>
  );
}
