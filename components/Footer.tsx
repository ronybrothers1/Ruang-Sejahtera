import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/lib/site';

const contactItems = [
  siteConfig.contact.address ? { icon: MapPin, label: siteConfig.contact.address } : null,
  siteConfig.contact.whatsapp ? { icon: Phone, label: siteConfig.contact.whatsapp } : null,
  siteConfig.contact.email ? { icon: Mail, label: siteConfig.contact.email } : null,
].filter(Boolean) as { icon: typeof MapPin; label: string }[];

export function Footer() {
  return (
    <footer className="bg-brand-black text-neutral-300">
      <div className="shell py-14 md:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="inline-flex rounded-2xl bg-white p-3"><BrandLogo compact /></div>
            <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-400">{siteConfig.description}</p>
            <div className="mt-6 border-l-2 border-brand-red pl-4 text-sm leading-6 text-neutral-300">Kepercayaan dibangun dari kegiatan yang dapat dilihat, data yang dapat ditelusuri, dan laporan yang dapat diperiksa.</div>
          </div>
          <div><h2 className="footer-heading">Jelajahi</h2><div className="footer-links"><Link href="/tentang-kami">Tentang Kami</Link><Link href="/program">Program</Link><Link href="/kegiatan">Kegiatan</Link><Link href="/berita">Berita</Link><Link href="/galeri">Galeri</Link></div></div>
          <div><h2 className="footer-heading">Akuntabilitas</h2><div className="footer-links"><Link href="/dampak">Dampak</Link><Link href="/transparansi">Transparansi</Link><Link href="/organisasi">Organisasi</Link><Link href="/tentang-kami/legalitas">Legalitas</Link><Link href="/kebijakan-donasi">Kebijakan Donasi</Link></div></div>
          <div>
            <h2 className="footer-heading">Kontak resmi</h2>
            {contactItems.length ? <ul className="space-y-4 text-sm text-neutral-400">{contactItems.map(({ icon: Icon, label }) => <li key={label} className="flex gap-3"><Icon size={17} className="mt-0.5 shrink-0 text-brand-red" /><span>{label}</span></li>)}</ul> : <p className="text-sm leading-7 text-neutral-500">Data kontak resmi belum dipublikasikan. Website tidak menampilkan alamat, nomor, atau akun fiktif.</p>}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between"><p>© {new Date().getFullYear()} Yayasan Ruang Sejahtera.</p><div className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/privasi">Privasi</Link><Link href="/ketentuan">Ketentuan</Link><Link href="/aksesibilitas">Aksesibilitas</Link><Link href="/disclaimer">Disclaimer</Link></div></div>
      </div>
    </footer>
  );
}
