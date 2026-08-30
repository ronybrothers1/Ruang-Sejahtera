import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { PageState } from '@/components/PageState';

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  description: 'Halaman yang diminta tidak tersedia di website Yayasan Ruang Sejahtera.',
};

export default function NotFound() {
  return <PageState eyebrow="404 · Halaman tidak ditemukan" title="Informasi yang Anda cari belum tersedia." description="Tautan mungkin berubah atau informasi belum dipublikasikan. Gunakan pencarian atau kembali ke beranda." icon={<Compass size={26} />} actions={<><Link href="/" className="trust-button trust-button-primary">Ke Beranda</Link><Link href="/cari" className="trust-button trust-button-secondary">Cari Informasi</Link></>} />;
}
