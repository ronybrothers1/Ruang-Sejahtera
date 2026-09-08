/* eslint-disable @next/next/no-img-element */

type MemberCardProps = {
  fullName: string;
  profileImageUrl: string | null;
  memberNumber: string;
  joinedAt: string;
  qrCodeUrl: string | null;
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'RS';
}

export function MemberCard({
  fullName,
  profileImageUrl,
  memberNumber,
  joinedAt,
  qrCodeUrl,
}: MemberCardProps) {
  return (
    <article className="member-card" aria-label={`Kartu anggota ${fullName}`}>
      <div className="member-card-topline" />
      <header className="member-card-header">
        <img
          src="/brand/logo-ruang-sejahtera-transparent.svg"
          alt="Logo resmi Yayasan Ruang Sejahtera"
          className="member-card-logo"
        />
        <div className="member-card-heading">
          <p>Identitas resmi</p>
          <h2>Kartu anggota</h2>
          <span>Yayasan Ruang Sejahtera</span>
        </div>
      </header>

      <div className="member-card-content">
        <div className="member-card-photo-wrap">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt={`Foto profil ${fullName}`} className="member-card-photo" />
          ) : (
            <div role="img" className="member-card-photo member-card-initials" aria-label={`Inisial ${initials(fullName)}`}>
              {initials(fullName)}
            </div>
          )}
          <span className="member-card-status">Aktif</span>
        </div>

        <div className="member-card-details">
          <div><span>Nama anggota</span><strong>{fullName}</strong></div>
          <div><span>Nomor anggota</span><strong>{memberNumber}</strong></div>
          <div><span>Tanggal terbit</span><strong>{joinedAt}</strong></div>
        </div>

        <div className="member-card-verification">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR verifikasi kartu anggota" className="member-card-qr" />
          ) : (
            <div className="member-card-qr member-card-qr-placeholder" aria-hidden="true">QR</div>
          )}
          <span>Scan untuk verifikasi</span>
        </div>
      </div>

      <footer className="member-card-footer">
        <span>Kartu aktif setelah anggota dinyatakan lulus ujian keanggotaan.</span>
        <strong>RUANG SEJAHTERA</strong>
      </footer>
    </article>
  );
}
