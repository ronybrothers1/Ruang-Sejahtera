import Link from 'next/link';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SessionLogout } from '@/components/auth/SessionLogout';
import { requireUserSession } from '@/lib/auth/admin-session';
import { programs } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function ProgramApplicationPage({ searchParams }: { searchParams: Promise<{ submitted?: string; error?: string }> }) {
  const session = await requireUserSession();
  const query = await searchParams;
  if (session.role !== 'member') {
    return <div className="grid min-h-screen place-items-center bg-neutral-100 p-6"><section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center"><p className="font-heading text-2xl font-extrabold">Pengajuan program tersedia untuk Anggota.</p><Link href="/akun" className="button-primary mt-5 inline-flex">Kembali ke akun</Link></section></div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-brand-ink">
      <header className="border-b border-neutral-200 bg-white"><div className="member-portal-header-inner mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6"><div className="member-portal-brand flex items-center gap-4"><BrandLogo compact priority className="member-portal-logo" /><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Portal Anggota</p><p className="mt-1 text-sm font-bold text-neutral-700">Pengajuan Program</p></div></div><div className="flex items-center gap-3"><Link href="/akun" className="button-secondary">Akun</Link><SessionLogout authMethod={session.authMethod} /></div></div></header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <p className="eyebrow">Bantuan Ruang Sejahtera</p>
        <h1 className="mt-3 max-w-4xl font-heading text-4xl font-extrabold tracking-tight md:text-5xl">Pilih program yang paling sesuai dengan kebutuhan.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-600">Satu pengajuan hanya untuk satu program. Siapkan identitas calon penerima, lokasi lengkap, data pendukung, dan foto kondisi terkini agar tim dapat menilai kebutuhan dengan tepat.</p>
        {query.submitted ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Pengajuan berhasil dikirim dan menunggu review Core Manager atau Super Admin.</div> : null}
        {query.error ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">{query.error === 'exists' ? 'Anda sudah memiliki pengajuan aktif untuk program tersebut.' : 'Pengajuan belum berhasil dikirim. Periksa kembali data dan foto yang diunggah.'}</div> : null}
        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Pilihan program bantuan">
          {programs.map((program) => <Link key={program.slug} href={`/akun/pengajuan/${program.slug}`} className="group rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-300 hover:shadow-lg"><div className="flex items-start justify-between gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-brand-red"><ClipboardList size={22} aria-hidden="true" /></span><ArrowRight className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-brand-red" size={20} aria-hidden="true" /></div><p className="mt-6 text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">{program.focus}</p><h2 className="mt-2 font-heading text-2xl font-extrabold">{program.name}</h2><p className="mt-3 text-sm leading-6 text-neutral-600">{program.summary}</p><span className="mt-6 inline-flex text-sm font-bold text-brand-red">Isi pengajuan <ArrowRight size={15} className="ml-2" aria-hidden="true" /></span></Link>)}
        </section>
      </main>
    </div>
  );
}
