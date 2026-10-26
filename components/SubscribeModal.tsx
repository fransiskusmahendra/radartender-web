"use client";

import React, { useState } from "react";
import { X, QrCode, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: { id: "starter" | "pro" | "vip"; title: string; price: number };
}

export function SubscribeModal({ isOpen, onClose, initialPlan }: SubscribeModalProps) {
  const plan = initialPlan || { id: "pro", title: "Pro Kontraktor (3 Bulan)", price: 199000 };

  const [vendorName, setVendorName] = useState("");
  const [vendorWa, setVendorWa] = useState("");
  const [email, setEmail] = useState("");
  const [cluster, setCluster] = useState("Pekerjaan Konstruksi");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "qris">("form");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.id,
          planTitle: plan.title,
          price: plan.price,
          vendorName,
          vendorWa,
          email,
          cluster,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);
        setStep("qris");
      }
    } catch (err) {
      console.error("Failed to submit subscription", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    const cleanWa = (vendorWa || "").replace(/[^0-9]/g, "");
    const waText = encodeURIComponent(
      `Halo Tim RadarTender.id,\nSaya sudah melakukan pembayaran via QRIS untuk langganan:\n\n*Order ID:* ${orderId}\n*Paket:* ${plan.title}\n*Nominal:* Rp ${plan.price.toLocaleString("id-ID")}\n*Perusahaan:* ${vendorName}\n*No WA:* ${vendorWa}\n\nMohon bantu verifikasi dan aktivasi notifikasi WhatsApp bot kami. Terima kasih!`
    );
    window.open(`https://wa.me/628211076517?text=${waText}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "form" ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Pendaftaran Berlangganan
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {plan.title}
              </h3>
              <div className="mt-2 text-2xl font-extrabold text-amber-400">
                Rp {plan.price.toLocaleString("id-ID")}
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Perusahaan / Kontraktor / Vendor: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT. Wijaya Mandiri Konstruksi"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp Aktif (Untuk Notifikasi Lelang): *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={vendorWa}
                  onChange={(e) => setVendorWa(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Perusahaan / Penanggung Jawab:
                </label>
                <input
                  type="email"
                  placeholder="admin@perusahaan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fokus Kluster Tender:
                </label>
                <select
                  value={cluster}
                  onChange={(e) => setCluster(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="Semua Kluster">Semua Kluster Lelang</option>
                  <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi &amp; Fisik</option>
                  <option value="Pengadaan Barang">Pengadaan Barang &amp; Material</option>
                  <option value="Jasa Konsultansi">Jasa Konsultansi &amp; Perencanaan</option>
                  <option value="Jasa Lainnya">Jasa Lainnya</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Membuat Tagihan QRIS...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      Lanjutkan ke Pembayaran QRIS
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tagihan Siap Dibayar
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Pindai QRIS Nasional
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Gunakan BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, atau ShopeePay
            </p>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-2xl inline-block mb-4 shadow-xl">
              {/* Dynamic QR image generated via public qr service */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://radartender.id/pay/${orderId}`}
                alt="QRIS RadarTender.id"
                className="w-48 h-48 mx-auto"
              />
              <div className="mt-2 text-center">
                <span className="text-[10px] font-bold text-slate-900 tracking-wider uppercase">
                  NMID: ID1020261988291
                </span>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-white">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paket:</span>
                <span className="text-white font-medium">{plan.title}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5">
                <span className="text-slate-400">Total Tagihan:</span>
                <span className="font-bold text-amber-400 text-sm">
                  Rp {plan.price.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* WhatsApp Confirmation Button */}
            <button
              onClick={handleWhatsAppConfirm}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Saya Sudah Bayar (Konfirmasi via WA)
            </button>
            <p className="text-[11px] text-slate-500 mt-2">
              Akun dan bot alert WhatsApp Anda akan langsung diaktifkan segera setelah konfirmasi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
