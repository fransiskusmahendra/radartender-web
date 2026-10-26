"use client";

import React from "react";
import { ShieldCheck, Scale, CheckCircle2 } from "lucide-react";

export function ComplianceNotice() {
  return (
    <section id="kepatuhan-ojk" className="py-16 bg-slate-950 border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Transparansi &amp; Kepatuhan Regulasi (OJK &amp; LKPP)
              </h3>
              <p className="text-xs text-slate-400">
                Landasan legalitas platform RadarTender.id dan penerbitan jaminan proyek
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Platform Software Intelijen
              </div>
              <p className="text-slate-400">
                RadarTender.id adalah platform SaaS intelijen data tender independen yang dikembangkan dan dioperasikan oleh <strong>CV. QIRA Solusi Digital</strong> untuk memantau pengumuman lelang terbuka pemerintah dan BUMN.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Lembaga Berizin &amp; Diawasi OJK
              </div>
              <p className="text-slate-400">
                Penerbitan instrumen penjaminan (Surety Bond &amp; Kontra Bank Garansi) difasilitasi melalui agen resmi dan mitra asuransi umum serta bank devisa terkemuka yang terdaftar dan diawasi resmi oleh <strong>Otoritas Jasa Keuangan (OJK)</strong> dan <strong>Bank Indonesia (BI)</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Kepatuhan 0% Rebating Ilegal
              </div>
              <p className="text-slate-400">
                Kami mematuhi penuh ketentuan regulasi asuransi yang melarang <em>illegal rebating</em> pemotongan tarif premi resmi. Keuntungan yang diberikan kepada kontraktor berupa <strong>Fasilitas Lisensi Software RadarTender.id</strong> bernilai tambah secara legal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
