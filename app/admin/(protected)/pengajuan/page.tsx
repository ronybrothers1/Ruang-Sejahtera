import Image from 'next/image';
import Link from 'next/link';
import { ClipboardCheck, MapPin, UserRound } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ProgramApplicationReviewForm } from '@/components/admin/ProgramApplicationReviewForm';
import { requireAdminSession } from '@/lib/auth/admin-session';
import { can } from '@/lib/auth/permissions';
import { listProgramApplications, type ApplicationStatus } from '@/lib/program-applications';
import { programs } from '@/lib/content';

const labels: Record<ApplicationStatus, string> = {
  submitted: 'Masuk',
  under_review: 'Sedang direview',
  revision_required: 'Perlu perbaikan',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

const detailLabels: Record<string, string> = {
  familyCount: 'Jumlah keluarga',
  condition: 'Kondisi ekonomi',
  needDescription: 'Bantuan yang diharapkan',
  businessType: 'Jenis usaha',
  businessDuration: 'Lama usaha',
  currentCondition: 'Kondisi usaha',
  assistanceNeed: 'Kebutuhan bantuan',
  houseCondition: 'Kondisi rumah',
  occupants: 'Penghuni rumah',
  damageDescription: 'Rincian kerusakan',
  waterSource: 'Sumber air',
  affectedFamilies: 'Keluarga terdampak',
  crisisDuration: 'Lama kesulitan air',
  schoolLevel: 'Jenjang pendidikan',
  studentCount: 'Jumlah anak',
  educationNeed: 'Kebutuhan pendidikan',
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default async function ProgramApplicationsAdminPage({ searchParams }: { searchParams: Promise<{ reviewed?: string }> }) {
  const session = await requireAdminSession();
  if (!can(session.role, 'membership.review')) return <div className="rounded-2xl border border-neutral-200 bg-white p-8"><h1 className="font-heading text-2xl font-extrabold">Akses review tidak tersedia.</h1><Link href="/admin" className="button-primary mt-5 inline-flex">Kembali ke dashboard</Link></div>;
  const applications = await listProgramApplications();
  const query = await searchParams;

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">Pengajuan Program</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">Review bantuan masyarakat.</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">Core Manager dan Super Admin dapat memeriksa data, melihat foto kondisi awal, lalu memilih status pengajuan secara langsung.</p></div><span className="count-badge">{applications.length} pengajuan</span></div>
      {query.reviewed ? <div role="status" className="status-message-success mt-7 rounded-xl border p-4 text-sm font-semibold">Status pengajuan berhasil diperbarui.</div> : null}
      <section className="mt-8 space-y-5" aria-label="Daftar pengajuan program">
        {applications.length ? applications.map((application) => {
          const program = programs.find((item) => item.slug === application.programSlug);
          return <article key={application.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 md:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">{program?.name || application.programSlug}</p><StatusBadge status={application.status === 'approved' ? 'approved' : application.status === 'rejected' ? 'rejected' : application.status === 'revision_required' ? 'revision_required' : application.status === 'under_review' ? 'pending_review' : 'draft'} /></div><h2 className="mt-3 font-heading text-2xl font-extrabold">{application.beneficiaryName}</h2><p className="mt-2 text-sm text-neutral-500">Dikirim {dateLabel(application.createdAt)}</p></div><div className="flex items-center gap-2 text-sm text-neutral-600"><UserRound size={17} aria-hidden="true" /> Identitas calon penerima tersedia</div></div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">{application.existingPhotoUrl ? <Image src={application.existingPhotoUrl} alt={application.existingPhotoAlt || 'Foto kondisi awal calon penerima'} width={440} height={300} unoptimized className="h-44 w-full rounded-xl border border-neutral-200 object-cover lg:h-48" /> : <div className="grid h-44 place-items-center rounded-xl bg-neutral-100 text-sm text-neutral-500">Tidak ada foto</div>}<div className="grid gap-5 text-sm sm:grid-cols-2"><div><p className="font-bold">Identitas</p><p className="mt-1 text-neutral-600">{application.beneficiaryIdentity}</p></div><div><p className="font-bold">Kontak</p><p className="mt-1 text-neutral-600">{application.phone}</p></div><div className="sm:col-span-2"><p className="flex items-center gap-2 font-bold"><MapPin size={16} aria-hidden="true" /> Lokasi</p><p className="mt-1 leading-6 text-neutral-600">{Object.values(application.address).filter(Boolean).join(', ')}</p></div>{Object.entries(application.details).map(([key, value]) => <div key={key}><p className="font-bold">{detailLabels[key] || key}</p><p className="mt-1 leading-6 text-neutral-600">{value}</p></div>)}</div></div>
            <div className="mt-6 border-t border-neutral-100 pt-6"><div className="flex items-center gap-2"><ClipboardCheck className="text-brand-red" size={18} aria-hidden="true" /><p className="font-bold">Keputusan review</p></div>{application.status === 'submitted' || application.status === 'under_review' ? <ProgramApplicationReviewForm applicationId={application.id} currentStatus={application.status} reviewNote={application.reviewNote} /> : <p className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">{application.status === 'revision_required' ? 'Menunggu anggota memperbaiki dan mengirim ulang pengajuan.' : 'Keputusan ini bersifat final dan tidak dapat ditimpa dari formulir review.'}</p>}</div>
          </article>;
        }) : <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center"><p className="font-heading text-2xl font-extrabold">Belum ada pengajuan.</p><p className="mt-3 text-sm text-neutral-600">Pengajuan dari Anggota akan muncul di halaman ini.</p></div>}
      </section>
    </div>
  );
}
