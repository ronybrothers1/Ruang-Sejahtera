export type Program = {
  slug: string;
  name: string;
  summary: string;
  focus: string;
  image: string;
  accent: string;
};

/**
 * Content in this module is intentionally used to preview the complete public
 * experience before it is replaced by verified editorial and operational data.
 */
export const sampleMode = true;

export const programs: Program[] = [
  {
    slug: 'berbagi-rasa',
    name: 'Berbagi Rasa',
    summary: 'Berbagi Rasa (Rakyat Sejahtera): bantuan sembako dan uang tunai bagi masyarakat yang membutuhkan.',
    focus: 'Rakyat Sejahtera',
    image: 'https://images.unsplash.com/photo-1758599669327-83d310882929?auto=format&fit=crop&w=1600&q=82',
    accent: '01',
  },
  {
    slug: 'merakyat',
    name: 'Merakyat',
    summary: 'Merakyat (Mabecce’ Usahanah Rakyat): bantuan renovasi serta modal bagi usaha mikro dan kecil.',
    focus: 'Usaha rakyat',
    image: 'https://images.unsplash.com/photo-1758599668949-5118d71838fd?auto=format&fit=crop&w=1600&q=82',
    accent: '02',
  },
  {
    slug: 'rehat',
    name: 'REHAT',
    summary: 'REHAT (Renovasi Rumah Rakyat): bedah dan renovasi rumah agar menjadi hunian yang lebih layak.',
    focus: 'Renovasi Rumah Rakyat',
    image: 'https://images.unsplash.com/photo-1632215861513-130b66fe97f4?auto=format&fit=crop&w=1600&q=82',
    accent: '03',
  },
  {
    slug: 'berbagi-air-bersih',
    name: 'Berbagi Air Bersih',
    summary: 'Bantuan air bersih untuk masyarakat di wilayah yang terdampak kekeringan.',
    focus: 'Air bersih',
    image: 'https://images.unsplash.com/photo-1768381569898-7a2613a67356?auto=format&fit=crop&w=1600&q=82',
    accent: '04',
  },
  {
    slug: 'berbagi-masa-depan',
    name: 'Berbagi Masa Depan',
    summary: 'Bantuan pendidikan berupa peralatan sekolah dan dukungan biaya pendidikan.',
    focus: 'Pendidikan',
    image: 'https://images.unsplash.com/photo-1727553957788-9ddfd38889d2?auto=format&fit=crop&w=1600&q=82',
    accent: '05',
  },
];

export const sampleStats = [
  { value: '1.240', label: 'Penerima manfaat', note: 'data contoh sementara' },
  { value: '38', label: 'Kegiatan sosial', note: 'data contoh sementara' },
  { value: '12', label: 'Desa terjangkau', note: 'data contoh sementara' },
  { value: 'Rp186,5 Jt', label: 'Dana tersalurkan', note: 'data contoh sementara' },
] as const;

export const sampleActivities = [
  { slug: 'penyaluran-air-bersih-sukamaju', date: '20 Mei 2026', location: 'Desa Sukamaju, Sampang', title: 'Penyaluran Air Bersih untuk Warga', summary: 'Distribusi air bersih untuk keluarga terdampak kekeringan.', image: 'https://images.unsplash.com/photo-1768381569898-7a2613a67356?auto=format&fit=crop&w=1400&q=80' },
  { slug: 'sembako-lansia-banyukapah', date: '18 Mei 2026', location: 'Banyukapah, Sampang', title: 'Bantuan Sembako untuk Lansia', summary: 'Penyaluran paket kebutuhan pokok kepada warga lanjut usia.', image: 'https://images.unsplash.com/photo-1758599669327-83d310882929?auto=format&fit=crop&w=1400&q=80' },
  { slug: 'kelas-belajar-anak', date: '16 Mei 2026', location: 'Sampang, Jawa Timur', title: 'Kelas Belajar Ceria untuk Anak', summary: 'Kegiatan belajar dan pendampingan untuk anak usia sekolah.', image: 'https://images.unsplash.com/photo-1727553957788-9ddfd38889d2?auto=format&fit=crop&w=1400&q=80' },
  { slug: 'gotong-royong-lingkungan', date: '14 Mei 2026', location: 'Pesisir Sampang', title: 'Gotong Royong Lingkungan', summary: 'Aksi bersama relawan menjaga lingkungan dan ruang hidup warga.', image: 'https://images.unsplash.com/photo-1758599668949-5118d71838fd?auto=format&fit=crop&w=1400&q=80' },
] as const;

export const sampleNews = [
  { slug: 'air-bersih-terus-bergerak', date: '19 Mei 2026', title: 'Ketika Air Menjadi Prioritas, Distribusi Terus Bergerak', category: 'Kegiatan', image: 'https://images.unsplash.com/photo-1768381569898-7a2613a67356?auto=format&fit=crop&w=1400&q=80' },
  { slug: 'pendidikan-investasi-masa-depan', date: '15 Mei 2026', title: 'Pendidikan adalah Investasi Masa Depan Anak', category: 'Cerita', image: 'https://images.unsplash.com/photo-1727553957788-9ddfd38889d2?auto=format&fit=crop&w=1400&q=80' },
  { slug: 'rumah-layak-harapan-baru', date: '12 Mei 2026', title: 'Rumah Layak, Harapan Baru untuk Keluarga', category: 'Program', image: 'https://images.unsplash.com/photo-1632215861513-130b66fe97f4?auto=format&fit=crop&w=1400&q=80' },
  { slug: 'relawan-bergerak-bersama', date: '8 Mei 2026', title: 'Relawan Bergerak Bersama untuk Lingkungan', category: 'Relawan', image: 'https://images.unsplash.com/photo-1758599669327-83d310882929?auto=format&fit=crop&w=1400&q=80' },
] as const;

export const sampleTestimonials = [
  { name: 'Siti Aisyah', role: 'Warga penerima manfaat', quote: 'Bantuan air bersih sangat membantu kebutuhan keluarga kami. Terima kasih kepada semua yang sudah peduli.' },
  { name: 'Maria L. Kolo', role: 'Orang tua siswa', quote: 'Anak-anak lebih bersemangat belajar ketika ada dukungan perlengkapan dan pendampingan yang teratur.' },
  { name: 'Slamet Riyadi', role: 'Penerima program hunian', quote: 'Perbaikan rumah membuat keluarga kami merasa jauh lebih aman dan nyaman.' },
] as const;

export const sampleFinance = [
  { label: 'Berbagi Air Bersih', value: 28, amount: 'Rp52,2 Juta' },
  { label: 'Berbagi Rasa', value: 24, amount: 'Rp44,8 Juta' },
  { label: 'Berbagi Masa Depan', value: 20, amount: 'Rp37,3 Juta' },
  { label: 'REHAT', value: 18, amount: 'Rp33,5 Juta' },
  { label: 'Merakyat', value: 10, amount: 'Rp18,7 Juta' },
] as const;

export const sampleFinanceHeadline = [
  { value: 'Rp224,8 Jt', label: 'Total penerimaan' },
  { value: 'Rp186,5 Jt', label: 'Total penyaluran' },
  { value: 'Rp18,2 Jt', label: 'Operasional' },
  { value: 'Rp20,1 Jt', label: 'Saldo/alokasi' },
] as const;

export const sampleOrganization = [
  { role: 'Pembina', name: 'Nama Pembina' },
  { role: 'Pengawas', name: 'Nama Pengawas' },
  { role: 'Ketua', name: 'Nama Ketua' },
  { role: 'Sekretaris', name: 'Nama Sekretaris' },
  { role: 'Bendahara', name: 'Nama Bendahara' },
  { role: 'Koordinator Program', name: 'Nama Koordinator' },
  { role: 'Koordinator Relawan', name: 'Nama Koordinator Relawan' },
] as const;

export const sampleTimeline = [
  { year: '2024', title: 'Gagasan kepedulian mulai dirumuskan', description: 'Sekelompok penggerak sosial mulai mengorganisasi bantuan berbasis kebutuhan masyarakat.' },
  { year: '2025', title: 'Gerakan diperluas', description: 'Kegiatan sosial berkembang dengan fokus kebutuhan dasar, pendidikan, dan respons kemanusiaan.' },
  { year: '2026', title: 'Penguatan tata kelola digital', description: 'Ruang Sejahtera mulai membangun pusat informasi, dokumentasi, dampak, dan transparansi publik yang lebih terstruktur.' },
] as const;

export const sampleVision = 'Menjadi ruang kepedulian yang menghadirkan kesejahteraan melalui aksi sosial yang nyata, inklusif, dan dapat dipercaya.';

export const sampleMissions = [
  { title: 'Hadir dekat dengan kebutuhan', description: 'Mengembangkan program sosial yang berangkat dari kebutuhan nyata masyarakat dan asesmen lapangan.' },
  { title: 'Menjaga martabat penerima manfaat', description: 'Menyalurkan dukungan dengan pendekatan yang manusiawi, proporsional, dan menghormati privasi.' },
  { title: 'Membangun kepercayaan publik', description: 'Membuka jejak program, kegiatan, dokumentasi, dampak, dan penggunaan dana secara mudah dipahami.' },
  { title: 'Menguatkan kolaborasi', description: 'Menghubungkan masyarakat, relawan, donatur, dan mitra untuk menciptakan dampak yang lebih berkelanjutan.' },
] as const;

export const sampleValues = [
  { title: 'Kemanusiaan', description: 'Menempatkan martabat manusia dan kebutuhan masyarakat sebagai pusat setiap keputusan.' },
  { title: 'Transparansi', description: 'Menyajikan jejak program dan informasi penggunaan sumber daya dengan bahasa yang dapat dipahami.' },
  { title: 'Akuntabilitas', description: 'Menjaga tanggung jawab yang jelas dari perencanaan, pelaksanaan, dokumentasi, hingga laporan.' },
  { title: 'Dampak', description: 'Mengukur hasil menggunakan definisi, periode, dan sumber data yang dapat ditelusuri.' },
  { title: 'Aksesibilitas', description: 'Membuat informasi dan layanan digital dapat digunakan oleh sebanyak mungkin orang.' },
] as const;

export const sampleLegalDocuments = [
  { title: 'Akta Pendirian Yayasan', number: 'Nomor XX / Tahun 20XX', issuer: 'Notaris · contoh sementara' },
  { title: 'Keputusan Pengesahan', number: 'AHU-XXXX.XX.XX.20XX', issuer: 'Kementerian terkait · contoh sementara' },
  { title: 'NPWP Yayasan', number: 'XX.XXX.XXX.X-XXX.XXX', issuer: 'Nomor contoh sementara' },
  { title: 'Dokumen Domisili / Administrasi', number: 'Nomor XXX/20XX', issuer: 'Dokumen contoh sementara' },
] as const;

export const sampleContact = [
  { label: 'Alamat kantor', value: 'Jl. Kebaikan No. 10, Kabupaten Sampang, Jawa Timur' },
  { label: 'WhatsApp', value: '+62 812-0000-2026' },
  { label: 'Email', value: 'halo@ruangsejahtera.org' },
] as const;

export const sampleDonationAmounts = ['Rp25.000', 'Rp50.000', 'Rp100.000', 'Rp250.000'] as const;


export const trustPrinciples = [
  ['Transparan', 'Informasi kegiatan dan penggunaan dana perlu disiapkan agar dapat dipantau publik.'],
  ['Akuntabel', 'Setiap program perlu memiliki penanggung jawab dan jejak dokumentasi.'],
  ['Tepat sasaran', 'Prioritas bantuan perlu ditetapkan melalui asesmen kebutuhan.'],
  ['Berintegritas', 'Keputusan program harus ditempatkan di atas kepentingan pribadi.'],
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
