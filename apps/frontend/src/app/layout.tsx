import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Flame, Clock, PiggyBank } from 'lucide-react';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kerja Dulu? — Anti-FOMO & Impulsive Spending Advisor',
  description: 'Ubah nominal harga barang menjadi jam kerja riil sebelum checkout. Tahan nafsu belanja impulsif dengan 72-Hour Cooling Vault.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-slate-100 hover:text-amber-400 transition-colors"
            >
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Flame className="w-5 h-5" />
              </span>
              <span>Kerja Dulu?</span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
              >
                Evaluator
              </Link>
              <Link
                href="/vault"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Cooling Vault</span>
              </Link>
              <Link
                href="/saved"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all flex items-center gap-1.5"
              >
                <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
                <span>Money Saved</span>
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
