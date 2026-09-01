import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { getCurrentUserSession, getBootstrapAuthStatus } from '@/lib/auth/admin-session';
import { getIdentityStatus } from '@/lib/auth/config';
import { canAccessControlPlane } from '@/lib/auth/permissions';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await getCurrentUserSession();
  if (session) redirect(canAccessControlPlane(session.role) ? '/admin' : '/akun');
  const { error } = await searchParams;
  const auth = getBootstrapAuthStatus();
  const identity = getIdentityStatus();

  if (identity.clerk && identity.database && !auth.configured) redirect('/masuk?redirect_url=%2Fadmin');

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl md:p-9" aria-labelledby="admin-login-title">
        <div className="inline-flex rounded-2xl border border-neutral-200 bg-white p-3"><BrandLogo compact priority /></div>
        <div className="mt-8 flex items-center gap-3 text-brand-red"><ShieldCheck size={22} aria-hidden="true" /><span className="text-xs font-extrabold uppercase tracking-[.16em]">Area Administrasi</span></div>
        <h1 id="admin-login-title" className="mt-4 font-heading text-3xl font-extrabold tracking-tight">Akses pengelolaan konten</h1>
        <p className="mt-4 text-sm leading-7 text-neutral-600">Super Admin masuk melalui kunci akses sederhana selama tahap pembangunan. Core Manager dan Member menggunakan akun masing-masing melalui halaman masuk dan daftar.</p>

        {error === 'invalid' ? <div id="admin-login-error" role="alert" className="status-message-error mt-6 rounded-xl border p-4 text-sm font-semibold">Kunci akses tidak valid.</div> : null}

        {auth.configured ? (
          <form action="/api/admin/session" method="post" className="mt-7 space-y-5">
            <div>
              <label htmlFor="accessKey" className="text-sm font-bold">Kunci akses Super Admin</label>
              <div className="relative mt-2">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} aria-hidden="true" />
                <input id="accessKey" name="accessKey" type="password" autoComplete="current-password" required aria-invalid={error === 'invalid'} aria-describedby={error === 'invalid' ? 'admin-login-error' : undefined} className="min-h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm" />
              </div>
            </div>
            <button className="button-primary w-full" type="submit">Masuk sebagai Super Admin</button>
          </form>
        ) : (
          <div className="status-message-warning mt-7 rounded-2xl border p-5">
            <p className="text-sm font-bold">Login sederhana belum diaktifkan.</p>
            <p className="mt-2 text-sm leading-6">Aktifkan konfigurasi login sementara pada environment deployment ini untuk mengakses panel pembangunan.</p>
          </div>
        )}
      </section>
    </div>
  );
}
