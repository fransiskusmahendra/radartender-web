"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Share, Check } from "lucide-react";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if dismissed recently (7 days)
    const dismissedAt = localStorage.getItem("radartender_pwa_dismissed");
    if (dismissedAt) {
      const diffDays = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (diffDays < 7) return;
    }

    // Check if already in standalone mode (already installed)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setInstalled(true);
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(ua) && !/(crios|fxios)/.test(ua);
    setIsIOS(isAppleMobile);

    // Listen to Android / Chrome PWA install event
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Tampilkan prompt setelah 3 detik agar user tidak kaget
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // If on iOS and not dismissed, show prompt after 5 seconds
    if (isAppleMobile) {
      const timer = setTimeout(() => setShowPrompt(true), 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem("radartender_pwa_dismissed", Date.now().toString());
  };

  if (installed || !showPrompt) return null;

  return (
    <aside
      aria-label="Pemasangan Aplikasi RadarTender"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-fade-in"
    >
      <div className="p-4 rounded-2xl bg-slate-900/95 border border-amber-500/30 backdrop-blur-md shadow-2xl shadow-slate-950/80 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shrink-0 shadow-md shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              Pasang Aplikasi RadarTender
              <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                PWA
              </span>
            </h4>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              Akses cepat tanpa browser, hemat kuota &amp; lancar di HP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-orange-400 transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pasang</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                Pasang di iPhone / iPad
              </h4>
              <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  Tekan ikon <strong>Share</strong> (kotak panah ke atas) di bagian bawah Safari.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  Gulir ke bawah dan pilih <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home Screen).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  Tekan <strong>Tambah (Add)</strong> di pojok kanan atas. Selesai!
                </span>
              </li>
            </ol>
            <button
              onClick={() => {
                setShowIOSGuide(false);
                handleDismiss();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
