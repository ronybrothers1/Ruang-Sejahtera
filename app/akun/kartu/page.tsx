import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import QRCode from 'qrcode';
import { MemberCard } from '@/components/membership/MemberCard';
import { PrintCardButton } from '@/components/membership/PrintCardButton';
import { requireUserSession } from '@/lib/auth/admin-session';
import { findUserByIdentityProviderId } from '@/lib/db/users';
import { getMemberCard, getMemberCardVerificationProof, hasPassedExam, issueMemberCard } from '@/lib/membership';

export const dynamic = 'force-dynamic';

function formatCardDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

async function getVerificationOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (configuredUrl) return configuredUrl;
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  const protocol = requestHeaders.get('x-forwarded-proto')?.split(',')[0].trim() || 'https';
  return host ? `${protocol}://${host}` : null;
}

export default async function MemberCardPage() {
  const session = await requireUserSession();
  if (session.role !== 'member' || !session.identityProviderId) redirect('/akun');

  const profile = await findUserByIdentityProviderId(session.identityProviderId);
  if (!profile || !(await hasPassedExam(profile.id))) redirect('/akun/keanggotaan');

  const card = await getMemberCard(profile.id) || await issueMemberCard(profile.id);
  if (!card || card.status !== 'active') redirect('/akun/keanggotaan');

  const proof = getMemberCardVerificationProof(card.memberNumber);
  const verificationPath = proof
    ? `/verifikasi/anggota?nomor=${encodeURIComponent(card.memberNumber)}&proof=${encodeURIComponent(proof)}`
    : null;
  const verificationOrigin = verificationPath ? await getVerificationOrigin() : null;
  const verificationUrl = verificationPath && verificationOrigin
    ? new URL(verificationPath, verificationOrigin).toString()
    : null;
  const qrCodeUrl = verificationUrl
    ? await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
      color: { dark: '#151515', light: '#ffffff' },
    }).catch(() => null)
    : null;

  return (
    <div className="member-card-page">
      <main className="member-card-shell">
        <div className="member-card-actions">
          <div>
            <Link href="/akun" className="member-card-back">← Kembali ke akun</Link>
            <p className="eyebrow">Identitas anggota</p>
            <h1>Kartu anggota</h1>
            <p className="member-card-intro">
              Kartu ini dibuat otomatis setelah Anda lulus ujian keanggotaan. Simpan sebagai PDF
              untuk digunakan saat diperlukan.
            </p>
          </div>
          <PrintCardButton />
        </div>

        <section className="member-card-preview" aria-label="Pratinjau kartu anggota">
          <MemberCard
            fullName={profile.fullName}
            profileImageUrl={profile.profileImageUrl}
            memberNumber={card.memberNumber}
            joinedAt={formatCardDate(card.joinedAt)}
            qrCodeUrl={qrCodeUrl}
          />
        </section>

        <aside className="member-card-help">
          <strong>Informasi penggunaan</strong>
          <span>QR pada kartu mengarah ke halaman verifikasi publik dan hanya menampilkan data minimum.</span>
          <span>Untuk PDF, pilih printer “Save as PDF” pada dialog cetak dan nonaktifkan header/footer browser.</span>
        </aside>
      </main>
    </div>
  );
}
