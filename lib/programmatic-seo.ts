export interface ProgrammaticPageConfig {
  slug: string;
  title: string;
  badge: string;
  heading: string;
  description: string;
  category: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const PROGRAMMATIC_PAGES: Record<string, ProgrammaticPageConfig> = {
  ikn: {
    slug: "ikn",
    title: "Tender IKN & Kalimantan",
    badge: "Fokus Wilayah IKN Nusantara",
    heading: "Radar Pengadaan Lelang IKN Nusantara & Kalimantan 2026",
    description:
      "Daftar lelang LPSE Kementerian PUPR, Otorita IKN, dan BUMN untuk pembangunan infrastruktur ibukota nusantara dan Pulau Kalimantan bernilai ratusan miliar rupiah.",
    region: "IKN & Kalimantan",
    category: "Semua Kluster",
    metaTitle: "Tender IKN & Kalimantan LPSE 2026 Terbaru | RadarTender.id",
    metaDescription:
      "Pantau lelang LPSE IKN Nusantara dan Kalimantan terbaru. Dilengkapi hitung mundur dokumen penawaran dan kalkulator jaminan proyek (Surety Bond/Bank Garansi).",
    keywords: [
      "Tender IKN",
      "Lelang proyek IKN Nusantara",
      "Tender PUPR Kalimantan",
      "Pengadaan OIKN",
      "Surety bond proyek IKN",
      "LPSE Kalimantan Timur",
    ],
  },
  konstruksi: {
    slug: "konstruksi",
    title: "Tender Konstruksi Fisik",
    badge: "Kluster Konstruksi & Fisik",
    heading: "Radar Lelang Pekerjaan Konstruksi & Infrastruktur Nasional",
    description:
      "Pantau ratusan tender proyek fisik gedung, jalan, jembatan, bendungan, dan MEP dari LPSE kementerian, dinas PUPR daerah, dan BUMN konstruksi se-Indonesia.",
    category: "Pekerjaan Konstruksi",
    region: "Semua Wilayah",
    metaTitle: "Tender Konstruksi & Proyek Fisik LPSE PUPR Terbaru | RadarTender.id",
    metaDescription:
      "Katalog tender proyek konstruksi fisik gedung, jalan & infrastruktur LPSE nasional. Simulasi hitung jaminan pelaksanaan dan uang muka express.",
    keywords: [
      "Tender konstruksi",
      "Lelang proyek fisik LPSE",
      "Tender jalan jembatan PUPR",
      "Jaminan pelaksanaan konstruksi",
      "Surety bond kontraktor",
    ],
  },
  "pengadaan-barang": {
    slug: "pengadaan-barang",
    title: "Tender Pengadaan Barang",
    badge: "Kluster Pengadaan Barang & Material",
    heading: "Radar Lelang Pengadaan Barang, Material & Fabrikasi BUMN",
    description:
      "Katalog lelang suplai material, genset, alat berat, peralatan medis, pipa, dan logistik instansi pemerintah dan BUMN bernilai tinggi.",
    category: "Pengadaan Barang",
    region: "Semua Wilayah",
    metaTitle: "Tender Pengadaan Barang & Material LPSE BUMN | RadarTender.id",
    metaDescription:
      "Info lelang pengadaan barang dan suplai material BUMN/LPSE se-Indonesia. Lengkap dengan jadwal batas upload penawaran dan jaminan penawaran.",
    keywords: [
      "Tender pengadaan barang",
      "Lelang material BUMN",
      "Tender suplai alat berat",
      "Jaminan penawaran bid bond",
      "Pengadaan LKPP",
    ],
  },
  "jasa-konsultansi": {
    slug: "jasa-konsultansi",
    title: "Tender Jasa Konsultansi",
    badge: "Kluster Jasa Konsultansi & Perencanaan",
    heading: "Radar Lelang Jasa Konsultansi, DED & Manajemen Proyek",
    description:
      "Peluang pengadaan perencana teknis, konsultan pengawas, studi kelayakan (FS), AMDAL, dan audit sistem dari instansi pemerintah dan BUMN.",
    category: "Jasa Konsultansi",
    region: "Semua Wilayah",
    metaTitle: "Tender Jasa Konsultansi & Perencanaan LPSE | RadarTender.id",
    metaDescription:
      "Daftar lelang konsultan pengawas, perencana DED, dan studi kelayakan proyek kementerian dan BUMN terbaru hari ini.",
    keywords: [
      "Tender jasa konsultansi",
      "Lelang perencana pengawas LPSE",
      "Konsultan DED proyek",
      "Pengadaan jasa konsultansi 2026",
    ],
  },
  "dki-jakarta": {
    slug: "dki-jakarta",
    title: "Tender DKI Jakarta",
    badge: "Fokus Ibukota & Kantor Pusat BUMN",
    heading: "Radar Pengadaan Lelang Pemprov DKI Jakarta & BUMN Pusat",
    description:
      "Pantau lelang LPSE Pemprov DKI Jakarta, BUMD DKI, dan tender kantor pusat BUMN di Jakarta dengan nilai pagu hingga triliunan rupiah.",
    region: "DKI Jakarta",
    category: "Semua Kluster",
    metaTitle: "Tender LPSE DKI Jakarta & BUMN Ibukota | RadarTender.id",
    metaDescription:
      "Akses lelang pengadaan barang & jasa LPSE DKI Jakarta dan BUMN kantor pusat hari ini. Hitung batas waktu dan estimasi penjaminan proyek.",
    keywords: [
      "Tender DKI Jakarta",
      "LPSE DKI Jakarta",
      "Lelang Pemprov Jakarta",
      "Tender BUMN Jakarta",
      "Bank Garansi DKI Jakarta",
    ],
  },
};
