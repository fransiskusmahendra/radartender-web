"use client";

import React, { useState, useEffect } from "react";
import { X, UserCheck, ShieldCheck, Crown, LogOut, CheckCircle2 } from "lucide-react";

interface UserProfile {
  companyName: string;
  contactPerson: string;
  whatsapp: string;
  email?: string;
  isPro?: boolean;
  activationCode?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile | null) => void;
}

export function LoginModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}: LoginModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (userProfile) {
      setCompanyName(userProfile.companyName || "");
      setContactPerson(userProfile.contactPerson || "");
      setWhatsapp(userProfile.whatsapp || "");
      setEmail(userProfile.email || "");
    }
  }, [userProfile, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const clean = accessCode.trim().toUpperCase();
    const isPro =
      userProfile?.isPro ||
      clean.startsWith("RT-") ||
      clean.startsWith("PRO") ||
      clean.startsWith("VIP") ||
      clean.startsWith("RADAR") ||
      clean.startsWith("KONTRAKTOR");

    const newProfile: UserProfile = {
      companyName,
      contactPerson,
      whatsapp,
      email,
      isPro: Boolean(isPro),
      activationCode: clean || userProfile?.activationCode,
    };

    onSaveProfile(newProfile);
    onClose();
  };

  const handleLogout = () => {
    onSaveProfile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            Identitas Kontraktor
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {userProfile ? "Profil Akun Anda" : "Masuk / Simpan Identitas"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Informasi ini akan otomatis mengisi formulir saat Anda mengajukan jaminan lelang atau mengaktifkan alert.
          </p>
        </div>

        {userProfile?.isPro && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-5 flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-black text-amber-300 block uppercase tracking-wide">
                Akun Berlangganan PRO Aktif
              </span>
              <span className="text-[11px] text-slate-300">
                Akses alert WhatsApp harian &amp; prioritas penjaminan proyek aktif.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
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
              Nama PIC / Kontak Anda: *
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
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {!userProfile?.isPro && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kode Akses / Order ID PRO (Opsional):
              </label>
              <input
                type="text"
                placeholder="Masukkan Order ID atau kode promo"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                *Memberikan akses status PRO instan jika Anda memiliki kode langganan.
              </span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
            >
              Simpan Identitas
            </button>

            {userProfile && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-red-400 font-semibold text-xs border border-slate-800 flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar / Hapus Identitas
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
