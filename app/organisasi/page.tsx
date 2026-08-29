import type { Metadata } from 'next';
import { UsersRound } from 'lucide-react';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Organisasi', description: 'Struktur organisasi Yayasan Ruang Sejahtera.' };

export default function OrganizationPage() {
  const roles = [['Pembina','Nama Pembina'],['Pengawas','Nama Pengawas'],['Ketua','Nama Ketua'],['Sekretaris','Nama Sekretaris'],['Bendahara','Nama Bendahara'],['Koordinator Program','Nama Koordinator'],['Koordinator Relawan','Nama Koordinator Relawan']];
  return (
    <>
      <PageHero eyebrow="Organisasi" title="Kerja bersama membutuhkan tanggung jawab yang terlihat." description="Struktur dan nama di halaman draft ini hanya contoh presentasi. Seluruh identitas akan diganti dengan data pengurus resmi sebelum rilis final." />
      <div className="sample-note"><strong>STRUKTUR CONTOH</strong><span>Nama pengurus di bawah adalah placeholder yang sengaja ditandai, bukan identitas resmi.</span></div>
      <section className="section-pad bg-[#f4f4f2]"><div className="shell org-chart-v3"><div className="org-card org-primary"><span><UsersRound size={22}/></span><small>Pimpinan yayasan</small><h2>Nama Ketua</h2><p>Ketua · CONTOH SEMENTARA</p></div><div className="org-line"/ ><div className="org-grid">{roles.filter(r=>r[0]!=='Ketua').map(([role,name],index)=><article key={role}><div className="org-avatar">{String(index+1).padStart(2,'0')}</div><small>{role}</small><h2>{name}</h2><p>Data identitas sementara</p></article>)}</div></div></section>
    </>
  );
}
