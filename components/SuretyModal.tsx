"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Send, Loader2, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/tenders-data";

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
  };
}

export function SuretyModal({ isOpen, onClose, initialData }: SuretyModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [guaranteeType, setGuaranteeType] = useState("Jaminan Pelaksanaan (Performance Bond)");
  const [projectValue, setProjectValue] = useState<number>(5000000000);
  const [bondValue, setBondValue] = useState<number>(250000000);
  const [obligeeName, setObligeeName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.guaranteeType) setGuaranteeType(initialData.guaranteeType);
      if (initialData.projectValue) setProjectValue(initialData.projectValue);
      if (initialData.bondValue) setBondValue(initialData.bondValue);
      if (initialData.obligeeName) setObligeeName(initialData.obligeeName);
      if (initialData.tenderTitle) {
        setNotes(`Tender: ${initialData.tenderCode || ""} - ${initialData.tenderTitle}`);
      }
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        // Direct WhatsApp redirection
        const cleanWa = (whatsapp || "").replace(/[^0-9]/g, "");
        const waText = encodeURIComponent(
          `Halo Tim Penjaminan RadarTender.id,\nSaya ingin mengajukan penerbitan jaminan proyek:\n\n*Perusahaan:* ${companyName}\n*PIC:* ${contactPerson}\n*No WhatsApp:* ${whatsapp}\n*Jenis Jaminan:* ${guaranteeType}\n*Nilai Proyek:* ${formatRupiah(projectValue)}\n*Nilai Jaminan:* ${formatRupiah(bondValue)}\n*Pemilik Proyek (Obligee):* ${obligeeName || "-"}\n*Keterangan:* ${notes || "-"}\n\nMohon informasi persyaratan dan draft penawarannya. Terima kasih!`
        );
        setTimeout(() => {
          window.open(`https://wa.me/628211076517?text=${waText}`, "_blank");
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
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Layanan Asistensi Penjaminan Proyek
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Formulir Penerbitan Surety Bond / Bank Garansi
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Isi data proyek Anda di bawah ini. Tim analis underwriter kami akan menghitung simulasi resmi dalam waktu 15 menit.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama PT / CV (Principal): *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="PT. Sumber Makmur Abadi"
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
                    placeholder="Bpk. Hendra Gunawan"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jenis Jaminan: *
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
                    <option value="Kontra Bank Garansi Devisa">Kontra Bank Garansi Devisa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pemilik Proyek (Obligee):
                  </label>
                  <input
                    type="text"
                    placeholder="Dinas PUPR / PT Pertamina / BUMN"
                    value={obligeeName}
                    onChange={(e) => setObligeeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimasi Nilai HPS / Proyek:
                  </label>
                  <input
                    type="number"
                    value={projectValue}
                    onChange={(e) => setProjectValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-amber-400 mt-1 block">
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
                  <span className="text-[11px] text-emerald-400 mt-1 block">
                    {formatRupiah(bondValue)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Proyek / Nama Paket Lelang:
                </label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan nama tender atau tenggat waktu dokumen penyerahan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses Pengajuan...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim &amp; Hubungkan ke Underwriter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              Pengajuan Telah Diterima!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
              Data penjaminan proyek telah diteruskan ke tim underwriter. Jendela WhatsApp akan terbuka otomatis untuk konfirmasi dokumen langsung.
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
