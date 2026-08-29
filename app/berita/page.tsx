import type { Metadata } from 'next';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
export const metadata: Metadata = { title: 'Berita', description: 'Berita, cerita dampak, dan pengumuman Yayasan Ruang Sejahtera.' };
export default function NewsPage() { return <><PageHero eyebrow="Berita & Cerita" title="Publikasi editorial yang ditulis dan disunting manusia." description="CMS V2 disiapkan agar administrator dapat menulis, menyunting, mengategorikan, dan mempublikasikan berita secara manual dengan metadata SEO dan dokumentasi terkait." /><section className="py-18 md:py-24"><div className="shell"><EmptyState title="Belum ada berita" description="Berita yang telah melewati proses editorial akan tampil di sini. Sistem tidak menghasilkan berita otomatis untuk sekadar mengisi halaman." /></div></section></>; }
