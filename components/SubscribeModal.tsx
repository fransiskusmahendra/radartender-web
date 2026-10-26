"use client";

import React, { useState } from "react";
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Building2,
  MessageSquare,
} from "lucide-react";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: { id: "starter" | "pro" | "vip"; title: string; price: number };
}

export function SubscribeModal({ isOpen, onClose, initialPlan }: SubscribeModalProps) {
  const plan = initialPlan || { id: "pro", title: "Pro Kontraktor (3 Bulan)", price: 199000 };

  const [vendorName, setVendorName] = useState("");
  const [vendorPic, setVendorPic] = useState("");
  const [vendorWa, setVendorWa] = useState("");
  const [email, setEmail] = useState("");
  const [cluster, setCluster] = useState("Pekerjaan Konstruksi");

  const [orderId, setOrderId] = useState<string | null>(null);
  const [finalAmount, setFinalAmount] = useState<number>(plan.price);
  const [step, setStep] = useState<"form" | "payment">("form");
  const [paymentMethod, setPaymentMethod] = useState<"bca" | "qris">("bca");
  const [loading, setLoading] = useState(false);
  const [copiedRek, setCopiedRek] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Generate unique 3-digit verification code (e.g. 100 - 899)
    const uniqueCode = Math.floor(100 + Math.random() * 899);
    const calculatedFinalAmount = plan.price + uniqueCode;
    setFinalAmount(calculatedFinalAmount);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.id,
          planTitle: plan.title,
          price: plan.price,
          uniqueAmount: calculatedFinalAmount,
          vendorName,
          vendorPic,
          vendorWa,
          email,
          cluster,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);

        // Save profile to localStorage
        try {
          localStorage.setItem(
            "radartender_user_profile",
            JSON.stringify({
              companyName: vendorName,
              contactPerson: vendorPic,
              whatsapp: vendorWa,
              email,
              lastOrderId: data.orderId,
            })
          );
        } catch (err) {}

        setStep("payment");
      }
    } catch (err) {
      console.error("Failed to submit subscription", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "rek" | "nominal") => {
    navigator.clipboard.writeText(text);
    if (type === "rek") {
      setCopiedRek(true);
      setTimeout(() => setCopiedRek(false), 2000);
    } else {
      setCopiedNominal(true);
      setTimeout(() => setCopiedNominal(false), 2000);
    }
  };

  const handleWhatsAppConfirm = () => {
    const waText = encodeURIComponent(
      `Halo Tim RadarTender.id,\nSaya sudah melakukan transfer pembayaran:\n\n*Order ID:* ${orderId}\n*Paket:* ${plan.title}\n*Nominal Transfer:* Rp ${finalAmount.toLocaleString("id-ID")}\n*Tujuan:* Bank BCA 4210122848 a/n Fransiskus Xaverius Mahendra Kotualubun\n*Perusahaan:* ${vendorName}\n*PIC:* ${vendorPic || "-"}\n*No WA:* ${vendorWa}\n\nBerikut bukti transfernya, mohon dibantu aktivasi notifikasi bot WhatsApp kami. Terima kasih!`
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
              <p className="text-xs text-slate-400 mt-1">
                Isi data perusahaan Anda di bawah untuk membuat tagihan resmi &amp; aktivasi bot WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama PT / CV (Kontraktor / Vendor): *
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
                  Nama Penanggung Jawab (PIC / Estimator):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bpk. Mahendra"
                  value={vendorPic}
                  onChange={(e) => setVendorPic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp Aktif (Untuk Kirim Alert Lelang): *
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
                  Email Perusahaan (Opsional):
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
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Membuat Tagihan Pembayaran...
                    </>
                  ) : (
                    <>
                      <span>Lanjutkan ke Pembayaran</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STEP 2: INVOICE & INSTRUCTION (ONLY DISPLAYED WHEN READY TO PAY) */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tagihan Siap Dibayar
              </div>
              <h3 className="text-2xl font-black text-white">Instruksi Pembayaran</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Order ID: <span className="font-mono font-bold text-amber-400">{orderId}</span>
              </p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setPaymentMethod("bca")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === "bca"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                Transfer Bank BCA
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("qris")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === "qris"
                    ? "bg-slate-800 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                Scan QRIS
              </button>
            </div>

            {/* METHOD 1: BANK BCA DETAILS */}
            {paymentMethod === "bca" ? (
              <div className="space-y-4 mb-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-black text-xs">
                        BCA
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Bank Central Asia (BCA)</span>
                        <span className="text-[11px] text-slate-400">Transfer Antar-Bank / Sesama BCA</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Nomor Rekening Tujuan:</span>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="font-mono text-lg font-black text-white tracking-wider">
                        4210122848
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("4210122848", "rek")}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs flex items-center gap-1 border border-blue-500/30 transition"
                      >
                        {copiedRek ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedRek ? "Tersalin!" : "Salin"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-0.5">Atas Nama Penerima:</span>
                    <span className="text-xs font-bold text-slate-200 block uppercase">
                      Fransiskus Xaverius Mahendra Kotualubun
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400 font-medium">Total Nominal Transfer:</span>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                        Termasuk Kode Unik
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <span className="text-xl font-black text-amber-400 tracking-tight">
                        Rp {finalAmount.toLocaleString("id-ID")}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(String(finalAmount), "nominal")}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/40 transition"
                      >
                        {copiedNominal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedNominal ? "Tersalin!" : "Salin"}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                      *PENTING: Mohon transfer tepat hingga 3 digit terakhir untuk mempercepat verifikasi otomatis.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* METHOD 2: QRIS OPTION */
              <div className="text-center mb-6">
                <div className="p-4 bg-white rounded-2xl inline-block mb-3 shadow-xl">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://radartender.id/pay/${orderId}`}
                    alt="QRIS RadarTender.id"
                    className="w-44 h-44 mx-auto"
                  />
                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-bold text-slate-900 tracking-wider uppercase">
                      NMID: ID1020261988291
                    </span>
                  </div>
                </div>
                <div className="text-center text-xs text-slate-300 font-semibold mb-1">
                  Nominal: Rp {finalAmount.toLocaleString("id-ID")}
                </div>
                <p className="text-[11px] text-slate-500">
                  Dapat dipindai melalui BCA, Mandiri, BRI, GoPay, OVO, ShopeePay, atau DANA.
                </p>
              </div>
            )}

            {/* Confirmation Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleWhatsAppConfirm}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                Saya Sudah Transfer (Kirim Bukti via WhatsApp)
              </button>
              <p className="text-[11px] text-center text-slate-500">
                Akun PRO dan bot alert WhatsApp Anda akan langsung diaktifkan setelah konfirmasi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
