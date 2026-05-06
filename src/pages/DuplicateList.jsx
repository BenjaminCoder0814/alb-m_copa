import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { TEAMS } from '../data/stickers';
import { Minus, ArrowLeftRight, Copy } from 'lucide-react';

function DuplicateCard({ sticker, onRemove, onTrade, index }) {
  const team = TEAMS[sticker.country];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-3 rounded-2xl p-3.5"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `${team?.color}20`, border: `1px solid ${team?.color}40` }}
      >
        {team?.flag}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm font-mono">{sticker.code}</p>
        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{team?.name}</p>
      </div>
      <div
        className="px-2.5 py-1 rounded-lg font-black text-sm shrink-0"
        style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}
      >
        x{sticker.quantity}
      </div>
      <div className="flex gap-1.5">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onTrade(sticker.code)}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}
          title="Marcar como trocada"
        >
          <ArrowLeftRight size={13} color="#60a5fa" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onRemove(sticker.code)}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
          title="Remover uma copia"
        >
          <Minus size={13} color="#f87171" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function DuplicateList() {
  const { getDuplicateStickers, removeSticker, markTraded } = useCollection();
  const [search, setSearch] = useState('');

  const duplicates = getDuplicateStickers();
  const filtered = duplicates.filter((s) =>
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    TEAMS[s.country]?.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalExtra = duplicates.reduce((acc, s) => acc + (s.quantity - 1), 0);

  return (
    <div className="pb-6 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #2d1a00, #451f00, #2d1a00)',
          border: '1px solid rgba(245,158,11,0.3)',
          boxShadow: '0 0 40px rgba(245,158,11,0.1)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }} />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: '#f59e0b' }} />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)' }}>
            <Copy size={20} color="#fbbf24" />
          </div>
          <div>
            <h1 className="text-xl font-black">Repetidas</h1>
            <p className="text-white/40 text-xs">Para trocar com amigos</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <p className="text-2xl font-black" style={{ color: '#fbbf24' }}>{duplicates.length}</p>
            <p className="text-[10px] text-white/40 uppercase">tipos</p>
          </div>
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <p className="text-2xl font-black" style={{ color: '#34d399' }}>{totalExtra}</p>
            <p className="text-[10px] text-white/40 uppercase">copias extras</p>
          </div>
        </div>
      </motion.div>

      {duplicates.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎉</p>
          <p className="font-bold text-white">Nenhuma repetida ainda!</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Continue completando o album</p>
        </div>
      ) : (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar figurinha ou pais..."
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              color: 'white',
            }}
          />
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((s, i) => (
                <DuplicateCard key={s.code} sticker={s} onRemove={removeSticker} onTrade={markTraded} index={i} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <p className="text-center py-10 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Nenhum resultado</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
