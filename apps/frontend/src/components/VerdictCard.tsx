'use client';

import Link from 'next/link';
import { Clock, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export interface EvaluationResult {
  id: string;
  metrics: {
    hourly_rate: number;
    work_hours_required: number;
    work_days_required: number;
  };
  analysis: {
    ai_verdict: 'dangerously_impulsive' | 'questionable' | 'reasonable';
    ai_roast_critique: string;
    ai_reality_check: string;
    cheaper_alternative?: string | null;
  };
  unlock_at: string;
}

interface VerdictCardProps {
  result: EvaluationResult;
}

export function VerdictCard({ result }: VerdictCardProps) {
  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'dangerously_impulsive':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          label: 'Dangerously Impulsive',
        };
      case 'questionable':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          label: 'Questionable',
        };
      case 'reasonable':
      default:
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          label: 'Reasonable',
        };
    }
  };

  const verdictConfig = getVerdictStyle(result.analysis.ai_verdict);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-in fade-in duration-300">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500">Konversi Waktu Kerja</span>
          <div className="flex items-center gap-2 text-2xl font-black text-amber-400 mt-1">
            <Clock className="w-6 h-6 text-amber-500" />
            <span>
              {result.metrics.work_hours_required} Jam Kerja{' '}
              <span className="text-sm font-normal text-slate-400">
                (~{result.metrics.work_days_required} hari kerja)
              </span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Berdasarkan upah riil: Rp {result.metrics.hourly_rate.toLocaleString('id-ID')} / jam
          </p>
        </div>

        <div className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${verdictConfig.bg}`}>
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{verdictConfig.label}</span>
        </div>
      </div>

      {/* AI Roast Critique */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Reality Roast</span>
        </div>
        <p className="text-slate-200 text-sm leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          "{result.analysis.ai_roast_critique}"
        </p>
      </div>

      {/* AI Reality Check Question */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pertanyaan Reflektif Sebelum Beli</h3>
        <p className="text-amber-200/90 text-sm font-medium bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
          "{result.analysis.ai_reality_check}"
        </p>
      </div>

      {/* Cheaper Alternative if provided */}
      {result.analysis.cheaper_alternative && (
        <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold text-blue-200 mb-0.5">Alternatif Lebih Hemat:</strong>
            {result.analysis.cheaper_alternative}
          </div>
        </div>
      )}

      {/* Vault Status Footer */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-300">Tersimpan di 72-Hour Vault:</span>
          <CountdownTimer unlockAt={result.unlock_at} />
        </div>

        <Link
          href="/vault"
          className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>Ke Cooling Vault</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

export default VerdictCard;
