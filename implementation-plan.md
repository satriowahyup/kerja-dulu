# 📋 Implementation Plan: "Kerja Dulu?" — Anti-Impulsive Shopping Advisor

> **Project Classification:** B2C AI Lifestyle & Financial Decision App (Portfolio Project #1)  
> **Backend Framework:** Hono v4+ (TypeScript on Cloudflare Workers)  
> **Frontend Framework:** Next.js 15+ (App Router on Cloudflare Pages)  
> **Database:** Cloudflare D1 (Serverless SQLite)  
> **AI Inference:** Cloudflare Workers AI (`@cf/meta/llama-3-8b-instruct`)  
> **Estimated Execution Time:** 7 – 10 Days  

---

## 1. Project Overview & Business Value

Aplikasi web anti-belanja impulsif yang ditujukan untuk Gen Z dan Milenial. Aplikasi ini mencegah perilaku *doom-spending* dan jebakan FOMO dengan cara:
1. **Konversi "Work-Hour Equivalent":** Mengubah nominal harga barang menjadi jumlah jam/hari kerja nyata yang harus dihabiskan pengguna untuk membelinya.
2. **AI Devil’s Advocate (Kritikus Belanja):** Memposisikan model AI sebagai penantang objektif yang memberikan 3 pertanyaan kritis dan argumen logis sebelum pengguna checkout.
3. **The 72-Hour Cooling-Off Vault:** Menyimpan barang impian dalam masa "karantina" 72 jam di basis data Cloudflare D1 untuk meredam dopamin sesaat. Jika setelah 3 hari pengguna membatalkan niat beli, sistem mencatat nominal tersebut ke dalam metrik **"Money Saved Tracker"**.

---

## 2. System Architecture & Data Flow

```text
[ User Browser / Next.js on Cloudflare Pages ]
       │
       │ 1. Input: Nama barang, Harga, Kategori, Gaji bulanan, Jam kerja/minggu
       ▼
[ Cloudflare Worker: Hono API Gateway ]
       │
       ├──► 2. Hitung Metrik Finansial Deterministik (Tanpa LLM)
       │       - Hourly Rate = Gaji / (Jam Kerja * 4.33)
       │       - Work Hours Required = Harga / Hourly Rate
       │       - Opportunity Cost (Contoh: Setara X porsi makan siang)
       │
       │ 3. Dispatch Context + Prompt Evaluasi Belanja
       ▼
[ Cloudflare Workers AI (@cf/meta/llama-3-8b-instruct) ]
       │ 4. Generate: Roasting/Kritik objektif, Alternatif hemat, Pertanyaan reflektif
       ▼
[ Hono Validation Layer (Zod) ]
       │ 5. Parse output strictly ke schema JSON
       ▼
[ Cloudflare D1 Database ]
       │ 6. Simpan item ke tabel `cooling_vault` dengan unlock_at = NOW() + 72 jam
       ▼
[ Next.js Dashboard UI ]
       │ 7. Tampilkan Verdict Card + Timer Hitung Mundur 72 Jam