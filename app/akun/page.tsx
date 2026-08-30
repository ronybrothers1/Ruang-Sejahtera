import Link from 'next/link';
import { BadgeCheck, ClipboardCheck, FileText, ShieldCheck, UserRound } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SessionLogout } from '@/components/auth/SessionLogout';
import { canAccessControlPlane } from '@/lib/auth/permissions';
import { requireUserSession } from '@/lib/auth/admin-session';

const roleLabels = {
  super_admin: 'Super Admin',
  core_manager: 'Pengurus Inti',
  member: 'Anggota',
} as const;

const membershipLabels = {
  registered: 'Terdaftar',
  email_verified: 'Email terverifikasi',
  data_review: 'Verifikasi data',
  exam_eligible: 'Dapat mengikuti ujian',
  exam_completed: 'Ujian selesai',
  passed: 'Lulus ujian',
  failed: 'Belum lulus',
  admin_approved: 'Disetujui admin',
  active: 'Anggota aktif',
  suspended: 'Ditangguhkan',
  revoked: 'Keanggotaan dicabut',
} as const;

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string; mfa?: string }> }) {
  const session = await requireUserSession();
  const query = await searchParams;

  return (
    <div className="min-h-screen bg-neutral-100 text-brand-ink">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <div className="flex items-center gap-4"><BrandLogo compact /><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Portal Akun</p><p className="mt-1 text-sm font-bold text-neutral-700">{roleLabels[session.role]}</p></div></div>
          <div className="flex items-center gap-3"><Link href="/" className="button-secondary">Lihat Website</Link><SessionLogout authMethod={session.authMethod} /></div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {query.error === 'forbidden' ? <div className="status-message-error mb-6 rounded-xl border p-4 text-sm font-semibold" role="alert">Akun Anda tidak memiliki akses ke control plane administrasi.</div> : null}
        {session.mfaRequired || query.mfa === 'required' ? <div className="status-message-warning mb-6 rounded-xl border p-4 text-sm font-semibold" role="alert">Super Admin wajib mengaktifkan autentikasi dua langkah sebelum membuka panel administrasi.</div> : null}

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div><p className="eyebrow">Ringkasan Akun</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Selamat datang, {session.fullName || 'Anggota'}.</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">Portal ini menjadi pusat proses keanggotaan, pengiriman konten, status kurasi, dan kartu anggota Anda.</p></div>
          <aside className="rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-center gap-3"><UserRound className="text-brand-red" size={22} aria-hidden="true" /><h2 className="font-heading text-lg font-extrabold">Status akun</h2></div><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Role</dt><dd className="font-bold">{roleLabels[session.role]}</dd></div><div className="flex justify-between gap-4"><dt>Keanggotaan</dt><dd className="text-right font-bold">{membershipLabels[session.membershipStatus]}</dd></div></dl></aside>
        </section>

        <section className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Fitur akun">
          <Link href="/akun/profil" className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200"><UserRound className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Profil & keamanan</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Kelola identitas akun, password, dan autentikasi dua langkah.</p></Link>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6"><ClipboardCheck className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Keanggotaan & ujian</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Form data, ujian dasar, dan penilaian akan diaktifkan pada fase berikutnya.</p></div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6"><FileText className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Konten saya</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Buat draft dan kirim berita atau kegiatan untuk dikurasi Super Admin.</p></div>
          {canAccessControlPlane(session.role) ? <Link href="/admin" className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200"><ShieldCheck className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Control plane</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Masuk ke panel pengelolaan sesuai kewenangan role Anda.</p></Link> : <div className="rounded-2xl border border-neutral-200 bg-white p-6"><BadgeCheck className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Kartu anggota</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Kartu digital tersedia otomatis setelah seluruh proses dinyatakan lulus dan sah.</p></div>}
        </section>
      </main>
    </div>
  );
}
