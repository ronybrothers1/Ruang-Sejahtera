import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DocumentLayout } from '@/components/DocumentLayout';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi BUM Desa Accounting',
  description: 'Kebijakan privasi untuk penggunaan Google Identity pada aplikasi BUM Desa Accounting.',
};

export default function BumdesAccountingPrivacyPage() {
  const sections = [
    {
      id: 'data-yang-digunakan',
      title: 'Data yang digunakan',
      content:
        'Saat pengguna memilih Masuk dengan Google, BUM Desa Accounting menggunakan data identitas dasar yang diberikan melalui Google OpenID Connect, termasuk alamat email, nama profil bila tersedia, dan pengenal akun Google yang diperlukan untuk mengikat identitas pengguna secara aman ke akun aplikasi.',
    },
    {
      id: 'tujuan-penggunaan',
      title: 'Tujuan penggunaan data',
      content:
        'Data identitas digunakan untuk autentikasi, pencocokan pengguna yang telah terdaftar, pembentukan sesi aplikasi, penentuan BUM Desa yang boleh diakses, serta penerapan role dan permission. Data tersebut tidak digunakan untuk memberikan hak akses ke database BUM Desa lain.',
    },
    {
      id: 'token-google',
      title: 'Token dan kredensial Google',
      content:
        'Authorization code dan access token Google diproses untuk menyelesaikan verifikasi identitas. Kredensial OAuth rahasia disimpan pada konfigurasi server aplikasi dan tidak ditampilkan kepada pengguna. Token Google tidak digunakan sebagai pengganti otorisasi internal BUM Desa Accounting.',
    },
    {
      id: 'penyimpanan-dan-keamanan',
      title: 'Penyimpanan dan keamanan',
      content:
        'Informasi akun aplikasi, mapping tenant, role, permission, dan sesi dikelola pada sisi server. Setiap BUM Desa menggunakan database Google Spreadsheet yang terpisah, dan database ID ditentukan oleh server berdasarkan registry aplikasi, bukan oleh input pengguna sebagai sumber otoritas.',
    },
    {
      id: 'berbagi-data',
      title: 'Berbagi data',
      content:
        'BUM Desa Accounting tidak menjual data identitas pengguna. Data hanya diproses untuk menjalankan fungsi autentikasi, otorisasi, keamanan, administrasi akun, dan operasional aplikasi yang berkaitan dengan BUM Desa yang berhak diakses pengguna.',
    },
    {
      id: 'retensi-dan-kontak',
      title: 'Retensi dan kontak',
      content:
        'Data akun dan catatan akses disimpan selama diperlukan untuk pengelolaan akun, keamanan, audit, dan kewajiban operasional aplikasi. Pertanyaan mengenai penggunaan data atau permintaan terkait akun dapat disampaikan kepada pengelola melalui alamat email dukungan yang tercantum pada layar persetujuan Google OAuth.',
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="BUM Desa Accounting"
        title="Kebijakan Privasi"
        description="Cara BUM Desa Accounting menggunakan dan melindungi data identitas saat pengguna masuk dengan Google."
      />
      <Breadcrumbs
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'BUM Desa Accounting', href: '/bumdes-accounting' },
          { label: 'Kebijakan Privasi' },
        ]}
      />
      <DocumentLayout sections={sections} />
    </>
  );
}
