import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { getCurrentUserSession } from '@/lib/auth/admin-session';
import { getIdentityStatus } from '@/lib/auth/config';
import { canAccessControlPlane } from '@/lib/auth/permissions';
import { safeInternalRedirect } from '@/lib/security/safe-redirect';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun Ruang Sejahtera.',
  robots: { index: false, follow: false, nocache: true },
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ redirect_url?: string }> }) {
  const status = getIdentityStatus();
  const session = await getCurrentUserSession();
  if (session) redirect(canAccessControlPlane(session.role) ? '/admin' : '/akun');
  const { redirect_url: redirectUrl } = await searchParams;
  const destination = safeInternalRedirect(redirectUrl);

  return (
    <AuthShell
      eyebrow="Akun Ruang Sejahtera"
      title="Satu akun untuk berkontribusi dengan tertib."
      description="Masuk untuk mengelola profil, mengikuti proses keanggotaan, mengirim berita atau kegiatan, dan memantau hasil kurasi."
    >
      {status.clerk && status.database ? (
        <SignIn
          routing="path"
          path="/masuk"
          signUpUrl="/daftar"
          forceRedirectUrl={destination}
          appearance={{ variables: { colorPrimary: '#d71920', borderRadius: '0.9rem' } }}
        />
      ) : (
        <section className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl" role="status">
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-red">Belum diaktifkan</p>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight">Layanan akun sedang disiapkan.</h1>
          <p className="mt-4 text-sm leading-7 text-neutral-600">Form login akan aktif setelah identity provider dan database production terhubung. Website publik tetap dapat digunakan seperti biasa.</p>
        </section>
      )}
    </AuthShell>
  );
}
