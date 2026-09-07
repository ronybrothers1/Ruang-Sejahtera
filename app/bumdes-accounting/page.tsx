import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DocumentLayout } from '@/components/DocumentLayout';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'BUM Desa Accounting',
  description: 'Informasi publik BUM Desa Accounting, aplikasi akuntansi BUM Desa berbasis Google Apps Script dan Google Sheets.',
};

export default function BumdesAccountingPage() {
  const sections = [
    {
      id: 'tentang-aplikasi',
      title: 'Tentang aplikasi',
      content:
        'BUM Desa Accounting adalah aplikasi akuntansi untuk BUM Desa yang menggunakan Google Apps Script sebagai application layer dan Google Sheets sebagai database terpisah untuk setiap BUM Desa. Aplikasi dirancang agar identitas pengguna, tenant, role, permission, dan database diverifikasi oleh server sebelum akses diberikan.',
    },
    {
      id: 'login-google',
      title: 'Masuk dengan Google',
      content:
        'Aplikasi menggunakan Google OAuth/OpenID Connect untuk memverifikasi identitas akun Google. Login Google hanya digunakan sebagai bukti identitas. Hak akses aplikasi tetap ditentukan oleh sistem BUM Desa Accounting berdasarkan akun yang telah didaftarkan, tenant yang berhak diakses, role, dan permission.',
    },
    {
      id: 'isolasi-data',
      title: 'Isolasi data BUM Desa',
      content:
        'Setiap BUM Desa menggunakan database Google Spreadsheet yang terpisah. Pengguna tidak memilih atau memasukkan database ID sebagai otoritas akses. Server menentukan database yang benar berdasarkan mapping tenant pada registry aplikasi.',
    },
    {
      id: 'kanal-informasi',
      title: 'Kanal informasi publik',
      content:
        'Halaman ini disediakan pada domain Ruang Sejahtera sebagai halaman informasi publik untuk BUM Desa Accounting dan kebutuhan konfigurasi OAuth Google. Halaman ini tidak mengubah fungsi utama aplikasi yang tetap berjalan melalui Google Apps Script.',
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Aplikasi"
        title="BUM Desa Accounting"
        description="Informasi publik dan identitas aplikasi BUM Desa Accounting."
      />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'BUM Desa Accounting' }]} />
      <DocumentLayout sections={sections} />
    </>
  );
}
