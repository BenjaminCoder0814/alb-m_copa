import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { TEAMS, STICKER_MAP } from '../data/stickers';
import { Minus, ArrowLeftRight, Copy, X, CheckCircle2, XCircle } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';

function TradeModal({ sticker, onClose, onTrade }) {
  const [giveCode, setGiveCode] = useState(sticker.code);
  const [receiveCode, setReceiveCode] = useState('');
  const [result, setResult] = useState(null);
  const normalizedGive = giveCode.trim().toUpperCase();
  const normalizedReceive = receiveCode.trim().toUpperCase();
  const isGiveValid = !!STICKER_MAP[normalizedGive];
  const isReceiveValid = !!STICKER_MAP[normalizedReceive];
  const canConfirm = isGiveValid && normalizedGive && isReceiveValid && normalizedReceive;

  const handleTrade = () => {
    if (!canConfirm) return;
    const res = onTrade(normalizedGive, normalizedReceive);
    setResult(res);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl p-6 space-y-4"
        style={{ background: '#0d2d18', border: `1px solid ${GREEN}44`, boxShadow: `0 0 60px ${GREEN}33` }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-black text-white text-lg">Registrar Troca</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <X size={16} color="white" />
          </button>
        </div>

        {/* Give */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(239,68,68,0.8)' }}>🔴 Você DEU</p>
          <input
            value={giveCode}
            onChange={(e) => { setGiveCode(e.target.value.toUpperCase()); setResult(null); }}
            placeholder="Codigo da figurinha que você deu..."
            className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none tracking-widest"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: `2px solid ${isGiveValid && normalizedGive ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.12)'}`,
              color: 'white',
              caretColor: YELLOW,
            }}
          />
          {normalizedGive && !isGiveValid && (
            <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>Codigo invalido</p>
          )}
          {normalizedGive && isGiveValid && (
            <p className="text-xs mt-1.5" style={{ color: 'rgba(239,68,68,0.8)' }}>
              {TEAMS[STICKER_MAP[normalizedGive]?.country]?.flag} {STICKER_MAP[normalizedGive]?.countryName} · #{STICKER_MAP[normalizedGive]?.number}
            </p>
          )}
        </div>

        {/* Receive */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: `${GREEN}cc` }}>🟢 Você RECEBEU</p>
          <input
            value={receiveCode}
            onChange={(e) => { setReceiveCode(e.target.value.toUpperCase()); setResult(null); }}
            placeholder="Codigo da figurinha que você recebeu..."
            className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none tracking-widest"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: `2px solid ${isReceiveValid && normalizedReceive ? GREEN + '77' : 'rgba(255,255,255,0.12)'}`,
              color: 'white',
              caretColor: YELLOW,
            }}
            autoFocus
          />
          {normalizedReceive && !isReceiveValid && (
            <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>Codigo invalido</p>
          )}
          {normalizedReceive && isReceiveValid && (
            <p className="text-xs mt-1.5" style={{ color: GREEN }}>
              {TEAMS[STICKER_MAP[normalizedReceive]?.country]?.flag} {STICKER_MAP[normalizedReceive]?.countryName} · #{STICKER_MAP[normalizedReceive]?.number}
            </p>
          )}
        </div>

        {/* Result feedback */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-3.5 flex items-center gap-3"
              style={{
                background: result.success ? `${GREEN}18` : 'rgba(239,68,68,0.12)',
                border: `1px solid ${result.success ? GREEN + '44' : 'rgba(239,68,68,0.3)'}`,
              }}
            >
              {result.success ? <CheckCircle2 size={18} color={GREEN} /> : <XCircle size={18} color="#f87171" />}
              <p className="text-sm font-bold text-white">{result.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-3 rounded-2xl font-bold text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            Cancelar
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleTrade}
            disabled={!canConfirm}
            className="py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
            style={{
              background: canConfirm ? `linear-gradient(135deg, #005c27, ${GREEN})` : 'rgba(255,255,255,0.05)',
              color: canConfirm ? 'white' : 'rgba(255,255,255,0.2)',
              border: `1px solid ${canConfirm ? GREEN + '55' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <ArrowLeftRight size={15} />
            Confirmar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DuplicateCard({ sticker, onRemove, onTrade, index }) {
  const [showModal, setShowModal] = useState(false);
  const team = TEAMS[sticker.country];

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20, height: 0 }}
        transition={{ delay: index * 0.03 }}
        className="flex items-center gap-3 rounded-2xl p-3.5"
        style={{
          background: `linear-gradient(135deg, ${team?.color || GREEN}10, rgba(0,0,0,0.2))`,
          border: `1px solid ${team?.color || GREEN}30`,
        }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `${team?.color || GREEN}20`, border: `1px solid ${team?.color || GREEN}40` }}
        >
          {team?.flag}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-sm font-mono tracking-wider">{sticker.code}</p>
          <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{team?.name}</p>
        </div>
        <div
          className="px-2.5 py-1 rounded-xl font-black text-sm shrink-0"
          style={{ background: 'rgba(255,223,0,0.15)', color: YELLOW, border: '1px solid rgba(255,223,0,0.3)' }}
        >
          x{sticker.quantity}
        </div>
        <div className="flex gap-1.5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowModal(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${GREEN}20`, border: `1px solid ${GREEN}44` }}
            title="Registrar troca"
          >
            <ArrowLeftRight size={14} color={GREEN} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onRemove(sticker.code)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
            title="Remover uma copia"
          >
            <Minus size={14} color="#f87171" />
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <TradeModal
            sticker={sticker}
            onClose={() => setShowModal(false)}
            onTrade={(giveCode, receiveCode) => {
              const res = onTrade(giveCode, receiveCode);
              if (res.success) setTimeout(() => setShowModal(false), 1500);
              return res;
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function DuplicateList() {
  const { getDuplicateStickers, removeSticker, tradeSticker } = useCollection();
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
          background: 'linear-gradient(135deg, #2d1a00, #3d2400, #2d1a00)',
          border: `1px solid rgba(255,223,0,0.3)`,
          boxShadow: `0 0 40px rgba(255,223,0,0.08)`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, #002776, ${GREEN}, ${YELLOW}, ${GREEN}, #002776)` }} />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: YELLOW }} />
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,223,0,0.15)', border: '1px solid rgba(255,223,0,0.35)' }}>
            <Copy size={20} color={YELLOW} />
          </div>
          <div>
            <h1 className="text-xl font-black">Repetidas</h1>
            <p className="text-white/40 text-xs">Gerencie trocas com amigos</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <p className="text-2xl font-black" style={{ color: YELLOW }}>{duplicates.length}</p>
            <p className="text-[10px] text-white/40 uppercase">tipos</p>
          </div>
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <p className="text-2xl font-black" style={{ color: GREEN }}>{totalExtra}</p>
            <p className="text-[10px] text-white/40 uppercase">copias extras</p>
          </div>
        </div>
      </motion.div>

      {duplicates.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎉</p>
          <p className="font-bold text-white">Nenhuma repetida ainda!</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Continue colando figurinhas!</p>
        </div>
      ) : (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar figurinha ou pais..."
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1.5px solid rgba(255,255,255,0.1)`,
              color: 'white',
            }}
          />

          <p className="text-[10px] px-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
            ↔ Toque em ↔ para registrar troca (dar + receber) · − para remover 1 copia
          </p>

          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((s, i) => (
                <DuplicateCard
                  key={s.code}
                  sticker={s}
                  onRemove={removeSticker}
                  onTrade={tradeSticker}
                  index={i}
                />
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
