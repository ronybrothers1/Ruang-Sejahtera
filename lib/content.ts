export type Program = {
  slug: string;
  name: string;
  summary: string;
  focus: string;
  image: string;
  accent: string;
};

export const sampleMode = true;

export const programs: Program[] = [
  { slug: 'air-bersih', name: 'Air Bersih', summary: 'Distribusi air bersih untuk wilayah yang mengalami keterbatasan akses selama musim kemarau.', focus: 'Kebutuhan dasar', image: 'https://images.unsplash.com/photo-1768381569898-7a2613a67356?auto=format&fit=crop&w=1400&q=82', accent: '01' },
  { slug: 'bantuan-sembako', name: 'Bantuan Sembako', summary: 'Paket kebutuhan pokok untuk keluarga rentan, lansia, dan masyarakat yang membutuhkan.', focus: 'Ketahanan keluarga', image: 'https://images.unsplash.com/photo-1758599669327-83d310882929?auto=format&fit=crop&w=1400&q=82', accent: '02' },
  { slug: 'bantuan-pendidikan', name: 'Bantuan Pendidikan', summary: 'Dukungan perlengkapan belajar, kelas pendampingan, dan kebutuhan pendidikan anak.', focus: 'Pendidikan', image: 'https://images.unsplash.com/photo-1727553957788-9ddfd38889d2?auto=format&fit=crop&w=1400&q=82', accent: '03' },
  { slug: 'bedah-rumah', name: 'Bedah Rumah', summary: 'Perbaikan rumah tidak layak huni agar keluarga dapat tinggal lebih aman dan bermartabat.', focus: 'Hunian layak', image: 'https://images.unsplash.com/photo-1632215861513-130b66fe97f4?auto=format&fit=crop&w=1400&q=82', accent: '04' },
  { slug: 'tanggap-bencana', name: 'Tanggap Bencana', summary: 'Respons cepat, logistik dasar, dan dukungan pemulihan awal bagi masyarakat terdampak bencana.', focus: 'Kemanusiaan', image: 'https://images.unsplash.com/photo-1758599668949-5118d71838fd?auto=format&fit=crop&w=1400&q=82', accent: '05' },
  { slug: 'program-sosial', name: 'Sosial & Pemberdayaan', summary: 'Program sosial berbasis kebutuhan lokal untuk memperkuat daya tahan dan kemandirian masyarakat.', focus: 'Pemberdayaan', image: 'https://images.unsplash.com/photo-1758599669327-83d310882929?auto=format&fit=crop&w=1400&q=82', accent: '06' },
];

export const sampleStats = [
  { value: '1.240', label: 'Penerima manfaat', note: 'data contoh sementara' },
  { value: '38', label: 'Kegiatan sosial', note: 'data contoh sementara' },
  { value: '12', label: 'Desa terjangkau', note: 'data contoh sementara' },
  { value: 'Rp186,5 Jt', label: 'Dana tersalurkan', note: 'data contoh sementara' },
] as const;

export const sampleActivities = [
  { slug: 'penyaluran-air-bersih-sukamaju', date: '20 Mei 2026', location: 'Desa Sukamaju, Sampang', title: 'Penyaluran Air Bersih untuk Warga', summary: 'Distribusi air bersih untuk keluarga terdampak kekeringan.', image: 'https://images.unsplash.com/photo-1768381569898-7a2613a67356?auto=format&fit=crop&w=1200&q=80' },
  { slug: 'sembako-lansia-banyukapah', date: '18 Mei 2026', location: 'Banyukapah, Sampang', title: 'Bantuan Sembako untuk Lansia', summary: 'Penyaluran paket kebutuhan pokok kepada warga lanjut usia.', image: 'https://images.unsplash.com/photo-1758599669327-83d310882929?auto=format&fit=crop&w=1200&q=80' },
  { slug: 'kelas-belajar-anak', date: '16 Mei 2026', location: 'Sampang, Jawa Timur', title: 'Kelas Belajar Ceria untuk Anak', summary: 'Kegiatan belajar dan pendampingan untuk anak usia sekolah.', image: 'https://images.unsplash.com/photo-1727553957788-9ddfd38889d2?auto=format&fit=crop&w=1200&q=80' },
  { slug: 'gotong-royong-lingkungan', date: '14 Mei 2026', location: 'Pesisir Sampang', title: 'Gotong Royong Lingkungan', summary: 'Aksi bersama relawan menjaga lingkungan dan ruang hidup warga.', image: 'https://images.unsplash.com/photo-1758599668949-5118d71838fd?auto=format&fit=crop&w=1200&q=80' },
] as const;

export const sampleNews = [
  { slug: 'air-bersih-terus-bergerak', date: '19 Mei 2026', title: 'Ketika Air Menjadi Prioritas, Distribusi Terus Bergerak', category: 'Kegiatan', image: 'https://images.unsplash.com/photo-1768381569898-7a2613a67356?auto=format&fit=crop&w=1200&q=80' },
  { slug: 'pendidikan-investasi-masa-depan', date: '15 Mei 2026', title: 'Pendidikan adalah Investasi Masa Depan Anak', category: 'Cerita', image: 'https://images.unsplash.com/photo-1727553957788-9ddfd38889d2?auto=format&fit=crop&w=1200&q=80' },
  { slug: 'rumah-layak-harapan-baru', date: '12 Mei 2026', title: 'Rumah Layak, Harapan Baru untuk Keluarga', category: 'Program', image: 'https://images.unsplash.com/photo-1632215861513-130b66fe97f4?auto=format&fit=crop&w=1200&q=80' },
  { slug: 'relawan-bergerak-bersama', date: '8 Mei 2026', title: 'Relawan Bergerak Bersama untuk Lingkungan', category: 'Relawan', image: 'https://images.unsplash.com/photo-1758599669327-83d310882929?auto=format&fit=crop&w=1200&q=80' },
] as const;

export const sampleTestimonials = [
  { name: 'Siti Aisyah', role: 'Warga penerima manfaat', quote: 'Bantuan air bersih sangat membantu kebutuhan keluarga kami. Terima kasih kepada semua yang sudah peduli.' },
  { name: 'Maria L. Kolo', role: 'Orang tua siswa', quote: 'Anak-anak lebih bersemangat belajar ketika ada dukungan perlengkapan dan pendampingan yang teratur.' },
  { name: 'Slamet Riyadi', role: 'Penerima program hunian', quote: 'Perbaikan rumah membuat keluarga kami merasa jauh lebih aman dan nyaman.' },
] as const;

export const sampleFinance = [
  { label: 'Air Bersih', value: 28, amount: 'Rp52,2 Juta' },
  { label: 'Bantuan Sembako', value: 24, amount: 'Rp44,8 Juta' },
  { label: 'Pendidikan', value: 20, amount: 'Rp37,3 Juta' },
  { label: 'Bedah Rumah', value: 18, amount: 'Rp33,5 Juta' },
  { label: 'Tanggap Bencana', value: 10, amount: 'Rp18,7 Juta' },
] as const;

export const trustPrinciples = [
  ['Transparan', 'Laporan kegiatan dan penggunaan dana dapat dipantau publik.'],
  ['Akuntabel', 'Setiap program memiliki penanggung jawab dan jejak dokumentasi.'],
  ['Tepat sasaran', 'Prioritas bantuan ditetapkan melalui asesmen kebutuhan.'],
  ['Berintegritas', 'Keputusan program ditempatkan di atas kepentingan pribadi.'],
] as const;

export const publicSearchIndex = [
  { title: 'Tentang Kami', description: 'Profil, nilai, fokus kegiatan, dan komitmen yayasan.', href: '/tentang-kami' },
  { title: 'Program', description: 'Seluruh fokus program sosial Yayasan Ruang Sejahtera.', href: '/program' },
  { title: 'Kegiatan', description: 'Arsip kegiatan sosial dan dokumentasi lapangan.', href: '/kegiatan' },
  { title: 'Dampak', description: 'Ringkasan dampak dan indikator program.', href: '/dampak' },
  { title: 'Transparansi', description: 'Laporan keuangan, program, dan dokumen publik.', href: '/transparansi' },
  { title: 'Berita', description: 'Berita kegiatan, cerita dampak, dan pengumuman.', href: '/berita' },
  { title: 'Galeri', description: 'Dokumentasi foto dan video kegiatan.', href: '/galeri' },
  { title: 'Organisasi', description: 'Struktur organisasi dan pengurus.', href: '/organisasi' },
  { title: 'Kontak', description: 'Kanal komunikasi Yayasan Ruang Sejahtera.', href: '/kontak' },
  ...programs.map((program) => ({ title: program.name, description: program.summary, href: `/program/${program.slug}` })),
];
