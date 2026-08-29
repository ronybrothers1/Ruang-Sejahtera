"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Heart, ArrowRight, BookOpen, Droplets, Home as HomeIcon, Users, CheckCircle, ChevronRight, BarChart, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/kemanusiaan/1920/1080"
            alt="Kegiatan Sosial"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl flex flex-col items-center gap-6"
          >
            <span className="px-4 py-1.5 rounded-full bg-red-600/20 text-red-100 border border-red-500/30 text-sm font-medium tracking-wide">
              Yayasan Sosial & Kemanusiaan
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-heading">
              Berbagi Kebaikan, Menguatkan Kehidupan.
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
              Ruang untuk berbagi, jalan untuk sejahtera. Kami hadir memberikan manfaat nyata untuk pendidikan, bantuan kemanusiaan, dan pemberdayaan masyarakat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Link
                href="/donasi"
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-base font-semibold transition-all shadow-lg shadow-red-600/30"
              >
                <Heart size={20} className="fill-current" />
                Donasi Sekarang
              </Link>
              <Link
                href="/kegiatan"
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full text-base font-semibold transition-all backdrop-blur-sm"
              >
                Lihat Kegiatan
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMPACT STATISTICS SECTION */}
      <section className="py-16 bg-white border-b border-slate-100 relative z-20 -mt-10 rounded-t-[3rem] overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Penerima Manfaat', value: '12.450+', icon: Users },
              { label: 'Kegiatan Sosial', value: '450+', icon: CheckCircle },
              { label: 'Wilayah Terjangkau', value: '34', icon: MapPin },
              { label: 'Donatur Aktif', value: '1.200+', icon: Heart },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-3 p-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-2">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-heading">{stat.value}</h3>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM UNGGULAN */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="text-red-600 font-semibold tracking-wide text-sm uppercase mb-3 block">Fokus Kami</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
                Program Bantuan Nyata
              </h2>
            </div>
            <Link href="/program" className="hidden md:flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors">
              Lihat Semua Program <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Bantuan Sembako', desc: 'Distribusi kebutuhan pokok untuk keluarga kurang mampu dan lansia.', icon: Heart, img: 'sembako' },
              { title: 'Bantuan Pendidikan', desc: 'Beasiswa dan perlengkapan sekolah untuk anak-anak berprestasi.', icon: BookOpen, img: 'pendidikan' },
              { title: 'Distribusi Air Bersih', desc: 'Penyediaan air bersih di wilayah yang mengalami kekeringan ekstrem.', icon: Droplets, img: 'air' },
              { title: 'Tanggap Bencana', desc: 'Respons cepat dan penyaluran logistik untuk wilayah terdampak bencana.', icon: Users, img: 'bencana' },
              { title: 'Bedah Rumah', desc: 'Perbaikan tempat tinggal agar menjadi rumah layak huni dan sehat.', icon: HomeIcon, img: 'rumah' },
              { title: 'Program Sosial', desc: 'Pemberdayaan dan pelatihan untuk meningkatkan kemandirian ekonomi.', icon: CheckCircle, img: 'sosial' },
            ].map((prog, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col transition-all duration-300"
              >
                <div className="relative h-48 w-full bg-slate-100">
                  <Image
                    src={`https://picsum.photos/seed/${prog.img}/600/400`}
                    alt={prog.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2.5 rounded-xl text-red-600">
                    <prog.icon size={20} />
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">{prog.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{prog.desc}</p>
                  <Link href={`/program`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-red-600 transition-colors group">
                    Pelajari Program <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 md:hidden flex justify-center">
            <Link href="/program" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium w-full">
              Lihat Semua Program
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY PREVIEW */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center relative z-10">
                <span className="text-red-400 font-semibold tracking-wide text-sm uppercase mb-4 block">Komitmen Kami</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 font-heading">
                  Transparansi dan Akuntabilitas
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-10">
                  Setiap donasi yang diamanahkan kepada Yayasan Ruang Sejahtera dicatat, dikelola, dan dilaporkan secara terbuka untuk memastikan dampak yang maksimal.
                </p>
                <Link
                  href="/transparansi"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-full text-base font-semibold w-fit transition-colors"
                >
                  <BarChart size={20} />
                  Lihat Laporan Transparansi
                </Link>
              </div>
              
              <div className="relative p-10 lg:p-20 bg-slate-800/50 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-700/50">
                <div className="space-y-6">
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 text-sm mb-2 font-medium">Total Penyaluran Program 2026</p>
                    <p className="text-3xl font-bold text-white font-heading">Rp 1.450.000.000</p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <p className="text-slate-400 text-sm mb-2 font-medium">Laporan Program & Donasi</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-white">Laporan Q2 Tersedia</p>
                      <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-medium">Terverifikasi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-red-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/pattern/1000/1000')] opacity-5 mix-blend-overlay"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 max-w-3xl font-heading">
            Bersama kita bisa ciptakan ruang yang lebih sejahtera untuk mereka.
          </h2>
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mb-10">
            Dukungan Anda berarti besar. Salurkan kebaikan hari ini dan lihat langsung dampak nyata yang Anda berikan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/donasi"
              className="bg-white text-red-600 hover:bg-slate-50 px-8 py-4 rounded-full text-lg font-bold transition-colors shadow-xl"
            >
              Mulai Berdonasi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
