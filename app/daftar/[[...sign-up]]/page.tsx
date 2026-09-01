import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { getCurrentUserSession } from '@/lib/auth/admin-session';
import { getIdentityStatus } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Daftar Anggota',
  description: 'Registrasi calon anggota Yayasan Ruang Sejahtera.',
  robots: { index: false, follow: false, nocache: true },
};

export default async function SignUpPage() {
  const status = getIdentityStatus();
  const session = await getCurrentUserSession();
  if (session) redirect('/akun');

  return (
    <AuthShell
      eyebrow="Registrasi Keanggotaan"
      title="Bergabung dimulai dari data yang dapat dipertanggungjawabkan."
      description="Setiap pendaftar memperoleh akun anggota dengan status calon. Role tidak dapat dipilih sendiri dan keanggotaan aktif hanya diberikan setelah verifikasi, ujian, dan persetujuan."
    >
      {status.clerk && status.database ? (
        <SignUp
          routing="path"
          path="/daftar"
          signInUrl="/masuk"
          forceRedirectUrl="/akun"
          appearance={{ variables: { colorPrimary: '#d71920', borderRadius: '0.9rem' } }}
        />
      ) : (
        <section className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl" role="status">
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-red">Registrasi belum dibuka</p>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight">Sistem pendaftaran sedang dipersiapkan.</h1>
          <p className="mt-4 text-sm leading-7 text-neutral-600">Registrasi baru akan dibuka setelah autentikasi, database, kebijakan privasi, dan alur verifikasi terpasang secara lengkap.</p>
        </section>
      )}
    </AuthShell>
  );
}
