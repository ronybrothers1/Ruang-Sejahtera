import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Intro */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-4 rounded-xl inline-flex self-start">
              <BrandLogo />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Yayasan Ruang Sejahtera hadir untuk memberikan manfaat nyata kepada masyarakat melalui program sosial, kemanusiaan, dan pemberdayaan.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-tight font-heading">Menu Utama</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="/program" className="hover:text-white transition-colors">Program Sosial</Link></li>
              <li><Link href="/kegiatan" className="hover:text-white transition-colors">Kegiatan Terbaru</Link></li>
              <li><Link href="/dampak" className="hover:text-white transition-colors">Dampak Kami</Link></li>
              <li><Link href="/berita" className="hover:text-white transition-colors">Berita & Cerita</Link></li>
            </ul>
          </div>

          {/* Transparency & Support */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-tight font-heading">Transparansi & Dukungan</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/transparansi" className="hover:text-white transition-colors">Laporan Keuangan</Link></li>
              <li><Link href="/transparansi/program" className="hover:text-white transition-colors">Laporan Program</Link></li>
              <li><Link href="/donasi" className="hover:text-white transition-colors">Donasi Sekarang</Link></li>
              <li><Link href="/relawan" className="hover:text-white transition-colors">Menjadi Relawan</Link></li>
              <li><Link href="/mitra" className="hover:text-white transition-colors">Kemitraan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg tracking-tight font-heading">Hubungi Kami</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  [ALAMAT RESMI YAYASAN]<br />
                  Jakarta, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-red-500 shrink-0" />
                <span className="text-slate-400">[NOMOR WHATSAPP RESMI]</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-red-500 shrink-0" />
                <span className="text-slate-400">[EMAIL RESMI]</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} Yayasan Ruang Sejahtera. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="/ketentuan" className="hover:text-white transition-colors">Ketentuan Penggunaan</Link>
            <Link href="/kebijakan-donasi" className="hover:text-white transition-colors">Kebijakan Donasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
