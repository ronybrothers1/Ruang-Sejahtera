import type { Metadata } from 'next';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
export const metadata: Metadata = { title: 'Sejarah', description: 'Sejarah Yayasan Ruang Sejahtera.' };
export default function HistoryPage() { return <><PageHero eyebrow="Tentang Kami" title="Sejarah Yayasan" description="Kronologi organisasi harus berasal dari catatan resmi, bukan narasi yang disusun untuk mengisi ruang kosong." /><section className="py-18 md:py-24"><div className="shell"><EmptyState title="Sejarah resmi belum dipublikasikan" description="Timeline akan mendukung tanggal, peristiwa, dokumen, dan konteks setelah bahan sejarah yayasan diverifikasi." /></div></section></>; }
