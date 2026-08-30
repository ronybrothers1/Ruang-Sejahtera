import Link from 'next/link';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import {
  getControlPlaneSecurityStatus,
  hasValidControlPlaneApproval,
} from '@/lib/auth/control-plane-gate';
import { requireUserSession } from '@/lib/auth/admin-session';

export const dynamic = 'force-dynamic';

export default async function ControlPlaneApprovalPage({ searchParams }: { searchParams: Promise<{ error?: string; required?: string }> }) {
  const session = await requireUserSession();
  if (session.authMethod !== 'clerk' || session.role !== 'super_admin' || !session.identityProviderId || !session.sessionId) redirect('/akun');

  const security = getControlPlaneSecurityStatus();
  if (security.mode !== 'approval' || !security.configured || security.configurationError) redirect('/akun/profil?mfa=required');
  if (!session.mfaRequired || await hasValidControlPlaneApproval(session)) redirect('/admin');

  const query = await searchParams;

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <BrandLogo compact priority />
          <Link href="/akun" className="text-sm font-bold text-neutral-300 transition hover:text-white">Kembali ke portal akun</Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white p-7 text-brand-ink shadow-2xl sm:p-9" aria-labelledby="approval-title">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-brand-red"><ShieldCheck size={24} aria-hidden="true" /></div>
          <p className="mt-7 text-xs font-extrabold uppercase tracking-[.16em] text-brand-red">Approval Control Plane</p>
          <h1 id="approval-title" className="mt-3 font-heading text-3xl font-extrabold tracking-tight">Konfirmasi akses administrasi</h1>
          <p className="mt-4 text-sm leading-7 text-neutral-600">MFA Clerk belum aktif pada akun ini. Masukkan kunci approval yang disimpan terpisah untuk membuka Control Plane selama {Math.round(security.approvalTtlSeconds / 60)} menit.</p>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="note">
            <strong>Mitigasi sementara, bukan pengganti MFA.</strong> Approval terikat ke sesi login ini, tidak disimpan di browser sebagai teks biasa, dan akan kedaluwarsa otomatis.
          </div>

          {query.error === 'invalid' ? <div className="status-message-error mt-6 rounded-xl border p-4 text-sm font-semibold" role="alert">Kunci approval tidak valid.</div> : null}

          <form action="/api/admin/approval" method="post" className="mt-7 space-y-5">
            <label htmlFor="approvalKey" className="block text-sm font-bold">Kunci approval</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} aria-hidden="true" />
              <input id="approvalKey" name="approvalKey" type="password" autoComplete="off" required maxLength={512} className="min-h-12 w-full rounded-xl border border-neutral-300 bg-white pl-11 pr-4 text-sm" />
            </div>
            <button className="button-primary w-full" type="submit">Buka Control Plane sementara</button>
          </form>

          <p className="mt-6 text-xs leading-6 text-neutral-500">Untuk keamanan jangka panjang, aktifkan MFA di Clerk dan kembalikan mode ke <code className="font-mono">mfa</code> setelah paket autentikasi mendukungnya.</p>
        </section>
      </main>
    </div>
  );
}
