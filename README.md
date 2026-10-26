# RadarTender.id — Indonesian Procurement & Surety Intelligence

Platform SaaS intelijen tender lelang pemerintah (LPSE / SPSE / SIRUP) dan BUMN terintegrasi kalkulator serta layanan pengajuan **Surety Bond & Bank Garansi** berizin Otoritas Jasa Keuangan (OJK).

Engineered & Powered by **CV QIRA Solusi Digital** ([qirasolution.com](https://www.qirasolution.com)).

---

## 🚀 Fitur Utama
1. **Radar Tender Real-Time**: Data lelang nasional terkurasi dengan nilai HPS > Rp 1 Miliar.
2. **Hitung Mundur Penawaran (Countdown)**: Deteksi otomatis batas akhir submisi penawaran lelang untuk menghindari diskualifikasi waktu.
3. **Kalkulator Surety Bond**: Simulasi instan Jaminan Penawaran (1-3%), Jaminan Pelaksanaan (5%), Jaminan Uang Muka (20%), dan Jaminan Pemeliharaan (5%).
4. **Subscription QRIS Otomatis**: Integrasi pembayaran paket langganan Rp 99k / Rp 249k / Rp 799k dengan notifikasi alert Telegram & WhatsApp.
5. **Zero-Rebating Compliance**: Mematuhi penuh aturan OJK dengan skema legal program bundling software IT dari CV QIRA Solusi Digital.

---

## 🛠️ Deploy ke Vercel (100% Gratis)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda (`fransiskusmahendra`).
2. Klik **"Add New..."** -> **"Project"**.
3. Import repositori **`radartender-web`**.
4. Di bagian **Environment Variables**, tambahkan:
   - `RADARTENDER_BOT_TOKEN` = `8833867052:AAENMsY9RnRh_Ycl1tgjaK_3PhgvCAMjRFs`
   - `RADARTENDER_CHAT_ID` = `1013981853`
5. Klik **"Deploy"**.

---

## 🌐 Menghubungkan Domain `radartender.id` dari DomaiNesia
Setelah deploy selesai di Vercel:
1. Di Vercel -> Buka **Settings** -> **Domains**.
2. Masukkan domain: `radartender.id` dan centang opsi add `www.radartender.id`.
3. Buka Dashboard **DomaiNesia** (`dash.domainesia.com`) -> Menu **Domain** -> Klik `radartender.id` -> Tab **DNS Management**:
   - Record 1: Type `A`, Host `@`, Value `76.76.21.21`
   - Record 2: Type `CNAME`, Host `www`, Value `cname.vercel-dns.com`
4. Simpan. Domain Anda akan langsung aktif dengan sertifikat HTTPS (SSL) gratis!
