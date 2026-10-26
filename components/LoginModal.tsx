"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  Crown,
  LogOut,
  CheckCircle2,
  Smartphone,
  Tag,
  Building2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

export interface UserProfile {
  companyName: string;
  contactPerson: string;
  whatsapp: string;
  email?: string;
  isPro?: boolean;
  activationCode?: string;
  planTitle?: string;
  daysRemaining?: number;
  expiresAt?: string;
  orderId?: string;
  cluster?: string;
  preferredRegion?: string;
  specialKeywords?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile | null) => void;
  onOpenSubscribe?: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onOpenSubscribe,
}: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "profile">("login");

  // Form states for WhatsApp Cloud Login
  const [loginPhone, setLoginPhone] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [loginCode, setLoginCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form states for Profile edit
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [profileWhatsapp, setProfileWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [cluster, setCluster] = useState("Semua Kluster");
  const [preferredRegion, setPreferredRegion] = useState("Semua Wilayah");
  const [specialKeywords, setSpecialKeywords] = useState("");

  useEffect(() => {
    if (userProfile) {
      setCompanyName(userProfile.companyName || "");
      setContactPerson(userProfile.contactPerson || "");
      setProfileWhatsapp(userProfile.whatsapp || "");
      setEmail(userProfile.email || "");
      setLoginPhone(userProfile.whatsapp || "");
      setLoginCode(userProfile.activationCode || "");
      if (userProfile.cluster) setCluster(userProfile.cluster);
      if (userProfile.preferredRegion) setPreferredRegion(userProfile.preferredRegion);
      if (userProfile.specialKeywords) setSpecialKeywords(userProfile.specialKeywords);
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  // Handle WhatsApp Only Cloud Login
  const handleCloudLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: loginPhone.trim(),
          accessCode: loginCode.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.message ||
            "Nomor WhatsApp belum terdaftar sebagai PRO. Pastikan nomor sudah sesuai atau hubungi admin."
        );
        setIsLoading(false);
        return;
      }

      // Success: hydrate user profile
      const user = data.user;
      const updatedProfile: UserProfile = {
        companyName:
          user.companyName !== "Member Kontraktor" && user.companyName
            ? user.companyName
            : userProfile?.companyName || "Perusahaan Kontraktor",
        contactPerson: user.contactPerson || userProfile?.contactPerson || "",
        whatsapp: user.whatsapp || loginPhone.trim(),
        email: user.email || userProfile?.email || "",
        isPro: Boolean(data.isPro),
        activationCode: loginCode.trim() || user.orderId,
        planTitle: user.planTitle,
        daysRemaining: data.daysRemaining,
        expiresAt: user.expiresAt,
        orderId: user.orderId,
        cluster: user.cluster || userProfile?.cluster || "Semua Kluster",
        preferredRegion: user.preferredRegion || userProfile?.preferredRegion || "Semua Wilayah",
        specialKeywords: user.specialKeywords || userProfile?.specialKeywords || "",
      };

      onSaveProfile(updatedProfile);
      setSuccessMessage(data.message || "Berhasil masuk! Status PRO aktif.");
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage("Gagal menghubungkan ke server autentikasi. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Profile Save
  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const newProfile: UserProfile = {
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      whatsapp: profileWhatsapp.trim(),
      email: email.trim(),
      isPro: userProfile?.isPro,
      activationCode: userProfile?.activationCode,
      planTitle: userProfile?.planTitle,
      daysRemaining: userProfile?.daysRemaining,
      expiresAt: userProfile?.expiresAt,
      orderId: userProfile?.orderId,
      cluster,
      preferredRegion,
      specialKeywords: specialKeywords.trim(),
    };

    onSaveProfile(newProfile);
    onClose();
  };

  const handleLogout = () => {
    onSaveProfile(null);
    onClose();
  };

  const formatExpiryDate = (isoString?: string) => {
    if (!isoString) return null;
    try {
      return new Date(isoString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            Akses Kontraktor
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {userProfile?.isPro
              ? "Akun Kontraktor PRO"
              : userProfile
              ? "Profil Kontraktor"
              : "Masuk via WhatsApp"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cukup gunakan nomor WhatsApp Anda. Akun PRO tersinkronisasi otomatis di seluruh perangkat.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "login"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {userProfile?.isPro ? "Status Langganan" : "Masuk via WhatsApp"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === "profile"
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Identitas PT / CV
          </button>
        </div>

        {/* PRO STATUS BANNER IF ACTIVE */}
        {userProfile?.isPro && activeTab === "login" && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                Langganan PRO Aktif
              </span>
              {userProfile.daysRemaining !== undefined && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {userProfile.daysRemaining} Hari Lagi
                </span>
              )}
            </div>

            <div className="space-y-1 text-xs text-slate-300 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Paket:</span>
                <span className="font-semibold text-white">
                  {userProfile.planTitle || "Pro Kontraktor"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor WhatsApp:</span>
                <span className="font-semibold text-white">{userProfile.whatsapp}</span>
              </div>
              {userProfile.companyName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Perusahaan:</span>
                  <span className="font-semibold text-white">{userProfile.companyName}</span>
                </div>
              )}
              {userProfile.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Masa Aktif Hingga:</span>
                  <span className="font-semibold text-amber-300">
                    {formatExpiryDate(userProfile.expiresAt)}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Ubah Profil PT
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: WHATSAPP-ONLY LOGIN FORM */}
        {activeTab === "login" && !userProfile?.isPro && (
          <form onSubmit={handleCloudLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor WhatsApp Anda: *
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500 tracking-wide"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Masukkan nomor WhatsApp yang Anda gunakan saat memesan paket PRO.
              </p>
            </div>

            {/* Collapsible Promo Code (Optional) */}
            <div>
              <button
                type="button"
                onClick={() => setShowPromoInput(!showPromoInput)}
                className="text-[11px] text-amber-400/90 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
              >
                <Tag className="w-3 h-3" />
                {showPromoInput ? "Sembunyikan Kode Promo" : "Punya Kode Promo / Voucher? (Opsional)"}
                {showPromoInput ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              {showPromoInput && (
                <div className="mt-2 animate-fadeIn">
                  <input
                    type="text"
                    placeholder="Contoh: RADARPRO atau VIP2026"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono uppercase"
                  />
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href="#harga"
                    onClick={() => {
                      onClose();
                      if (onOpenSubscribe) onOpenSubscribe();
                    }}
                    className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase hover:bg-amber-400 transition"
                  >
                    Daftar PRO Sekarang
                  </a>
                  <a
                    href="https://wa.me/628211076517?text=Halo%20Admin%20RadarTender%2C%20saya%20sudah%20transfer%20dan%20ingin%20aktivasi%20nomor%20WhatsApp%20saya"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-slate-300 hover:text-white underline inline-flex items-center gap-0.5"
                  >
                    Konfirmasi ke Admin
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi Server...
                </>
              ) : (
                <>
                  <span>Masuk Akun PRO</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <a
                href="https://wa.me/628211076517?text=Halo%20Admin%20RadarTender%2C%20saya%20butuh%20bantuan%20aktivasi%20akun%20PRO"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-amber-400 inline-flex items-center gap-1 transition"
              >
                Belum berlangganan? Hubungi Admin WhatsApp
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </form>
        )}

        {/* TAB 2: PROFILE IDENTITAS PT / CV */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfileForm} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama PT / CV (Perusahaan): *
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
                Nama PIC / Estimator: *
              </label>
              <input
                type="text"
                required
                placeholder="Pak Hendra / Bpk. Mahendra"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nomor WhatsApp Aktif: *
              </label>
              <input
                type="tel"
                required
                placeholder="081234567890"
                value={profileWhatsapp}
                onChange={(e) => setProfileWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Alamat Email (Opsional):
              </label>
              <input
                type="email"
                placeholder="kontraktor@ptgraha.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Smart Curation Alert Preferences */}
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
                Atur kriteria lelang yang ingin dikirimkan otomatis ke WhatsApp Anda (3-5 lelang paling relevan per hari):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kluster Pengadaan:
                  </label>
                  <select
                    value={cluster}
                    onChange={(e) => setCluster(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
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
                  placeholder="Contoh: Aspal, Dermaga, RSUD, Pipa HDPE"
                  value={specialKeywords}
                  onChange={(e) => setSpecialKeywords(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
              >
                Simpan Profil Kontraktor
              </button>

              {userProfile && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-red-400 font-semibold text-xs border border-slate-800 flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Hapus Sesi Identitas
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
