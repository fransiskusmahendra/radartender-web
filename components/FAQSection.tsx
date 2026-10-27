"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles, ShieldCheck, Clock, FileText, CheckCircle2 } from "lucide-react";
import { FAQ_DATA, FAQItem } from "@/lib/faq-data";

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
            href="https://wa.me/6281314620473?text=Halo%20Admin%20RadarTender%2C%20saya%20ingin%20konsultasi%20persyaratan%20lelang%20dan%20jaminan%20proyek"
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
