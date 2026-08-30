import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import {
  examAnswers,
  examAttempts,
  examQuestions,
  examSettings,
  memberCards,
  users,
  type UserRow,
} from '@/lib/db/schema';

const EXAM_VERSION = 2;
const EXAM_PASSING_SCORE = 75;
const EXAM_DURATION_MINUTES = 120;
const EXAM_MAXIMUM_ATTEMPTS = 2;
const EXAM_RETRY_WINDOW_DAYS = 7;

export const defaultExamQuestions = [
  {
    dimension: 'Kejujuran',
    prompt: 'Anda menemukan kelebihan uang dalam penghitungan bantuan. Apa tindakan yang paling tepat?',
    options: [
      { id: 'a', label: 'Melaporkan dan mengembalikan kelebihan tersebut sesuai prosedur.', score: 2 },
      { id: 'b', label: 'Menyimpannya karena jumlahnya kecil.', score: 0 },
      { id: 'c', label: 'Membaginya kepada teman tanpa pencatatan.', score: 0 },
      { id: 'd', label: 'Menggunakannya untuk kebutuhan pribadi terlebih dahulu.', score: 0 },
    ],
  },
  {
    dimension: 'Ketulusan',
    prompt: 'Apa makna membantu masyarakat dengan tulus?',
    options: [
      { id: 'a', label: 'Membantu dengan hormat tanpa menjadikan penerima sebagai alat untuk mencari pujian.', score: 2 },
      { id: 'b', label: 'Membantu hanya jika kegiatan tersebut diliput.', score: 0 },
      { id: 'c', label: 'Memastikan nama penolong selalu lebih dikenal.', score: 0 },
      { id: 'd', label: 'Memberi bantuan agar penerima merasa berutang budi.', score: 0 },
    ],
  },
  {
    dimension: 'Integritas',
    prompt: 'Jika target kegiatan belum tercapai, apa yang seharusnya dilakukan?',
    options: [
      { id: 'a', label: 'Menyampaikan keadaan sebenarnya dan menyusun perbaikan yang realistis.', score: 2 },
      { id: 'b', label: 'Mengubah angka agar laporan terlihat berhasil.', score: 0 },
      { id: 'c', label: 'Menghapus bagian kegiatan yang belum selesai.', score: 0 },
      { id: 'd', label: 'Menyalahkan penerima manfaat.', score: 0 },
    ],
  },
  {
    dimension: 'Semangat pelayanan',
    prompt: 'Ketika kegiatan sosial berjalan lebih berat dari rencana, sikap yang tepat adalah...',
    options: [
      { id: 'a', label: 'Tetap berusaha, berkoordinasi, dan menyesuaikan cara kerja tanpa mengabaikan mutu.', score: 2 },
      { id: 'b', label: 'Meninggalkan kegiatan tanpa memberi kabar.', score: 0 },
      { id: 'c', label: 'Memaksa cara lama walaupun tidak efektif.', score: 0 },
      { id: 'd', label: 'Menunggu orang lain menyelesaikan semuanya.', score: 0 },
    ],
  },
  {
    dimension: 'Konsistensi',
    prompt: 'Bagaimana cara menjaga kepercayaan masyarakat dalam jangka panjang?',
    options: [
      { id: 'a', label: 'Menepati komitmen, mencatat proses, dan menjaga standar meskipun tidak diawasi.', score: 2 },
      { id: 'b', label: 'Bekerja baik hanya ketika ada penilaian.', score: 0 },
      { id: 'c', label: 'Mengutamakan kegiatan yang mudah difoto.', score: 0 },
      { id: 'd', label: 'Mengganti aturan sesuai kepentingan pribadi.', score: 0 },
    ],
  },
  {
    dimension: 'Empati',
    prompt: 'Saat berbicara dengan penerima bantuan, anggota sebaiknya...',
    options: [
      { id: 'a', label: 'Mendengarkan dengan hormat dan tidak merendahkan kondisi mereka.', score: 2 },
      { id: 'b', label: 'Memotong pembicaraan agar kegiatan cepat selesai.', score: 0 },
      { id: 'c', label: 'Membandingkan mereka dengan penerima lain.', score: 0 },
      { id: 'd', label: 'Menganggap semua kebutuhan pasti sama.', score: 0 },
    ],
  },
  {
    dimension: 'Keadilan',
    prompt: 'Bagaimana menentukan penerima manfaat ketika jumlah bantuan terbatas?',
    options: [
      { id: 'a', label: 'Menggunakan kebutuhan dan data yang dapat dipertanggungjawabkan.', score: 2 },
      { id: 'b', label: 'Mendahulukan kerabat anggota.', score: 0 },
      { id: 'c', label: 'Memilih orang yang paling sering memuji organisasi.', score: 0 },
      { id: 'd', label: 'Membagi secara diam-diam tanpa dasar.', score: 0 },
    ],
  },
  {
    dimension: 'Non-diskriminasi',
    prompt: 'Sikap yang sesuai dalam kegiatan sosial adalah...',
    options: [
      { id: 'a', label: 'Melayani tanpa membedakan agama, suku, gender, pilihan politik, atau latar belakang.', score: 2 },
      { id: 'b', label: 'Mendahulukan kelompok yang memiliki pengaruh.', score: 0 },
      { id: 'c', label: 'Membatasi bantuan berdasarkan kedekatan.', score: 0 },
      { id: 'd', label: 'Menghindari penerima yang berbeda pandangan.', score: 0 },
    ],
  },
  {
    dimension: 'Kerahasiaan',
    prompt: 'Data pribadi penerima manfaat harus...',
    options: [
      { id: 'a', label: 'Disimpan dan digunakan hanya untuk tujuan pelayanan yang sah.', score: 2 },
      { id: 'b', label: 'Dibagikan ke grup umum agar semua tahu.', score: 0 },
      { id: 'c', label: 'Dijadikan bahan candaan internal.', score: 0 },
      { id: 'd', label: 'Dijual kepada pihak yang membutuhkan data.', score: 0 },
    ],
  },
  {
    dimension: 'Persetujuan',
    prompt: 'Sebelum mengunggah foto penerima manfaat ke media sosial, anggota perlu...',
    options: [
      { id: 'a', label: 'Memastikan persetujuan dan kepatutan penggunaan foto.', score: 2 },
      { id: 'b', label: 'Mengunggahnya karena berada di lokasi kegiatan.', score: 0 },
      { id: 'c', label: 'Meminta persetujuan setelah foto menjadi viral.', score: 0 },
      { id: 'd', label: 'Menganggap semua foto kegiatan bebas digunakan.', score: 0 },
    ],
  },
  {
    dimension: 'Perlindungan anak',
    prompt: 'Ketika mendokumentasikan anak dalam kegiatan sosial, anggota harus...',
    options: [
      { id: 'a', label: 'Mengutamakan keselamatan, martabat, dan persetujuan wali yang diperlukan.', score: 2 },
      { id: 'b', label: 'Meminta anak mengulang adegan demi foto yang menarik.', score: 0 },
      { id: 'c', label: 'Menyebutkan data lengkap anak di ruang publik.', score: 0 },
      { id: 'd', label: 'Menggunakan foto anak untuk promosi pribadi.', score: 0 },
    ],
  },
  {
    dimension: 'Akuntabilitas',
    prompt: 'Mengapa setiap penggunaan dana kegiatan perlu dicatat?',
    options: [
      { id: 'a', label: 'Agar penggunaan dana dapat diperiksa dan dipertanggungjawabkan.', score: 2 },
      { id: 'b', label: 'Agar laporan tampak lebih panjang.', score: 0 },
      { id: 'c', label: 'Agar anggota bebas memakai dana.', score: 0 },
      { id: 'd', label: 'Agar penerima tidak dapat bertanya.', score: 0 },
    ],
  },
  {
    dimension: 'Anti-korupsi',
    prompt: 'Pemasok menawarkan hadiah pribadi setelah dipilih dalam kegiatan. Apa tindakan yang tepat?',
    options: [
      { id: 'a', label: 'Menolak atau melaporkannya sesuai kebijakan konflik kepentingan.', score: 2 },
      { id: 'b', label: 'Menerima diam-diam karena bukan uang tunai.', score: 0 },
      { id: 'c', label: 'Menerimanya lalu menyembunyikan dari tim.', score: 0 },
      { id: 'd', label: 'Meminta hadiah yang nilainya lebih besar.', score: 0 },
    ],
  },
  {
    dimension: 'Konflik kepentingan',
    prompt: 'Jika calon pemasok adalah keluarga Anda, yang sebaiknya dilakukan adalah...',
    options: [
      { id: 'a', label: 'Mengungkapkan hubungan tersebut dan tidak memengaruhi keputusan secara pribadi.', score: 2 },
      { id: 'b', label: 'Menyembunyikannya agar proses berjalan cepat.', score: 0 },
      { id: 'c', label: 'Mengarahkan tim memilih keluarga tanpa pembanding.', score: 0 },
      { id: 'd', label: 'Meminta komisi sebagai imbalan.', score: 0 },
    ],
  },
  {
    dimension: 'Transparansi',
    prompt: 'Informasi apa yang paling penting dalam laporan kegiatan?',
    options: [
      { id: 'a', label: 'Tujuan, pelaksanaan, penerima manfaat, penggunaan sumber daya, dan hasil sebenarnya.', score: 2 },
      { id: 'b', label: 'Hanya foto yang terlihat paling baik.', score: 0 },
      { id: 'c', label: 'Nama orang yang paling banyak hadir.', score: 0 },
      { id: 'd', label: 'Cerita yang membuat organisasi tampak sempurna.', score: 0 },
    ],
  },
  {
    dimension: 'Tanggung jawab',
    prompt: 'Jika Anda melakukan kesalahan dalam pendataan, tindakan terbaik adalah...',
    options: [
      { id: 'a', label: 'Segera melapor, memperbaiki data, dan mencatat koreksinya.', score: 2 },
      { id: 'b', label: 'Menghapus bukti kesalahan.', score: 0 },
      { id: 'c', label: 'Menunggu sampai ada yang menemukan.', score: 0 },
      { id: 'd', label: 'Menyalahkan sistem tanpa memeriksa ulang.', score: 0 },
    ],
  },
  {
    dimension: 'Disiplin',
    prompt: 'Mengapa ketepatan waktu penting dalam kegiatan sosial?',
    options: [
      { id: 'a', label: 'Karena waktu penerima manfaat dan tim harus dihormati.', score: 2 },
      { id: 'b', label: 'Karena keterlambatan selalu bisa ditutupi.', score: 0 },
      { id: 'c', label: 'Karena hanya ketua yang boleh terlambat.', score: 0 },
      { id: 'd', label: 'Karena jadwal tidak berhubungan dengan pelayanan.', score: 0 },
    ],
  },
  {
    dimension: 'Kerja sama',
    prompt: 'Ketika terjadi perbedaan pendapat dalam tim, sikap yang paling sehat adalah...',
    options: [
      { id: 'a', label: 'Mendengar alasan, membahas data, dan mencari keputusan terbaik untuk penerima manfaat.', score: 2 },
      { id: 'b', label: 'Memaksakan pendapat anggota paling senior.', score: 0 },
      { id: 'c', label: 'Membawa konflik ke media sosial.', score: 0 },
      { id: 'd', label: 'Menghentikan komunikasi dengan seluruh tim.', score: 0 },
    ],
  },
  {
    dimension: 'Komunikasi',
    prompt: 'Informasi perubahan jadwal kegiatan sebaiknya...',
    options: [
      { id: 'a', label: 'Disampaikan secepat mungkin kepada pihak yang terdampak melalui saluran yang jelas.', score: 2 },
      { id: 'b', label: 'Disimpan agar tidak menimbulkan pertanyaan.', score: 0 },
      { id: 'c', label: 'Disampaikan hanya kepada teman dekat.', score: 0 },
      { id: 'd', label: 'Diumumkan setelah kegiatan selesai.', score: 0 },
    ],
  },
  {
    dimension: 'Kerendahan hati',
    prompt: 'Bagaimana anggota sebaiknya menerima kritik dari masyarakat?',
    options: [
      { id: 'a', label: 'Mendengarkan, memeriksa kebenarannya, dan memperbaiki hal yang memang keliru.', score: 2 },
      { id: 'b', label: 'Menganggap semua kritik sebagai serangan.', score: 0 },
      { id: 'c', label: 'Membalas kritik dengan mempermalukan pengkritik.', score: 0 },
      { id: 'd', label: 'Menghapus semua komentar yang tidak memuji.', score: 0 },
    ],
  },
  {
    dimension: 'Orientasi penerima',
    prompt: 'Ukuran keberhasilan kegiatan sosial yang paling bermakna adalah...',
    options: [
      { id: 'a', label: 'Manfaat nyata dan bermartabat yang diterima masyarakat sesuai kebutuhannya.', score: 2 },
      { id: 'b', label: 'Jumlah unggahan anggota.', score: 0 },
      { id: 'c', label: 'Banyaknya spanduk yang terpasang.', score: 0 },
      { id: 'd', label: 'Seberapa sering organisasi dipuji.', score: 0 },
    ],
  },
  {
    dimension: 'Kepatuhan',
    prompt: 'Jika aturan organisasi terasa merepotkan, anggota sebaiknya...',
    options: [
      { id: 'a', label: 'Mengikuti aturan sambil mengusulkan perbaikan melalui jalur yang tepat.', score: 2 },
      { id: 'b', label: 'Mengabaikannya jika tidak ada pengawas.', score: 0 },
      { id: 'c', label: 'Membuat aturan sendiri untuk kepentingan pribadi.', score: 0 },
      { id: 'd', label: 'Mengajak anggota lain melanggar bersama-sama.', score: 0 },
    ],
  },
  {
    dimension: 'Keamanan',
    prompt: 'Jika menemukan kondisi berbahaya di lokasi kegiatan, Anda harus...',
    options: [
      { id: 'a', label: 'Mengutamakan keselamatan, menghentikan aktivitas berisiko, dan melapor kepada penanggung jawab.', score: 2 },
      { id: 'b', label: 'Tetap melanjutkan agar jadwal tidak berubah.', score: 0 },
      { id: 'c', label: 'Menyembunyikan risiko agar tidak dianggap menghambat.', score: 0 },
      { id: 'd', label: 'Menunggu sampai ada korban.', score: 0 },
    ],
  },
  {
    dimension: 'Batas peran',
    prompt: 'Anggota diminta menjanjikan bantuan di luar kewenangannya. Apa respons yang tepat?',
    options: [
      { id: 'a', label: 'Menjelaskan batas kewenangan dan meneruskan permintaan kepada pihak yang berwenang.', score: 2 },
      { id: 'b', label: 'Menjanjikannya agar masyarakat tidak kecewa.', score: 0 },
      { id: 'c', label: 'Meminta imbalan agar janji diproses.', score: 0 },
      { id: 'd', label: 'Menghindari penerima tanpa memberi penjelasan.', score: 0 },
    ],
  },
  {
    dimension: 'Kemandirian',
    prompt: 'Bantuan sosial yang baik seharusnya...',
    options: [
      { id: 'a', label: 'Menjawab kebutuhan tanpa merendahkan dan, bila mungkin, memperkuat kemandirian penerima.', score: 2 },
      { id: 'b', label: 'Membuat penerima terus bergantung tanpa rencana.', score: 0 },
      { id: 'c', label: 'Diberikan hanya agar dokumentasi terlihat ramai.', score: 0 },
      { id: 'd', label: 'Menggantikan semua keputusan penerima.', score: 0 },
    ],
  },
  {
    dimension: 'Kepedulian',
    prompt: 'Apa yang menunjukkan kepedulian yang matang?',
    options: [
      { id: 'a', label: 'Memahami kebutuhan, hadir dengan hormat, dan menindaklanjuti sesuai kemampuan.', score: 2 },
      { id: 'b', label: 'Memberi nasihat tanpa mendengarkan.', score: 0 },
      { id: 'c', label: 'Membantu hanya orang yang dikenal.', score: 0 },
      { id: 'd', label: 'Menganggap semua masalah selesai setelah foto bersama.', score: 0 },
    ],
  },
  {
    dimension: 'Pengelolaan sumber daya',
    prompt: 'Saat menggunakan kendaraan dan perlengkapan organisasi, anggota harus...',
    options: [
      { id: 'a', label: 'Menggunakannya sesuai tujuan, merawatnya, dan mencatat kerusakan atau biaya yang timbul.', score: 2 },
      { id: 'b', label: 'Memakainya untuk urusan pribadi tanpa izin.', score: 0 },
      { id: 'c', label: 'Membiarkan perlengkapan rusak karena bukan milik pribadi.', score: 0 },
      { id: 'd', label: 'Membawa pulang barang yang tersisa tanpa pencatatan.', score: 0 },
    ],
  },
  {
    dimension: 'Dokumentasi',
    prompt: 'Dokumentasi kegiatan yang baik harus...',
    options: [
      { id: 'a', label: 'Sesuai fakta, memiliki konteks, dan tidak mengeksploitasi penerima manfaat.', score: 2 },
      { id: 'b', label: 'Dibuat dramatis walaupun tidak sesuai keadaan.', score: 0 },
      { id: 'c', label: 'Mengutamakan foto yang membuat penerima tampak lemah.', score: 0 },
      { id: 'd', label: 'Menghilangkan informasi yang tidak menguntungkan.', score: 0 },
    ],
  },
  {
    dimension: 'Media sosial',
    prompt: 'Sebelum membagikan informasi kegiatan di media sosial, anggota perlu...',
    options: [
      { id: 'a', label: 'Memeriksa kebenaran, izin publikasi, dan dampak informasi bagi penerima.', score: 2 },
      { id: 'b', label: 'Membagikannya secepat mungkin agar viral.', score: 0 },
      { id: 'c', label: 'Menambahkan cerita yang belum diverifikasi.', score: 0 },
      { id: 'd', label: 'Menggunakan akun penerima tanpa izin.', score: 0 },
    ],
  },
  {
    dimension: 'Rumor',
    prompt: 'Anda mendengar tuduhan tentang anggota lain. Apa tindakan yang bertanggung jawab?',
    options: [
      { id: 'a', label: 'Tidak menyebarkan rumor dan menggunakan mekanisme pelaporan yang sesuai bila ada dasar.', score: 2 },
      { id: 'b', label: 'Menyebarkannya agar tim waspada.', score: 0 },
      { id: 'c', label: 'Mengunggah tuduhan tanpa bukti.', score: 0 },
      { id: 'd', label: 'Mengancam orang yang dituduh.', score: 0 },
    ],
  },
  {
    dimension: 'Pelaporan',
    prompt: 'Jika melihat dugaan penyalahgunaan bantuan, anggota harus...',
    options: [
      { id: 'a', label: 'Mencatat fakta seperlunya dan melapor melalui jalur yang aman serta resmi.', score: 2 },
      { id: 'b', label: 'Menyelesaikannya dengan kekerasan.', score: 0 },
      { id: 'c', label: 'Membiarkannya demi menjaga nama baik.', score: 0 },
      { id: 'd', label: 'Meminta imbalan agar tidak melapor.', score: 0 },
    ],
  },
  {
    dimension: 'Anti-kekerasan',
    prompt: 'Dalam kegiatan sosial, kekerasan verbal maupun fisik...',
    options: [
      { id: 'a', label: 'Tidak dapat dibenarkan dan harus dicegah serta dilaporkan.', score: 2 },
      { id: 'b', label: 'Boleh dilakukan jika kegiatan sedang sibuk.', score: 0 },
      { id: 'c', label: 'Wajar untuk mendisiplinkan penerima.', score: 0 },
      { id: 'd', label: 'Boleh jika tidak direkam.', score: 0 },
    ],
  },
  {
    dimension: 'Martabat',
    prompt: 'Mengapa penerima manfaat tidak boleh diperlakukan sebagai objek konten?',
    options: [
      { id: 'a', label: 'Karena mereka memiliki martabat, hak, dan suara yang harus dihormati.', score: 2 },
      { id: 'b', label: 'Karena konten hanya boleh memuat pengurus.', score: 0 },
      { id: 'c', label: 'Karena semua dokumentasi pasti salah.', score: 0 },
      { id: 'd', label: 'Karena penerima tidak boleh berbicara.', score: 0 },
    ],
  },
  {
    dimension: 'Kebebasan',
    prompt: 'Penerima bantuan menolak difoto. Anggota sebaiknya...',
    options: [
      { id: 'a', label: 'Menghormati penolakan tanpa mengurangi haknya atas pelayanan.', score: 2 },
      { id: 'b', label: 'Mengambil foto secara diam-diam.', score: 0 },
      { id: 'c', label: 'Menunda bantuan sampai ia setuju.', score: 0 },
      { id: 'd', label: 'Meminta orang lain membujuknya dengan tekanan.', score: 0 },
    ],
  },
  {
    dimension: 'Kualitas layanan',
    prompt: 'Jika kualitas bantuan tidak sesuai dengan yang dijanjikan, anggota harus...',
    options: [
      { id: 'a', label: 'Mengakui masalah, melaporkan, dan mengupayakan penyelesaian.', score: 2 },
      { id: 'b', label: 'Menyuruh penerima menerima saja.', score: 0 },
      { id: 'c', label: 'Menghapus catatan distribusi.', score: 0 },
      { id: 'd', label: 'Menyalahkan penerima karena tidak bersyukur.', score: 0 },
    ],
  },
  {
    dimension: 'Ketepatan data',
    prompt: 'Mengapa data penerima perlu diperbarui ketika keadaan berubah?',
    options: [
      { id: 'a', label: 'Agar keputusan bantuan tetap sesuai kebutuhan dan tidak menimbulkan ketidakadilan.', score: 2 },
      { id: 'b', label: 'Agar jumlah penerima selalu terlihat besar.', score: 0 },
      { id: 'c', label: 'Agar data lama dapat dijual.', score: 0 },
      { id: 'd', label: 'Agar anggota tidak perlu melakukan verifikasi.', score: 0 },
    ],
  },
  {
    dimension: 'Objektivitas',
    prompt: 'Dalam menilai kebutuhan penerima, anggota sebaiknya menghindari...',
    options: [
      { id: 'a', label: 'Prasangka, favoritisme, dan keputusan yang tidak berbasis informasi.', score: 2 },
      { id: 'b', label: 'Pemeriksaan lapangan.', score: 0 },
      { id: 'c', label: 'Konsultasi dengan tim.', score: 0 },
      { id: 'd', label: 'Pencatatan hasil asesmen.', score: 0 },
    ],
  },
  {
    dimension: 'Profesionalitas',
    prompt: 'Sikap profesional anggota terlihat dari...',
    options: [
      { id: 'a', label: 'Menjalankan tugas dengan kompeten, sopan, dapat diandalkan, dan sesuai prosedur.', score: 2 },
      { id: 'b', label: 'Berbicara keras agar ditakuti.', score: 0 },
      { id: 'c', label: 'Menghindari tugas yang sulit.', score: 0 },
      { id: 'd', label: 'Mengutamakan hubungan pribadi.', score: 0 },
    ],
  },
  {
    dimension: 'Belajar',
    prompt: 'Jika belum memahami tugas, anggota yang baik akan...',
    options: [
      { id: 'a', label: 'Bertanya, belajar, dan meminta arahan sebelum bertindak.', score: 2 },
      { id: 'b', label: 'Berpura-pura paham agar tidak malu.', score: 0 },
      { id: 'c', label: 'Menyalin pekerjaan tanpa memahami.', score: 0 },
      { id: 'd', label: 'Menyalahkan instruksi.', score: 0 },
    ],
  },
  {
    dimension: 'Evaluasi',
    prompt: 'Apa tujuan evaluasi setelah kegiatan?',
    options: [
      { id: 'a', label: 'Mengetahui hasil, kekurangan, dan perbaikan untuk kegiatan berikutnya.', score: 2 },
      { id: 'b', label: 'Mencari orang untuk disalahkan.', score: 0 },
      { id: 'c', label: 'Membuat laporan terlihat sempurna.', score: 0 },
      { id: 'd', label: 'Menghindari pertanyaan masyarakat.', score: 0 },
    ],
  },
  {
    dimension: 'Keberlanjutan',
    prompt: 'Program sosial yang berkelanjutan perlu...',
    options: [
      { id: 'a', label: 'Mempertimbangkan kebutuhan jangka panjang, kapasitas lokal, dan dampak lingkungan.', score: 2 },
      { id: 'b', label: 'Hanya mengejar kegiatan yang paling ramai.', score: 0 },
      { id: 'c', label: 'Mengabaikan pemeliharaan setelah bantuan diberikan.', score: 0 },
      { id: 'd', label: 'Mengganti kebutuhan warga dengan agenda pribadi.', score: 0 },
    ],
  },
  {
    dimension: 'Partisipasi',
    prompt: 'Mengapa masyarakat perlu dilibatkan dalam merancang kegiatan?',
    options: [
      { id: 'a', label: 'Agar program sesuai kebutuhan dan masyarakat memiliki ruang untuk berpartisipasi.', score: 2 },
      { id: 'b', label: 'Agar tanggung jawab organisasi dapat dialihkan.', score: 0 },
      { id: 'c', label: 'Agar keputusan tidak perlu dicatat.', score: 0 },
      { id: 'd', label: 'Agar kegiatan terlihat lebih ramai.', score: 0 },
    ],
  },
  {
    dimension: 'Kemandirian tim',
    prompt: 'Jika ketua tidak hadir, anggota sebaiknya...',
    options: [
      { id: 'a', label: 'Mengikuti mandat dan prosedur yang ada, lalu melaporkan hasilnya.', score: 2 },
      { id: 'b', label: 'Menghentikan semua pekerjaan tanpa alasan.', score: 0 },
      { id: 'c', label: 'Mengambil keputusan apa pun tanpa koordinasi.', score: 0 },
      { id: 'd', label: 'Menunggu instruksi untuk hal yang sudah jelas.', score: 0 },
    ],
  },
  {
    dimension: 'Ketahanan',
    prompt: 'Bagaimana menghadapi hasil kegiatan yang belum sesuai harapan?',
    options: [
      { id: 'a', label: 'Mengevaluasi dengan jujur, belajar dari pengalaman, dan memperbaiki langkah.', score: 2 },
      { id: 'b', label: 'Menutupi hasil agar tidak terlihat gagal.', score: 0 },
      { id: 'c', label: 'Berhenti membantu selamanya.', score: 0 },
      { id: 'd', label: 'Menolak semua masukan.', score: 0 },
    ],
  },
  {
    dimension: 'Kesetaraan',
    prompt: 'Dalam pembagian tugas, prinsip yang tepat adalah...',
    options: [
      { id: 'a', label: 'Mempertimbangkan kemampuan, beban kerja, keselamatan, dan kesempatan yang adil.', score: 2 },
      { id: 'b', label: 'Memberi semua tugas berat kepada anggota baru.', score: 0 },
      { id: 'c', label: 'Memilih tugas berdasarkan kedekatan.', score: 0 },
      { id: 'd', label: 'Mengabaikan keterbatasan fisik anggota.', score: 0 },
    ],
  },
  {
    dimension: 'Batas pribadi',
    prompt: 'Jika penerima meminta bantuan pribadi di luar program, anggota sebaiknya...',
    options: [
      { id: 'a', label: 'Menjelaskan batas peran dan mengarahkan ke saluran bantuan yang tepat.', score: 2 },
      { id: 'b', label: 'Memanfaatkan ketergantungan penerima.', score: 0 },
      { id: 'c', label: 'Memberi janji tanpa kemampuan.', score: 0 },
      { id: 'd', label: 'Meminta imbalan pribadi.', score: 0 },
    ],
  },
  {
    dimension: 'Keamanan digital',
    prompt: 'Kata sandi dan akses akun organisasi seharusnya...',
    options: [
      { id: 'a', label: 'Dijaga, tidak dibagikan sembarangan, dan digunakan sesuai kewenangan.', score: 2 },
      { id: 'b', label: 'Dikirim melalui grup umum.', score: 0 },
      { id: 'c', label: 'Dipakai bersama tanpa pencatatan.', score: 0 },
      { id: 'd', label: 'Ditulis di ruang publik agar mudah ditemukan.', score: 0 },
    ],
  },
  {
    dimension: 'Informasi publik',
    prompt: 'Jika belum yakin sebuah informasi benar, anggota harus...',
    options: [
      { id: 'a', label: 'Menunda publikasi dan memeriksa sumbernya terlebih dahulu.', score: 2 },
      { id: 'b', label: 'Menyebarkannya dengan tulisan “katanya”.', score: 0 },
      { id: 'c', label: 'Menambahkan angka agar lebih meyakinkan.', score: 0 },
      { id: 'd', label: 'Meminta penerima membuktikan bahwa informasi itu salah.', score: 0 },
    ],
  },
  {
    dimension: 'Netralitas',
    prompt: 'Dalam kegiatan yayasan, anggota tidak boleh...',
    options: [
      { id: 'a', label: 'Memanfaatkan bantuan atau kegiatan untuk kampanye politik pribadi.', score: 2 },
      { id: 'b', label: 'Mencatat kebutuhan masyarakat.', score: 0 },
      { id: 'c', label: 'Berkoordinasi dengan perangkat desa.', score: 0 },
      { id: 'd', label: 'Mengikuti prosedur organisasi.', score: 0 },
    ],
  },
  {
    dimension: 'Kepercayaan',
    prompt: 'Kepercayaan masyarakat paling mudah rusak ketika anggota...',
    options: [
      { id: 'a', label: 'Tidak jujur, ingkar janji, menyalahgunakan wewenang, atau menutup-nutupi kesalahan.', score: 2 },
      { id: 'b', label: 'Meminta arahan kepada koordinator.', score: 0 },
      { id: 'c', label: 'Menyusun laporan kegiatan.', score: 0 },
      { id: 'd', label: 'Mengakui keterbatasan program.', score: 0 },
    ],
  },
  {
    dimension: 'Kepemimpinan',
    prompt: 'Pemimpin kegiatan sosial yang baik seharusnya...',
    options: [
      { id: 'a', label: 'Memberi teladan, mendengar tim, mengambil tanggung jawab, dan melindungi penerima manfaat.', score: 2 },
      { id: 'b', label: 'Mengambil semua pujian dan menghindari kesalahan.', score: 0 },
      { id: 'c', label: 'Membuat anggota takut bertanya.', score: 0 },
      { id: 'd', label: 'Menyerahkan keputusan sulit kepada penerima.', score: 0 },
    ],
  },
  {
    dimension: 'Keselamatan penerima',
    prompt: 'Jika kegiatan berpotensi mempermalukan penerima, anggota harus...',
    options: [
      { id: 'a', label: 'Mengubah cara pelaksanaan agar bantuan tetap bermartabat dan aman.', score: 2 },
      { id: 'b', label: 'Tetap melakukannya karena sudah direncanakan.', score: 0 },
      { id: 'c', label: 'Meminta penerima menahan rasa malu.', score: 0 },
      { id: 'd', label: 'Menganggap dokumentasi lebih penting.', score: 0 },
    ],
  },
  {
    dimension: 'Kecermatan',
    prompt: 'Sebelum menyerahkan bantuan, anggota perlu...',
    options: [
      { id: 'a', label: 'Memeriksa jenis, jumlah, penerima, dan bukti serah terima dengan cermat.', score: 2 },
      { id: 'b', label: 'Menyerahkan tanpa menghitung agar cepat.', score: 0 },
      { id: 'c', label: 'Mengandalkan ingatan saja.', score: 0 },
      { id: 'd', label: 'Mengubah jumlah setelah kegiatan.', score: 0 },
    ],
  },
  {
    dimension: 'Responsif',
    prompt: 'Ketika kebutuhan darurat muncul di lapangan, anggota sebaiknya...',
    options: [
      { id: 'a', label: 'Menilai keadaan, mengutamakan keselamatan, dan segera berkoordinasi untuk respons yang tepat.', score: 2 },
      { id: 'b', label: 'Menunggu masalah membesar.', score: 0 },
      { id: 'c', label: 'Membuat janji tanpa menghitung kemampuan.', score: 0 },
      { id: 'd', label: 'Menyebarkan foto sebelum bertindak.', score: 0 },
    ],
  },
  {
    dimension: 'Keadaban',
    prompt: 'Saat berkomunikasi dengan warga yang marah, anggota perlu...',
    options: [
      { id: 'a', label: 'Tetap tenang, menghormati, mendengar pokok masalah, dan memberi penjelasan yang benar.', score: 2 },
      { id: 'b', label: 'Membalas dengan nada lebih keras.', score: 0 },
      { id: 'c', label: 'Merekam untuk mempermalukannya.', score: 0 },
      { id: 'd', label: 'Mengancam menghentikan pelayanan.', score: 0 },
    ],
  },
  {
    dimension: 'Komitmen',
    prompt: 'Komitmen sebagai anggota paling tepat diwujudkan dengan...',
    options: [
      { id: 'a', label: 'Hadir, menyelesaikan tanggung jawab, dan memberi kabar jika mengalami kendala.', score: 2 },
      { id: 'b', label: 'Muncul hanya ketika ada penghargaan.', score: 0 },
      { id: 'c', label: 'Mengambil tugas sebanyak-banyaknya lalu meninggalkannya.', score: 0 },
      { id: 'd', label: 'Mengandalkan anggota lain tanpa koordinasi.', score: 0 },
    ],
  },
  {
    dimension: 'Keaslian',
    prompt: 'Dalam membuat berita kegiatan, anggota harus...',
    options: [
      { id: 'a', label: 'Menulis berdasarkan kejadian dan sumber yang benar, tanpa mengarang kutipan atau angka.', score: 2 },
      { id: 'b', label: 'Menambahkan cerita agar lebih menarik.', score: 0 },
      { id: 'c', label: 'Menyalin berita orang lain tanpa sumber.', score: 0 },
      { id: 'd', label: 'Mengubah tanggal agar sesuai jadwal publikasi.', score: 0 },
    ],
  },
  {
    dimension: 'Koreksi',
    prompt: 'Jika berita yang sudah dikirim ternyata memiliki kesalahan fakta, anggota harus...',
    options: [
      { id: 'a', label: 'Segera memberi tahu pengelola dan mengirim koreksi yang jelas.', score: 2 },
      { id: 'b', label: 'Membiarkannya selama belum ada yang protes.', score: 0 },
      { id: 'c', label: 'Menghapus sumber informasi.', score: 0 },
      { id: 'd', label: 'Menyalahkan editor sepenuhnya.', score: 0 },
    ],
  },
  {
    dimension: 'Kapasitas diri',
    prompt: 'Menjaga kondisi diri saat menjadi relawan penting karena...',
    options: [
      { id: 'a', label: 'Relawan yang sehat dan sadar batas dapat melayani dengan lebih aman dan konsisten.', score: 2 },
      { id: 'b', label: 'Relawan tidak boleh pernah beristirahat.', score: 0 },
      { id: 'c', label: 'Kelelahan selalu menunjukkan ketulusan.', score: 0 },
      { id: 'd', label: 'Masalah kesehatan harus disembunyikan.', score: 0 },
    ],
  },
  {
    dimension: 'Keteguhan moral',
    prompt: 'Jika teman dekat meminta perlakuan khusus dalam penyaluran, Anda sebaiknya...',
    options: [
      { id: 'a', label: 'Menjelaskan kriteria yang berlaku dan tetap menggunakan proses yang adil.', score: 2 },
      { id: 'b', label: 'Mendahulukannya karena hubungan pertemanan.', score: 0 },
      { id: 'c', label: 'Menyembunyikan bantuan dari penerima lain.', score: 0 },
      { id: 'd', label: 'Meminta imbalan untuk membantu.', score: 0 },
    ],
  },
  {
    dimension: 'Tata kelola',
    prompt: 'Mengapa keputusan penting perlu melalui koordinasi?',
    options: [
      { id: 'a', label: 'Agar keputusan memiliki pertimbangan yang cukup, pembagian tanggung jawab jelas, dan risiko dapat dikendalikan.', score: 2 },
      { id: 'b', label: 'Agar anggota tidak perlu berpikir.', score: 0 },
      { id: 'c', label: 'Agar keputusan dapat ditunda tanpa alasan.', score: 0 },
      { id: 'd', label: 'Agar hanya orang tertentu yang mengetahui keadaan.', score: 0 },
    ],
  },
  {
    dimension: 'Keberanian',
    prompt: 'Keberanian dalam kegiatan sosial berarti...',
    options: [
      { id: 'a', label: 'Berani menyampaikan kebenaran dan melindungi yang rentan meskipun tidak nyaman.', score: 2 },
      { id: 'b', label: 'Berani mengambil risiko tanpa perhitungan.', score: 0 },
      { id: 'c', label: 'Berani membalas kritik dengan agresif.', score: 0 },
      { id: 'd', label: 'Berani melanggar aturan demi hasil cepat.', score: 0 },
    ],
  },
  {
    dimension: 'Ketulusan pelayanan',
    prompt: 'Jika tidak mendapat penghargaan atas pekerjaan sosial, anggota yang baik akan...',
    options: [
      { id: 'a', label: 'Tetap menjaga mutu pelayanan karena tujuan utamanya adalah manfaat bagi masyarakat.', score: 2 },
      { id: 'b', label: 'Mengurangi kualitas pekerjaan secara diam-diam.', score: 0 },
      { id: 'c', label: 'Meminta penerima memuji secara terbuka.', score: 0 },
      { id: 'd', label: 'Menghentikan semua tanggung jawab tanpa pemberitahuan.', score: 0 },
    ],
  },
  {
    dimension: 'Keadilan prosedural',
    prompt: 'Jika dua penerima memiliki kebutuhan yang sama, keputusan yang tepat adalah...',
    options: [
      { id: 'a', label: 'Menggunakan kriteria yang sama dan menjelaskan prosesnya secara wajar.', score: 2 },
      { id: 'b', label: 'Memilih yang lebih dekat dengan pengurus.', score: 0 },
      { id: 'c', label: 'Memilih yang lebih terkenal.', score: 0 },
      { id: 'd', label: 'Mengundi tanpa mempertimbangkan aturan.', score: 0 },
    ],
  },
  {
    dimension: 'Kepercayaan data',
    prompt: 'Mengapa anggota tidak boleh mengisi data kegiatan berdasarkan perkiraan?',
    options: [
      { id: 'a', label: 'Karena data yang tidak akurat dapat menyesatkan keputusan dan merugikan masyarakat.', score: 2 },
      { id: 'b', label: 'Karena semua perkiraan pasti melanggar hukum.', score: 0 },
      { id: 'c', label: 'Karena data hanya diperlukan untuk desain.', score: 0 },
      { id: 'd', label: 'Karena laporan tidak boleh memiliki angka.', score: 0 },
    ],
  },
  {
    dimension: 'Amanah',
    prompt: 'Amanah dalam kegiatan sosial berarti...',
    options: [
      { id: 'a', label: 'Menjaga titipan sumber daya, menjalankan tugas, dan mempertanggungjawabkan hasilnya.', score: 2 },
      { id: 'b', label: 'Menggunakan sumber daya selama tidak ketahuan.', score: 0 },
      { id: 'c', label: 'Mendahulukan kepentingan pribadi.', score: 0 },
      { id: 'd', label: 'Menolak semua bentuk evaluasi.', score: 0 },
    ],
  },
  {
    dimension: 'Kepedulian lingkungan',
    prompt: 'Dalam kegiatan lapangan, anggota sebaiknya...',
    options: [
      { id: 'a', label: 'Mengurangi sampah, menggunakan sumber daya secara bijak, dan menjaga lokasi kegiatan.', score: 2 },
      { id: 'b', label: 'Meninggalkan sampah karena bukan rumah sendiri.', score: 0 },
      { id: 'c', label: 'Menggunakan perlengkapan sekali pakai tanpa pertimbangan.', score: 0 },
      { id: 'd', label: 'Menganggap dampak lingkungan tidak berhubungan dengan kegiatan sosial.', score: 0 },
    ],
  },
  {
    dimension: 'Keterbukaan',
    prompt: 'Ketika masyarakat meminta penjelasan tentang program, anggota harus...',
    options: [
      { id: 'a', label: 'Memberi informasi yang benar sesuai kewenangan atau mengarahkan ke pihak yang tepat.', score: 2 },
      { id: 'b', label: 'Menghindari semua pertanyaan.', score: 0 },
      { id: 'c', label: 'Memberi jawaban yang menyenangkan walau tidak benar.', score: 0 },
      { id: 'd', label: 'Meminta masyarakat mencari sendiri.', score: 0 },
    ],
  },
  {
    dimension: 'Perbaikan',
    prompt: 'Sikap yang paling penting setelah menerima laporan masalah adalah...',
    options: [
      { id: 'a', label: 'Memastikan laporan diterima, memeriksa fakta, dan menindaklanjuti sesuai tingkat urgensinya.', score: 2 },
      { id: 'b', label: 'Menganggap laporan sebagai gangguan.', score: 0 },
      { id: 'c', label: 'Menghapus laporan agar tidak menumpuk.', score: 0 },
      { id: 'd', label: 'Menyebarkan identitas pelapor.', score: 0 },
    ],
  },
  {
    dimension: 'Etika relawan',
    prompt: 'Relawan seharusnya tidak menggunakan hubungan dengan penerima untuk...',
    options: [
      { id: 'a', label: 'Meminta uang, layanan pribadi, dukungan politik, atau keuntungan lain.', score: 2 },
      { id: 'b', label: 'Memahami kebutuhan pelayanan.', score: 0 },
      { id: 'c', label: 'Menyampaikan informasi program.', score: 0 },
      { id: 'd', label: 'Menghubungkan penerima dengan layanan yang tepat.', score: 0 },
    ],
  },
  {
    dimension: 'Keamanan laporan',
    prompt: 'Identitas pelapor dugaan pelanggaran sebaiknya...',
    options: [
      { id: 'a', label: 'Dilindungi dan hanya dibuka kepada pihak yang memiliki kebutuhan kewenangan.', score: 2 },
      { id: 'b', label: 'Diumumkan agar menjadi pelajaran.', score: 0 },
      { id: 'c', label: 'Dibagikan kepada pihak yang dituduh.', score: 0 },
      { id: 'd', label: 'Dipakai untuk menekan pelapor.', score: 0 },
    ],
  },
  {
    dimension: 'Keteladanan',
    prompt: 'Anggota yang melihat pelanggaran aturan oleh senior sebaiknya...',
    options: [
      { id: 'a', label: 'Menggunakan jalur pelaporan yang tersedia tanpa membenarkan pelanggaran.', score: 2 },
      { id: 'b', label: 'Diam karena pelakunya lebih senior.', score: 0 },
      { id: 'c', label: 'Membalas dengan pelanggaran lain.', score: 0 },
      { id: 'd', label: 'Menyebarkannya sebagai gosip.', score: 0 },
    ],
  },
  {
    dimension: 'Tujuan sosial',
    prompt: 'Dalam setiap keputusan kegiatan, pertanyaan utama yang perlu diajukan adalah...',
    options: [
      { id: 'a', label: 'Apakah keputusan ini benar-benar bermanfaat, aman, adil, dan bermartabat bagi masyarakat?', score: 2 },
      { id: 'b', label: 'Apakah keputusan ini membuat anggota terlihat hebat?', score: 0 },
      { id: 'c', label: 'Apakah keputusan ini paling cepat viral?', score: 0 },
      { id: 'd', label: 'Apakah keputusan ini menguntungkan kelompok sendiri?', score: 0 },
    ],
  },
] as const;

export type ActiveExam = {
  settings: typeof examSettings.$inferSelect;
  questions: Array<typeof examQuestions.$inferSelect>;
};

export type MemberExamState = ActiveExam & {
  attempt: typeof examAttempts.$inferSelect;
};

function seededValue(seed: string) {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function shuffle<T>(values: T[], seed: string) {
  const result = [...values];
  let state = seededValue(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = Math.imul(state ^ (state >>> 13), 16777619) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function getQuestionsForAttempt(questions: Array<typeof examQuestions.$inferSelect>, attemptId: string) {
  return shuffle(questions, attemptId).map((question) => ({
    ...question,
    options: shuffle(question.options, `${attemptId}:${question.id}`),
  }));
}

async function getOrCreateVersionTwo(createdBy: string) {
  const db = getDb();
  let settings = (await db.select().from(examSettings).where(eq(examSettings.version, EXAM_VERSION)).limit(1))[0];

  if (!settings) {
    settings = (await db.insert(examSettings).values({
      version: EXAM_VERSION,
      passingScore: EXAM_PASSING_SCORE,
      durationMinutes: EXAM_DURATION_MINUTES,
      maximumAttempts: EXAM_MAXIMUM_ATTEMPTS,
      retryDelayDays: EXAM_RETRY_WINDOW_DAYS,
      isActive: true,
      createdBy,
    }).returning())[0];
  }

  if (!settings) throw new Error('EXAM_SETTINGS_CREATE_FAILED');

  await db.update(examSettings).set({ isActive: false }).where(eq(examSettings.isActive, true));
  const refreshed = (await db.update(examSettings).set({
    passingScore: EXAM_PASSING_SCORE,
    durationMinutes: EXAM_DURATION_MINUTES,
    maximumAttempts: EXAM_MAXIMUM_ATTEMPTS,
    retryDelayDays: EXAM_RETRY_WINDOW_DAYS,
    isActive: true,
    updatedAt: new Date(),
  }).where(eq(examSettings.id, settings.id)).returning())[0];
  settings = refreshed || settings;

  let questions = await db.select().from(examQuestions)
    .where(and(eq(examQuestions.settingsId, settings.id), eq(examQuestions.isActive, true)))
    .orderBy(examQuestions.displayOrder);

  if (questions.length < defaultExamQuestions.length) {
    const existingPrompts = new Set(questions.map((question) => question.prompt));
    const nextOrder = questions.reduce((highest, question) => Math.max(highest, question.displayOrder), 0);
    const missing = defaultExamQuestions.filter((question) => !existingPrompts.has(question.prompt));
    if (missing.length) {
      await db.insert(examQuestions).values(missing.map((question, index) => ({
        settingsId: settings.id,
        dimension: question.dimension,
        prompt: question.prompt,
        options: [...question.options],
        displayOrder: nextOrder + index + 1,
        isActive: true,
      })));
      questions = await db.select().from(examQuestions)
        .where(and(eq(examQuestions.settingsId, settings.id), eq(examQuestions.isActive, true)))
        .orderBy(examQuestions.displayOrder);
    }
  }

  return { settings, questions };
}

export async function getActiveExam(createdBy: string): Promise<ActiveExam> {
  return getOrCreateVersionTwo(createdBy);
}

export async function countWeeklyExamAttempts(userId: string) {
  const since = Date.now() - EXAM_RETRY_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const attempts = await getDb().select().from(examAttempts).where(eq(examAttempts.userId, userId));
  return attempts.filter((attempt) => attempt.createdAt.getTime() >= since).length;
}

export async function getOrCreateExamAttempt(userId: string): Promise<MemberExamState> {
  const db = getDb();
  const exam = await getActiveExam(userId);
  const attempts = await db.select().from(examAttempts)
    .where(eq(examAttempts.userId, userId))
    .orderBy(desc(examAttempts.createdAt));

  const now = Date.now();
  const active = attempts.find((attempt) => attempt.status === 'in_progress');
  if (active && active.startedAt.getTime() + exam.settings.durationMinutes * 60 * 1000 > now) {
    return { ...exam, attempt: active };
  }
  if (active) {
    await db.update(examAttempts).set({ status: 'invalidated', updatedAt: new Date() }).where(eq(examAttempts.id, active.id));
  }

  const since = now - EXAM_RETRY_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const recentAttempts = attempts.filter((attempt) => attempt.createdAt.getTime() >= since);
  if (recentAttempts.length >= EXAM_MAXIMUM_ATTEMPTS) throw new Error('EXAM_WEEKLY_LIMIT');

  const attemptNumber = attempts.reduce((highest, attempt) => Math.max(highest, attempt.attemptNumber), 0) + 1;
  const inserted = (await db.insert(examAttempts).values({
    userId,
    settingsId: exam.settings.id,
    attemptNumber,
    status: 'in_progress',
  }).returning())[0];
  if (!inserted) throw new Error('EXAM_ATTEMPT_CREATE_FAILED');
  return { ...exam, attempt: inserted };
}

export async function getLatestExamAttempt(userId: string) {
  const rows = await getDb().select().from(examAttempts)
    .where(eq(examAttempts.userId, userId))
    .orderBy(desc(examAttempts.createdAt))
    .limit(1);
  return rows[0] || null;
}

export async function hasPassedExam(userId: string) {
  const rows = await getDb().select({ id: examAttempts.id })
    .from(examAttempts)
    .where(and(eq(examAttempts.userId, userId), eq(examAttempts.passed, true)))
    .limit(1);
  return Boolean(rows[0]);
}

export async function getMemberCard(userId: string) {
  const rows = await getDb().select().from(memberCards).where(eq(memberCards.userId, userId)).limit(1);
  return rows[0] || null;
}

export async function issueMemberCard(userId: string) {
  const existing = await getMemberCard(userId);
  if (existing) return existing;

  const suffix = randomBytes(3).toString('hex').toUpperCase();
  const memberNumber = `RS-${new Date().getFullYear()}-${suffix}`;
  const verificationTokenHash = createHash('sha256').update(randomUUID()).digest('hex');
  const inserted = await getDb().insert(memberCards).values({
    userId,
    memberNumber,
    verificationTokenHash,
    joinedAt: new Date().toISOString().slice(0, 10),
    status: 'active',
    issuedBy: userId,
  }).returning();
  return inserted[0];
}

export async function submitMembershipExam(input: {
  userId: string;
  attemptId: string;
  answers: Record<string, string>;
}) {
  const db = getDb();
  const attemptRows = await db.select().from(examAttempts)
    .where(and(eq(examAttempts.id, input.attemptId), eq(examAttempts.userId, input.userId)))
    .limit(1);
  const attempt = attemptRows[0];
  if (!attempt) throw new Error('EXAM_ATTEMPT_NOT_FOUND');
  if (attempt.status !== 'in_progress') throw new Error('EXAM_ATTEMPT_CLOSED');

  const settingsRows = await db.select().from(examSettings).where(eq(examSettings.id, attempt.settingsId)).limit(1);
  const settings = settingsRows[0];
  if (!settings) throw new Error('EXAM_SETTINGS_NOT_FOUND');
  const questions = await db.select().from(examQuestions)
    .where(and(eq(examQuestions.settingsId, settings.id), eq(examQuestions.isActive, true)))
    .orderBy(examQuestions.displayOrder);

  if (attempt.startedAt.getTime() + settings.durationMinutes * 60 * 1000 <= Date.now()) {
    await db.update(examAttempts).set({ status: 'invalidated', updatedAt: new Date() }).where(eq(examAttempts.id, attempt.id));
    throw new Error('EXAM_TIME_EXPIRED');
  }

  const shuffledQuestions = getQuestionsForAttempt(questions, attempt.id);
  const answerRows = shuffledQuestions.map((question) => {
    const selectedOptionId = input.answers[question.id];
    const selected = question.options.find((option) => option.id === selectedOptionId);
    if (!selected) throw new Error('EXAM_INCOMPLETE');
    return { questionId: question.id, selectedOptionId, awardedScore: selected.score };
  });
  const automaticScore = answerRows.reduce((total, answer) => total + answer.awardedScore, 0);
  const passed = automaticScore >= settings.passingScore;
  const submittedAt = new Date();

  await db.update(examAttempts).set({
    status: 'submitted',
    automaticScore,
    finalScore: automaticScore,
    passed,
    submittedAt,
    gradedAt: submittedAt,
    updatedAt: submittedAt,
  }).where(eq(examAttempts.id, attempt.id));

  await db.insert(examAnswers).values(answerRows.map((answer) => ({
    attemptId: attempt.id,
    questionId: answer.questionId,
    selectedOptionId: answer.selectedOptionId,
    awardedScore: answer.awardedScore,
  })));

  if (passed) {
    await db.update(users).set({ membershipStatus: 'passed', updatedAt: new Date() }).where(eq(users.id, input.userId));
    await issueMemberCard(input.userId);
  } else {
    await db.update(users).set({ membershipStatus: 'failed', updatedAt: new Date() }).where(eq(users.id, input.userId));
  }

  return { attempt, passed, score: automaticScore, passingScore: settings.passingScore };
}

export const examRules = {
  passingScore: EXAM_PASSING_SCORE,
  durationMinutes: EXAM_DURATION_MINUTES,
  maximumAttempts: EXAM_MAXIMUM_ATTEMPTS,
  retryWindowDays: EXAM_RETRY_WINDOW_DAYS,
  pointsPerQuestion: 2,
  questionCount: defaultExamQuestions.length,
};
