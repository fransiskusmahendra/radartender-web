export interface FAQItem {
  question: string;
  answer: string;
  category: "umum" | "surety" | "langganan";
}

export const FAQ_DATA: FAQItem[] = [
  {
    category: "umum",
    question: "Apa perbedaan RadarTender.id dengan portal LPSE biasa?",
    answer:
      "Portal LPSE resmi mengharuskan kontraktor membuka puluhan website LKPP kementerian dan pemda satu per satu. RadarTender.id mengagregasi ratusan lelang strategis LPSE dan BUMN nasional (HPS > Rp 1 Miliar) ke dalam satu dashboard real-time yang dilengkapi filter provinsi, indikator hitung mundur batas upload dokumen, serta integrasi langsung ke kalkulator Surety Bond dan lembar estimasi PDF formal.",
  },
  {
    category: "surety",
    question: "Berapa kisaran biaya (rate) penerbitan Surety Bond (Jaminan Penawaran / Pelaksanaan)?",
    answer:
      "Rate pasar untuk Jaminan Penawaran (Bid Bond) asuransi umumnya berkisar antara 0,25% - 0,35% dari nilai jaminan dengan batas minimum biaya polis (minimum charge) sekitar Rp 350.000. Untuk Jaminan Pelaksanaan (Performance Bond), berkisar antara 0,35% - 0,60% per tahun. Anda dapat menghitung perkiraan biaya pasti secara instan dan transparan menggunakan Kalkulator Surety Bond di RadarTender.id.",
  },
  {
    category: "surety",
    question: "Apakah instrumen jaminan proyek di RadarTender.id diakui resmi di LPSE & diawasi OJK?",
    answer:
      "Ya, seluruh jaminan proyek (Surety Bond dan Bank Garansi) diproses dan diterbitkan secara sah oleh jaringan Perusahaan Asuransi Umum dan Bank Devisa terkemuka di Indonesia yang terdaftar serta diawasi resmi oleh Otoritas Jasa Keuangan (OJK) dan Bank Indonesia. Dokumen terbit lengkap dengan tanda tangan basah / digital, nomor registrasi verifikasi, serta barcode keabsahan.",
  },
  {
    category: "langganan",
    question: "Bagaimana cara mendapatkan notifikasi lelang harian via WhatsApp?",
    answer:
      "Dengan berlangganan Paket Pro Kontraktor atau VIP, nomor WhatsApp Anda akan otomatis didaftarkan ke bot intelijen RadarTender. Setiap hari kerja pukul 08:30 WIB, Anda akan menerima ringkasan lelang proyek baru yang sesuai dengan wilayah dan kategori tender fokus perusahaan Anda.",
  },
  {
    category: "umum",
    question: "Apakah Draf Lembar Estimasi format PDF bisa digunakan untuk rapat komite tender?",
    answer:
      "Sangat bisa. Fitur 'Draf PDF' kami dirancang khusus mengikuti standar format telaah kelayakan komite lelang pengadaan kontraktor. Dokumen ini memuat identitas paket lelang, kode tender, HPS, persentase nilai jaminan, perkiraan biaya premi, serta checklist kelayakan dokumen pra-kualifikasi yang siap dicetak di kertas A4.",
  },
  {
    category: "surety",
    question: "Bagaimana jika batas waktu upload dokumen lelang tersisa kurang dari 48 jam?",
    answer:
      "RadarTender.id menyediakan jalur asistensi prioritas (Express Line) khusus pengguna PRO & VIP. Tim pendamping kami siap menghubungkan dokumen administrasi Anda ke underwriter rekanan untuk percepatan draft verifikasi (approval) sehingga jaminan penawaran terbit tepat waktu sebelum portal LPSE ditutup.",
  },
];
