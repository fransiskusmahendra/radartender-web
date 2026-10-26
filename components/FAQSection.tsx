"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles, ShieldCheck, Clock, FileText, CheckCircle2 } from "lucide-react";

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

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFaqs =
    selectedCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === selectedCategory);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-lelang" className="py-20 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5 mb-2">
            <HelpCircle className="w-4 h-4" />
            Tanya Jawab &amp; Pusat Pengetahuan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Pertanyaan yang Sering Diajukan Kontraktor
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            Pelajari segala hal mengenai sistem pemantauan lelang LPSE/BUMN, batas waktu penawaran, dan tata cara penerbitan Surety Bond resmi.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {[
              { id: "all", label: "Semua Topik" },
              { id: "umum", label: "Radar Lelang LPSE" },
              { id: "surety", label: "Surety Bond & Bank Garansi" },
              { id: "langganan", label: "Akses Akun PRO" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOpenIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-sm sm:text-base text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isOpen
                        ? "bg-amber-500 text-slate-950 rotate-180"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-black text-white">Punya Pertanyaan Spesifik Terkait Tender Tertentu?</h4>
            <p className="text-xs text-slate-400 mt-1">
              Konsultasikan kendala dokumen jaminan atau verifikasi lelang Anda bersama tim analis kami.
            </p>
          </div>
          <a
            href="https://wa.me/628211076517?text=Halo%20Admin%20RadarTender%2C%20saya%20ingin%20konsultasi%20persyaratan%20lelang%20dan%20jaminan%20proyek"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shrink-0 shadow-lg shadow-amber-500/20"
          >
            Konsultasi WhatsApp ➔
          </a>
        </div>
      </div>
    </section>
  );
}
