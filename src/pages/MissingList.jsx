import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { GROUPS, TEAMS } from '../data/stickers';
import { Search } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE = '#002776';

export default function MissingList() {
  const { getMissingStickers } = useCollection();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const missing = getMissingStickers();

  const groups = ['ALL', ...Object.keys(GROUPS)];

  const filtered = missing.filter((s) => {
    const matchGroup = filter === 'ALL' || s.group === filter;
    const matchSearch = search === '' || s.code.toLowerCase().includes(search.toLowerCase()) || (TEAMS[s.country]?.name.toLowerCase().includes(search.toLowerCase()));
    return matchGroup && matchSearch;
  });

  const byCountry = filtered.reduce((acc, s) => {
    if (!acc[s.country]) acc[s.country] = [];
    acc[s.country].push(s);
    return acc;
  }, {});

  return (
    <div className="pb-6 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #001c3d, #002a5c, #001c3d)',
          border: `1px solid ${BLUE}77`,
          boxShadow: `0 0 40px ${BLUE}33`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }} />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-15 blur-2xl" style={{ background: BLUE }} />
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <div>
            <h1 className="text-xl font-black">Faltando</h1>
            <p className="text-white/40 text-xs">{missing.length} figurinhas para completar</p>
          </div>
        </div>
      </motion.div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" color="rgba(255,255,255,0.3)" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar pais ou codigo..."
          className="w-full rounded-xl pl-9 pr-4 py-3 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black transition-all"
            style={{
              background: filter === g ? `linear-gradient(135deg, #005c27, ${GREEN})` : 'rgba(255,255,255,0.06)',
              color: filter === g ? 'white' : 'rgba(255,255,255,0.4)',
              border: filter === g ? `1px solid ${GREEN}55` : '1px solid rgba(255,255,255,0.08)',
              boxShadow: filter === g ? `0 2px 12px ${GREEN}44` : 'none',
            }}
          >
            {g === 'ALL' ? 'Todos' : `Grupo ${g}`}
          </button>
        ))}
      </div>

      {missing.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏆</p>
          <p className="font-bold text-white">Album completo!</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Parabens, voce e campeao!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(byCountry).map(([country, stickers]) => {
            const team = TEAMS[country];
            const color = team?.color || BLUE;
            return (
              <motion.div
                key={country}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: `${color}12`, border: `1px solid ${color}30` }}
              >
                <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ borderBottom: `1px solid ${color}20` }}>
                  <span className="text-xl">{team?.flag}</span>
                  <span className="font-black text-white text-sm">{team?.name || country}</span>
                  <span className="ml-auto text-xs font-bold" style={{ color: `${color}cc` }}>{stickers.length} faltando</span>
                </div>
                <div className="px-4 py-3 flex flex-wrap gap-1.5">
                  {stickers.map((s) => (
                    <span
                      key={s.code}
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                    >
                      {s.code}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
