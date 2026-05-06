import { motion } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { ALL_STICKERS, GROUPS, TEAMS } from '../data/stickers';
import { Download, Upload, Trash2, BarChart2 } from 'lucide-react';
import { useRef } from 'react';

function ProgressRow({ label, pct, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="py-1.5"
    >
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}aa, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay }}
        />
      </div>
    </motion.div>
  );
}

const actionStyle = (variant) => ({
  primary: {
    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    color: 'white',
    border: '1px solid rgba(59,130,246,0.4)',
    boxShadow: '0 4px 20px rgba(59,130,246,0.25)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  danger: {
    background: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.2)',
  },
}[variant]);

export default function Reports() {
  const { getOwnedCount, getTotalDuplicates, calculateProgress, getGroupProgress, getCountryProgress, exportCollection, importCollection, resetCollection } = useCollection();
  const fileRef = useRef(null);

  const owned = getOwnedCount();
  const duplicates = getTotalDuplicates();
  const missing = ALL_STICKERS.length - owned;
  const pct = calculateProgress();
  const groupProgress = getGroupProgress();

  const topCountries = Object.keys(TEAMS)
    .map((code) => ({ code, pct: parseFloat(getCountryProgress(code).pct), ...TEAMS[code] }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);

  const handleImport = (e) => { const f = e.target.files?.[0]; if (f) importCollection(f); };
  const handleReset = () => { if (window.confirm('Apagar toda a colecao?')) resetCollection(); };

  return (
    <div className="pb-6 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e, #2d1a4b, #1a0a2e)',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 0 40px rgba(139,92,246,0.1)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)' }} />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: '#8b5cf6' }} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)' }}>
            <BarChart2 size={20} color="#a78bfa" />
          </div>
          <div>
            <h1 className="text-xl font-black">Relatorio</h1>
            <p className="text-white/40 text-xs">Visao geral da sua colecao</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Coletadas', value: owned, color: '#60a5fa' },
          { label: 'Faltando', value: missing, color: '#f87171' },
          { label: 'Repetidas', value: duplicates, color: '#fbbf24' },
        ].map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl p-3 text-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
            <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #FFD700, #C9A84C)' }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Progresso Total</p>
        </div>
        <ProgressRow label="Album completo" pct={pct} color="#60a5fa" />
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)' }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Por Grupo</p>
        </div>
        {Object.entries(groupProgress).map(([g, d], i) => (
          <ProgressRow key={g} label={`Grupo ${g}`} pct={parseFloat(d.pct)} color="#3b82f6" delay={i * 0.04} />
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #34d399, #10b981)' }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Top Paises</p>
        </div>
        {topCountries.map(({ code, pct: p, name, flag, color }, i) => (
          <div key={code} className="flex items-center gap-2">
            <span className="text-xs w-5 text-center font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>{i + 1}</span>
            <span className="text-base">{flag}</span>
            <div className="flex-1">
              <ProgressRow label={name} pct={p} color={color || '#3b82f6'} delay={i * 0.04} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Dados da Colecao</p>
        {[
          { label: 'Exportar colecao (.json)', icon: Download, action: exportCollection, variant: 'primary' },
          { label: 'Importar colecao', icon: Upload, action: () => fileRef.current?.click(), variant: 'secondary' },
          { label: 'Resetar colecao', icon: Trash2, action: handleReset, variant: 'danger' },
        ].map(({ label, icon: Icon, action, variant }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.98 }}
            onClick={action}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm transition-all"
            style={actionStyle(variant)}
          >
            <Icon size={17} />
            {label}
          </motion.button>
        ))}
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>
    </div>
  );
}
