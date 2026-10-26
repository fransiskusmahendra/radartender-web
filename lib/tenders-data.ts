/**
 * RadarTender.id — Procurement Intelligence & Surety Bond Calculation Engine
 */

export interface TenderItem {
  id: string;
  tender_code: string;
  title: string;
  agency_name: string;
  procurement_type: "Pekerjaan Konstruksi" | "Pengadaan Barang" | "Jasa Konsultansi" | "Jasa Lainnya";
  hps_value: number;
  pagu_value: number;
  current_stage: string;
  deadline_days: number; // Days from today
  location: string;
  lpse_source: string;
  source_url: string;
  registration_url?: string;
  pic_contact?: string; // Kontak Pokja / Panitia / Helpdesk LPSE
  surety_opportunity: boolean;
}

export function formatRupiah(val: number): string {
  if (val >= 1_000_000_000_000) {
    return `Rp ${(val / 1_000_000_000_000).toFixed(2)} Triliun`;
  } else if (val >= 1_000_000_000) {
    return `Rp ${(val / 1_000_000_000).toFixed(1)} Miliar`;
  } else if (val >= 1_000_000) {
    return `Rp ${(val / 1_000_000).toFixed(0)} Juta`;
  }
  return `Rp ${val.toLocaleString("id-ID")}`;
}

export const TENDERS_SEED: TenderItem[] = [
  {
    id: "tender-1",
    tender_code: "LPSE-IKN-2026-009",
    title: "Pembangunan Kompleks Hunian ASN & Hankam Tahap 2 Kawasan Inti IKN",
    agency_name: "Otorita Ibu Kota Nusantara (OIKN) - Ditjen Cipta Karya",
    procurement_type: "Pekerjaan Konstruksi",
    hps_value: 125000000000,
    pagu_value: 132000000000,
    current_stage: "Upload Dokumen Penawaran",
    deadline_days: 2,
    location: "Penajam Paser Utara, Kalimantan Timur (IKN)",
    lpse_source: "LPSE Otorita IKN Nusantara",
    source_url: "https://spseic.ikn.go.id/eproc4",
    registration_url: "https://spseic.ikn.go.id/eproc4/lelang/daftar/pendaftaran",
    pic_contact: "Pokja Pemilihan Ditjen Cipta Karya (Helpdesk LPSE IKN: 0811-540-8800)",
    surety_opportunity: true,
  },
  {
    id: "tender-2",
    tender_code: "LPSE-KEMENPUPR-2026-081",
    title: "Peningkatan dan Preservasi Jalan Lintas Pantai Selatan Jawa Segmen 4",
    agency_name: "Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR)",
    procurement_type: "Pekerjaan Konstruksi",
    hps_value: 48500000000,
    pagu_value: 52000000000,
    current_stage: "Pengumuman Pascakualifikasi",
    deadline_days: 4,
    location: "Trenggalek - Tulungagung, Jawa Timur",
    lpse_source: "LPSE Kementerian PUPR",
    source_url: "https://spse.pu.go.id/eproc4/lelang",
    registration_url: "https://spse.pu.go.id/eproc4/lelang/daftar",
    pic_contact: "Pokja BP2JK Jawa Timur (Call Center: 031-8288220 / WA: 0812-3221-5500)",
    surety_opportunity: true,
  },
  {
    id: "tender-3",
    tender_code: "BUMN-PERTAMINA-2026-119",
    title: "Revitalisasi Fasilitas Storage & Terminal BBM Transit Wilayah Indonesia Timur",
    agency_name: "PT Pertamina Patra Niaga (Subholding C&T)",
    procurement_type: "Pekerjaan Konstruksi",
    hps_value: 65400000000,
    pagu_value: 70000000000,
    current_stage: "Pemberian Penjelasan (Aanwijzing)",
    deadline_days: 3,
    location: "Makassar, Sulawesi Selatan",
    lpse_source: "e-Procurement Pertamina Group",
    source_url: "https://eproc.pertamina.com",
    registration_url: "https://eproc.pertamina.com/vendor/login",
    pic_contact: "Procurement Helpdesk Pertamina Patra Niaga (Contact Pertamina: 135 / pcc@pertamina.com)",
    surety_opportunity: true,
  },
  {
    id: "tender-4",
    tender_code: "LPSE-DKI-2026-112",
    title: "Pembangunan Gedung Fasilitas Rawat Inap Terpadu RSUD Cengkareng",
    agency_name: "Pemerintah Provinsi DKI Jakarta - Dinas Kesehatan",
    procurement_type: "Pekerjaan Konstruksi",
    hps_value: 32800000000,
    pagu_value: 35000000000,
    current_stage: "Upload Dokumen Penawaran",
    deadline_days: 1,
    location: "Jakarta Barat, DKI Jakarta",
    lpse_source: "LPSE Provinsi DKI Jakarta",
    source_url: "https://lpse.jakarta.go.id/eproc4/lelang",
    registration_url: "https://lpse.jakarta.go.id/eproc4/lelang/daftar",
    pic_contact: "Pokja BPPBJ DKI Jakarta (Helpdesk: 021-3822234 / WA: 0811-1999-5773)",
    surety_opportunity: true,
  },
  {
    id: "tender-5",
    tender_code: "LPSE-PLN-2026-034",
    title: "Pengadaan Trafo Daya 60 MVA & Kubikel 20 kV Gardu Induk Tegangan Tinggi",
    agency_name: "PT PLN (Persero) Unit Induk Transmisi Jawa Bagian Tengah",
    procurement_type: "Pengadaan Barang",
    hps_value: 18750000000,
    pagu_value: 20000000000,
    current_stage: "Evaluasi Administrasi & Teknis",
    deadline_days: 5,
    location: "Semarang, Jawa Tengah",
    lpse_source: "e-Procurement PT PLN (Persero)",
    source_url: "https://eproc.pln.co.id",
    registration_url: "https://eproc.pln.co.id/portal/login",
    pic_contact: "Tim Pengadaan UIT JBT (Helpdesk e-Proc: 024-8451100 / ext. 320)",
    surety_opportunity: true,
  },
  {
    id: "tender-6",
    tender_code: "LPSE-KEMENHUB-2026-042",
    title: "Modernisasi Sistem Instrument Landing System (ILS) Bandara Internasional Minangkabau",
    agency_name: "Kementerian Perhubungan RI - Ditjen Perhubungan Udara",
    procurement_type: "Pengadaan Barang",
    hps_value: 14200000000,
    pagu_value: 15500000000,
    current_stage: "Upload Dokumen Penawaran",
    deadline_days: 3,
    location: "Padang Pariaman, Sumatera Barat",
    lpse_source: "LPSE Kementerian Perhubungan",
    source_url: "https://lpse.dephub.go.id/eproc4",
    registration_url: "https://lpse.dephub.go.id/eproc4/lelang/daftar",
    pic_contact: "Pokja ULP Ditjen Hubud (Helpdesk: 021-3505550 / WA: 0813-1002-3344)",
    surety_opportunity: true,
  },
  {
    id: "tender-7",
    tender_code: "LPSE-JABAR-2026-095",
    title: "Jasa Konsultansi Manajemen Konstruksi RSUD Paru Regional Jawa Barat",
    agency_name: "Pemerintah Provinsi Jawa Barat - Dinas Perumahan dan Permukiman",
    procurement_type: "Jasa Konsultansi",
    hps_value: 3600000000,
    pagu_value: 4000000000,
    current_stage: "Penyampaian Dokumen Prakualifikasi",
    deadline_days: 6,
    location: "Bandung, Jawa Barat",
    lpse_source: "LPSE Provinsi Jawa Barat",
    source_url: "https://lpse.jabarprov.go.id/eproc4",
    registration_url: "https://lpse.jabarprov.go.id/eproc4/lelang/daftar",
    pic_contact: "Biro Pengadaan Barang & Jasa Jabar (022-4233340 / WA: 0811-222-3838)",
    surety_opportunity: false,
  },
  {
    id: "tender-8",
    tender_code: "LPSE-PELINDO-2026-018",
    title: "Pengerukan Alur Pelayaran & Kolam Pelabuhan Tanjung Perak Surabaya Tahap 3",
    agency_name: "PT Pelabuhan Indonesia (Persero) Regional 3",
    procurement_type: "Jasa Lainnya",
    hps_value: 28400000000,
    pagu_value: 30000000000,
    current_stage: "Upload Dokumen Penawaran",
    deadline_days: 2,
    location: "Surabaya, Jawa Timur",
    lpse_source: "e-Procurement Pelindo",
    source_url: "https://eproc.pelindo.co.id",
    registration_url: "https://eproc.pelindo.co.id/vendor/login",
    pic_contact: "Divisi Pengadaan Pelindo Regional 3 (Helpdesk: 031-3298631 / pengadaan@pelindo.co.id)",
    surety_opportunity: true,
  },
];

export interface EnrichedTenderItem extends TenderItem {
  days_remaining: number;
  urgency_label: string;
  urgency_badge: "urgent" | "active" | "fresh";
  bid_bond_min: number; // 1%
  bid_bond_max: number; // 3%
  performance_bond: number; // 5%
  advance_payment_bond: number; // 20%
}

export function getEnrichedTenders(): EnrichedTenderItem[] {
  return TENDERS_SEED.map((t) => {
    const days = t.deadline_days;
    let badge: "urgent" | "active" | "fresh" = "fresh";
    let label = `⚡ Sisa ${days} Hari`;

    if (days <= 3) {
      badge = "urgent";
      label = `🔥 Sisa ${days} Hari (Segera Tutup)`;
    } else if (days <= 7) {
      badge = "active";
      label = `⚡ Sisa ${days} Hari`;
    } else {
      label = `✨ Sisa ${days} Hari`;
    }

    return {
      ...t,
      days_remaining: days,
      urgency_label: label,
      urgency_badge: badge,
      bid_bond_min: Math.round(t.hps_value * 0.01),
      bid_bond_max: Math.round(t.hps_value * 0.03),
      performance_bond: Math.round(t.hps_value * 0.05),
      advance_payment_bond: Math.round(t.hps_value * 0.2),
    };
  });
}
