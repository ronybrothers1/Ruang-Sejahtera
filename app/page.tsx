import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Droplets,
  FileText,
  GraduationCap,
  HandHeart,
  Heart,
  Home as HomeIcon,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
} from 'lucide-react';
import { programs, sampleMode, trustPrinciples } from '@/lib/content';

const programIcons = [HandHeart, Store, HomeIcon, Droplets, GraduationCap];

const trustSignals = [
  {
    label: '5 program utama',
    description: 'Fokus bantuan disusun jelas agar publik mudah memahami ruang kerja yayasan.',
    icon: Target,
  },
  {
    label: 'Transparansi publik',
    description: 'Kebijakan, struktur, dan informasi akuntabilitas ditempatkan dalam ruang yang mudah dijangkau.',
    icon: ShieldCheck,
  },
  {
    label: 'Dokumentasi kegiatan',
    description: 'Kegiatan, berita, dan galeri disiapkan sebagai jejak publik atas kerja di lapangan.',
    icon: Camera,
  },
] as const;

const exploreCards = [
  {
    href: '/kegiatan',
    eyebrow: 'Kegiatan',
    title: 'Lihat jejak aksi di lapangan.',
    description: 'Ruang untuk menampilkan kegiatan sosial, lokasi, waktu, dan dokumentasi pelaksanaan.',
    image: programs[3].image,
    icon: HandHeart,
  },
  {
    href: '/galeri',
    eyebrow: 'Galeri',
    title: 'Dokumentasi yang bicara apa adanya.',
    description: 'Foto dan video membantu publik melihat proses, bukan hanya membaca klaim.',
    image: programs[0].image,
    icon: Camera,
  },
  {
    href: '/berita',
    eyebrow: 'Berita & cerita',
    title: 'Kabar yang memberi konteks.',
    description: 'Catatan kegiatan, cerita dampak, dan informasi yayasan dalam format editorial.',
    image: programs[4].image,
    icon: Newspaper,
  },
] as const;

export default function Home() {
  return (
    <div className="home-v6">
      <section className="v6-hero" aria-labelledby="home-title">
        <div className="v6-hero-glow" aria-hidden="true" />
        <div className="v6-hero-grid shell">
          <div className="v6-hero-copy">
            <span className="v6-kicker"><Sparkles size={15} aria-hidden="true" /> Gerakan sosial & kemanusiaan</span>
            <h1 id="home-title" className="v6-hero-title">
              <span>Bersama kita</span>
              <span className="v6-hero-accent">hadirkan harapan,</span>
              <span>wujudkan</span>
              <span>kesejahteraan.</span>
            </h1>
            <p className="v6-hero-lead">
              Ruang Sejahtera menghubungkan kepedulian dengan aksi yang terarah—dari kebutuhan dasar dan air bersih hingga pendidikan, usaha rakyat, dan hunian layak.
            </p>
            <div className="v6-hero-actions">
              <Link href="/donasi" className="v6-button v6-button-primary"><Heart size={18} fill="currentColor" aria-hidden="true" /> Donasi Sekarang</Link>
              <Link href="/program" className="v6-button v6-button-secondary">Jelajahi Program <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
            <div className="v6-hero-links" aria-label="Jalur kepercayaan publik">
              <Link href="/transparansi"><ShieldCheck size={16} aria-hidden="true" /> Transparansi</Link>
              <Link href="/tentang-kami/legalitas"><FileText size={16} aria-hidden="true" /> Legalitas</Link>
              <Link href="/kegiatan"><Camera size={16} aria-hidden="true" /> Dokumentasi</Link>
            </div>
          </div>

          <div className="v6-hero-visual" aria-label="Kolase visual program Ruang Sejahtera">
            <div className="v6-hero-main-photo">
              <Image
                src={programs[3].image}
                alt="Visual sementara untuk program berbagi air bersih"
                fill
                priority
                sizes="(max-width: 960px) 100vw, 49vw"
              />
              <div className="v6-photo-shade" />
            </div>
            <div className="v6-hero-side-photos">
              <div><Image src={programs[0].image} alt="Visual sementara untuk program bantuan sosial" fill sizes="(max-width: 680px) 48vw, 20vw" /></div>
              <div><Image src={programs[4].image} alt="Visual sementara untuk program pendidikan" fill sizes="(max-width: 680px) 48vw, 20vw" /></div>
            </div>
            <div className="v6-hero-trust-card">
              <ShieldCheck size={22} aria-hidden="true" />
              <div>
                <strong>Kepercayaan dibangun lewat keterbukaan.</strong>
                <span>Program, kegiatan, struktur, dan kebijakan ditempatkan dalam satu ekosistem publik.</span>
              </div>
            </div>
            {sampleMode ? <span className="v6-visual-disclosure">Visual sementara · dokumentasi asli akan menggantikan foto contoh</span> : null}
          </div>
        </div>
      </section>

      <section className="v6-trust-band" aria-label="Prinsip kepercayaan Ruang Sejahtera">
        <div className="shell v6-trust-grid">
          {trustSignals.map(({ label, description, icon: Icon }) => (
            <article key={label}>
              <span className="v6-trust-icon"><Icon size={20} aria-hidden="true" /></span>
              <div><strong>{label}</strong><p>{description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="v6-section v6-program-section" aria-labelledby="program-heading">
        <div className="shell">
          <div className="v6-section-head">
            <div>
              <span className="v6-eyebrow">Program utama</span>
              <h2 id="program-heading">Bantuan yang punya fokus, bukan sekadar nama.</h2>
            </div>
            <p>Lima program resmi Ruang Sejahtera dirancang agar kebutuhan masyarakat dapat dibaca dengan lebih jelas dan ditangani melalui jalur yang tepat.</p>
          </div>

          <div className="v6-program-grid">
            {programs.map((program, index) => {
              const Icon = programIcons[index];
              return (
                <Link href={`/program/${program.slug}`} className="v6-program-card" key={program.slug}>
                  <div className="v6-program-media">
                    <Image src={program.image} alt={`Visual sementara program ${program.name}`} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                    <div className="v6-program-overlay" />
                    <span className="v6-program-index">{program.accent}</span>
                    <span className="v6-program-icon"><Icon size={20} aria-hidden="true" /></span>
                  </div>
                  <div className="v6-program-copy">
                    <span>{program.focus}</span>
                    <h3>{program.name}</h3>
                    <p>{program.summary}</p>
                    <strong>Pelajari program <ArrowRight size={15} aria-hidden="true" /></strong>
                  </div>
                </Link>
              );
            })}
          </div>
          {sampleMode ? <p className="v6-inline-note">Foto pada kartu program masih berupa visual sementara; nama dan fokus program mengikuti struktur resmi yang tersedia pada website.</p> : null}
        </div>
      </section>

      <section className="v6-section v6-method-section" aria-labelledby="method-heading">
        <div className="shell v6-method-layout">
          <div className="v6-method-copy">
            <span className="v6-eyebrow">Cara kami bekerja</span>
            <h2 id="method-heading">Kepercayaan tidak diminta. Ia dibangun.</h2>
            <p>Pengalaman digital Ruang Sejahtera dirancang agar publik dapat memahami apa yang dikerjakan, bagaimana prinsipnya, dan ke mana mencari informasi pendukung.</p>
            <Link href="/tentang-kami/nilai" className="v6-text-link">Pelajari nilai yayasan <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>

          <div className="v6-principles">
            {trustPrinciples.map(([title, description], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>

          <aside className="v6-accountability-card" aria-label="Akses akuntabilitas">
            <span className="v6-card-kicker"><ShieldCheck size={17} aria-hidden="true" /> Ruang akuntabilitas</span>
            <h3>Informasi penting harus mudah ditemukan.</h3>
            <p>Akses halaman transparansi, legalitas, dan struktur organisasi tanpa harus menelusuri website terlalu jauh.</p>
            <div className="v6-accountability-links">
              <Link href="/transparansi">Transparansi <ArrowRight size={15} aria-hidden="true" /></Link>
              <Link href="/tentang-kami/legalitas">Legalitas <ArrowRight size={15} aria-hidden="true" /></Link>
              <Link href="/organisasi">Organisasi <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="v6-section v6-explore-section" aria-labelledby="explore-heading">
        <div className="shell">
          <div className="v6-section-head v6-section-head-compact">
            <div>
              <span className="v6-eyebrow">Lihat lebih dekat</span>
              <h2 id="explore-heading">Bukan hanya cerita. Ada ruang untuk memeriksa.</h2>
            </div>
            <Link href="/kegiatan" className="v6-text-link">Lihat semua kegiatan <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>

          <div className="v6-explore-grid">
            {exploreCards.map(({ href, eyebrow, title, description, image, icon: Icon }) => (
              <Link href={href} className="v6-explore-card" key={href}>
                <div className="v6-explore-media">
                  <Image src={image} alt={`Visual sementara untuk ${eyebrow}`} fill sizes="(max-width: 720px) 100vw, 33vw" />
                  <div className="v6-explore-overlay" />
                  <span><Icon size={18} aria-hidden="true" /> {eyebrow}</span>
                </div>
                <div className="v6-explore-copy"><h3>{title}</h3><p>{description}</p><strong>Buka halaman <ArrowRight size={15} aria-hidden="true" /></strong></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="v6-closing-cta" aria-labelledby="closing-heading">
        <div className="v6-closing-photo"><Image src={programs[1].image} alt="Visual sementara kegiatan sosial Ruang Sejahtera" fill sizes="100vw" /></div>
        <div className="v6-closing-overlay" />
        <div className="shell v6-closing-content">
          <div>
            <span className="v6-card-kicker">Bergerak bersama</span>
            <h2 id="closing-heading">Kebaikan menjadi berarti ketika sampai pada kebutuhan yang tepat.</h2>
            <p>Kenali programnya, lihat ruang transparansinya, lalu tentukan bentuk dukungan yang paling sesuai.</p>
          </div>
          <div className="v6-closing-actions">
            <Link href="/donasi" className="v6-button v6-button-light"><Heart size={18} aria-hidden="true" /> Donasi Sekarang</Link>
            <Link href="/transparansi" className="v6-button v6-button-dark">Lihat Transparansi <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
