import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { TEAMS, GROUPS } from '../data/stickers';
import { Search } from 'lucide-react';

function MissingChip({ code }) {
  return (
    <span
      className="inline-flex items-center text-[10px] font-mono font-bold px-2 py-1 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}
    >
      {code}
    </span>
  );
}

export default function MissingList() {
  const { getMissingStickers } = useCollection();
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [filterCountry, setFilterCountry] = useState('ALL');

  const missing = getMissingStickers();
  const groups = ['ALL', ...Object.keys(GROUPS)];

  const countries = useMemo(() => {
    if (filterGroup === 'ALL') return ['ALL', ...Object.keys(TEAMS)];
    return ['ALL', ...(GROUPS[filterGroup] || [])];
  }, [filterGroup]);

  const filtered = useMemo(() => missing.filter((s) => {
    if (filterGroup !== 'ALL' && s.group !== filterGroup) return false;
    if (filterCountry !== 'ALL' && s.country !== filterCountry) return false;
    return true;
  }), [missing, filterGroup, filterCountry]);

  const byCountry = useMemo(() => {
    const map = {};
    for (const s of filtered) {
      if (!map[s.country]) map[s.country] = [];
      map[s.country].push(s);
    }
    return map;
  }, [filtered]);

  return (
    <div className="pb-6 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #1a0a0a, #2d0f0f, #1a0a0a)',
          border: '1px solid rgba(239,68,68,0.25)',
          boxShadow: '0 0 40px rgba(239,68,68,0.08)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #ef4444, transparent)' }} />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15 blur-2xl" style={{ background: '#ef4444' }} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.35)' }}>
            <Search size={20} color="#f87171" />
          </div>
          <div>
            <h1 className="text-xl font-black">Faltando</h1>
            <p className="text-white/40 text-xs">{missing.length} figurinhas para completar o álbum</p>
          </div>
        </div>
      </motion.div>

      {missing.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏆</p>
          <p className="font-black text-xl text-white">Álbum Completo!</p>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Parabéns, você é campeão!</p>
        </div>
      ) : (
        <>
          {/* Group filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => { setFilterGroup(g); setFilterCountry('ALL'); }}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: filterGroup === g ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)',
                  border: filterGroup === g ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.09)',
                  color: filterGroup === g ? '#f87171' : 'rgba(255,255,255,0.45)',
                }}
              >
                {g === 'ALL' ? 'Todos' : `Grupo ${g}`}
              </button>
            ))}
          </div>

          {/* Country filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCountry(c)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: filterCountry === c ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: filterCountry === c ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
                  color: filterCountry === c ? 'white' : 'rgba(255,255,255,0.35)',
                }}
              >
                {c === 'ALL' ? '🌍 Todos' : `${TEAMS[c]?.flag} ${c}`}
              </button>
            ))}
          </div>

          <p className="text-xs px-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{filtered.length} figurinhas</p>

          <div className="space-y-3">
            {Object.entries(byCountry).map(([country, stickers], i) => {
              const team = TEAMS[country];
              return (
                <motion.div
                  key={country}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl p-3.5"
                  style={{ background: `linear-gradient(135deg, ${team?.color}12, rgba(255,255,255,0.03))`, border: `1px solid ${team?.color}25` }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xl">{team?.flag}</span>
                    <span className="text-sm font-bold text-white">{team?.name}</span>
                    <span className="ml-auto text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{stickers.length} faltando</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stickers.map((s) => <MissingChip key={s.code} code={s.code} />)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

