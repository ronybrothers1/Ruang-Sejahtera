import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { getAdminSession, getBootstrapAuthStatus } from '@/lib/auth/admin-session';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await getAdminSession();
  if (session) redirect('/admin');
  const { error } = await searchParams;
  const auth = getBootstrapAuthStatus();

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl md:p-9" aria-labelledby="admin-login-title">
        <div className="inline-flex rounded-2xl border border-neutral-200 bg-white p-3"><BrandLogo compact priority /></div>
        <div className="mt-8 flex items-center gap-3 text-brand-red"><ShieldCheck size={22} aria-hidden="true" /><span className="text-xs font-extrabold uppercase tracking-[.16em]">Area Administrasi</span></div>
        <h1 id="admin-login-title" className="mt-4 font-heading text-3xl font-extrabold tracking-tight">Akses pengelolaan konten</h1>
        <p className="mt-4 text-sm leading-7 text-neutral-600">Halaman ini tidak menggunakan akun contoh. Akses hanya tersedia setelah autentikasi admin dikonfigurasi secara eksplisit pada environment deployment.</p>

        {error === 'invalid' ? <div role="alert" className="status-message-error mt-6 rounded-xl border p-4 text-sm font-semibold">Kredensial tidak valid.</div> : null}

        {auth.configured ? (
          <form action="/api/admin/session" method="post" className="mt-7 space-y-5">
            <div>
              <label htmlFor="accessKey" className="text-sm font-bold">Kunci akses preview</label>
              <div className="relative mt-2">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} aria-hidden="true" />
                <input id="accessKey" name="accessKey" type="password" autoComplete="current-password" required className="min-h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm" />
              </div>
            </div>
            <button className="button-primary w-full" type="submit">Masuk ke Admin</button>
          </form>
        ) : (
          <div className="status-message-warning mt-7 rounded-2xl border p-5">
            <p className="text-sm font-bold">Autentikasi admin belum diaktifkan.</p>
            <p className="mt-2 text-sm leading-6">Bootstrap login hanya diizinkan pada local/preview dan otomatis diblokir pada environment production. Konfigurasi production harus memakai identity provider dengan MFA.</p>
          </div>
        )}
      </section>
    </div>
  );
}
