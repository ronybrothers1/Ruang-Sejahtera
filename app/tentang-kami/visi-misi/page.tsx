import type { Metadata } from 'next';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
export const metadata: Metadata = { title: 'Visi & Misi', description: 'Visi dan misi resmi Yayasan Ruang Sejahtera.' };
export default function VisionMissionPage() { return <><PageHero eyebrow="Tentang Kami" title="Visi & Misi" description="Ruang ini disiapkan untuk rumusan visi dan misi yang telah disahkan yayasan. V2 tidak menyusun rumusan resmi atas nama organisasi tanpa sumber internal." /><section className="py-18 md:py-24"><div className="shell"><EmptyState title="Visi & misi resmi belum dipublikasikan" description="Konten akan tampil setelah rumusan resmi dimasukkan melalui CMS dan disetujui untuk publikasi." /></div></section></>; }
