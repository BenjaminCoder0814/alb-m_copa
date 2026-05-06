import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useCollection } from '../store/CollectionContext';
import { albumStructure } from '../data/stickers';

const GREEN  = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE   = '#002776';
const BG_DARK = '#011a07';

// ─── StickerCell ────────────────────────────────────────────────────────────
function StickerCell({ code, qty, onAdd, onRemove }) {
  const holdRef = useRef(null);
  const didHold = useRef(false);

  const startHold = () => {
    didHold.current = false;
    holdRef.current = setTimeout(() => {
      didHold.current = true;
      onRemove(code);
    }, 600);
  };

  const endHold = () => {
    clearTimeout(holdRef.current);
  };

  const handleClick = () => {
    if (!didHold.current) onAdd(code);
    didHold.current = false;
  };

  let bg, textColor, border;
  if (!qty) {
    bg = 'rgba(255,255,255,0.06)';
    textColor = 'rgba(255,255,255,0.2)';
    border = '1px solid rgba(255,255,255,0.08)';
  } else if (qty === 1) {
    bg = `${GREEN}cc`;
    textColor = '#fff';
    border = `1px solid ${GREEN}`;
  } else {
    bg = `${YELLOW}dd`;
    textColor = '#000';
    border = `1px solid ${YELLOW}`;
  }

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onClick={handleClick}
      style={{ background: bg, border, color: textColor }}
      className="w-7 h-7 rounded-md text-[10px] font-black flex items-center justify-center shrink-0 select-none transition-all duration-100 active:scale-90 cursor-pointer"
      title={`${code} — ${!qty ? 'falta' : qty === 1 ? 'tenho' : `repetida x${qty}`}\nClique para adicionar • Segure para remover`}
    >
      {qty > 1 ? qty : ''}
    </button>
  );
}

// ─── CountryRow ─────────────────────────────────────────────────────────────
function CountryRow({ country, collection, onAdd, onRemove }) {
  const { name, code, flag, stickers } = country;
  const owned = Array.from({ length: stickers }, (_, i) => collection[`${code}${i + 1}`] ? 1 : 0)
    .reduce((s, v) => s + v, 0);

  return (
    <div className="flex items-center gap-0 min-w-0">
      {/* Sticky country name */}
      <div
        className="shrink-0 flex flex-col justify-center px-2 py-1 z-10"
        style={{
          width: 110,
          minWidth: 110,
          background: 'linear-gradient(90deg, #003d1a 80%, transparent)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-1">
          <span className="text-base leading-none">{flag}</span>
          <span className="text-[10px] font-black text-white/90 truncate">{name}</span>
        </div>
        <span className="text-[9px] mt-0.5" style={{ color: owned === stickers ? YELLOW : 'rgba(255,255,255,0.4)' }}>
          {owned}/{stickers}
        </span>
      </div>

      {/* Sticker cells — scrollable */}
      <div className="flex gap-1 px-2 py-1.5 overflow-x-auto scrollbar-none flex-1">
        {Array.from({ length: stickers }, (_, i) => {
          const n = i + 1;
          const sCode = `${code}${n}`;
          return (
            <div key={n} className="flex flex-col items-center gap-0.5 shrink-0">
              <span className="text-[7px] text-white/20 leading-none">{n}</span>
              <StickerCell
                code={sCode}
                qty={collection[sCode] || 0}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── InitialSection ──────────────────────────────────────────────────────────
function InitialSection({ section, collection, onAdd, onRemove, expanded, onToggle }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ border: `1px solid rgba(201,168,76,0.3)` }}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(0,0,0,0.3))' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <span className="text-sm font-black text-white">{section.section}</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}>
            {section.stickers.length} figurinhas
          </span>
        </div>
        {expanded ? <ChevronDown size={16} className="text-white/50" /> : <ChevronRight size={16} className="text-white/50" />}
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-white/5">
              {section.stickers.map((s) =>
                s.numbers.map((n) => {
                  const code = `${s.code}${n}`;
                  const qty = collection[code] || 0;
                  let cellBg = 'rgba(255,255,255,0.06)';
                  if (qty === 1) cellBg = `${GREEN}cc`;
                  if (qty > 1) cellBg = `${YELLOW}dd`;
                  return (
                    <div key={code} className="flex items-center gap-3 px-4 py-2">
                      <span className="text-xl w-8 text-center">{s.flag}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white">{s.name}</p>
                        <p className="text-[9px] text-white/40">{code}</p>
                      </div>
                      <StickerCell code={code} qty={qty} onAdd={onAdd} onRemove={onRemove} />
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── GroupSection ────────────────────────────────────────────────────────────
function GroupSection({ section, collection, onAdd, onRemove, expanded, onToggle }) {
  const { group, groupCode, color = GREEN, countries } = section;
  const totalGroup = countries.reduce((s, c) => s + c.stickers, 0);
  const ownedGroup = countries.reduce((sum, c) => {
    for (let i = 1; i <= c.stickers; i++) {
      if (collection[`${c.code}${i}`]) sum++;
    }
    return sum;
  }, 0);
  const pct = ((ownedGroup / totalGroup) * 100).toFixed(0);

  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ border: `1px solid ${color}30` }}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${color}18, rgba(0,0,0,0.35))` }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
          style={{ background: `linear-gradient(135deg, ${color}66, ${color})`, color: '#fff' }}
        >
          {groupCode}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-black text-white">{group}</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {countries.map(c => c.flag + ' ' + c.name).join(' · ')}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-black" style={{ color }}>{ownedGroup}/{totalGroup}</p>
          <p className="text-[9px] text-white/30">{pct}%</p>
        </div>
        {expanded ? <ChevronDown size={16} className="text-white/50" /> : <ChevronRight size={16} className="text-white/50" />}
      </button>

      {/* Progress bar */}
      <div className="h-1" style={{ background: `${color}18` }}>
        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>

      {/* Country rows */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Numbers header row */}
            <div className="flex items-center gap-0 bg-black/20 border-b border-white/5">
              <div className="shrink-0" style={{ width: 110, minWidth: 110 }}>
                <p className="text-[9px] text-white/30 px-2 py-1">Seleção</p>
              </div>
              <div className="flex gap-1 px-2 py-1 overflow-x-auto scrollbar-none flex-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <span key={i} className="w-7 shrink-0 text-center text-[7px] text-white/25">
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>

            {/* Country rows */}
            <div className="divide-y divide-white/5">
              {countries.map((c) => (
                <CountryRow
                  key={c.code}
                  country={c}
                  collection={collection}
                  onAdd={onAdd}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── QuickAddInput ────────────────────────────────────────────────────────────
function QuickAddInput({ onAdd }) {
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const inputRef = useRef(null);

  const submit = () => {
    const raw = value.trim();
    if (!raw) return;
    const result = onAdd(raw);
    if (result.invalid.length > 0 && result.new.length === 0 && result.duplicate.length === 0) {
      setFeedback({ type: 'error', msg: `"${raw}" não encontrado` });
    } else if (result.new.length > 0) {
      setFeedback({ type: 'success', msg: `✓ ${result.new.join(', ')} adicionada!` });
    } else {
      setFeedback({ type: 'warn', msg: `${result.duplicate.join(', ')} repetida +1` });
    }
    setValue('');
    setTimeout(() => setFeedback(null), 2500);
    inputRef.current?.focus();
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Ex: BRA1, CAN5, FRA12..."
            className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm font-mono text-white placeholder-white/25 outline-none"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
        </div>
        <button
          onClick={submit}
          className="px-4 py-2.5 rounded-xl text-sm font-black text-black transition-all active:scale-95"
          style={{ background: `linear-gradient(135deg, ${GREEN}, #00b347)` }}
        >
          +
        </button>
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs mt-1.5 px-1 font-bold"
            style={{
              color: feedback.type === 'success' ? GREEN : feedback.type === 'error' ? '#ef4444' : YELLOW,
            }}
          >
            {feedback.msg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Legend ──────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex items-center gap-4 mb-4 px-1">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded" style={{ background: `${GREEN}cc`, border: `1px solid ${GREEN}` }} />
        <span className="text-[10px] text-white/50">Tenho</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded" style={{ background: `${YELLOW}dd`, border: `1px solid ${YELLOW}` }} />
        <span className="text-[10px] text-white/50">Repetida</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }} />
        <span className="text-[10px] text-white/50">Falta</span>
      </div>
      <span className="text-[9px] text-white/25 ml-auto">Segure = remover</span>
    </div>
  );
}

// ─── AlbumView (main) ─────────────────────────────────────────────────────────
export default function AlbumView() {
  const { collection, addStickers, removeSticker } = useCollection();
  const [expanded, setExpanded] = useState({ 'Página Inicial': true });

  const toggle = useCallback((key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleAdd = useCallback((raw) => addStickers(raw), [addStickers]);
  const handleRemove = useCallback((code) => removeSticker(code), [removeSticker]);

  const totalStickers = albumStructure.reduce((sum, s) => {
    if (s.type === 'initial') return sum + s.stickers.reduce((a, x) => a + x.numbers.length, 0);
    return sum + s.countries.reduce((a, c) => a + c.stickers, 0);
  }, 0);
  const ownedCount = Object.keys(collection).length;
  const pctComplete = totalStickers ? ((ownedCount / totalStickers) * 100).toFixed(1) : '0.0';

  return (
    <div className="pb-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-4 mb-4"
        style={{
          background: 'linear-gradient(135deg, #003d1a 0%, #005c27 60%, #003d1a 100%)',
          border: `1px solid ${GREEN}40`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-base">📒</span>
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: YELLOW }}>Álbum Completo</span>
            </div>
            <h2 className="text-xl font-black text-white">Copa do Mundo 2026</h2>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black" style={{ color: GREEN }}>{pctComplete}%</p>
            <p className="text-[10px] text-white/40">{ownedCount}/{totalStickers}</p>
          </div>
        </div>
        {/* Overall progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pctComplete}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW})` }}
          />
        </div>
      </motion.div>

      {/* ── Quick Add ── */}
      <QuickAddInput onAdd={handleAdd} />

      {/* ── Legend ── */}
      <Legend />

      {/* ── Expand / Collapse All ── */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            const all = {};
            albumStructure.forEach((s) => {
              all[s.groupCode || s.section] = true;
            });
            setExpanded(all);
          }}
          className="flex-1 text-xs font-bold py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
        >
          Expandir tudo
        </button>
        <button
          onClick={() => setExpanded({})}
          className="flex-1 text-xs font-bold py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
        >
          Recolher tudo
        </button>
      </div>

      {/* ── Sections ── */}
      {albumStructure.map((section) => {
        if (section.type === 'initial') {
          const sKey = section.section;
          return (
            <InitialSection
              key={sKey}
              section={section}
              collection={collection}
              onAdd={handleAdd}
              onRemove={handleRemove}
              expanded={!!expanded[sKey]}
              onToggle={() => toggle(sKey)}
            />
          );
        }
        return (
          <GroupSection
            key={section.groupCode}
            section={section}
            collection={collection}
            onAdd={handleAdd}
            onRemove={handleRemove}
            expanded={!!expanded[section.groupCode]}
            onToggle={() => toggle(section.groupCode)}
          />
        );
      })}
    </div>
  );
}
