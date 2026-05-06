import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { GROUPS, TEAMS } from '../data/stickers';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
};

function StickerCell({ code, state, quantity }) {
  const styles = {
    owned: {
      background: 'rgba(16,185,129,0.2)',
      border: '1px solid rgba(16,185,129,0.5)',
      color: '#34d399',
    },
    duplicate: {
      background: 'rgba(245,158,11,0.2)',
      border: '1px solid rgba(245,158,11,0.5)',
      color: '#fbbf24',
    },
    missing: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: 'rgba(255,255,255,0.2)',
    },
  }[state];

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative rounded-lg text-center py-1.5 text-[10px] font-bold cursor-default select-none"
      style={styles}
    >
      {code}
      {quantity > 1 && (
        <span
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center shadow"
          style={{ background: '#f59e0b', color: 'white' }}
        >
          {quantity}
        </span>
      )}
    </motion.div>
  );
}

function CountryCard({ teamCode }) {
  const { collection, getCountryProgress } = useCollection();
  const [open, setOpen] = useState(false);
  const team = TEAMS[teamCode];
  const { owned, total, pct } = getCountryProgress(teamCode);
  const isComplete = owned === total;

  const stickers = [];
  for (let i = 1; i <= total; i++) {
    const code = `${teamCode}${i}`;
    const qty = collection[code] || 0;
    const state = qty === 0 ? 'missing' : qty === 1 ? 'owned' : 'duplicate';
    stickers.push({ code, state, qty });
  }

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden"
      style={{
        background: open ? `linear-gradient(135deg, ${team.color}18, rgba(255,255,255,0.04))` : 'rgba(255,255,255,0.04)',
        border: isComplete ? `1px solid ${team.color}60` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isComplete ? `0 0 20px ${team.color}20` : 'none',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-3.5 text-left"
      >
        <span className="text-2xl">{team.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm font-bold text-white truncate">{team.name}</span>
            {isComplete && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: `${team.color}30`, color: team.color }}>
                ✓ Completo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: isComplete ? team.color : `linear-gradient(90deg, ${team.color}99, ${team.color})` }}
              />
            </div>
            <span className="text-[11px] font-mono shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{owned}/{total}</span>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)' }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 grid grid-cols-5 gap-1.5">
              {stickers.map(({ code, state, qty }) => (
                <StickerCell key={code} code={code} state={state} quantity={qty} />
              ))}
            </div>
            <div className="flex gap-4 px-3 pb-3 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded" style={{ background: 'rgba(16,185,129,0.6)' }} />Tenho
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded" style={{ background: 'rgba(245,158,11,0.6)' }} />Repetida
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />Falta
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GroupSection({ group, teams }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-1 py-2.5 mb-2"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
        >
          {group}
        </div>
        <span className="font-bold text-white/70 text-sm">Grupo {group}</span>
        <div className="ml-auto" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2 mb-5"
          >
            {teams.map((t) => <CountryCard key={t} teamCode={t} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AlbumView() {
  return (
    <div className="pb-6 space-y-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white mb-4"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 40px rgba(0,0,0,0.3)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)' }}>
            <BookOpen size={20} color="#FFD700" />
          </div>
          <div>
            <h1 className="text-xl font-black">Álbum Completo</h1>
            <p className="text-white/40 text-xs">Toque em um país para expandir</p>
          </div>
        </div>
      </motion.div>

      {Object.entries(GROUPS).map(([group, teams]) => (
        <GroupSection key={group} group={group} teams={teams} />
      ))}
    </div>
  );
}
