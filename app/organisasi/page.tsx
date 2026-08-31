import type { Metadata } from 'next';
import {
  BriefcaseBusiness,
  Building2,
  Code2,
  GraduationCap,
  HeartHandshake,
  House,
  MapPinned,
  Radio,
  ShieldCheck,
  Siren,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { SectionNavigation } from '@/components/SectionNavigation';
import { aboutNavItems } from '@/lib/navigation';

export const metadata: Metadata = {
  title: 'Organisasi',
  description: 'Struktur organisasi Yayasan Ruang Sejahtera, bidang kerja, Tim IT, dan koordinator kecamatan.',
};

type PersonCardProps = {
  name: string;
  role: string;
  unit?: string;
  variant?: 'advisory' | 'chair' | 'coordinator' | 'member' | 'empty';
  compact?: boolean;
};

const advisory = ['Moch. Wijdan', 'Hofid', 'Aliyanto, SH'];

const organizationalFields: Array<{ name: string; coordinator: string; icon: typeof HeartHandshake; member?: string }> = [
  { name: 'Bidang Kesehatan', coordinator: 'Faisol Al Besuni', icon: HeartHandshake },
  { name: 'Bidang Pendidikan', coordinator: 'M. Roqib', icon: GraduationCap },
  { name: 'Bidang Usaha Mikro', coordinator: 'Ali Mashuri / Bung Dimas', icon: BriefcaseBusiness },
  { name: 'Bidang Hunian Rakyat', coordinator: 'Imam Sahroni Darmawan', icon: House, member: 'Abd. Qohar' },
  { name: 'Bidang Penanggulangan Bencana', coordinator: 'Holis Saleh', icon: Siren },
] as const;

const subfields = [
  { name: 'Sub IT', person: 'Habibi', icon: Code2 },
  { name: 'Sub Sosmed', person: 'Subeiri', icon: Radio },
] as const;

const districts = [
  'Banyuates',
  'Camplong',
  'Jrengik',
  'Karangpenang',
  'Kedungdung',
  'Ketapang',
  'Omben',
  'Pangarengan',
  'Robatal',
  'Sampang',
  'Sokobanah',
  'Sreseh',
  'Tambelangan',
  'Torjun',
] as const;

function PlaceholderPortrait({ label = 'Placeholder foto' }: { label?: string }) {
  return (
    <div className="organization-portrait" role="img" aria-label={label}>
      <UserRound size={32} strokeWidth={1.65} aria-hidden="true" />
      <span>Placeholder</span>
    </div>
  );
}

function PersonCard({ name, role, unit, variant = 'coordinator', compact = false }: PersonCardProps) {
  return (
    <article className={`organization-person-card organization-person-card-${variant}${compact ? ' organization-person-card-compact' : ''}`}>
      <PlaceholderPortrait label={`Placeholder foto untuk ${name}`} />
      <div className="organization-person-copy">
        <p className="organization-person-role">{role}</p>
        <h3>{name}</h3>
        {unit ? <p className="organization-person-unit">{unit}</p> : null}
      </div>
    </article>
  );
}

export default function OrganizationPage() {
  return (
    <>
      <PageHero
        eyebrow="Organisasi"
        title="Orang-orang yang menjaga gerak bersama."
        description="Struktur organisasi Yayasan Ruang Sejahtera memperlihatkan jalur tanggung jawab dari Pembina/Penasihat, Ketua, bidang kerja, Tim IT, hingga koordinator di 14 kecamatan Kabupaten Sampang."
      />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Tentang Kami', href: '/tentang-kami' }, { label: 'Organisasi' }]} />
      <SectionNavigation label="Jelajahi Tentang Kami" items={aboutNavItems} currentHref="/organisasi" />
      <PreviewNotice label="Keterangan data">Data nama dan jabatan mengikuti struktur yang ditetapkan. Foto personel dan nama koordinator kecamatan yang belum tersedia ditampilkan sebagai placeholder.</PreviewNotice>

      <main className="organization-page">
        <section className="organization-section organization-governance" aria-labelledby="organization-structure-heading">
          <div className="shell">
            <div className="organization-section-heading">
              <div>
                <p className="organization-kicker">01 · Struktur utama</p>
                <h2 id="organization-structure-heading">Tanggung jawab dimulai dari atas.</h2>
              </div>
              <p>Setiap tingkat memiliki posisi yang berbeda, tetapi semuanya bergerak dalam satu koordinasi untuk melayani masyarakat.</p>
            </div>

            <div className="organization-tree" aria-label="Hierarki kepemimpinan Yayasan Ruang Sejahtera">
              <div className="organization-tree-label"><ShieldCheck size={17} aria-hidden="true" /> Pembina / Penasihat</div>
              <div className="organization-advisory-grid">
                {advisory.map((name) => <PersonCard key={name} name={name} role="Pembina / Penasihat" variant="advisory" compact />)}
              </div>
              <div className="organization-connector organization-connector-down" aria-hidden="true" />
              <PersonCard name="Nasiri, SE" role="Ketua" unit="Pusat koordinasi organisasi" variant="chair" />
              <div className="organization-connector organization-connector-down" aria-hidden="true" />
              <div className="organization-branch-label"><Building2 size={17} aria-hidden="true" /> Bidang-bidang organisasi</div>
            </div>

            <div className="organization-field-grid">
              {organizationalFields.map(({ name, coordinator, icon: Icon, member }) => (
                <article key={name} className="organization-field-card">
                  <div className="organization-field-heading">
                    <span className="organization-field-icon"><Icon size={21} aria-hidden="true" /></span>
                    <div>
                      <p className="organization-kicker">Bidang kerja</p>
                      <h3>{name}</h3>
                    </div>
                  </div>
                  <div className="organization-field-people">
                    <p className="organization-mini-label">Koordinator (Co.)</p>
                    <PersonCard name={coordinator} role="Koordinator (Co.)" variant="coordinator" compact />
                    {member ? (
                      <div className="organization-nested-team">
                        <p className="organization-mini-label">Anggota</p>
                        <PersonCard name={member} role="Anggota bidang" variant="member" compact />
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}

              <article className="organization-field-card organization-infokom-card">
                <div className="organization-field-heading">
                  <span className="organization-field-icon"><Radio size={21} aria-hidden="true" /></span>
                  <div>
                    <p className="organization-kicker">Bidang kerja</p>
                    <h3>Bidang Informasi dan Komunikasi (Infokom)</h3>
                  </div>
                </div>
                <div className="organization-field-people">
                  <p className="organization-mini-label">Koordinator (Co.)</p>
                  <PersonCard name="Hasbul" role="Koordinator (Co.)" variant="coordinator" compact />
                  <div className="organization-subfields" aria-label="Subbagian di bawah Bidang Informasi dan Komunikasi">
                    <div className="organization-subfields-heading"><span>Subbagian di bawah Infokom</span></div>
                    <div className="organization-subfield-grid">
                      {subfields.map(({ name, person, icon: Icon }) => (
                        <div key={name} className="organization-subfield-card">
                          <PlaceholderPortrait label={`Placeholder foto untuk ${person}, ${name}`} />
                          <div>
                            <p><Icon size={13} aria-hidden="true" /> {name}</p>
                            <strong>{person}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="organization-section organization-application" aria-labelledby="application-heading">
          <div className="shell">
            <div className="organization-application-layout">
              <div className="organization-application-intro">
                <p className="organization-kicker">02 · Unit khusus</p>
                <h2 id="application-heading">Aplikasi Ruang Sejahtera.</h2>
                <p>Tim IT bekerja sebagai unit khusus untuk mengembangkan dan menjaga aplikasi digital yayasan.</p>
                <div className="organization-target"><span>Target pengembangan</span><strong>1 bulan</strong></div>
              </div>
              <div className="organization-it-panel">
                <div className="organization-it-panel-heading"><span className="organization-field-icon"><Code2 size={22} aria-hidden="true" /></span><div><p className="organization-kicker">Tim IT</p><h3>Pengembangan aplikasi</h3></div></div>
                <p className="organization-mini-label">Koordinator (Co.)</p>
                <PersonCard name="Habibi" role="Koordinator (Co.)" unit="Tim IT · Aplikasi Ruang Sejahtera" variant="coordinator" />
                <div className="organization-it-members">
                  <p className="organization-mini-label">Anggota Tim IT</p>
                  <div className="organization-it-member-grid">
                    {['Imam Sahroni Darmawan', 'Aliyanto', 'Husni'].map((name) => <PersonCard key={name} name={name} role="Anggota Tim IT" variant="member" compact />)}
                  </div>
                </div>
                <p className="organization-separation-note"><Code2 size={15} aria-hidden="true" /> Tim IT aplikasi ini berbeda dari Sub IT pada Bidang Infokom.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="organization-section organization-districts" aria-labelledby="district-heading">
          <div className="shell">
            <div className="organization-section-heading organization-district-heading">
              <div>
                <p className="organization-kicker">03 · Jangkauan wilayah</p>
                <h2 id="district-heading">Koordinator Kecamatan.</h2>
              </div>
              <div className="organization-district-count"><MapPinned size={19} aria-hidden="true" /><strong>14</strong><span>kecamatan di Kabupaten Sampang</span></div>
            </div>
            <div className="organization-district-grid">
              {districts.map((district, index) => (
                <article key={district} className="organization-district-card">
                  <div className="organization-district-number">{String(index + 1).padStart(2, '0')}</div>
                  <PlaceholderPortrait label={`Placeholder foto koordinator Kecamatan ${district}`} />
                  <div>
                    <p className="organization-person-role">Nama</p>
                    <h3>Kosong</h3>
                    <p className="organization-district-role">Koordinator Kecamatan {district}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="organization-placeholder-note"><UsersRound size={17} aria-hidden="true" /> Foto personel menggunakan placeholder seragam. Nama koordinator kecamatan akan diisi setelah data resmi tersedia.</p>
          </div>
        </section>
      </main>
    </>
  );
}
