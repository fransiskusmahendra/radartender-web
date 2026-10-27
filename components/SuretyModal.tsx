"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  FileText,
  Building2,
  UploadCloud,
  FileCheck,
  Trash2,
  Link2,
  AlertCircle,
  HelpCircle,
  FolderArchive,
  DollarSign,
  FileSpreadsheet,
} from "lucide-react";
import { formatRupiah } from "@/lib/tenders-data";

interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
  dataBase64?: string;
}

interface SuretyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    guaranteeType?: string;
    projectValue?: number;
    bondValue?: number;
    tenderTitle?: string;
    tenderCode?: string;
    obligeeName?: string;
    sourceUrl?: string;
  };
}

export function SuretyModal({ isOpen, onClose, initialData }: SuretyModalProps) {
  // Principal & Project info
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [guaranteeType, setGuaranteeType] = useState("Jaminan Pelaksanaan (Performance Bond)");
  const [projectValue, setProjectValue] = useState<number>(5000000000);
  const [bondValue, setBondValue] = useState<number>(250000000);
  const [obligeeName, setObligeeName] = useState("");
  const [notes, setNotes] = useState("");

  // Underwriting Document Uploads (Insurance Standards)
  const [legalDocs, setLegalDocs] = useState<UploadedFileInfo[]>([]);
  const [financialDocs, setFinancialDocs] = useState<UploadedFileInfo[]>([]);
  const [tenderDocs, setTenderDocs] = useState<UploadedFileInfo[]>([]);
  const [companyProfileDoc, setCompanyProfileDoc] = useState<UploadedFileInfo[]>([]);
  const [driveUrl, setDriveUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Hidden file input refs
  const legalInputRef = useRef<HTMLInputElement>(null);
  const financialInputRef = useRef<HTMLInputElement>(null);
  const tenderInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill from localStorage (saved contractor identity / login)
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem("radartender_user_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.contactPerson) setContactPerson(parsed.contactPerson);
          if (parsed.whatsapp) setWhatsapp(parsed.whatsapp);
        }
      } catch (e) {}
    }
  }, [isOpen]);

  // Auto-fill from selected tender or calculator initialData
  useEffect(() => {
    if (initialData) {
      if (initialData.guaranteeType) setGuaranteeType(initialData.guaranteeType);
      if (initialData.projectValue) setProjectValue(initialData.projectValue);
      if (initialData.bondValue) setBondValue(initialData.bondValue);
      if (initialData.obligeeName) setObligeeName(initialData.obligeeName);
      if (initialData.tenderTitle) {
        const prefix = initialData.tenderCode ? `[${initialData.tenderCode}] ` : "";
        setNotes(`Paket Tender: ${prefix}${initialData.tenderTitle}`);
      }
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Helper to convert file to UploadedFileInfo
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<UploadedFileInfo[]>>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Limit file size to 15MB
      if (file.size > 15 * 1024 * 1024) {
        alert(`File ${file.name} melebihi batas 15MB. Silakan gunakan link Google Drive untuk berkas besar.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setter((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            type: file.type,
            dataBase64: result.slice(0, 1000), // lightweight preview / signature
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be re-selected if removed
    e.target.value = "";
  };

  const removeFile = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<UploadedFileInfo[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save profile to localStorage for future automatic fill
    try {
      const existing = localStorage.getItem("radartender_user_profile");
      const parsed = existing ? JSON.parse(existing) : {};
      localStorage.setItem(
        "radartender_user_profile",
        JSON.stringify({
          ...parsed,
          companyName,
          contactPerson,
          whatsapp,
        })
      );
    } catch (e) {}

    // Prepare document inventory summary (auto-link selected LPSE tender docs if bid bond)
    let tenderDocsList = tenderDocs.map((f) => `${f.name} (${formatFileSize(f.size)})`);
    if (initialData?.tenderTitle) {
      const autoLinkEntry = `[Auto-Link LPSE] ${initialData.tenderCode ? '[' + initialData.tenderCode + '] ' : ''}${initialData.tenderTitle}${initialData.sourceUrl ? ' (' + initialData.sourceUrl + ')' : ''}`;
      tenderDocsList = [autoLinkEntry, ...tenderDocsList];
    }

    const uploadedDocsSummary = {
      legalDocs: legalDocs.map((f) => `${f.name} (${formatFileSize(f.size)})`),
      financialDocs: financialDocs.map((f) => `${f.name} (${formatFileSize(f.size)})`),
      tenderDocs: tenderDocsList,
      companyProfileDoc: companyProfileDoc.map((f) => `${f.name} (${formatFileSize(f.size)})`),
      driveUrl: driveUrl.trim(),
    };

    try {
      const res = await fetch("/api/surety-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactPerson,
          whatsapp,
          guaranteeType,
          projectValue,
          bondValue,
          obligeeName,
          notes,
          underwritingDocs: uploadedDocsSummary,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);

        // Direct WhatsApp fast-track to Ko Mahen
        const docsCount =
          legalDocs.length + financialDocs.length + tenderDocs.length + companyProfileDoc.length;
        const driveNote = driveUrl ? `\n*Folder Berkas:* ${driveUrl}` : "";
        const docsNote =
          docsCount > 0
            ? `\n*Dokumen Terlampir:* ${docsCount} berkas underwriting (Legalitas, Keuangan, RKS/Tender)`
            : "";

        const waText = encodeURIComponent(
          `Halo Tim Penjaminan RadarTender.id,\nSaya mengajukan penerbitan jaminan proyek:\n\n*Perusahaan:* ${companyName}\n*PIC:* ${contactPerson}\n*No WhatsApp:* ${whatsapp}\n*Jenis Jaminan:* ${guaranteeType}\n*Nilai Proyek:* ${formatRupiah(projectValue)}\n*Nilai Jaminan:* ${formatRupiah(bondValue)}\n*Pemilik Proyek (Obligee):* ${obligeeName || "-"}\n*Keterangan:* ${notes || "-"}${docsNote}${driveNote}\n\nMohon analisa underwriting dan siapkan draft penawarannya. Terima kasih!`
        );
        setTimeout(() => {
          window.open(`https://wa.me/6281314620473?text=${waText}`, "_blank");
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to submit surety request", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Layanan Underwriting Asuransi &amp; Bank Garansi Resmi
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Pengajuan Jaminan Proyek (Surety Bond)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Lengkapi rincian proyek dan lampirkan dokumen persyaratan underwriting standar asuransi umum untuk penerbitan draft penjaminan express.
              </p>
            </div>

            {/* Selected Tender Context Card */}
            {initialData?.tenderTitle && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6 flex items-start gap-3">
                <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-300 block">
                    {initialData.tenderCode ? `[${initialData.tenderCode}] ` : ""}
                    {initialData.tenderTitle}
                  </span>
                  <div className="text-slate-300 mt-0.5 flex flex-wrap gap-x-3">
                    {initialData.obligeeName && <span>Satker: {initialData.obligeeName}</span>}
                    {initialData.projectValue && <span>HPS: {formatRupiah(initialData.projectValue)}</span>}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* BAGIAN 1: IDENTITAS PRINCIPAL & PROYEK */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-200">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  1. Identitas Principal &amp; Rincian Proyek
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nama PT / CV (Perusahaan Principal): *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="PT. Graha Mandiri Persada"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nama PIC / Penanggung Jawab: *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bpk. Hendra Gunawan (Direktur)"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nomor WhatsApp Aktif: *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Jenis Jaminan yang Diajukan: *
                    </label>
                    <select
                      value={guaranteeType}
                      onChange={(e) => setGuaranteeType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Jaminan Penawaran (Bid Bond)">Jaminan Penawaran (Bid Bond)</option>
                      <option value="Jaminan Pelaksanaan (Performance Bond)">Jaminan Pelaksanaan (Perf Bond)</option>
                      <option value="Jaminan Uang Muka (Advance Payment Bond)">Jaminan Uang Muka (Advance)</option>
                      <option value="Jaminan Pemeliharaan (Maintenance Bond)">Jaminan Pemeliharaan</option>
                      <option value="Kontra Bank Garansi Devisa">Kontra Bank Garansi Devisa (BUMN/Pemerintah)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Pemilik Proyek (Obligee): *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Kementerian PUPR / Pertamina / PLN"
                      value={obligeeName}
                      onChange={(e) => setObligeeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nilai HPS / Proyek:
                    </label>
                    <input
                      type="number"
                      value={projectValue}
                      onChange={(e) => setProjectValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-amber-400 mt-1 block font-semibold truncate">
                      {formatRupiah(projectValue)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nilai Jaminan yang Diminta:
                    </label>
                    <input
                      type="number"
                      value={bondValue}
                      onChange={(e) => setBondValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[11px] text-emerald-400 mt-1 block font-semibold truncate">
                      {formatRupiah(bondValue)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Catatan Khusus / Judul Paket Lelang:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan nama tender atau tenggat waktu dokumen penyerahan..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* BAGIAN 2: BERKAS UNDERWRITING ASURANSI (UPLOAD DOKUMEN) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
                    <FolderArchive className="w-4 h-4 text-emerald-400" />
                    2. Berkas Underwriting Penjaminan (Standar Asuransi)
                  </div>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    Format: PDF, JPG, PNG, ZIP (Maks. 15MB/file)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>
                    Dokumen underwriting diperlukan oleh analis asuransi umum &amp; bank devisa untuk memverifikasi kapasitas hukum, kesehatan keuangan, dan keabsahan paket lelang principal sebelum menerbitkan sertifikat penjaminan.
                  </span>
                </div>

                {/* Upload Slots Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slot 1: Legalitas PT */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                        Legalitas Perusahaan
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                        Wajib
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                      Akta Pendirian/Perubahan + SK Kemenkumham, NIB / SBU Konstruksi, NPWP &amp; KTP Direktur.
                    </p>

                    <input
                      ref={legalInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.zip,.rar"
                      onChange={(e) => handleFileChange(e, setLegalDocs)}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => legalInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-amber-500 text-xs text-slate-300 flex items-center justify-center gap-2 transition"
                    >
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      Pilih Dokumen Legalitas
                    </button>

                    {legalDocs.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {legalDocs.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[11px] bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                          >
                            <span className="truncate max-w-[180px] text-slate-200">{f.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-slate-500 font-mono text-[10px]">{formatFileSize(f.size)}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(i, setLegalDocs)}
                                className="text-red-400 hover:text-red-300 p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Slot 2: Keuangan & Rekening Koran */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                        Keuangan &amp; Rekening
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                        Wajib
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                      Rekening Koran 3 Bulan Terakhir, Laporan Keuangan Terakhir (Audited/In-House), atau SPT Tahunan.
                    </p>

                    <input
                      ref={financialInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.zip,.rar,.xlsx,.xls"
                      onChange={(e) => handleFileChange(e, setFinancialDocs)}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => financialInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-cyan-500 text-xs text-slate-300 flex items-center justify-center gap-2 transition"
                    >
                      <UploadCloud className="w-4 h-4 text-cyan-400" />
                      Pilih Rekening &amp; Lapkeu
                    </button>

                    {financialDocs.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {financialDocs.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[11px] bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                          >
                            <span className="truncate max-w-[180px] text-slate-200">{f.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-slate-500 font-mono text-[10px]">{formatFileSize(f.size)}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(i, setFinancialDocs)}
                                className="text-red-400 hover:text-red-300 p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Slot 3: Dokumen Pengadaan / Tender */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        Dokumen Tender / RKS
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                        {initialData?.tenderTitle ? "Tersinkronisasi" : "Wajib"}
                      </span>
                    </div>

                    {/* Auto-Linked from LPSE if tender is selected */}
                    {initialData?.tenderTitle ? (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 mb-3">
                        <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px] mb-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Tersinkronisasi Otomatis dari Portal LPSE</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">
                          {initialData.tenderCode ? `[${initialData.tenderCode}] ` : ""}{initialData.tenderTitle}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                          Dokumen pengumuman &amp; syarat lelang resmi terhubung langsung ke underwriter melalui link LPSE. Anda tidak perlu mengunggah ulang file RKS.
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                        Dokumen Pemilihan/RKS/Pengumuman LPSE (untuk Bid Bond) atau SPPBJ / Kontrak (untuk Perf Bond).
                      </p>
                    )}

                    <input
                      ref={tenderInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.zip,.rar"
                      onChange={(e) => handleFileChange(e, setTenderDocs)}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => tenderInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-emerald-500 text-xs text-slate-300 flex items-center justify-center gap-2 transition"
                    >
                      <UploadCloud className="w-4 h-4 text-emerald-400" />
                      {initialData?.tenderTitle
                        ? "+ Tambah Dokumen / Addendum (Opsional)"
                        : "Pilih Dokumen Tender / Kontrak"}
                    </button>

                    {tenderDocs.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {tenderDocs.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[11px] bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                          >
                            <span className="truncate max-w-[180px] text-slate-200">{f.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-slate-500 font-mono text-[10px]">{formatFileSize(f.size)}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(i, setTenderDocs)}
                                className="text-red-400 hover:text-red-300 p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Slot 4: Company Profile & Pengalaman */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-400" />
                        Company Profile &amp; Pengalaman
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                        Pendukung
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 leading-snug">
                      Profil perusahaan, daftar pengalaman pekerjaan sejenis 3 tahun terakhir (bila ada).
                    </p>

                    <input
                      ref={profileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.zip,.rar"
                      onChange={(e) => handleFileChange(e, setCompanyProfileDoc)}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => profileInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-purple-500 text-xs text-slate-300 flex items-center justify-center gap-2 transition"
                    >
                      <UploadCloud className="w-4 h-4 text-purple-400" />
                      Pilih Company Profile
                    </button>

                    {companyProfileDoc.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {companyProfileDoc.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[11px] bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                          >
                            <span className="truncate max-w-[180px] text-slate-200">{f.name}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-slate-500 font-mono text-[10px]">{formatFileSize(f.size)}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(i, setCompanyProfileDoc)}
                                className="text-red-400 hover:text-red-300 p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Alternatif Cepat: Google Drive / Cloud Link */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-amber-400" />
                    Atau Lampirkan Tautan Folder Cloud (Google Drive / Dropbox / OneDrive):
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/contoh-dokumen-tender"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    *Rekomendasi untuk berkas berukuran besar (&gt; 20MB). Pastikan hak akses folder disetel &quot;Anyone with the link can view / Siapa saja dengan tautan dapat melihat&quot;.
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses &amp; Meneruskan Dokumen ke Underwriter...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Ajukan Jaminan &amp; Kirim Berkas Underwriting
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Setelah pengajuan terkirim, Anda akan otomatis terhubung ke WhatsApp underwriter kami untuk percepatan approval draft polis.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Pengajuan &amp; Berkas Underwriting Diterima!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
              Data pokok proyek dan kelengkapan dokumen persyaratan underwriting Anda telah berhasil diteruskan ke tim underwriter. Jendela WhatsApp akan terbuka otomatis untuk konfirmasi dokumen dan koordinasi draf polis penjaminan.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Tutup Jendela
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
