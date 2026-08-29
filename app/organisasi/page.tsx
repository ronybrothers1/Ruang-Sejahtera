import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, UsersRound } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Organisasi',
  description: 'Struktur tanggung jawab Yayasan Ruang Sejahtera.',
};

export default function OrganizationPage() {
  return (
    <>
      <PageHero
        eyebrow="Organisasi"
        title="Tanggung jawab kelembagaan harus terlihat."
        description="Struktur organisasi akan memuat identitas dan fungsi pengurus yang telah diverifikasi serta memang layak untuk akses publik."
      />
      <section className="trust-page-section">
        <div className="shell trust-single-column">
          <div className="trust-icon-intro">
            <UsersRound size={30} aria-hidden="true" />
            <span>Tata kelola</span>
            <h2>Nama, jabatan, dan kewenangan tidak boleh diisi dengan identitas contoh.</h2>
            <p>Struktur contoh telah dihapus agar publik tidak keliru menganggapnya sebagai susunan pengurus resmi. Informasi akan ditambahkan setelah diselaraskan dengan dokumen yayasan.</p>
          </div>
          <EmptyState
            eyebrow="Struktur pengurus"
            title="Struktur organisasi resmi belum dipublikasikan."
            description="Ketika tersedia, halaman ini akan menjelaskan pembina, pengawas, pengurus, fungsi operasional, masa jabatan atau periode, serta batas kewenangan yang relevan."
            action={<Link href="/tentang-kami/legalitas" className="trust-button trust-button-ink">Lihat ruang legalitas <ArrowRight size={17} aria-hidden="true" /></Link>}
          />
        </div>
      </section>
    </>
  );
}
