import Link from 'next/link';
import { CheckCircle2, ClipboardCheck, LockKeyhole } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SessionLogout } from '@/components/auth/SessionLogout';
import { requireUserSession } from '@/lib/auth/admin-session';
import { findUserByIdentityProviderId } from '@/lib/db/users';
import { getActiveExam, getLatestExamAttempt, hasPassedExam } from '@/lib/membership';

export const dynamic = 'force-dynamic';

export default async function MembershipPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const session = await requireUserSession();
  if (session.role !== 'member' || !session.identityProviderId) {
    return (
      <div className="grid min-h-screen place-items-center bg-neutral-100 p-6">
        <section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <p className="font-heading text-2xl font-extrabold">Halaman ini untuk Anggota.</p>
          <Link href="/admin" className="button-primary mt-5 inline-flex">Kembali ke panel</Link>
        </section>
      </div>
    );
  }

  const profile = await findUserByIdentityProviderId(session.identityProviderId);
  if (!profile) return null;
  const exam = await getActiveExam(profile.id);
  const latestAttempt = await getLatestExamAttempt(profile.id);
  const passed = await hasPassedExam(profile.id);
  const { result } = await searchParams;
  const attemptsUsed = latestAttempt?.attemptNumber || 0;
  const canTakeExam = !passed && attemptsUsed < exam.settings.maximumAttempts;

  return (
    <div className="min-h-screen bg-neutral-100 text-brand-ink">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <div className="flex items-center gap-4"><BrandLogo compact /><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Portal Anggota</p><p className="mt-1 text-sm font-bold text-neutral-700">Keanggotaan & Tes</p></div></div>
          <div className="flex items-center gap-3"><Link href="/akun" className="button-secondary">Akun</Link><SessionLogout authMethod={session.authMethod} /></div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <p className="eyebrow">Tahap keanggotaan</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight">Lulus tes untuk membuka akses anggota.</h1>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-600">Setelah lulus tes, kartu anggota dibuat otomatis dan Anda dapat mengirim berita untuk dikurasi. Sebelum lulus, akses tersebut tetap terkunci.</p>

        {result === 'passed' ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold"><CheckCircle2 className="mr-2 inline-block" size={18} />Selamat, Anda lulus tes. Kartu anggota dan fitur kirim berita sudah terbuka.</div> : null}
        {result === 'failed' ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Nilai tes belum mencapai batas lulus. Anda masih dapat mengulang selama kesempatan tersedia.</div> : null}
        {result === 'error' ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Tes belum dapat disimpan. Periksa jawaban Anda dan coba lagi.</div> : null}

        <section className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-neutral-500">Status</p><p className="mt-3 font-heading text-xl font-extrabold">{passed ? 'Lulus tes' : 'Belum lulus'}</p></div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-neutral-500">Nilai lulus</p><p className="mt-3 font-heading text-xl font-extrabold">{exam.settings.passingScore}/100</p></div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-neutral-500">Kesempatan</p><p className="mt-3 font-heading text-xl font-extrabold">{attemptsUsed}/{exam.settings.maximumAttempts}</p></div>
        </section>

        {passed ? (
          <section className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
            <h2 className="font-heading text-2xl font-extrabold">Akses anggota sudah terbuka.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">Kartu anggota telah dibuat otomatis. Anda juga dapat mengirim berita dengan foto untuk dikurasi.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Link href="/akun/kartu" className="button-primary">Lihat kartu anggota</Link><Link href="/akun/konten/baru/berita" className="button-secondary">Buat berita</Link></div>
          </section>
        ) : canTakeExam ? (
          <form action="/api/membership/exam" method="post" className="mt-8 space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
            <div className="flex items-start gap-3 border-b border-neutral-100 pb-5"><ClipboardCheck className="mt-1 shrink-0 text-brand-red" size={23} /><div><h2 className="font-heading text-2xl font-extrabold">Tes dasar keanggotaan</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{exam.questions.length} pertanyaan · Nilai minimal {exam.settings.passingScore} · Tidak ada batas waktu teknis.</p></div></div>
            {exam.questions.map((question, index) => (
              <fieldset key={question.id} className="rounded-xl border border-neutral-200 p-5">
                <legend className="px-1 text-base font-bold">{index + 1}. {question.prompt}</legend>
                <div className="mt-4 space-y-3">
                  {question.options.map((option) => <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-3 text-sm leading-6 hover:border-red-300"><input type="radio" name={`question-${question.id}`} value={option.id} required className="mt-1" /> <span>{option.label}</span></label>)}
                </div>
              </fieldset>
            ))}
            <button type="submit" className="button-primary w-full sm:w-auto">Kirim jawaban tes</button>
          </form>
        ) : (
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <LockKeyhole className="text-amber-700" size={23} />
            <h2 className="mt-4 font-heading text-2xl font-extrabold">Kesempatan tes sudah habis.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">Hubungi pengelola untuk meminta pemeriksaan atau pembukaan kesempatan berikutnya.</p>
          </section>
        )}
      </main>
    </div>
  );
}
