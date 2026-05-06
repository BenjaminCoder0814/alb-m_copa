import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { STICKER_MAP } from '../data/stickers';
import { Plus, Minus, CheckCircle2, XCircle, Copy } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE = '#002776';

export default function StickerInput() {
  const { collection, addStickers, removeSticker } = useCollection();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'duplicate'|'error', message, code }
  const inputRef = useRef(null);

  const normalizedCode = code.trim().toUpperCase();
  const stickerInfo = STICKER_MAP[normalizedCode];
  const currentQty = collection[normalizedCode] || 0;

  const handleAdd = () => {
    if (!normalizedCode) return;
    if (!stickerInfo) {
      setFeedback({ type: 'error', message: `"${normalizedCode}" nao existe no album.` });
      return;
    }
    const res = addStickers(normalizedCode);
    if (res.new.length > 0) {
      setFeedback({ type: 'success', message: `${normalizedCode} adicionada!`, code: normalizedCode });
    } else {
      setFeedback({ type: 'duplicate', message: `${normalizedCode} repetida! Voce ja tem ${currentQty + 1}x`, code: normalizedCode });
    }
    setCode('');
    inputRef.current?.focus();
  };

  const handleRemove = () => {
    if (!normalizedCode || !currentQty) return;
    removeSticker(normalizedCode);
    setFeedback({ type: 'removed', message: `${normalizedCode} removida. Restam ${Math.max(0, currentQty - 1)}x`, code: normalizedCode });
    setCode('');
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: `linear-gradient(135deg, #003d1a 0%, #005c27 50%, #003d1a 100%)`,
          border: `1px solid ${GREEN}55`,
          boxShadow: `0 0 40px ${GREEN}33`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }} />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: YELLOW }} />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg" style={{ background: `${YELLOW}22`, border: `1px solid ${YELLOW}55` }}>
            🇧🇷
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Adicionar Figurinha</h1>
            <p className="text-white/50 text-xs">Uma figurinha por vez, certinho!</p>
          </div>
        </div>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-5 space-y-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div>
          <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: `${YELLOW}cc` }}>
            Codigo da Figurinha
          </label>
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setFeedback(null); }}
            onKeyDown={handleKey}
            placeholder="Ex: BRA1, ARG5, FRA10..."
            className="w-full rounded-2xl px-4 py-4 text-lg font-bold outline-none tracking-widest"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: `2px solid ${stickerInfo ? GREEN + '88' : 'rgba(255,255,255,0.12)'}`,
              color: 'white',
              caretColor: YELLOW,
              letterSpacing: '0.15em',
            }}
          />
        </div>

        {/* Preview */}
        <AnimatePresence mode="wait">
          {stickerInfo && normalizedCode && (
            <motion.div
              key={normalizedCode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-2xl p-3"
              style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}33` }}
            >
              <span className="text-2xl">{stickerInfo.flag || '🏳️'}</span>
              <div className="flex-1">
                <p className="font-black text-white text-sm">{normalizedCode}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{stickerInfo.country} · #{stickerInfo.number}</p>
              </div>
              {currentQty > 0 && (
                <div className="px-2.5 py-1 rounded-xl text-xs font-black" style={{ background: currentQty > 1 ? `rgba(255,223,0,0.2)` : `${GREEN}33`, color: currentQty > 1 ? YELLOW : '#4ade80' }}>
                  {currentQty > 1 ? `${currentQty}x repetida` : 'Ja tenho'}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={!normalizedCode}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm"
            style={{
              background: normalizedCode ? `linear-gradient(135deg, #005c27, ${GREEN})` : 'rgba(255,255,255,0.05)',
              color: normalizedCode ? 'white' : 'rgba(255,255,255,0.2)',
              border: `1px solid ${normalizedCode ? GREEN + '66' : 'rgba(255,255,255,0.07)'}`,
              boxShadow: normalizedCode ? `0 4px 20px ${GREEN}44` : 'none',
            }}
          >
            <Plus size={18} />
            Adicionar
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRemove}
            disabled={!normalizedCode || !currentQty}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm"
            style={{
              background: (normalizedCode && currentQty) ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
              color: (normalizedCode && currentQty) ? '#f87171' : 'rgba(255,255,255,0.2)',
              border: `1px solid ${(normalizedCode && currentQty) ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <Minus size={18} />
            Remover
          </motion.button>
        </div>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: feedback.type === 'success' ? `${GREEN}20` : feedback.type === 'duplicate' ? 'rgba(255,223,0,0.12)' : feedback.type === 'removed' ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${feedback.type === 'success' ? GREEN + '44' : feedback.type === 'duplicate' ? 'rgba(255,223,0,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}
          >
            {feedback.type === 'success' && <CheckCircle2 size={20} color={GREEN} />}
            {feedback.type === 'duplicate' && <Copy size={20} color={YELLOW} />}
            {(feedback.type === 'error' || feedback.type === 'removed') && <XCircle size={20} color="#f87171" />}
            <p className="font-bold text-sm text-white">{feedback.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick examples */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Exemplos de codigos</p>
        <div className="flex flex-wrap gap-2">
          {['BRA1', 'BRA5', 'ARG1', 'FRA10', 'FWC1', 'GER3'].map((ex) => (
            <button
              key={ex}
              onClick={() => { setCode(ex); setFeedback(null); inputRef.current?.focus(); }}
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
