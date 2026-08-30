/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BrandLogo } from '@/components/BrandLogo';
import { PrintCardButton } from '@/components/membership/PrintCardButton';
import { requireUserSession } from '@/lib/auth/admin-session';
import { findUserByIdentityProviderId } from '@/lib/db/users';
import { getMemberCard, hasPassedExam } from '@/lib/membership';

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'RS';
}

export const dynamic = 'force-dynamic';

export default async function MemberCardPage() {
  const session = await requireUserSession();
  if (session.role !== 'member' || !session.identityProviderId) redirect('/akun');

  const profile = await findUserByIdentityProviderId(session.identityProviderId);
  if (!profile || !(await hasPassedExam(profile.id))) redirect('/akun/keanggotaan');
  const card = await getMemberCard(profile.id);
  if (!card) redirect('/akun/keanggotaan');

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-8 text-brand-ink md:px-6 md:py-12">
      <main className="mx-auto w-full max-w-5xl">
        <div className="member-card-actions mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><Link href="/akun" className="text-sm font-bold text-brand-red">← Kembali ke akun</Link><p className="eyebrow mt-5">Identitas anggota</p><h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight">Kartu Anggota</h1><p className="mt-3 max-w-2xl leading-7 text-neutral-600">Ukuran kartu mengikuti ukuran KTP. Tekan tombol unduh, lalu pilih “Simpan sebagai PDF” pada dialog cetak.</p></div>
          <PrintCardButton />
        </div>

        <section className="member-card-print-page">
          <article className="member-card relative overflow-hidden rounded-[4mm] border border-red-200 bg-white shadow-xl">
            <div className="absolute inset-x-0 top-0 h-[14mm] bg-brand-red" />
            <div className="relative flex h-full flex-col justify-between p-[4mm]">
              <div className="flex items-start justify-between gap-2">
                <img src="/brand/logo-ruang-sejahtera-transparent.svg" alt="Logo Ruang Sejahtera" className="h-[9mm] w-auto object-contain brightness-0 invert" />
                <div className="text-right text-[2.4mm] font-bold uppercase tracking-[.12em] text-white">Kartu Anggota</div>
              </div>
              <div className="flex items-center gap-[4mm] pt-[3mm]">
                {profile.profileImageUrl ? <img src={profile.profileImageUrl} alt={`Foto profil ${profile.fullName}`} className="h-[21mm] w-[17mm] shrink-0 rounded-[2mm] border-2 border-white object-cover shadow-sm" /> : <div className="grid h-[21mm] w-[17mm] shrink-0 place-items-center rounded-[2mm] border-2 border-white bg-red-100 text-[5mm] font-extrabold text-brand-red">{initials(profile.fullName)}</div>}
                <div className="min-w-0"><p className="text-[2.3mm] font-bold uppercase tracking-[.1em] text-brand-red">Anggota aktif</p><h2 className="mt-[1.3mm] truncate text-[5mm] font-extrabold leading-tight">{profile.fullName}</h2><p className="mt-[1.5mm] text-[2.7mm] font-semibold text-neutral-600">No. Anggota: {card.memberNumber}</p><p className="mt-[1mm] text-[2.3mm] text-neutral-500">Berlaku sejak {card.joinedAt}</p></div>
              </div>
              <div className="flex items-end justify-between gap-2 border-t border-neutral-200 pt-[2.5mm]"><p className="max-w-[52mm] text-[2.1mm] leading-tight text-neutral-500">Yayasan Ruang Sejahtera<br />Kartu digital setelah lulus tes keanggotaan</p><p className="text-right text-[2.1mm] font-bold text-neutral-500">RESMI<br />Ruang Sejahtera</p></div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
