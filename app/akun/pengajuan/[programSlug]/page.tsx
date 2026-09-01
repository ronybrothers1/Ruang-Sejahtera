import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, Camera, ClipboardList, MapPin, Upload } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { SessionLogout } from '@/components/auth/SessionLogout';
import { requireUserSession } from '@/lib/auth/admin-session';
import { programs } from '@/lib/content';
import { getProgramApplicationForApplicant } from '@/lib/program-applications';

const fields: Record<string, Array<{ name: string; label: string; placeholder: string }>> = {
  'berbagi-rasa': [
    { name: 'familyCount', label: 'Jumlah anggota keluarga', placeholder: 'Contoh: 4 orang' },
    { name: 'condition', label: 'Kondisi ekonomi dan kebutuhan utama', placeholder: 'Jelaskan kondisi secara singkat' },
    { name: 'needDescription', label: 'Bantuan yang diharapkan', placeholder: 'Contoh: sembako dan bantuan tunai untuk kebutuhan dasar' },
  ],
  merakyat: [
    { name: 'businessType', label: 'Jenis usaha', placeholder: 'Contoh: warung kelontong' },
    { name: 'businessDuration', label: 'Lama usaha berjalan', placeholder: 'Contoh: 3 tahun' },
    { name: 'currentCondition', label: 'Kondisi usaha saat ini', placeholder: 'Jelaskan kondisi dan kendala usaha' },
    { name: 'assistanceNeed', label: 'Bantuan yang dibutuhkan', placeholder: 'Contoh: modal kerja atau renovasi tempat usaha' },
  ],
  rehat: [
    { name: 'houseCondition', label: 'Kondisi rumah', placeholder: 'Jelaskan bagian rumah yang rusak' },
    { name: 'occupants', label: 'Jumlah penghuni rumah', placeholder: 'Contoh: 5 orang' },
    { name: 'damageDescription', label: 'Rincian kerusakan', placeholder: 'Jelaskan kerusakan yang perlu ditangani' },
    { name: 'assistanceNeed', label: 'Bantuan yang dibutuhkan', placeholder: 'Contoh: perbaikan atap dan lantai' },
  ],
  'berbagi-air-bersih': [
    { name: 'waterSource', label: 'Sumber air yang digunakan', placeholder: 'Contoh: sumur warga yang mengering' },
    { name: 'affectedFamilies', label: 'Perkiraan keluarga terdampak', placeholder: 'Contoh: 30 keluarga' },
    { name: 'crisisDuration', label: 'Lama kesulitan air', placeholder: 'Contoh: 2 bulan' },
    { name: 'assistanceNeed', label: 'Bantuan yang dibutuhkan', placeholder: 'Contoh: penyaluran air bersih' },
  ],
  'berbagi-masa-depan': [
    { name: 'schoolLevel', label: 'Jenjang pendidikan', placeholder: 'Contoh: SD kelas 5' },
    { name: 'studentCount', label: 'Jumlah anak yang membutuhkan', placeholder: 'Contoh: 2 anak' },
    { name: 'educationNeed', label: 'Kebutuhan pendidikan', placeholder: 'Contoh: perlengkapan sekolah dan biaya transportasi' },
    { name: 'assistanceNeed', label: 'Bantuan yang dibutuhkan', placeholder: 'Jelaskan bantuan yang diharapkan' },
  ],
};

export default async function ProgramApplicationFormPage({ params, searchParams }: { params: Promise<{ programSlug: string }>; searchParams: Promise<{ error?: string }> }) {
  const session = await requireUserSession();
  if (session.role !== 'member') notFound();
  const { programSlug } = await params;
  const program = programs.find((item) => item.slug === programSlug);
  if (!program) notFound();
  const query = await searchParams;
  const application = await getProgramApplicationForApplicant({ applicantUserId: session.id, programSlug });
  if (application && application.status !== 'revision_required') redirect('/akun/pengajuan?error=exists');
  const isRevision = application?.status === 'revision_required';

  return (
    <div className="min-h-screen bg-neutral-100 text-brand-ink">
      <header className="border-b border-neutral-200 bg-white"><div className="member-portal-header-inner mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6"><div className="member-portal-brand flex items-center gap-4"><BrandLogo compact priority className="member-portal-logo" /><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Portal Anggota</p><p className="mt-1 text-sm font-bold text-neutral-700">Pengajuan Program</p></div></div><div className="flex items-center gap-3"><Link href="/akun" className="button-secondary">Akun</Link><SessionLogout authMethod={session.authMethod} /></div></div></header>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <Link href="/akun/pengajuan" className="inline-flex items-center gap-2 text-sm font-bold text-brand-red"><ArrowLeft size={16} aria-hidden="true" /> Pilih program lain</Link>
        <div className="mt-7"><p className="eyebrow">{program.focus}</p><h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight md:text-5xl">{isRevision ? 'Perbaiki pengajuan' : 'Pengajuan'} {program.name}</h1><p className="mt-4 max-w-3xl leading-7 text-neutral-600">{program.summary} {isRevision ? 'Perbarui data sesuai catatan reviewer, lalu kirim ulang untuk diperiksa.' : 'Isi data berdasarkan kondisi nyata agar tim dapat melakukan review dengan tepat.'}</p></div>
        {isRevision && application.reviewNote ? <div role="status" className="status-message-warning mt-7 rounded-xl border p-4 text-sm leading-6"><strong>Catatan yang harus diperbaiki:</strong> {application.reviewNote}</div> : null}
        {query.error ? <div role="alert" className="status-message-error mt-7 rounded-xl border p-4 text-sm font-semibold">Data belum lengkap atau belum berhasil disimpan. Periksa kembali kolom wajib dan foto kondisi awal.</div> : null}
        <form action="/api/membership/applications" method="post" encType="multipart/form-data" className="mt-8 space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          <input type="hidden" name="intent" value={isRevision ? 'resubmit' : 'create'} />
          {isRevision ? <input type="hidden" name="applicationId" value={application.id} /> : null}
          <input type="hidden" name="programSlug" value={program.slug} />
          <section aria-labelledby="beneficiary-heading"><div className="flex items-start gap-3"><ClipboardList className="mt-1 shrink-0 text-brand-red" size={23} aria-hidden="true" /><div><h2 id="beneficiary-heading" className="font-heading text-2xl font-extrabold">Data calon penerima</h2><p className="mt-2 text-sm leading-6 text-neutral-600">Gunakan data calon penerima bantuan, bukan hanya data pengaju.</p></div></div><div className="mt-5 grid gap-5 md:grid-cols-2"><label className="text-sm font-bold">Nama calon penerima<input name="beneficiaryName" required maxLength={160} defaultValue={application?.beneficiaryName || ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Nomor identitas<input name="beneficiaryIdentity" required maxLength={120} defaultValue={application?.beneficiaryIdentity || ''} placeholder="NIK atau identitas lain yang relevan" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Nomor yang dapat dihubungi<input name="phone" type="tel" required maxLength={40} defaultValue={application?.phone || ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label></div></section>
          <section aria-labelledby="location-heading"><div className="flex items-start gap-3"><MapPin className="mt-1 shrink-0 text-brand-red" size={23} aria-hidden="true" /><div><h2 id="location-heading" className="font-heading text-2xl font-extrabold">Lokasi calon penerima</h2><p className="mt-2 text-sm leading-6 text-neutral-600">Tuliskan alamat yang dapat digunakan tim untuk verifikasi lapangan.</p></div></div><div className="mt-5 grid gap-5 md:grid-cols-2"><label className="text-sm font-bold md:col-span-2">Alamat lengkap<input name="addressStreet" required maxLength={300} defaultValue={application?.address.street || ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Desa/Kelurahan<input name="addressVillage" required maxLength={120} defaultValue={application?.address.village || ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Kecamatan<input name="addressDistrict" required maxLength={120} defaultValue={application?.address.district || ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Kabupaten/Kota<input name="addressRegency" required maxLength={120} defaultValue={application?.address.regency || ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="text-sm font-bold">Provinsi<input name="addressProvince" required maxLength={120} defaultValue={application?.address.province || ''} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label></div></section>
          <section aria-labelledby="program-data-heading"><div className="flex items-start gap-3"><ClipboardList className="mt-1 shrink-0 text-brand-red" size={23} aria-hidden="true" /><div><h2 id="program-data-heading" className="font-heading text-2xl font-extrabold">Data khusus program</h2><p className="mt-2 text-sm leading-6 text-neutral-600">Jawab sesuai kondisi sebenarnya. Data ini membantu menentukan prioritas dan bentuk bantuan.</p></div></div><div className="mt-5 space-y-5">{(fields[program.slug] || []).map((field) => <label key={field.name} className="block text-sm font-bold">{field.label}<textarea name={field.name} required maxLength={700} rows={field.name === 'condition' || field.name === 'currentCondition' || field.name === 'damageDescription' || field.name === 'educationNeed' ? 4 : 3} defaultValue={application?.details[field.name] || ''} placeholder={field.placeholder} className="mt-2 w-full rounded-xl border border-neutral-300 p-4 font-normal leading-7" /></label>)}</div></section>
          <section aria-labelledby="photo-heading"><div className="flex items-start gap-3"><Camera className="mt-1 shrink-0 text-brand-red" size={23} aria-hidden="true" /><div><h2 id="photo-heading" className="font-heading text-2xl font-extrabold">Foto kondisi awal</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{isRevision ? 'Foto baru bersifat opsional. Biarkan kosong untuk tetap memakai foto sebelumnya.' : 'Unggah foto terbaru yang relevan dengan pengajuan.'} JPG, PNG, atau WEBP, maksimal 2 MB.</p></div></div><label className="mt-5 block text-sm font-bold">Foto kondisi eksisting<input name="existingPhoto" type="file" required={!isRevision} accept="image/jpeg,image/png,image/webp" className="mt-2 block min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:font-semibold" /></label><label className="mt-5 block text-sm font-bold">Keterangan foto<input name="existingPhotoAlt" required maxLength={160} defaultValue={application?.existingPhotoAlt || ''} placeholder="Contoh: Atap rumah calon penerima bocor di beberapa bagian" className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-4 font-normal" /></label><label className="mt-5 flex items-start gap-3 text-sm leading-6"><input name="photoConsent" value="yes" type="checkbox" required className="mt-1 size-4" /><span>Saya memastikan data yang dikirim benar dan memiliki izin untuk mengirim foto ini untuk keperluan penilaian pengajuan.</span></label></section>
          <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-6"><button type="submit" className="button-primary"><Upload size={17} aria-hidden="true" /> {isRevision ? 'Kirim ulang pengajuan' : 'Kirim pengajuan'}</button><Link href="/akun/pengajuan" className="button-secondary">Batal</Link></div>
        </form>
      </main>
    </div>
  );
}
