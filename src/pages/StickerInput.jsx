import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { Zap, CheckCircle2, Copy, AlertTriangle } from 'lucide-react';

function ResultBadge({ type, codes }) {
  if (!codes?.length) return null;
  const config = {
    new: {
      bg: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.3)',
      text: '#34d399',
      icon: <CheckCircle2 size={15} />,
      label: 'Nova',
    },
    duplicate: {
      bg: 'rgba(245,158,11,0.12)',
      border: 'rgba(245,158,11,0.3)',
      text: '#fbbf24',
      icon: <Copy size={15} />,
      label: 'Repetida',
    },
    invalid: {
      bg: 'rgba(239,68,68,0.12)',
      border: 'rgba(239,68,68,0.3)',
      text: '#f87171',
      icon: <AlertTriangle size={15} />,
      label: 'Invalida',
    },
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="rounded-2xl p-4"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
    >
      <div className="flex items-center gap-2 mb-3" style={{ color: config.text }}>
        {config.icon}
        <span className="font-bold text-sm">{config.label}</span>
        <span className="ml-auto text-xs opacity-70">{codes.length} figurinha{codes.length > 1 ? 's' : ''}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {codes.map((c) => (
          <span
            key={c}
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
            style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.text }}
          >
            {c}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function StickerInput() {
  const { addStickers } = useCollection();
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const textRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = addStickers(input);
    setResult(res);
    setInput('');
    textRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="space-y-5 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          border: '1px solid rgba(59,130,246,0.3)',
          boxShadow: '0 0 40px rgba(59,130,246,0.2)',
        }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: '#3b82f6' }} />
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)' }} />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}>
            <Zap size={20} color="#60a5fa" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Adicionar Figurinhas</h1>
            <p className="text-white/50 text-xs">Cole varios codigos de uma vez</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['BRA1', 'ARG5', 'FRA10'].map((ex) => (
            <button
              key={ex}
              onClick={() => setInput((prev) => prev ? prev + ' ' + ex : ex)}
              className="text-xs font-mono px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
            >
              {ex}
            </button>
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          ref={textRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ex: BRA1 BRA2 ARG5 FRA10"
          rows={4}
          className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.1)',
            color: 'white',
          }}
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={!input.trim()}
          className="w-full py-3.5 rounded-2xl font-black text-sm"
          style={{
            background: input.trim() ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)' : 'rgba(255,255,255,0.06)',
            color: input.trim() ? 'white' : 'rgba(255,255,255,0.3)',
            border: '1px solid rgba(59,130,246,0.3)',
          }}
        >
          Adicionar Figurinhas
        </motion.button>
      </form>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={Date.now()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <ResultBadge type="new" codes={result.new} />
            <ResultBadge type="duplicate" codes={result.duplicate} />
            <ResultBadge type="invalid" codes={result.invalid} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
