import Link from 'next/link';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SessionLogout } from '@/components/auth/SessionLogout';
import { requireUserSession } from '@/lib/auth/admin-session';
import { programs } from '@/lib/content';
import { listProgramApplications, type ApplicationStatus } from '@/lib/program-applications';

export const dynamic = 'force-dynamic';
const statusLabels: Record<ApplicationStatus, string> = {
  submitted: 'Menunggu review',
  under_review: 'Sedang diverifikasi',
  revision_required: 'Perlu perbaikan',
  approved: 'Pengajuan disetujui',
  rejected: 'Pengajuan ditolak',
};

const statusClasses: Record<ApplicationStatus, string> = {
  submitted: 'border-amber-200 bg-amber-50 text-amber-900',
  under_review: 'border-blue-200 bg-blue-50 text-blue-900',
  revision_required: 'border-orange-200 bg-orange-50 text-orange-900',
  approved: 'border-green-200 bg-green-50 text-green-900',
  rejected: 'border-red-200 bg-red-50 text-red-900',
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value));
}


export default async function ProgramApplicationPage({ searchParams }: { searchParams: Promise<{ submitted?: string; resubmitted?: string; error?: string }> }) {
  const session = await requireUserSession();
  const query = await searchParams;
  if (session.role !== 'member') {
    return <div className="grid min-h-screen place-items-center bg-neutral-100 p-6"><section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center"><p className="font-heading text-2xl font-extrabold">Pengajuan program tersedia untuk Anggota.</p><Link href="/akun" className="button-primary mt-5 inline-flex">Kembali ke akun</Link></section></div>;
  }

  const applications = await listProgramApplications({ applicantUserId: session.id });

  return (
    <div className="min-h-screen bg-neutral-100 text-brand-ink">
      <header className="border-b border-neutral-200 bg-white"><div className="member-portal-header-inner mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6"><div className="member-portal-brand flex items-center gap-4"><BrandLogo compact priority className="member-portal-logo" /><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Portal Anggota</p><p className="mt-1 text-sm font-bold text-neutral-700">Pengajuan Program</p></div></div><div className="flex items-center gap-3"><Link href="/akun" className="button-secondary">Akun</Link><SessionLogout authMethod={session.authMethod} /></div></div></header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <p className="eyebrow">Bantuan Ruang Sejahtera</p>
        <h1 className="mt-3 max-w-4xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">Pilih program yang paling sesuai dengan kebutuhan.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-600">Satu pengajuan hanya untuk satu program. Siapkan identitas calon penerima, lokasi lengkap, data pendukung, dan foto kondisi terkini agar tim dapat menilai kebutuhan dengan tepat.</p>
        {query.submitted ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Pengajuan berhasil dikirim dan menunggu review Core Manager atau Super Admin.</div> : null}
        {query.resubmitted ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Perbaikan berhasil dikirim ulang dan kembali masuk antrean review.</div> : null}
        {query.error ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">{query.error === 'exists' ? 'Anda sudah memiliki pengajuan aktif untuk program tersebut.' : 'Pengajuan belum berhasil dikirim. Periksa kembali data dan foto yang diunggah.'}</div> : null}
        {applications.length ? <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8" aria-labelledby="application-status-heading"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Status pengajuan</p><h2 id="application-status-heading" className="font-heading text-2xl font-extrabold">Pantau proses pengajuan Anda.</h2></div><span className="count-badge">{applications.length} pengajuan</span></div><div className="mt-6 space-y-4">{applications.map((application) => { const program = programs.find((item) => item.slug === application.programSlug); return <article key={application.id} className="rounded-xl border border-neutral-200 p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-heading text-xl font-extrabold">{program?.name || application.programSlug}</h3><p className="mt-1 text-sm text-neutral-500">Dikirim {dateLabel(application.createdAt)} · {application.beneficiaryName}</p></div><span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-extrabold ${statusClasses[application.status]}`}>{statusLabels[application.status]}</span></div>{application.reviewNote ? <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm leading-6"><strong>Catatan admin:</strong> {application.reviewNote}</div> : null}{application.status === 'revision_required' ? <Link href={`/akun/pengajuan/${application.programSlug}`} className="button-primary mt-4 inline-flex">Perbaiki dan kirim ulang <ArrowRight size={16} aria-hidden="true" /></Link> : null}</article>; })}</div></section> : null}
        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Pilihan program bantuan">
          {programs.map((program) => <Link key={program.slug} href={`/akun/pengajuan/${program.slug}`} className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-300 hover:shadow-lg"><div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-brand-red"><ClipboardList size={22} aria-hidden="true" /></span><ArrowRight className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-brand-red" size={20} aria-hidden="true" /></div><p className="mt-6 text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">{program.focus}</p><h2 className="mt-2 font-heading text-2xl font-extrabold">{program.name}</h2><p className="mt-3 text-sm leading-6 text-neutral-600">{program.summary}</p><span className="mt-6 inline-flex text-sm font-bold text-brand-red">Isi pengajuan <ArrowRight size={15} className="ml-2" aria-hidden="true" /></span></Link>)}
        </section>
      </main>
    </div>
  );
}
