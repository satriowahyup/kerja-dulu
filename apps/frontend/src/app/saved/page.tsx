'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PiggyBank, Clock, ArrowLeft, RefreshCw, AlertCircle, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface SavingsSummary {
  total_saved: number;
  total_hours_reclaimed: number;
  saved_count: number;
}

interface SavedHistoryItem {
  id: string;
  user_id: string;
  vault_item_id: string;
  saved_amount: number;
  hours_reclaimed: number;
  created_at: string;
  item_name?: string;
  item_category?: string;
  price?: number;
  ai_verdict?: string;
}

export default function SavedPage() {
  const [summary, setSummary] = useState<SavingsSummary>({
    total_saved: 0,
    total_hours_reclaimed: 0,
    saved_count: 0,
  });
  const [history, setHistory] = useState<SavedHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/vault/savings`);
      if (!res.ok) throw new Error('Gagal mengambil data savings analytics');
      const json = await res.json();
      if (json.success) {
        setSummary(json.data.summary || { total_saved: 0, total_hours_reclaimed: 0, saved_count: 0 });
        setHistory(json.data.history || []);
      } else {
        throw new Error(json.error || 'Terjadi kesalahan sistem');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gagal memuat analitik penghematan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  return (
    <main className="min-h-screen text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Evaluator
              </Link>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <PiggyBank className="w-7 h-7 text-emerald-400" />
              <span>Money Saved Analytics</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Rayakan kemenangan disiplin finansial Anda. Setiap godaan belanja impulsif yang Anda batalkan tercatat di sini.
            </p>
          </div>

          <button
            onClick={fetchSavings}
            disabled={loading}
            className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Analytics Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Total Money Saved */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-emerald-500/20">
              <TrendingUp className="w-16 h-16" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Total Diselamatkan
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-2">
              Rp {summary.total_saved.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dari {summary.saved_count} keputusan impulsif yang berhasil ditolak
            </p>
          </div>

          {/* Card 2: Hours Reclaimed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-amber-500/10">
              <Clock className="w-16 h-16" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Waktu Kerja Ditebus
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-2">
              {Number(summary.total_hours_reclaimed).toFixed(1)} Jam
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Setara ~{(Number(summary.total_hours_reclaimed) / 8).toFixed(1)} hari kerja penuh
            </p>
          </div>

          {/* Card 3: Items Resisted */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Barang Dibatalkan
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-200 mt-2">
              {summary.saved_count} Barang
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Lolos dari jerat flash sale & dorongan FOMO
            </p>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <span>Riwayat Penghematan Terkumpul</span>
          </h2>

          {loading && history.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
              <p className="text-slate-400 text-xs">Memuat riwayat...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-3">
              <PiggyBank className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-xs">Belum ada riwayat belanja yang dibatalkan.</p>
              <Link
                href="/vault"
                className="inline-block text-xs font-semibold text-amber-400 hover:underline"
              >
                Cek barang di 72-Hour Vault &rarr;
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Barang</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Uang Diselamatkan</th>
                    <th className="py-3 px-3">Jam Kerja Ditebus</th>
                    <th className="py-3 px-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {history.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-slate-200">
                        {row.item_name || 'Barang Impulsif'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 capitalize">
                        {row.item_category || 'Lainnya'}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-400">
                        + Rp {row.saved_amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 text-amber-300 font-medium">
                        {row.hours_reclaimed} Jam
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {new Date(row.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
