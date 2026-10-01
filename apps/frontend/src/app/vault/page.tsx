'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ShieldCheck, ShoppingCart, XCircle, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import CountdownTimer from '../../components/CountdownTimer';

interface VaultItem {
  id: string;
  user_id: string;
  item_name: string;
  item_category: string;
  price: number;
  work_hours_required: number;
  reason_to_buy?: string | null;
  ai_verdict: string;
  ai_roast_critique: string;
  ai_reality_check: string;
  status: 'cooling' | 'bought' | 'passed';
  created_at: string;
  unlock_at: string;
  is_unlocked?: number;
}

export default function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'cooling' | 'resolved'>('all');

  const fetchVaultItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/vault`);
      if (!res.ok) throw new Error('Gagal mengambil data vault');
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
      } else {
        throw new Error(json.error || 'Terjadi kesalahan sistem');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gagal memuat daftar vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultItems();
  }, []);

  const handleAction = async (id: string, action: 'passed' | 'bought') => {
    try {
      setProcessingId(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/vault/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchVaultItems();
      } else {
        alert(json.error || 'Gagal memperbarui status');
      }
    } catch (err: any) {
      alert(err?.message || 'Terjadi kesalahan');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'cooling') return item.status === 'cooling';
    if (filter === 'resolved') return item.status === 'passed' || item.status === 'bought';
    return true;
  });

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
              <Clock className="w-7 h-7 text-amber-500" />
              <span>72-Hour Cooling Vault</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Karantina niat belanja selama 3 hari. Buktikan apakah ini kebutuhan riil atau hanya dorongan FOMO.
            </p>
          </div>

          <button
            onClick={fetchVaultItems}
            disabled={loading}
            className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            onClick={() => setFilter('cooling')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'cooling'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sedang Dikarantina ({items.filter((i) => i.status === 'cooling').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'resolved'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terselesaikan ({items.filter((i) => i.status !== 'cooling').length})
          </button>
        </div>

        {/* Content */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
            <p className="text-slate-400 text-sm">Memuat item cooling vault...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 space-y-4">
            <Clock className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-300">Belum ada item di kategori ini</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Setiap kali Anda mengevaluasi niat belanja di Evaluator, barang akan otomatis masuk ke dalam masa karantina 72 jam di sini.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Mulai Evaluasi Barang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 transition-all hover:border-slate-700/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.item_category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-100 mt-1">{item.item_name}</h2>
                    <p className="text-sm font-semibold text-amber-400 mt-0.5">
                      Rp {item.price.toLocaleString('id-ID')} &bull;{' '}
                      <span className="text-xs font-normal text-slate-400">
                        Setara {item.work_hours_required} jam kerja
                      </span>
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {item.status === 'cooling' ? (
                      <CountdownTimer unlockAt={item.unlock_at} />
                    ) : item.status === 'passed' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" /> Batal Beli (Saved)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        <ShoppingCart className="w-3.5 h-3.5" /> Dibeli
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Roast Quote */}
                <div className="text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-slate-300 italic">
                  "{item.ai_roast_critique}"
                </div>

                {/* Actions for cooling items */}
                {item.status === 'cooling' && (
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      Setelah 72 jam, putuskan apakah Anda masih butuh barang ini:
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(item.id, 'passed')}
                        disabled={processingId === item.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Batalkan Niat Beli</span>
                      </button>
                      <button
                        onClick={() => handleAction(item.id, 'bought')}
                        disabled={processingId === item.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Tetap Beli</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
