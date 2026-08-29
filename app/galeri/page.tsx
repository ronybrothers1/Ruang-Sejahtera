import type { Metadata } from 'next';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
export const metadata: Metadata = { title: 'Galeri', description: 'Dokumentasi foto dan video kegiatan Yayasan Ruang Sejahtera.' };
export default function GalleryPage() { return <><PageHero eyebrow="Galeri" title="Dokumentasi adalah bukti, bukan dekorasi." description="Galeri diprioritaskan untuk foto dan video asli kegiatan, lengkap dengan alt text, caption, lokasi, tanggal, program terkait, dan status persetujuan publikasi jika diperlukan." /><section className="py-18 md:py-24"><div className="shell"><EmptyState title="Belum ada media yang dipublikasikan" description="Foto stok dan gambar acak telah dihapus. Dokumentasi asli akan tampil setelah diunggah melalui CMS dengan metadata dan pengaturan privasi yang sesuai." /></div></section></>; }
