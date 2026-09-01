import Link from 'next/link';
import { BadgeCheck, ClipboardCheck, ClipboardList, FileText, ShieldCheck, UserRound } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SessionLogout } from '@/components/auth/SessionLogout';
import { getControlPlaneSecurityStatus } from '@/lib/auth/control-plane-gate';
import { canAccessControlPlane } from '@/lib/auth/permissions';
import { requireUserSession } from '@/lib/auth/admin-session';
import { findUserByIdentityProviderId } from '@/lib/db/users';
import { hasPassedExam } from '@/lib/membership';
import { listProgramApplications } from '@/lib/program-applications';

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
  const security = getControlPlaneSecurityStatus();
  const profile = session.role === 'member' && session.identityProviderId
    ? await findUserByIdentityProviderId(session.identityProviderId)
    : null;
  const passedExam = session.role !== 'member' || Boolean(profile && await hasPassedExam(profile.id));
  const latestApplication = session.role === 'member' ? (await listProgramApplications({ applicantUserId: session.id }))[0] : null;
  const applicationStatusLabel = latestApplication ? ({ submitted: 'Menunggu review', under_review: 'Sedang diverifikasi', revision_required: 'Perlu perbaikan', approved: 'Pengajuan disetujui', rejected: 'Pengajuan ditolak' } as const)[latestApplication.status] : null;

  return (
    <div className="min-h-screen bg-neutral-100 text-brand-ink">
      <header className="border-b border-neutral-200 bg-white">
        <div className="member-portal-header-inner mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <div className="member-portal-brand flex items-center gap-4"><BrandLogo compact priority className="member-portal-logo" /><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Portal Akun</p><p className="mt-1 text-sm font-bold text-neutral-700">{roleLabels[session.role]}</p></div></div>
          <div className="flex items-center gap-3"><Link href="/" className="button-secondary">Lihat Website</Link><SessionLogout authMethod={session.authMethod} /></div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        {query.error === 'forbidden' ? <div className="status-message-error mb-6 rounded-xl border p-4 text-sm font-semibold" role="alert">Akun Anda tidak memiliki akses ke control plane administrasi.</div> : null}
        {session.mfaRequired || query.mfa === 'required' ? <div className="status-message-warning mb-6 rounded-xl border p-4 text-sm font-semibold" role="alert">{security.mode === 'approval' && security.configured && !security.configurationError ? 'MFA belum aktif. Akses Control Plane sementara memerlukan approval keamanan tambahan.' : 'Super Admin wajib mengaktifkan autentikasi dua langkah sebelum membuka panel administrasi.'}</div> : null}

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div><p className="eyebrow">Ringkasan Akun</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Selamat datang, {session.fullName || 'Anggota'}.</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">Portal ini menjadi pusat proses keanggotaan, pengiriman konten, status kurasi, dan kartu anggota Anda.</p></div>
          <aside className="rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-center gap-3"><UserRound className="text-brand-red" size={22} aria-hidden="true" /><h2 className="font-heading text-lg font-extrabold">Status akun</h2></div><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt>Role</dt><dd className="font-bold">{roleLabels[session.role]}</dd></div><div className="flex justify-between gap-4"><dt>Keanggotaan</dt><dd className="text-right font-bold">{membershipLabels[session.membershipStatus]}</dd></div></dl></aside>
        </section>

        <section className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Fitur akun">
          <Link href="/akun/profil" className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200"><UserRound className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Profil & keamanan</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Kelola identitas akun, password, dan keamanan profil.</p></Link>
          <Link href="/akun/keanggotaan" className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200"><ClipboardCheck className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Keanggotaan & ujian</h2><p className="mt-3 text-sm leading-6 text-neutral-600">{passedExam ? 'Tes sudah lulus. Kartu anggota dan kirim berita tersedia.' : 'Ikuti tes dasar untuk membuka kartu anggota dan fitur kirim berita.'}</p></Link>
          {session.role === 'member' ? <Link href={passedExam ? '/akun/konten' : '/akun/keanggotaan'} className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200"><FileText className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Konten saya</h2><p className="mt-3 text-sm leading-6 text-neutral-600">{passedExam ? 'Buat, edit, dan pantau status kurasi berita Anda.' : 'Fitur kirim berita terbuka setelah lulus tes.'}</p></Link> : <div className="rounded-2xl border border-neutral-200 bg-white p-6"><FileText className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Konten saya</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Buat draft dan kirim berita sesuai kewenangan role Anda.</p></div>}
          {session.role === 'member' ? <Link href="/akun/pengajuan" className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200"><ClipboardList className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">{latestApplication ? 'Status pengajuan bantuan' : 'Ajukan program bantuan'}</h2><p className="mt-3 text-sm leading-6 text-neutral-600">{latestApplication ? applicationStatusLabel : 'Pilih satu dari lima program dan kirim data calon penerima untuk direview tim.'}</p></Link> : null}
          {canAccessControlPlane(session.role) ? <Link href="/admin" className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200"><ShieldCheck className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Control plane</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Masuk ke panel pengelolaan sesuai kewenangan role Anda.</p></Link> : passedExam ? <Link href="/akun/kartu" className="rounded-2xl border border-green-200 bg-green-50 p-6 transition hover:-translate-y-1"><BadgeCheck className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Kartu anggota</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Lihat dan unduh kartu anggota ukuran KTP.</p></Link> : <div className="rounded-2xl border border-neutral-200 bg-white p-6"><BadgeCheck className="text-brand-red" size={22} /><h2 className="mt-5 font-heading text-xl font-extrabold">Kartu anggota</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Kartu tersedia otomatis setelah Anda lulus tes.</p></div>}
        </section>
      </main>
    </div>
  );
}
