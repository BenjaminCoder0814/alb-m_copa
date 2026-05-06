import { motion } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { ALL_STICKERS, GROUPS, TEAMS } from '../data/stickers';
import { TrendingUp, Star, Copy, AlertCircle, Trophy } from 'lucide-react';

function StatCard({ icon: Icon, label, value, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      className="relative overflow-hidden rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
    >
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 blur-2xl ${gradient}`} />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${gradient}`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      <p className="text-xs text-white/50 font-medium mt-0.5 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

function CircleProgress({ pct }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r}
          fill="none" stroke="url(#goldGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-4xl font-black text-white leading-none"
        >
          {pct}%
        </motion.span>
        <span className="text-xs text-white/50 mt-1 uppercase tracking-widest">completo</span>
      </div>
    </div>
  );
}

function GroupBar({ group, data, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      className="flex items-center gap-3 py-1.5"
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
        <span className="text-[11px] font-black text-white">{group}</span>
      </div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)' }}
          initial={{ width: 0 }}
          animate={{ width: `${data.pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.05 * index }}
        />
      </div>
      <span className="text-xs text-white/40 w-14 text-right font-mono">{data.owned}/{data.total}</span>
    </motion.div>
  );
}

export default function Dashboard() {
  const { getOwnedCount, getTotalDuplicates, calculateProgress, getGroupProgress } = useCollection();

  const owned = getOwnedCount();
  const duplicates = getTotalDuplicates();
  const missing = ALL_STICKERS.length - owned;
  const pct = calculateProgress();
  const groupProgress = getGroupProgress();

  return (
    <div className="space-y-5 pb-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #0d1b4b 0%, #1a3a8f 40%, #0d1b4b 100%)',
          border: '1px solid rgba(255,215,0,0.2)',
          boxShadow: '0 0 60px rgba(29,78,216,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }} />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

        {/* Gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />

        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#FFD700' }}>
              ⚽ FIFA World Cup 2026
            </p>
            <h1 className="text-3xl font-black tracking-tight leading-none">Meu<br />Álbum</h1>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Trophy size={48} className="opacity-80" style={{ color: '#FFD700' }} />
          </motion.div>
        </div>

        <CircleProgress pct={pct} />

        <div className="mt-4 text-center">
          <span className="text-white/60 text-sm">
            <span className="text-white font-bold">{owned}</span> de <span className="text-white font-bold">{ALL_STICKERS.length}</span> figurinhas coletadas
          </span>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Star} label="Coletadas" value={owned} gradient="bg-blue-600" delay={0.1} />
        <StatCard icon={Copy} label="Repetidas" value={duplicates} gradient="bg-amber-500" delay={0.15} />
        <StatCard icon={AlertCircle} label="Faltando" value={missing} gradient="bg-rose-500" delay={0.2} />
        <StatCard icon={TrendingUp} label="Progresso" value={`${pct}%`} gradient="bg-emerald-500" delay={0.25} />
      </div>

      {/* Group progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #FFD700, #C9A84C)' }} />
          <h2 className="text-sm font-bold text-white/70 uppercase tracking-widest">Progresso por Grupo</h2>
        </div>
        {Object.entries(groupProgress).map(([group, data], i) => (
          <GroupBar key={group} group={group} data={data} index={i} />
        ))}
      </motion.div>
    </div>
  );
}
