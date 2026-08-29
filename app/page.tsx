import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  Building2,
  FileCheck2,
  Heart,
  Landmark,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { ProgramMark } from '@/components/ProgramMark';
import { programs, trustPrinciples } from '@/lib/content';
import {
  publishedActivities,
  publishedArticles,
  publishedGalleries,
} from '@/lib/published-content';

const trustSignals = [
  {
    title: 'Lima program utama',
    description: 'Setiap program memiliki fokus yang berbeda agar ruang kerja yayasan mudah dipahami.',
    icon: Sparkles,
  },
  {
    title: 'Informasi terverifikasi',
    description: 'Konten publik dipisahkan dari draf dan hanya diterbitkan melalui alur editorial.',
    icon: SearchCheck,
  },
  {
    title: 'Ruang akuntabilitas',
    description: 'Laporan, legalitas, organisasi, dan kebijakan ditempatkan pada halaman khusus.',
    icon: ShieldCheck,
  },
] as const;

const accountabilityLinks = [
  {
    href: '/transparansi',
    title: 'Transparansi',
    description: 'Laporan dan dokumen hanya ditampilkan setelah sumber, periode, dan statusnya dapat dijelaskan.',
    icon: Landmark,
  },
  {
    href: '/tentang-kami/legalitas',
    title: 'Legalitas',
    description: 'Informasi hukum dipublikasikan secara proporsional tanpa membuka data yang semestinya dilindungi.',
    icon: FileCheck2,
  },
  {
    href: '/organisasi',
    title: 'Organisasi',
    description: 'Struktur tanggung jawab disiapkan agar publik mengetahui siapa mengelola setiap fungsi.',
    icon: Building2,
  },
  {
    href: '/kebijakan-donasi',
    title: 'Kebijakan Donasi',
    description: 'Prinsip penerimaan, penggunaan, pengembalian, dan perlindungan donatur dijelaskan sejak awal.',
    icon: BookOpenText,
  },
] as const;

const latestPublications = [
  ...publishedActivities.map((item) => ({
    type: 'Kegiatan',
    title: item.title,
    summary: item.summary,
    date: item.activityDate,
    href: `/kegiatan/${item.slug}`,
  })),
  ...publishedArticles.map((item) => ({
    type: item.category,
    title: item.title,
    summary: item.excerpt,
    date: item.publishedAt,
    href: `/berita/${item.slug}`,
  })),
  ...publishedGalleries.map((item) => ({
    type: 'Galeri',
    title: item.title,
    summary: item.summary,
    date: item.publishedAt,
    href: `/galeri/${item.slug}`,
  })),
]
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  .slice(0, 3);

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export default function Home() {
  return (
    <div className="trust-home">
      <section className="trust-hero" aria-labelledby="home-title">
        <div className="trust-hero-grid-lines" aria-hidden="true" />
        <div className="shell trust-hero-layout">
          <div className="trust-hero-copy">
            <span className="trust-kicker"><Sparkles size={15} aria-hidden="true" /> Gerakan sosial & kemanusiaan</span>
            <h1 id="home-title">Kepedulian perlu sampai ke tempat yang tepat.</h1>
            <p>Yayasan Ruang Sejahtera mengembangkan lima jalur program untuk menghubungkan kepedulian publik dengan kebutuhan dasar, usaha rakyat, hunian layak, air bersih, dan pendidikan.</p>
            <div className="trust-actions">
              <Link href="/program" className="trust-button trust-button-primary">Kenali Program <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href="/donasi" className="trust-button trust-button-secondary"><Heart size={18} aria-hidden="true" /> Cara Mendukung</Link>
            </div>
            <div className="trust-hero-assurance">
              <ShieldCheck size={20} aria-hidden="true" />
              <p><strong>Kepercayaan dimulai dari informasi yang jujur.</strong> Data, dokumen, dan cerita lapangan hanya ditampilkan setelah layak dipublikasikan.</p>
            </div>
          </div>

          <aside className="trust-program-console" aria-label="Lima program utama Ruang Sejahtera">
            <div className="trust-console-head">
              <div><span>Ruang kerja</span><strong>Program utama</strong></div>
              <small>05 fokus</small>
            </div>
            <div className="trust-console-list">
              {programs.map((program) => (
                <Link href={`/program/${program.slug}`} key={program.slug}>
                  <ProgramMark slug={program.slug} accent={program.accent} compact />
                  <span><small>{program.focus}</small><strong>{program.name}</strong></span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <Link href="/program" className="trust-console-footer">Lihat seluruh program <ArrowRight size={15} aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      <section className="trust-signal-band" aria-label="Fondasi kepercayaan">
        <div className="shell trust-signal-grid">
          {trustSignals.map(({ title, description, icon: Icon }) => (
            <article key={title}>
              <span><Icon size={21} aria-hidden="true" /></span>
              <div><h2>{title}</h2><p>{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section trust-programs" aria-labelledby="program-heading">
        <div className="shell">
          <div className="trust-section-heading">
            <div><span>Program utama</span><h2 id="program-heading">Lima jalur bantuan, satu arah kepedulian.</h2></div>
            <p>Setiap program memberi pintu masuk yang jelas bagi kebutuhan yang berbeda. Informasi rinci, jangkauan, dan hasil akan dilengkapi dari sumber resmi.</p>
          </div>
          <div className="trust-program-grid">
            {programs.map((program) => (
              <Link href={`/program/${program.slug}`} key={program.slug} className="trust-program-card">
                <ProgramMark slug={program.slug} accent={program.accent} />
                <span>{program.focus}</span>
                <h3>{program.name}</h3>
                <p>{program.summary}</p>
                <strong>Pelajari program <ArrowRight size={15} aria-hidden="true" /></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section trust-principle-section" aria-labelledby="principle-heading">
        <div className="shell trust-principle-layout">
          <div className="trust-principle-intro">
            <span>Prinsip kerja</span>
            <h2 id="principle-heading">Kepercayaan tidak dibangun oleh tampilan, tetapi oleh cara kerja.</h2>
            <p>Empat prinsip berikut menjadi kerangka untuk menyusun informasi program, pelaksanaan, dokumentasi, dan pertanggungjawaban publik.</p>
            <Link href="/tentang-kami/nilai" className="trust-text-link">Lihat landasan nilai <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="trust-principle-list">
            {trustPrinciples.map(([title, description], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section trust-publication-section" aria-labelledby="publication-heading">
        <div className="shell">
          <div className="trust-section-heading trust-section-heading-compact">
            <div><span>Jejak publik</span><h2 id="publication-heading">Kegiatan dan cerita yang sudah layak dibaca publik.</h2></div>
            <Link href="/kegiatan" className="trust-text-link">Arsip kegiatan <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          {latestPublications.length ? (
            <div className="trust-publication-grid">
              {latestPublications.map((item) => (
                <article key={item.href}>
                  <div><span>{item.type}</span><time dateTime={item.date}>{formatDate(item.date)}</time></div>
                  <h3><Link href={item.href}>{item.title}</Link></h3>
                  <p>{item.summary}</p>
                  <Link href={item.href}>Baca selengkapnya <ArrowRight size={15} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              eyebrow="Arsip terverifikasi"
              title="Belum ada kegiatan atau berita yang dipublikasikan."
              description="Kami tidak menampilkan contoh seolah-olah kegiatan nyata. Arsip akan muncul setelah tanggal, lokasi, narasi, dokumentasi, dan status persetujuan publikasinya telah diperiksa."
              action={<Link href="/program" className="trust-button trust-button-ink">Kenali program yang tersedia <ArrowRight size={17} aria-hidden="true" /></Link>}
            />
          )}
        </div>
      </section>

      <section className="trust-section trust-accountability" aria-labelledby="accountability-heading">
        <div className="shell">
          <div className="trust-section-heading">
            <div><span>Akuntabilitas</span><h2 id="accountability-heading">Informasi penting tidak boleh tersembunyi di balik slogan.</h2></div>
            <p>Empat ruang berikut disiapkan agar publik dapat menemukan dasar hukum, struktur tanggung jawab, kebijakan, dan laporan tanpa harus menebak.</p>
          </div>
          <div className="trust-accountability-grid">
            {accountabilityLinks.map(({ href, title, description, icon: Icon }) => (
              <Link href={href} key={href}>
                <span><Icon size={23} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <strong>Buka halaman <ArrowRight size={15} aria-hidden="true" /></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-closing" aria-labelledby="closing-heading">
        <div className="trust-closing-grid" aria-hidden="true" />
        <div className="shell trust-closing-content">
          <div>
            <span>Bergerak bersama</span>
            <h2 id="closing-heading">Dukungan yang baik dimulai dari informasi yang benar.</h2>
            <p>Pelajari program, periksa ruang transparansi, lalu pilih cara terlibat yang paling sesuai.</p>
          </div>
          <div className="trust-actions">
            <Link href="/donasi" className="trust-button trust-button-light"><Heart size={18} aria-hidden="true" /> Cara Mendukung</Link>
            <Link href="/kontak" className="trust-button trust-button-dark">Hubungi Yayasan <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
