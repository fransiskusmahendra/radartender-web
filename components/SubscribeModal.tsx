"use client";

import React, { useState, useEffect } from "react";
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
  Zap,
  Sparkles,
  ExternalLink,
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
  const [preferredRegion, setPreferredRegion] = useState("Semua Wilayah");
  const [specialKeywords, setSpecialKeywords] = useState("");

  const [orderId, setOrderId] = useState<string | null>(null);
  const [finalAmount, setFinalAmount] = useState<number>(plan.price);
  const [step, setStep] = useState<"form" | "payment">("form");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bca" | "midtrans">("qris");
  const [loading, setLoading] = useState(false);
  const [copiedRek, setCopiedRek] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);

  // Midtrans Snap states
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [snapRedirectUrl, setSnapRedirectUrl] = useState<string | null>(null);
  const [snapClientKey, setSnapClientKey] = useState<string>("");
  const [snapScriptUrl, setSnapScriptUrl] = useState<string>("https://app.sandbox.midtrans.com/snap/snap.js");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSnapOpening, setIsSnapOpening] = useState(false);

  // Inject Midtrans Snap script on demand
  useEffect(() => {
    if (step === "payment" && snapScriptUrl && snapClientKey) {
      const scriptId = "midtrans-snap-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = snapScriptUrl;
        script.setAttribute("data-client-key", snapClientKey);
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [step, snapScriptUrl, snapClientKey]);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Calculate final amount (Midtrans gets exact clean amount or unique amount)
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
          preferredRegion,
          specialKeywords,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderId(data.orderId);
        if (data.snapToken) setSnapToken(data.snapToken);
        if (data.snapRedirectUrl) setSnapRedirectUrl(data.snapRedirectUrl);
        if (data.clientKey) setSnapClientKey(data.clientKey);
        if (data.snapScriptUrl) setSnapScriptUrl(data.snapScriptUrl);

        // Save profile to localStorage
        try {
          localStorage.setItem(
            "radartender_user_profile",
            JSON.stringify({
              companyName: vendorName,
              contactPerson: vendorPic,
              whatsapp: vendorWa,
              email,
              cluster,
              preferredRegion,
              specialKeywords,
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

  const handleOpenMidtransSnap = () => {
    if (!snapToken) {
      alert("Token Midtrans belum tersedia. Anda dapat memilih metode Transfer BCA Manual di bawah.");
      return;
    }

    setIsSnapOpening(true);

    if (typeof (window as any).snap !== "undefined") {
      (window as any).snap.pay(snapToken, {
        onSuccess: function (result: any) {
          console.log("[Midtrans Success]", result);
          setPaymentSuccess(true);
          try {
            const saved = localStorage.getItem("radartender_user_profile");
            const parsed = saved ? JSON.parse(saved) : {};
            parsed.isPro = true;
            parsed.activationCode = orderId;
            parsed.orderId = orderId;
            localStorage.setItem("radartender_user_profile", JSON.stringify(parsed));
          } catch (e) {}
        },
        onPending: function (result: any) {
          console.log("[Midtrans Pending]", result);
          alert("Pembayaran Anda sedang diproses. Begitu pembayaran selesai, status akun PRO akan aktif otomatis.");
        },
        onError: function (result: any) {
          console.error("[Midtrans Error]", result);
          alert("Gagal memproses pembayaran Midtrans. Silakan coba kembali atau gunakan transfer manual BCA.");
        },
        onClose: function () {
          console.log("[Midtrans Closed by user]");
        },
      });
      setIsSnapOpening(false);
    } else if (snapRedirectUrl) {
      window.open(snapRedirectUrl, "_blank");
      setIsSnapOpening(false);
    } else {
      setIsSnapOpening(false);
      alert("Sedang memuat popup Midtrans, silakan coba 2 detik lagi.");
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

  const handleWhatsAppConfirm = (customMethod?: string) => {
    const methodLabel = customMethod || (paymentMethod === "qris" ? "QRIS Saweria" : paymentMethod === "midtrans" ? "Midtrans" : "Transfer Bank BCA");
    const tujuanText = methodLabel.includes("QRIS")
      ? "QRIS Saweria (a/n Fransiskus Xaverius Mahendra)"
      : "Bank BCA 4210122848 a/n Fransiskus Xaverius Mahendra Kotualubun";

    const waText = encodeURIComponent(
      `Halo Tim RadarTender.id,\nSaya sudah melakukan pembayaran:\n\n*Order ID:* ${orderId}\n*Paket:* ${plan.title}\n*Nominal Transfer:* Rp ${finalAmount.toLocaleString("id-ID")}\n*Metode:* ${methodLabel}\n*Tujuan:* ${tujuanText}\n*Perusahaan:* ${vendorName}\n*PIC:* ${vendorPic || "-"}\n*No WA:* ${vendorWa}\n\nBerikut bukti pembayarannya, mohon dibantu aktivasi notifikasi bot WhatsApp kami. Terima kasih!`
    );
    window.open(`https://wa.me/6281314620473?text=${waText}`, "_blank");
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

              {/* Smart WhatsApp Alert Preferences Card */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    🎯 Kustomisasi Alert WhatsApp Terkurasi
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                    Anti-Spam
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Kami tidak akan membombardir WhatsApp Anda dengan 500 lelang. Bot kami mengurasi 3-5 lelang terbaik setiap pagi yang 100% cocok dengan kriteria Anda:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Kluster Pengadaan:
                    </label>
                    <select
                      value={cluster}
                      onChange={(e) => setCluster(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="Semua Kluster">Semua Kluster Lelang</option>
                      <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi &amp; Fisik</option>
                      <option value="Pengadaan Barang">Pengadaan Barang &amp; Material</option>
                      <option value="Jasa Konsultansi">Jasa Konsultansi &amp; Perencanaan</option>
                      <option value="Jasa Lainnya">Jasa Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Wilayah Fokus Operasional:
                    </label>
                    <select
                      value={preferredRegion}
                      onChange={(e) => setPreferredRegion(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="Semua Wilayah">Semua Wilayah (Nasional)</option>
                      <option value="IKN & Kalimantan">IKN &amp; Kalimantan</option>
                      <option value="DKI Jakarta">DKI Jakarta</option>
                      <option value="Jawa Timur">Jawa Timur</option>
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="Jawa Tengah">Jawa Tengah</option>
                      <option value="Sumatera">Sumatera</option>
                      <option value="Sulawesi">Sulawesi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kata Kunci / Permintaan Khusus (Opsional):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: khusus jalan &amp; jembatan, gedung RSUD, genset, min HPS 10M"
                    value={specialKeywords}
                    onChange={(e) => setSpecialKeywords(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    *Tender yang memuat kata kunci ini akan diprioritaskan di baris teratas alert harian Anda.
                  </span>
                </div>
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
          /* STEP 2: INVOICE & INSTRUCTION */
          <div>
            {paymentSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Transaksi Terverifikasi Otomatis
                </span>
                <h3 className="text-2xl font-black text-white">Pembayaran Berhasil!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Selamat, akun Anda telah aktif sebagai <strong className="text-amber-400">PRO MEMBER</strong>. Seluruh akses database 500+ lelang telah terbuka dan bot alert WhatsApp Anda telah aktif.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      window.location.reload();
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Buka Akses RadarTender PRO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tagihan Siap Dibayar
                  </div>
                  <h3 className="text-2xl font-black text-white">Pilih Metode Pembayaran</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Order ID: <span className="font-mono font-bold text-amber-400">{orderId}</span>
                  </p>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-1.5 mb-6 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("qris")}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      paymentMethod === "qris"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span className="truncate">⚡ QRIS Instan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bca")}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      paymentMethod === "bca"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="truncate">Transfer BCA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("midtrans")}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                      paymentMethod === "midtrans"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="truncate">Midtrans</span>
                  </button>
                </div>

                {/* METHOD 1: QRIS INSTAN (SAWERIA) */}
                {paymentMethod === "qris" ? (
                  <div className="space-y-4 mb-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-slate-950 border border-amber-500/30 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xs">
                            <QrCode className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">QRIS Instan (Saweria)</span>
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Bebas Biaya Admin • Semua E-Wallet &amp; Bank
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Rekomendasi
                        </span>
                      </div>

                      {/* Official QR Code Card */}
                      <div className="bg-white rounded-2xl p-4 text-center max-w-[270px] mx-auto shadow-xl">
                        <div className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5 border-b border-slate-200 pb-1.5">
                          <QrCode className="w-3.5 h-3.5 text-slate-900" />
                          <span>QRIS PEMBAYARAN NASIONAL</span>
                        </div>
                        <img
                          src="/saweria-qr.png"
                          alt="QRIS Saweria Fransiskus Mahendra"
                          className="w-52 h-52 mx-auto object-contain rounded-lg"
                        />
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Penerima Resmi:</span>
                          <span className="text-xs font-black text-slate-900 block tracking-tight">
                            Fransiskus Xaverius Mahendra
                          </span>
                          <span className="text-[10px] text-amber-600 font-bold block mt-0.5">
                            Saweria • QRIS Nasional
                          </span>
                        </div>
                      </div>

                      {/* External links to live widget / web */}
                      <div className="flex items-center justify-center gap-2 text-center pt-1">
                        <a
                          href="https://saweria.co/widgets/qr?streamKey=fac59d2df0d4f826f26ccf41d7db17f4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 underline underline-offset-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Buka Layar Penuh Widget QR
                        </a>
                        <span className="text-slate-600 text-xs">•</span>
                        <a
                          href="https://saweria.co/fransiskusmahendra"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 underline underline-offset-2"
                        >
                          Buka Web Saweria ➔
                        </a>
                      </div>

                      {/* Nominal Box */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400 font-medium">Nominal Pembayaran:</span>
                          <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                            Paket {plan.title}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black text-amber-400 tracking-tight">
                            Rp {finalAmount.toLocaleString("id-ID")}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(String(finalAmount), "nominal")}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/40 transition"
                          >
                            {copiedNominal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedNominal ? "Tersalin!" : "Salin Nominal"}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-2 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                          💡 <strong>Cara Bayar:</strong> Buka aplikasi GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin, atau Mobile Banking &gt; Scan QR di atas &gt; Masukkan nominal <strong>Rp {finalAmount.toLocaleString("id-ID")}</strong> &gt; Tuliskan pesan / catatan: <code className="text-amber-300 font-mono font-bold">{orderId}</code>.
                        </p>
                      </div>

                      {/* Confirmation WhatsApp Button */}
                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleWhatsAppConfirm("QRIS Saweria")}
                          className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Saya Sudah Bayar via QRIS (Kirim Bukti ke CS)
                        </button>
                        <p className="text-[11px] text-center text-slate-500">
                          Kirim bukti transfer via WhatsApp untuk aktivasi instan akun PRO &amp; bot alert lelang Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === "bca" ? (
                  /* METHOD 2: MANUAL BANK BCA TRANSFER */
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
                          *PENTING: Mohon transfer tepat hingga 3 digit terakhir untuk mempercepat verifikasi.
                        </p>
                      </div>
                    </div>

                    {/* Confirmation Button for Manual BCA */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handleWhatsAppConfirm("Transfer Bank BCA")}
                        className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Saya Sudah Transfer (Kirim Bukti via WhatsApp)
                      </button>
                      <p className="text-[11px] text-center text-slate-500">
                        Akun PRO dan bot alert WhatsApp Anda akan langsung diaktifkan setelah konfirmasi bukti transfer.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* METHOD 3: MIDTRANS SNAP PAYMENT GATEWAY */
                  <div className="space-y-4 mb-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-slate-950 border border-amber-500/30 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xs">
                            <Zap className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">Midtrans Payment Gateway</span>
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verifikasi Otomatis 24 Jam
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Sandbox Testing
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Total Pembayaran:</span>
                        <div className="text-2xl font-black text-amber-400">
                          Rp {finalAmount.toLocaleString("id-ID")}
                        </div>
                        <span className="text-[11px] text-slate-300 block mt-1 leading-snug">
                          Mendukung: <strong>QRIS</strong>, <strong>Virtual Account BCA / Mandiri / BNI / BRI</strong>, &amp; Kartu Kredit.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenMidtransSnap}
                        disabled={isSnapOpening}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                      >
                        {isSnapOpening ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Membuka Midtrans...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-slate-950" />
                            Bayar Sekarang via Midtrans ➔
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-center text-slate-400">
                        *Klik tombol di atas untuk membuka popup Midtrans. Begitu Anda menyelesaikan transfer, status PRO langsung aktif.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
