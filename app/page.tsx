import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  Building2,
  FileCheck2,
  Heart,
  Landmark,
  MapPin,
  Quote,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ProgramMark } from '@/components/ProgramMark';
import {
  programs,
  sampleActivities,
  sampleFinance,
  sampleNews,
  sampleStats,
  sampleTestimonials,
  trustPrinciples,
} from '@/lib/content';

const accountabilityLinks = [
  { href: '/transparansi', title: 'Transparansi', description: 'Ringkasan penyaluran, laporan, dan dokumen publik dalam satu ruang yang mudah diperiksa.', icon: Landmark },
  { href: '/tentang-kami/legalitas', title: 'Legalitas', description: 'Identitas hukum disajikan proporsional tanpa membuka data yang perlu dilindungi.', icon: FileCheck2 },
  { href: '/organisasi', title: 'Organisasi', description: 'Struktur fungsi dan tanggung jawab membantu publik memahami tata kelola.', icon: Building2 },
  { href: '/kebijakan-donasi', title: 'Kebijakan Donasi', description: 'Prinsip penerimaan, penggunaan, dan perlindungan donatur dijelaskan sejak awal.', icon: BookOpenText },
] as const;

export default function Home() {
  return (
    <div className="trust-home">
      <section className="trust-hero" aria-labelledby="home-title">
        <div className="trust-hero-grid-lines" aria-hidden="true" />
        <div className="shell trust-hero-layout trust-hero-layout-rich">
          <div className="trust-hero-copy">
            <span className="trust-kicker"><Sparkles size={15} aria-hidden="true" /> Gerakan sosial & kemanusiaan</span>
            <h1 id="home-title">Kepedulian perlu sampai ke tempat yang tepat.</h1>
            <p>Yayasan Ruang Sejahtera menghubungkan kepedulian publik dengan kebutuhan dasar, usaha rakyat, hunian layak, air bersih, dan pendidikan.</p>
            <div className="trust-actions">
              <Link href="/program" className="trust-button trust-button-primary">Kenali Program <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link href="/donasi" className="trust-button trust-button-secondary"><Heart size={18} aria-hidden="true" /> Cara Mendukung</Link>
            </div>
            <div className="trust-hero-assurance">
              <ShieldCheck size={20} aria-hidden="true" />
              <p><strong>Preview lengkap untuk evaluasi desain.</strong> Foto dan angka bertanda “contoh” akan diganti dengan dokumentasi serta data resmi saat materi final tersedia.</p>
            </div>
          </div>

          <div className="trust-hero-media" aria-label="Kolase foto program contoh">
            <div className="trust-hero-main-image">
              <Image src={programs[3].image} alt="Foto contoh program air bersih" fill priority sizes="(max-width: 900px) 100vw, 42vw" />
              <span className="preview-chip">FOTO CONTOH</span>
              <div className="trust-hero-image-caption"><small>Fokus program</small><strong>Air bersih untuk kebutuhan mendesak</strong></div>
            </div>
            <div className="trust-hero-mini-grid">
              <div><Image src={programs[0].image} alt="Foto contoh bantuan kebutuhan dasar" fill sizes="(max-width: 680px) 50vw, 20vw" /></div>
              <div><Image src={programs[4].image} alt="Foto contoh program pendidikan" fill sizes="(max-width: 680px) 50vw, 20vw" /></div>
            </div>
            <Link href="/galeri" className="trust-hero-gallery-link">Lihat galeri preview <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="trust-signal-band" aria-label="Ringkasan dampak contoh">
        <div className="shell trust-stat-grid">
          {sampleStats.map((item) => (
            <article key={item.label}><strong>{item.value}</strong><span>{item.label}</span><small>{item.note}</small></article>
          ))}
        </div>
      </section>

      <section className="trust-section trust-programs" aria-labelledby="program-heading">
        <div className="shell">
          <div className="trust-section-heading">
            <div><span>Program utama</span><h2 id="program-heading">Lima jalur bantuan, satu arah kepedulian.</h2></div>
            <p>Setiap program memberi pintu masuk yang jelas bagi kebutuhan yang berbeda, dengan identitas visual yang tetap konsisten dan mudah dikenali.</p>
          </div>
          <div className="trust-program-grid trust-program-grid-photo">
            {programs.map((program) => (
              <Link href={`/program/${program.slug}`} key={program.slug} className="trust-program-card trust-program-card-photo">
                <div className="trust-card-image">
                  <Image src={program.image} alt={`Foto contoh ${program.name}`} fill sizes="(max-width: 680px) 38vw, (max-width: 1024px) 50vw, 33vw" />
                  <ProgramMark slug={program.slug} accent={program.accent} compact />
                  <span className="preview-chip">CONTOH</span>
                </div>
                <span>{program.focus}</span><h3>{program.name}</h3><p>{program.summary}</p>
                <strong>Pelajari program <ArrowRight size={15} aria-hidden="true" /></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section trust-activity-section" aria-labelledby="activity-heading">
        <div className="shell">
          <div className="trust-section-heading trust-section-heading-compact">
            <div><span>Kegiatan terbaru</span><h2 id="activity-heading">Aksi yang bisa dilihat, bukan hanya diceritakan.</h2></div>
            <Link href="/kegiatan" className="trust-text-link">Lihat seluruh kegiatan <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="trust-activity-grid">
            {sampleActivities.map((activity, index) => (
              <article key={activity.slug} className={index === 0 ? 'trust-activity-card trust-activity-card-featured' : 'trust-activity-card'}>
                <div className="trust-activity-image"><Image src={activity.image} alt={`Foto contoh ${activity.title}`} fill sizes={index === 0 ? '(max-width: 900px) 100vw, 50vw' : '(max-width: 680px) 100vw, 25vw'} /><span className="preview-chip">CONTOH</span></div>
                <div className="trust-activity-copy">
                  <div><time>{activity.date}</time><span><MapPin size={13} aria-hidden="true" /> {activity.location}</span></div>
                  <h3>{activity.title}</h3><p>{activity.summary}</p><Link href={`/kegiatan#${activity.slug}`}>Lihat kegiatan <ArrowRight size={14} aria-hidden="true" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section trust-principle-section" aria-labelledby="principle-heading">
        <div className="shell trust-principle-layout">
          <div className="trust-principle-intro">
            <span>Prinsip kerja</span><h2 id="principle-heading">Kepercayaan dibangun oleh cara kerja yang konsisten.</h2>
            <p>Empat prinsip ini menjadi kerangka dalam menyusun program, dokumentasi, pelayanan publik, dan pertanggungjawaban.</p>
            <Link href="/tentang-kami/nilai" className="trust-text-link">Lihat landasan nilai <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="trust-principle-list">
            {trustPrinciples.map(([title, description], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section trust-finance-section" aria-labelledby="finance-heading">
        <div className="shell trust-finance-layout">
          <div className="trust-finance-copy">
            <span>Transparansi & kepercayaan</span><h2 id="finance-heading">Amanah perlu disajikan dalam bentuk yang mudah diperiksa.</h2>
            <p>Simulasi ini memperlihatkan bagaimana komposisi penyaluran dapat dibaca. Nominal dan periode akan diganti dengan laporan resmi.</p>
            <div className="trust-actions"><Link href="/transparansi" className="trust-button trust-button-light">Lihat transparansi <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/kebijakan-donasi" className="trust-button trust-button-dark">Kebijakan donasi <ArrowRight size={17} aria-hidden="true" /></Link></div>
          </div>
          <div className="trust-finance-card">
            <div className="trust-finance-head"><div><small>SIMULASI LAPORAN</small><strong>Ringkasan Penyaluran</strong></div><b>{sampleStats[3].value}</b></div>
            <div className="trust-finance-bars">
              {sampleFinance.map((item) => (
                <div key={item.label}><div><span>{item.label}</span><strong>{item.amount}</strong></div><div className="trust-finance-track"><span style={{ width: `${item.value}%` }} /></div><small>{item.value}%</small></div>
              ))}
            </div>
            <p>Seluruh angka pada panel ini adalah data desain contoh, bukan laporan resmi yayasan.</p>
          </div>
        </div>
      </section>

      <section className="trust-section trust-story-section" aria-labelledby="story-heading">
        <div className="shell">
          <div className="trust-section-heading"><div><span>Cerita dampak</span><h2 id="story-heading">Suara manusia memberi makna pada setiap angka.</h2></div><p>Testimoni contoh mempertahankan struktur halaman hingga cerita asli siap digunakan dengan persetujuan publikasi.</p></div>
          <div className="trust-testimonial-grid">
            {sampleTestimonials.map((item) => (
              <article key={item.name}><Quote size={27} aria-hidden="true" /><blockquote>“{item.quote}”</blockquote><div><span>{item.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><p><strong>{item.name}</strong><small>{item.role} · CONTOH</small></p></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section trust-news-section" aria-labelledby="news-heading">
        <div className="shell">
          <div className="trust-section-heading trust-section-heading-compact"><div><span>Berita & cerita</span><h2 id="news-heading">Kabar dari lapangan.</h2></div><Link href="/berita" className="trust-text-link">Lihat semua berita <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <div className="trust-news-grid">
            {sampleNews.map((item) => (
              <article key={item.slug}><div className="trust-news-image"><Image src={item.image} alt={`Foto contoh ${item.title}`} fill sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 25vw" /><span>{item.category}</span></div><div><small>{item.date} · CONTOH</small><h3>{item.title}</h3><Link href={`/berita#${item.slug}`}>Baca cerita <ArrowRight size={14} aria-hidden="true" /></Link></div></article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section trust-accountability" aria-labelledby="accountability-heading">
        <div className="shell">
          <div className="trust-section-heading"><div><span>Akuntabilitas</span><h2 id="accountability-heading">Informasi penting tidak boleh tersembunyi di balik slogan.</h2></div><p>Empat ruang berikut membantu publik menemukan dasar hukum, struktur tanggung jawab, kebijakan, dan laporan secara langsung.</p></div>
          <div className="trust-accountability-grid">
            {accountabilityLinks.map(({ href, title, description, icon: Icon }) => (
              <Link href={href} key={href}><span><Icon size={23} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p><strong>Buka halaman <ArrowRight size={15} aria-hidden="true" /></strong></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-closing trust-closing-photo" aria-labelledby="closing-heading">
        <Image src={programs[1].image} alt="Foto contoh kegiatan sosial bersama warga" fill sizes="100vw" />
        <div className="trust-closing-photo-overlay" />
        <div className="shell trust-closing-content">
          <div><span>Bergerak bersama</span><h2 id="closing-heading">Dukungan yang baik dimulai dari informasi yang benar.</h2><p>Pelajari program, periksa ruang transparansi, lalu pilih cara terlibat yang paling sesuai.</p></div>
          <div className="trust-actions"><Link href="/donasi" className="trust-button trust-button-light"><Heart size={18} aria-hidden="true" /> Cara Mendukung</Link><Link href="/kontak" className="trust-button trust-button-dark">Hubungi Yayasan <ArrowRight size={18} aria-hidden="true" /></Link></div>
        </div>
      </section>
    </div>
  );
}
