import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Droplets,
  FileText,
  GraduationCap,
  HandHeart,
  HardHat,
  Heart,
  Home as HomeIcon,
  MapPin,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from 'lucide-react';
import {
  programs,
  sampleActivities,
  sampleFinance,
  sampleNews,
  sampleStats,
  sampleTestimonials,
  trustPrinciples,
} from '@/lib/content';

const programIcons = [Droplets, HandHeart, GraduationCap, HomeIcon, HardHat, Users];
const statIcons = [Users, Heart, MapPin, WalletCards];

export default function Home() {
  return (
    <div className="home-v4 bg-[#f7f7f5]">
      <section className="hero-stage hero-stage-v4">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-red-plane" aria-hidden="true" />
        <div className="hero-orbit" aria-hidden="true" />

        <div className="shell hero-grid hero-grid-v4">
          <div className="hero-copy hero-copy-v4">
            <span className="hero-kicker"><Sparkles size={15} /> Gerakan sosial & kemanusiaan</span>
            <h1>Bersama kita <span>hadirkan harapan,</span> wujudkan kesejahteraan.</h1>
            <p>Ruang Sejahtera menghubungkan kepedulian dengan aksi nyata—dari air bersih dan kebutuhan dasar hingga pendidikan, hunian layak, dan tanggap kemanusiaan.</p>

            <div className="hero-actions">
              <Link href="/donasi" className="cta-red"><Heart size={18} fill="currentColor" /> Donasi Sekarang</Link>
              <Link href="/kegiatan" className="cta-ghost">Lihat Kegiatan <ArrowRight size={18} /></Link>
            </div>

            <div className="hero-proof hero-proof-v4">
              <div className="avatar-stack" aria-hidden="true"><span>RS</span><span>01</span><span>02</span><span>03</span></div>
              <div><strong>Gerakan yang tumbuh bersama publik</strong><small>Profil relawan & donatur · contoh sementara</small></div>
            </div>

            <div className="hero-trustline" aria-label="Prinsip pengalaman publik">
              <span>Transparansi publik</span>
              <span>Dokumentasi kegiatan</span>
              <span>Berorientasi kebutuhan</span>
            </div>
          </div>

          <div className="hero-media hero-media-v4" aria-label="Kolase dokumentasi contoh sementara">
            <div className="hero-main-image">
              <Image src={programs[0].image} alt="Dokumentasi contoh program air bersih" fill priority sizes="(max-width: 820px) 100vw, (max-width: 1180px) 54vw, 48vw" />
              <div className="image-shade" />
              <div className="media-label">FOTO CONTOH · AKAN DIGANTI DOKUMENTASI ASLI</div>
            </div>
            <div className="hero-side-stack">
              <div className="mini-image"><Image src={programs[1].image} alt="Dokumentasi contoh bantuan sosial" fill sizes="(max-width: 820px) 48vw, 22vw" /></div>
              <div className="mini-image"><Image src={programs[2].image} alt="Dokumentasi contoh pendidikan" fill sizes="(max-width: 820px) 48vw, 22vw" /></div>
            </div>
          </div>
        </div>

        <div className="shell hero-stats-wrap hero-stats-wrap-v4">
          <div className="hero-stats hero-stats-v4">
            {sampleStats.map((item, index) => {
              const Icon = statIcons[index];
              return (
                <div className="hero-stat" key={item.label}>
                  <Icon size={26} />
                  <div><strong>{item.value}</strong><span>{item.label}</span><small>{item.note}</small></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-white section-pad section-pad-v4">
        <div className="shell">
          <div className="center-heading center-heading-v4">
            <span>Program Kami</span>
            <h2>Solusi nyata untuk perubahan yang terasa.</h2>
            <p>Enam fokus program untuk menjawab kebutuhan dasar, pendidikan, hunian, pemberdayaan, dan keadaan darurat masyarakat.</p>
          </div>

          <div className="program-grid-premium program-grid-v4">
            {programs.map((program, index) => {
              const Icon = programIcons[index];
              return (
                <Link href={`/program/${program.slug}`} className="program-card-premium program-card-v4" key={program.slug}>
                  <div className="program-image">
                    <Image src={program.image} alt={`Foto contoh ${program.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <span className="program-number">{program.accent}</span>
                    <span className="program-icon"><Icon size={19} /></span>
                  </div>
                  <div className="program-body">
                    <span>{program.focus}</span>
                    <h3>{program.name}</h3>
                    <p>{program.summary}</p>
                    <strong>Lihat Program <ArrowRight size={15} /></strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad section-pad-v4 bg-[#f4f4f2]">
        <div className="shell">
          <div className="split-heading split-heading-v4">
            <div><span className="eyebrow-v3">Kegiatan terbaru</span><h2 className="display-h2">Aksi yang bisa dilihat, bukan hanya diceritakan.</h2></div>
            <Link href="/kegiatan" className="text-link">Lihat semua kegiatan <ArrowRight size={16} /></Link>
          </div>

          <div className="activity-grid activity-grid-v4">
            {sampleActivities.map((activity) => (
              <article className="activity-card activity-card-v4" key={activity.slug}>
                <div className="activity-photo">
                  <Image src={activity.image} alt={`Foto contoh ${activity.title}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <span className="date-chip">{activity.date}</span>
                  <span className="draft-chip">CONTOH</span>
                </div>
                <div className="activity-body">
                  <span className="location-line"><MapPin size={14} /> {activity.location}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.summary}</p>
                  <Link href="/kegiatan">Baca detail <ArrowRight size={14} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-stage section-pad section-pad-v4 impact-stage-v4">
        <div className="shell impact-layout impact-layout-v4">
          <div className="impact-copy impact-copy-v4">
            <span className="eyebrow-v3 light">Transparansi & kepercayaan</span>
            <h2>Amanah Anda,<br />tanggung jawab kami.</h2>
            <p>Contoh visual laporan penyaluran, dokumen publik, dan prinsip tata kelola. Seluruh nominal pada bagian ini masih bersifat demonstrasi.</p>
            <div className="impact-links">
              <Link href="/transparansi"><FileText size={20} /> Lihat laporan</Link>
              <Link href="/kebijakan-donasi"><ShieldCheck size={20} /> Kebijakan donasi</Link>
            </div>
          </div>

          <div className="finance-panel finance-panel-v4">
            <div className="finance-head"><div><span>Ringkasan Penyaluran Dana</span><small>contoh sementara</small></div><strong>Rp186,5 Juta</strong></div>
            <div className="finance-content">
              <div className="donut" aria-label="Visual komposisi dana contoh"><div><b>100%</b><span>tersalurkan*</span></div></div>
              <div className="finance-list">{sampleFinance.map((item) => <div key={item.label}><span className="finance-dot" /><strong>{item.label}</strong><em>{item.value}%</em><small>{item.amount}</small></div>)}</div>
            </div>
            <p className="finance-disclaimer">*Seluruh angka merupakan data desain contoh dan bukan laporan resmi yayasan.</p>
          </div>

          <div className="principle-panel principle-panel-v4">
            <h3>Prinsip Kami</h3>
            {trustPrinciples.map(([title, description], i) => (
              <div className="principle-item" key={title}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div><strong>{title}</strong><p>{description}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-white section-pad section-pad-v4">
        <div className="shell">
          <div className="center-heading center-heading-v4"><span>Cerita dampak</span><h2>Mereka yang merasakan manfaat.</h2><p>Testimoni berikut merupakan contoh struktur konten dan akan diganti dengan cerita penerima manfaat yang telah mendapat persetujuan publikasi.</p></div>
          <div className="testimonial-grid testimonial-grid-v4">
            {sampleTestimonials.map((item) => (
              <article className="testimonial-card testimonial-card-v4" key={item.name}>
                <Quote size={32} />
                <p>“{item.quote}”</p>
                <div><div className="testimonial-avatar">{item.name.split(' ').map((x) => x[0]).join('').slice(0, 2)}</div><div><strong>{item.name}</strong><span>{item.role}</span></div></div>
                <small>TESTIMONI CONTOH</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad section-pad-v4 bg-[#f4f4f2]">
        <div className="shell">
          <div className="split-heading split-heading-v4"><div><span className="eyebrow-v3">Berita & cerita</span><h2 className="display-h2">Kabar dari lapangan.</h2></div><Link href="/berita" className="text-link">Lihat semua berita <ArrowRight size={16} /></Link></div>
          <div className="news-grid-v3 news-grid-v4">
            {sampleNews.map((item) => (
              <article className="news-card-v3 news-card-v4" key={item.slug}>
                <div className="news-image"><Image src={item.image} alt={`Foto contoh ${item.title}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" /><span>{item.category}</span></div>
                <div><small>{item.date} · DATA CONTOH</small><h3>{item.title}</h3><Link href="/berita">Baca cerita <ArrowRight size={14} /></Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-cta closing-cta-v4">
        <div className="closing-image"><Image src={programs[4].image} alt="Foto contoh relawan" fill sizes="100vw" /></div>
        <div className="closing-overlay" />
        <div className="shell closing-content closing-content-v4">
          <div><span>Bergerak bersama</span><h2>Hadirkan kebaikan.<br />Ubah kehidupan.</h2><p>Setiap dukungan adalah ruang baru bagi harapan untuk tumbuh.</p></div>
          <Link href="/donasi" className="cta-white"><Heart size={18} /> Donasi Sekarang</Link>
        </div>
      </section>
    </div>
  );
}
