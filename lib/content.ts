export type Program = {
  slug: string;
  name: string;
  summary: string;
  focus: string;
  image: string;
  imageAlt: string;
  imageLabel: 'DOKUMENTASI' | 'VISUAL CONTOH';
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
    image: '/media/bantuan-sembako.webp',
    imageAlt: 'Penyerahan bantuan sembako kepada seorang warga lanjut usia di rumahnya',
    imageLabel: 'DOKUMENTASI',
    accent: '01',
  },
  {
    slug: 'merakyat',
    name: 'Merakyat',
    summary: 'Merakyat (Mabecce’ Usahanah Rakyat): bantuan renovasi serta modal bagi usaha mikro dan kecil.',
    focus: 'Usaha rakyat',
    image: '/media/visual-merakyat.webp',
    imageAlt: 'Visual contoh pendampingan usaha mikro di warung warga Indonesia',
    imageLabel: 'VISUAL CONTOH',
    accent: '02',
  },
  {
    slug: 'rehat',
    name: 'REHAT',
    summary: 'REHAT (Renovasi Rumah Rakyat): bedah dan renovasi rumah agar menjadi hunian yang lebih layak.',
    focus: 'Renovasi Rumah Rakyat',
    image: '/media/visual-rehat.webp',
    imageAlt: 'Visual contoh gotong royong renovasi rumah warga di perdesaan Indonesia',
    imageLabel: 'VISUAL CONTOH',
    accent: '03',
  },
  {
    slug: 'berbagi-air-bersih',
    name: 'Berbagi Air Bersih',
    summary: 'Bantuan air bersih untuk masyarakat di wilayah yang terdampak kekeringan.',
    focus: 'Air bersih',
    image: '/media/penyaluran-air-bersih.webp',
    imageAlt: 'Warga mengisi jeriken saat penyaluran air bersih dari mobil tangki',
    imageLabel: 'DOKUMENTASI',
    accent: '04',
  },
  {
    slug: 'berbagi-masa-depan',
    name: 'Berbagi Masa Depan',
    summary: 'Bantuan pendidikan berupa peralatan sekolah dan dukungan biaya pendidikan.',
    focus: 'Pendidikan',
    image: '/media/visual-pendidikan.webp',
    imageAlt: 'Visual contoh penyerahan perlengkapan belajar kepada siswa sekolah dasar Indonesia',
    imageLabel: 'VISUAL CONTOH',
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
  { slug: 'penyaluran-air-bersih-sukamaju', date: '20 Mei 2026', location: 'Desa Sukamaju, Sampang', title: 'Penyaluran Air Bersih untuk Warga', summary: 'Distribusi air bersih untuk keluarga terdampak kekeringan.', image: '/media/penyaluran-air-bersih.webp', imageAlt: 'Warga menyiapkan jeriken saat penyaluran air bersih', imageLabel: 'DOKUMENTASI' },
  { slug: 'sembako-lansia-banyukapah', date: '18 Mei 2026', location: 'Banyukapah, Sampang', title: 'Bantuan Sembako untuk Lansia', summary: 'Penyaluran paket kebutuhan pokok kepada warga lanjut usia.', image: '/media/bantuan-sembako.webp', imageAlt: 'Penyerahan paket sembako kepada warga lanjut usia', imageLabel: 'DOKUMENTASI' },
  { slug: 'kelas-belajar-anak', date: '16 Mei 2026', location: 'Sampang, Jawa Timur', title: 'Kelas Belajar Ceria untuk Anak', summary: 'Kegiatan belajar dan pendampingan untuk anak usia sekolah.', image: '/media/visual-pendidikan.webp', imageAlt: 'Visual contoh dukungan pendidikan bagi siswa sekolah dasar', imageLabel: 'VISUAL CONTOH' },
  { slug: 'gotong-royong-lingkungan', date: '14 Mei 2026', location: 'Pesisir Sampang', title: 'Gotong Royong Lingkungan', summary: 'Aksi bersama relawan menjaga lingkungan dan ruang hidup warga.', image: '/media/visual-gotong-royong.webp', imageAlt: 'Visual contoh gotong royong membersihkan lingkungan pesisir Indonesia', imageLabel: 'VISUAL CONTOH' },
] as const;

export const sampleNews = [
  { slug: 'air-bersih-terus-bergerak', date: '19 Mei 2026', title: 'Ketika Air Menjadi Prioritas, Distribusi Terus Bergerak', category: 'Kegiatan', image: '/media/penyaluran-air-bersih.webp', imageAlt: 'Warga mengantrekan jeriken saat distribusi air bersih' },
  { slug: 'pendidikan-investasi-masa-depan', date: '15 Mei 2026', title: 'Pendidikan adalah Investasi Masa Depan Anak', category: 'Cerita', image: '/media/visual-pendidikan.webp', imageAlt: 'Visual contoh dukungan alat belajar untuk anak Indonesia' },
  { slug: 'rumah-layak-harapan-baru', date: '12 Mei 2026', title: 'Rumah Layak, Harapan Baru untuk Keluarga', category: 'Program', image: '/media/visual-rehat.webp', imageAlt: 'Visual contoh gotong royong memperbaiki rumah warga' },
  { slug: 'relawan-bergerak-bersama', date: '8 Mei 2026', title: 'Relawan Bergerak Bersama untuk Lingkungan', category: 'Relawan', image: '/media/visual-gotong-royong.webp', imageAlt: 'Visual contoh relawan membersihkan lingkungan pesisir' },
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

export type PublicSearchItem = {
  title: string;
  description: string;
  href: string;
  category: string;
};

export const publicSearchIndex: PublicSearchItem[] = [
  { title: 'Tentang Kami', description: 'Profil, ruang kerja, dan komitmen informasi publik yayasan.', href: '/tentang-kami', category: 'Tentang Kami' },
  { title: 'Visi & Misi', description: 'Arah dan misi yang menjadi dasar gerakan Yayasan Ruang Sejahtera.', href: '/tentang-kami/visi-misi', category: 'Tentang Kami' },
  { title: 'Nilai Kami', description: 'Prinsip kemanusiaan, transparansi, akuntabilitas, dampak, dan aksesibilitas.', href: '/tentang-kami/nilai', category: 'Tentang Kami' },
  { title: 'Sejarah', description: 'Perjalanan dan tonggak perkembangan Yayasan Ruang Sejahtera.', href: '/tentang-kami/sejarah', category: 'Tentang Kami' },
  { title: 'Organisasi', description: 'Struktur organisasi, peran, dan tanggung jawab pengurus.', href: '/organisasi', category: 'Tentang Kami' },
  { title: 'Legalitas', description: 'Identitas hukum dan ruang pemeriksaan dokumen legalitas yayasan.', href: '/tentang-kami/legalitas', category: 'Tentang Kami' },
  { title: 'Program', description: 'Lima fokus program sosial Yayasan Ruang Sejahtera.', href: '/program', category: 'Program' },
  ...programs.map((program) => ({ title: program.name, description: program.summary, href: `/program/${program.slug}`, category: 'Program' })),
  { title: 'Kegiatan', description: 'Arsip kegiatan sosial dan dokumentasi lapangan.', href: '/kegiatan', category: 'Kegiatan' },
  ...sampleActivities.map((activity) => ({ title: activity.title, description: `${activity.summary} ${activity.location}.`, href: `/kegiatan#${activity.slug}`, category: 'Kegiatan contoh' })),
  { title: 'Berita & Cerita', description: 'Berita kegiatan, cerita dampak, program, dan relawan.', href: '/berita', category: 'Kegiatan' },
  ...sampleNews.map((item) => ({ title: item.title, description: `${item.category} contoh yang memperlihatkan struktur artikel dan dokumentasi program.`, href: `/berita#${item.slug}`, category: 'Berita contoh' })),
  { title: 'Galeri Foto & Video', description: 'Dokumentasi visual kegiatan dan program sosial.', href: '/galeri', category: 'Kegiatan' },
  { title: 'Dampak', description: 'Ringkasan dampak, indikator program, dan kerangka pengukuran.', href: '/dampak', category: 'Akuntabilitas' },
  { title: 'Transparansi', description: 'Ringkasan keuangan, penyaluran, laporan, dan dokumen publik.', href: '/transparansi', category: 'Akuntabilitas' },
  { title: 'Dokumen Publik', description: 'Ruang laporan penyaluran, program, kebijakan, dan tata kelola.', href: '/transparansi#dokumen', category: 'Akuntabilitas' },
  { title: 'Kebijakan Donasi', description: 'Prinsip pencatatan, privasi donatur, dan keamanan transaksi.', href: '/kebijakan-donasi', category: 'Akuntabilitas' },
  { title: 'Cara Mendukung', description: 'Pilihan dukungan, simulasi donasi, dan standar keamanan.', href: '/donasi', category: 'Terlibat' },
  { title: 'Kontak & Kolaborasi', description: 'Kanal untuk pertanyaan program, kemitraan, relawan, media, dan dukungan.', href: '/kontak', category: 'Terlibat' },
  { title: 'Peta Situs', description: 'Direktori seluruh halaman publik Yayasan Ruang Sejahtera.', href: '/peta-situs', category: 'Bantuan' },
  { title: 'Kebijakan Privasi', description: 'Prinsip pengelolaan data pribadi, penerima manfaat, analytics, dan formulir.', href: '/privasi', category: 'Kebijakan' },
  { title: 'Ketentuan Penggunaan', description: 'Ketentuan penggunaan informasi dan layanan website.', href: '/ketentuan', category: 'Kebijakan' },
  { title: 'Aksesibilitas', description: 'Komitmen aksesibilitas dan perbaikan berkelanjutan website.', href: '/aksesibilitas', category: 'Kebijakan' },
  { title: 'Disclaimer', description: 'Batas penggunaan informasi publik pada website yayasan.', href: '/disclaimer', category: 'Kebijakan' },
];
