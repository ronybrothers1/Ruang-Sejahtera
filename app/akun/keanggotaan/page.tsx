import Link from 'next/link';
import { CheckCircle2, ClipboardCheck, LockKeyhole } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SessionLogout } from '@/components/auth/SessionLogout';
import { ExamGuard } from '@/components/membership/ExamGuard';
import { requireUserSession } from '@/lib/auth/admin-session';
import { findUserByIdentityProviderId } from '@/lib/db/users';
import {
  countWeeklyExamAttempts,
  examRules,
  getCurrentExamAttempt,
  getQuestionsForAttempt,
  hasPassedExam,
} from '@/lib/membership';

export const dynamic = 'force-dynamic';

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
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

  const [passed, attemptsUsed, currentAttempt, { result }] = await Promise.all([
    hasPassedExam(profile.id),
    countWeeklyExamAttempts(profile.id),
    getCurrentExamAttempt(profile.id),
    searchParams,
  ]);

  const examState = passed ? null : currentAttempt;
  const rules = examState?.settings || examRules;
  const attemptLimitReached = attemptsUsed >= rules.maximumAttempts;

  const displayQuestions = examState
    ? getQuestionsForAttempt(examState.questions, examState.attempt.id)
    : [];
  const deadline = examState && !examState.attempt.isUntimed
    ? new Date(
        examState.attempt.startedAt.getTime() +
          examState.settings.durationMinutes * 60 * 1000,
      ).toISOString()
    : null;

  return (
    <div className="min-h-screen bg-neutral-100 text-brand-ink">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <div className="flex items-center gap-4">
            <BrandLogo compact />
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Portal Anggota</p>
              <p className="mt-1 text-sm font-bold text-neutral-700">Keanggotaan & Tes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/akun" className="button-secondary">Akun</Link>
            <SessionLogout authMethod={session.authMethod} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <p className="eyebrow">Tahap keanggotaan</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight">
          Lulus tes untuk membuka akses anggota.
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-600">
          Tes ini menilai kejujuran, integritas, ketulusan membantu, konsistensi, empati,
          tanggung jawab, dan sikap pelayanan sosial.
        </p>

        {result === 'passed' ? (
          <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">
            <CheckCircle2 className="mr-2 inline-block" size={18} />
            Selamat, Anda lulus tes. Kartu anggota dan fitur kirim berita sudah terbuka.
          </div>
        ) : null}
        {result === 'failed' ? (
          <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">
            Nilai tes belum mencapai batas lulus. Kesempatan mengulang akan tersedia selama batas mingguan belum tercapai.
          </div>
        ) : null}
        {result === 'expired' ? (
          <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">
            Waktu ujian habis. Percobaan ini tidak lulus dan tetap dihitung sebagai satu kesempatan.
          </div>
        ) : null}
        {result === 'limit' ? (
          <div role="alert" className="status-message-warning mt-7 rounded-xl border p-4 text-sm font-semibold">
            Maksimal 2 percobaan dalam 7 hari sudah tercapai. Silakan mencoba kembali setelah periode tersebut.
          </div>
        ) : null}
        {result === 'error' ? (
          <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">
            Tes belum dapat disimpan. Silakan periksa jawaban dan coba lagi selama kesempatan masih tersedia.
          </div>
        ) : null}

        <section className="mt-8 grid gap-5 sm:grid-cols-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-extrabold uppercase tracking-[.12em] text-neutral-500">Status</p>
            <p className="mt-3 font-heading text-xl font-extrabold">{passed ? 'Lulus tes' : 'Belum lulus'}</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-extrabold uppercase tracking-[.12em] text-neutral-500">Nilai lulus</p>
            <p className="mt-3 font-heading text-xl font-extrabold">{rules.passingScore}/100</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-extrabold uppercase tracking-[.12em] text-neutral-500">Kesempatan</p>
            <p className="mt-3 font-heading text-xl font-extrabold">{attemptsUsed}/{rules.maximumAttempts}</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <p className="text-xs font-extrabold uppercase tracking-[.12em] text-neutral-500">Durasi</p>
            <p className="mt-3 font-heading text-xl font-extrabold">{rules.durationMinutes} menit</p>
          </div>
        </section>

        {passed ? (
          <section className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
            <h2 className="font-heading text-2xl font-extrabold">Akses anggota sudah terbuka.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              Kartu anggota telah dibuat otomatis. Anda juga dapat mengirim berita dengan foto untuk dikurasi.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/akun/kartu" className="button-primary">Lihat kartu anggota</Link>
              <Link href="/akun/konten/baru/berita" className="button-secondary">Buat berita</Link>
            </div>
          </section>
        ) : examState ? (
          <ExamGuard deadline={deadline} formId="member-exam-form">
            <form
              id="member-exam-form"
              action="/api/membership/exam"
              method="post"
              className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8"
            >
              <input type="hidden" name="attemptId" value={examState.attempt.id} />
              <div className="flex items-start gap-3 border-b border-neutral-100 pb-5">
                <ClipboardCheck className="mt-1 shrink-0 text-brand-red" size={23} />
                <div>
                  <h2 className="font-heading text-2xl font-extrabold">Tes dasar keanggotaan</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {displayQuestions.length} pertanyaan · {examState.attempt.isUntimed ? 'tanpa batas waktu' : `${examState.settings.durationMinutes} menit`} · {examRules.pointsPerQuestion} poin per jawaban benar · nilai minimal {examState.settings.passingScore}.
                    Urutan soal dan pilihan jawaban berbeda pada setiap percobaan.
                  </p>
                </div>
              </div>
              {displayQuestions.map((question, index) => (
                <fieldset key={question.id} className="rounded-xl border border-neutral-200 p-5">
                  <legend className="px-1 text-base font-bold">
                    {index + 1}. {question.prompt}
                  </legend>
                  <div className="mt-4 space-y-3">
                    {question.options.map(({ id, label }) => (
                      <label
                        key={id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-3 text-sm leading-6 hover:border-red-300"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={id}
                          required
                          className="mt-1"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <button type="submit" className="button-primary w-full sm:w-auto">
                Kirim jawaban tes
              </button>
            </form>
          </ExamGuard>
        ) : attemptLimitReached ? (
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <LockKeyhole className="text-amber-700" size={23} />
            <h2 className="mt-4 font-heading text-2xl font-extrabold">Kesempatan tes sudah habis.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              Maksimal 2 percobaan dalam 7 hari sudah digunakan. Anda dapat mencoba kembali setelah periode tersebut.
            </p>
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8" aria-labelledby="exam-start-heading">
            <ClipboardCheck className="text-brand-red" size={25} aria-hidden="true" />
            <h2 id="exam-start-heading" className="mt-4 font-heading text-2xl font-extrabold">Mulai saat Anda benar-benar siap.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              Membuka halaman ini tidak lagi memulai percobaan. Waktu baru berjalan setelah tombol di bawah ditekan.
              Siapkan koneksi yang stabil dan alokasikan waktu hingga {rules.durationMinutes} menit.
            </p>
            <form action="/api/membership/exam" method="post" className="mt-6 space-y-5">
              <input type="hidden" name="intent" value="start" />
              <label className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6">
                <input name="untimedAccommodation" value="yes" type="checkbox" className="mt-1 size-4 shrink-0" />
                <span>
                  <strong>Saya memerlukan akomodasi tanpa batas waktu.</strong>
                  <span className="mt-1 block text-neutral-600">Pilih bila batas waktu menjadi hambatan aksesibilitas. Jumlah soal dan nilai kelulusan tetap sama.</span>
                </span>
              </label>
              <button type="submit" className="button-primary">Mulai tes sekarang</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
