# 🔥 Kerja Dulu? — Anti-FOMO & Impulsive Shopping Advisor

> **"Sebelum checkout barang impian di keranjang belanja, hitung dulu berapa jam kerja nyata yang harus kamu korbankan untuk membayarnya."**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Hono](https://img.shields.io/badge/Hono-v4-E36002?logo=hono)](https://hono.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare)](https://workers.cloudflare.com/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1_SQLite-F38020?logo=sqlite)](https://developers.cloudflare.com/d1/)
[![Workers AI](https://img.shields.io/badge/Cloudflare-Workers_AI-F38020?logo=meta)](https://developers.cloudflare.com/workers-ai/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://www.typescriptlang.org/)

---

## 📌 Tentang Proyek

**Kerja Dulu?** adalah aplikasi web B2C AI Lifestyle & Financial Decision yang ditujukan bagi Gen Z dan Milenial untuk mencegah kebiasaan *doom-spending*, *impulsive buying*, dan jebakan FOMO dari *flash sale* media sosial.

Aplikasi ini tidak hanya sekadar kalkulator finansial biasa, melainkan bertindak sebagai **penantang objektif (*Devil’s Advocate*)** dengan 4 pilar inti:

1. **⏱️ Konversi "Work-Hour Equivalent" (Deterministik):** Mengubah nominal harga barang menjadi jumlah jam dan hari kerja riil berdasarkan gaji bersih bulanan dan jam kerja mingguan pengguna.
2. **🤖 AI Devil’s Advocate (Workers AI):** Menggunakan model LLM Llama 3.1 8B Instruct di Cloudflare Edge untuk memberikan *roasting* tajam, kritik objektif atas alasan beli, serta pertanyaan reflektif mendalam sebelum checkout.
3. **⏳ The 72-Hour Cooling-Off Vault:** Mengkarantina niat belanja selama 3 hari (72 jam) di basis data Cloudflare D1 dengan hitung mundur (*countdown timer*) interaktif untuk meredakan dorongan dopamin sesaat.
4. **📊 Money Saved Analytics & Hours Reclaimed:** Jika setelah masa karantina pengguna memutuskan untuk membatalkan pembelian (*Pass*), sistem mencatat nominal uang dan jam kerja produktif yang berhasil diselamatkan ke dalam metrik analitik.

---

## 🛠️ Tech Stack & Arsitektur

### 1. Frontend (`apps/frontend`)
* **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack) & [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/postcss`)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State & Handling:** React Hooks (Client Components) & TypeScript Strict Mode

### 2. Backend API (`apps/backend`)
* **Framework:** [Hono v4](https://hono.dev/) (Ultra-fast web framework on Edge)
* **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/) (Serverless V8 isolate)
* **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless relational SQLite)
* **AI Inference:** [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) (`@cf/meta/llama-3.1-8b-instruct`)
* **Validation:** [Zod](https://zod.dev/) & `@hono/zod-validator`
* **Deployment Tooling:** [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### 3. Repository Architecture
* **Workspace Management:** NPM Workspaces Monorepo (`apps/*`)

---

## 📂 Struktur Proyek

```text
kerja-dulu/
├── apps/
│   ├── backend/                         # Cloudflare Worker (Hono API)
│   │   ├── src/
│   │   │   ├── db/
│   │   │   │   └── schema.sql           # Skema tabel SQLite D1
│   │   │   ├── routes/
│   │   │   │   ├── evaluate.ts          # Endpoint POST /api/evaluate (Kalkulasi & Workers AI)
│   │   │   │   └── vault.ts             # Endpoint GET /api/vault & POST :id/action & savings
│   │   │   ├── types.ts                 # Definisi skema Zod & tipe TypeScript
│   │   │   └── index.ts                 # Entry point Hono & mounting sub-router
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── worker-configuration.d.ts    # Type generator Cloudflare Bindings
│   │   └── wrangler.jsonc               # Konfigurasi Cloudflare Workers & D1
│   │
│   └── frontend/                        # Next.js Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx             # Halaman utama: Form input & Live calculator
│       │   │   ├── vault/page.tsx       # Halaman 72-Hour Cooling Vault
│       │   │   ├── saved/page.tsx       # Halaman analitik Money Saved Tracker
│       │   │   ├── layout.tsx           # Navigasi global & layout wrapper
│       │   │   └── globals.css          # Tailwind CSS v4 styling
│       │   └── components/
│       │       ├── VerdictCard.tsx      # Komponen kartu hasil evaluasi AI
│       │       └── CountdownTimer.tsx   # Komponen timer 72 jam live
│       ├── .env.example                 # Contoh variabel lingkungan
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
├── .gitignore                           # Konfigurasi git ignore monorepo
├── implementation-plan.md               # Dokumen rencana implementasi & roadmap
├── package.json                         # Root monorepo configuration
└── README.md                            # Dokumentasi utama proyek
```

---

## 🚀 Panduan Setup & Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk meng-clone dan menjalankan repositori ini di komputer lokal Anda:

### 1. Prasyarat Sistem
* [Node.js](https://nodejs.org/) versi `18.17.0` atau yang lebih baru.
* [NPM](https://www.npmjs.com/) (bawaan Node.js).
* Akun [Cloudflare](https://dash.cloudflare.com/) (gratis) untuk fitur D1 Database & Workers AI.

---

### 2. Clone Repositori & Install Dependensi

```bash
# Clone repositori
git clone https://github.com/username-anda/kerja-dulu.git
cd kerja-dulu

# Install semua dependensi di seluruh workspace monorepo
npm install
```

---

### 3. Setup Backend & Cloudflare D1

Backend menggunakan Cloudflare Workers dengan D1 Database.

#### A. Login ke Cloudflare via Wrangler CLI
```bash
npx wrangler login
```

#### B. Setup Database D1 Lokal
Jalankan migrasi skema tabel ke database lokal SQLite Miniflare:

```bash
# Melalui script root:
npm run db:migrate:local

# Atau langsung dari folder backend:
npm run db:migrate:local --workspace=backend
```

*(Opsional untuk Production Remote D1):*
Jika Anda ingin membuat database D1 di Cloudflare Cloud:
```bash
npx wrangler d1 create kerja-dulu
```
Salin `database_id` yang dihasilkan ke dalam [`apps/backend/wrangler.jsonc`](file:///d:/Work/Freelance/Saas-development/kerja-dulu/apps/backend/wrangler.jsonc), lalu jalankan:
```bash
npm run db:migrate:remote
```

---

### 4. Setup Frontend Environment

Masuk ke folder `apps/frontend/` dan buat file `.env.local` dari `.env.example`:

```bash
# Linux / macOS / Git Bash:
cp apps/frontend/.env.example apps/frontend/.env.local

# Windows PowerShell:
Copy-Item apps/frontend/.env.example apps/frontend/.env.local
```

Isi file `apps/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

---

### 5. Menjalankan Aplikasi (Development Mode)

Buka dua jendela terminal terpisah (atau gunakan fitur background terminal):

#### Terminal 1: Jalankan Backend Worker (Port 8787)
```bash
npm run dev:backend
```
Backend API akan aktif di `http://localhost:8787`.

#### Terminal 2: Jalankan Frontend Next.js (Port 3000)
```bash
npm run dev:frontend
```
Frontend akan aktif di `http://localhost:3000`.

Buka browser Anda dan kunjungi: **`http://localhost:3000`** 🎉

---

## 📡 Referensi API Endpoints

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check runtime Cloudflare Worker & Hono |
| `POST` | `/api/evaluate` | Evaluasi barang, kalkulasi jam kerja, eksekusi AI, dan karantina ke vault |
| `GET` | `/api/vault` | Mengambil seluruh daftar barang di cooling vault beserta status `is_unlocked` |
| `POST` | `/api/vault/:id/action` | Menyelesaikan karantina (`passed` = batal beli & simpan uang, `bought` = tetap beli) |
| `GET` | `/api/vault/savings` | Mengambil ringkasan total uang terselamatkan dan jam kerja yang ditebus |

---

## 📊 Skema Database (`schema.sql`)

Aplikasi menggunakan 3 tabel relasional di Cloudflare D1:

1. **`user_profiles`**: Menyimpan profil pengguna, gaji bulanan, dan upah per jam yang telah dikonversi.
2. **`vault_items`**: Menyimpan barang yang sedang dikarantina selama 72 jam, status (`cooling`, `bought`, `passed`), output AI verdict, serta waktu pembukaan (`unlock_at`).
3. **`savings_tracker`**: Mencatat setiap item yang berhasil dibatalkan pembeliannya (`status = 'passed'`), nominal uang yang terselamatkan, dan jam kerja yang berhasil ditebus.

---

## 🧪 Verifikasi & Build

Untuk memastikan integritas tipe data dan kompilasi bebas error:

```bash
# Typecheck backend
npm run typecheck --workspace=backend

# Build frontend production
npm run build --workspace=frontend
```

---

## 🚢 Deployment

### Deploy Backend ke Cloudflare Workers
```bash
npm run deploy --workspace=backend
```

### Deploy Frontend ke Cloudflare Pages / Vercel
1. Set framework preset ke **Next.js**.
2. Set root directory ke **`apps/frontend`**.
3. Tambahkan environment variable:
   * `NEXT_PUBLIC_API_URL`: URL deployment Cloudflare Worker Anda (misal `https://backend.username.workers.dev`).

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Silakan gunakan dan kembangkan untuk portofolio atau solusi komersial Anda sendiri.
