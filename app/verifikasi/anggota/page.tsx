import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { getPublicMemberCardVerification } from '@/lib/membership';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Verifikasi Kartu Anggota',
  robots: { index: false, follow: false, nocache: true },
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export default async function MemberVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ nomor?: string | string[]; proof?: string | string[] }>;
}) {
  const params = await searchParams;
  const memberNumber = firstValue(params.nomor);
  const proof = firstValue(params.proof);
  let card = null;
  let unavailable = false;

  try {
    card = await getPublicMemberCardVerification(memberNumber, proof);
  } catch {
    unavailable = true;
  }

  return (
    <main className="member-verification-page">
      <section className="member-verification-panel" aria-labelledby="verification-title">
        <div className="member-verification-brand">
          <Image src="/brand/logo-ruang-sejahtera-transparent.svg" alt="Logo resmi Yayasan Ruang Sejahtera" width={564} height={251} unoptimized />
        </div>
        {card ? (
          <>
            <div className="member-verification-icon member-verification-icon-success"><CheckCircle2 size={28} aria-hidden="true" /></div>
            <p className="eyebrow">Verifikasi berhasil</p>
            <h1 id="verification-title">Kartu anggota sah.</h1>
            <p className="member-verification-lead">Data berikut cocok dengan catatan keanggotaan aktif Yayasan Ruang Sejahtera.</p>
            <dl className="member-verification-data">
              <div><dt>Nama anggota</dt><dd>{card.fullName}</dd></div>
              <div><dt>Nomor anggota</dt><dd>{card.memberNumber}</dd></div>
              <div><dt>Status</dt><dd className="member-verification-active">Aktif</dd></div>
              <div><dt>Tanggal terbit</dt><dd>{formatDate(card.joinedAt)}</dd></div>
            </dl>
          </>
        ) : (
          <>
            <div className="member-verification-icon member-verification-icon-error"><XCircle size={28} aria-hidden="true" /></div>
            <p className="eyebrow">Verifikasi kartu</p>
            <h1 id="verification-title">Kartu tidak dapat diverifikasi.</h1>
            <p className="member-verification-lead">
              {unavailable ? 'Layanan verifikasi sedang tidak tersedia. Silakan coba kembali beberapa saat lagi.' : 'Nomor atau tanda verifikasi tidak valid, atau kartu sudah tidak aktif.'}
            </p>
          </>
        )}
        <div className="member-verification-note">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Halaman ini hanya menampilkan data minimum untuk pemeriksaan keaslian kartu.</span>
        </div>
        <Link href="/" className="button-secondary member-verification-back">Kembali ke beranda</Link>
      </section>
    </main>
  );
}
