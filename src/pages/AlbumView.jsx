import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { TEAMS, GROUPS } from '../data/stickers';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';

function StickerCell({ code, qty }) {
  // qty: 0 = missing, 1 = owned, 2+ = duplicate
  const isMissing = qty === 0;
  const isDuplicate = qty > 1;
  const num = code.replace(/^[A-Z]+/, '');

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative flex flex-col items-center justify-center rounded-xl text-center select-none"
      style={{
        aspectRatio: '1',
        background: isMissing
          ? 'rgba(255,255,255,0.05)'
          : isDuplicate
          ? 'rgba(255,223,0,0.15)'
          : `${GREEN}25`,
        border: isMissing
          ? '1px solid rgba(255,255,255,0.08)'
          : isDuplicate
          ? `1px solid rgba(255,223,0,0.4)`
          : `1px solid ${GREEN}55`,
      }}
    >
      <span
        className="text-xs font-black"
        style={{ color: isMissing ? 'rgba(255,255,255,0.2)' : isDuplicate ? YELLOW : '#4ade80' }}
      >
        {num}
      </span>
      {isDuplicate && (
        <span
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shadow-sm"
          style={{ background: YELLOW, color: '#000' }}
        >
          {qty}
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
  const color = team?.color || GREEN;

  // Build sticker list for this country
  const stickers = [];
  for (let i = 1; i <= total; i++) {
    const c = `${teamCode}${i}`;
    stickers.push({ code: c, qty: collection[c] || 0 });
  }

  const duplicatesInCountry = stickers.filter((s) => s.qty > 1);
  const ownedInCountry = stickers.filter((s) => s.qty >= 1).length;

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}18, rgba(0,0,0,0.3))`,
        border: `1px solid ${color}35`,
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-3.5"
      >
        <span className="text-2xl">{team?.flag}</span>
        <div className="flex-1 text-left">
          <p className="font-bold text-white text-sm leading-tight">{team?.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}bb, ${color})` }}
              />
            </div>
            <span className="text-[10px] font-bold shrink-0" style={{ color: `${color}cc` }}>{ownedInCountry}/{total}</span>
          </div>
        </div>
        {duplicatesInCountry.length > 0 && (
          <span
            className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black"
            style={{ background: 'rgba(255,223,0,0.2)', color: YELLOW, border: '1px solid rgba(255,223,0,0.35)' }}
          >
            {duplicatesInCountry.length} rep.
          </span>
        )}
        <div style={{ color: 'rgba(255,255,255,0.25)' }}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-3.5 pb-3.5">
              {duplicatesInCountry.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold w-full" style={{ color: `${YELLOW}aa` }}>Repetidas:</span>
                  {duplicatesInCountry.map((s) => (
                    <span
                      key={s.code}
                      className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg"
                      style={{ background: 'rgba(255,223,0,0.15)', border: '1px solid rgba(255,223,0,0.3)', color: YELLOW }}
                    >
                      {s.code} x{s.qty}
                    </span>
                  ))}
                </div>
              )}
              <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {stickers.map((s) => (
                  <StickerCell key={s.code} code={s.code} qty={s.qty} />
                ))}
              </div>
              <div className="flex gap-3 mt-2.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: `${GREEN}55` }} />Tenho</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: 'rgba(255,223,0,0.4)' }} />Repetida</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />Falta</span>
              </div>
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
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-lg"
          style={{ background: `linear-gradient(135deg, #005c27, ${GREEN})`, color: YELLOW, boxShadow: `0 4px 12px ${GREEN}44` }}
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
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white mb-4"
        style={{
          background: 'linear-gradient(135deg, #003d1a, #005c27, #003d1a)',
          border: `1px solid ${GREEN}44`,
          boxShadow: `0 0 40px ${GREEN}22`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, #002776, ${GREEN}, ${YELLOW}, ${GREEN}, #002776)` }} />
        <div className="flex items-center gap-3">
          <span className="text-3xl">📗</span>
          <div>
            <h1 className="text-xl font-black">Album Completo</h1>
            <p className="text-white/40 text-xs">Toque em um pais para ver as figurinhas</p>
          </div>
        </div>
      </motion.div>

      {Object.entries(GROUPS).map(([group, teams]) => (
        <GroupSection key={group} group={group} teams={teams} />
      ))}
    </div>
  );
}
