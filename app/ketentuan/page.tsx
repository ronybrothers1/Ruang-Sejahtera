import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DocumentLayout } from '@/components/DocumentLayout';
import { PageHero } from '@/components/PageHero';
export const metadata: Metadata = { title: 'Ketentuan Penggunaan' };
export default function TermsPage() {
  const sections = [
    { id: 'informasi-publik', title: 'Informasi publik', content: 'Informasi pada website ditujukan untuk komunikasi publik yayasan. Data program, kegiatan, dampak, dan laporan harus berasal dari sumber resmi yang telah disetujui untuk publikasi.' },
    { id: 'penggunaan-wajar', title: 'Penggunaan yang wajar', content: 'Pengguna tidak boleh menyalahgunakan formulir, mencoba memperoleh akses tanpa izin, mengganggu layanan, atau menggunakan konten penerima manfaat dengan cara yang merugikan martabat dan privasi mereka.' },
    { id: 'kanal-pembayaran', title: 'Kanal pembayaran resmi', content: 'Informasi pembayaran hanya sah apabila ditampilkan melalui kanal resmi yang dikonfigurasi dan dikendalikan yayasan. Selama kanal tersebut belum aktif, website tidak meminta pembayaran.' },
  ];

  return (
    <>
      <PageHero eyebrow="Ketentuan" title="Ketentuan penggunaan website." description="Baseline ini mengatur penggunaan informasi publik pada website Yayasan Ruang Sejahtera dan akan disesuaikan kembali saat layanan digital bertambah." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Ketentuan Penggunaan' }]} />
      <DocumentLayout sections={sections} />
    </>
  );
}
