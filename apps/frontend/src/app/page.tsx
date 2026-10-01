'use client';

import { useState } from 'react';
import { Flame, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import VerdictCard, { EvaluationResult } from '../components/VerdictCard';

export default function Home() {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>(6000000);
  const [category, setCategory] = useState('gadget');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live calculation of work hours before submission
  const calculateLiveHours = () => {
    if (!price || !monthlyIncome || Number(monthlyIncome) <= 0) return null;
    const hourlyRate = Number(monthlyIncome) / (40 * 4.33);
    const hours = (Number(price) / hourlyRate).toFixed(1);
    const days = (Number(hours) / 8).toFixed(1);
    return { hours, days, hourlyRate: Math.round(hourlyRate) };
  };

  const liveMetrics = calculateLiveHours();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || !monthlyIncome) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: itemName,
          price: Number(price),
          monthly_income: Number(monthlyIncome),
          item_category: category,
          reason_to_buy: reason,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Server error (${res.status})`);
      }

      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        throw new Error(json.error || 'Gagal mengevaluasi data');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err?.message || 'Terjadi kesalahan saat memproses evaluasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-slate-100 flex flex-col items-center p-6 md:p-12">
      <div className="max-w-2xl w-full space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" /> Anti-FOMO & Impulsive Spending Advisor
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Should I Buy This?</h1>
          <p className="text-slate-400 text-sm">
            Ubah nominal harga barang menjadi jam kerja riil sebelum checkout di e-commerce.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nama Barang / Keinginan</label>
            <input
              type="text"
              required
              placeholder="Contoh: Mechanical Keyboard Wireless RGB"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-200"
              >
                <option value="gadget">Gadget & Tech</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="hobby">Hobi & Koleksi</option>
                <option value="gaming">Gaming & Entertainment</option>
                <option value="fnb">Kuliner / FnB</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Harga Barang (Rp)</label>
              <input
                type="number"
                required
                placeholder="Contoh: 1500000"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Gaji Bersih Bulanan (Rp)</label>
            <input
              type="number"
              required
              placeholder="Contoh: 6000000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {liveMetrics && (
            <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Live Kalkulasi:
              </span>
              <span className="font-semibold text-amber-300">
                Setara ~{liveMetrics.hours} jam kerja ({liveMetrics.days} hari kerja)
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Alasan Mau Beli (Self-justification)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Buat self-reward karena minggu ini capek lembur..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Menganalisis & Mengkarantina Niat Beli...</span>
              </>
            ) : (
              'Evaluasi Keputusan Ini'
            )}
          </button>
        </form>

        {result && <VerdictCard result={result} />}
      </div>
    </main>
  );
}