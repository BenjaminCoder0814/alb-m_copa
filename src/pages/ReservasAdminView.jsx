import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReservas } from '../store/ReservasContext';
import { useCollection } from '../store/CollectionContext';
import { TEAMS } from '../data/stickers';
import { CATEGORY_INFO } from '../utils/categories';
import { CheckCircle2, XCircle, Clock, X } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';

const STATUS_INFO = {
  pendente:   { label: 'Pendente',    color: YELLOW,    icon: <Clock size={13} />,       bg: 'rgba(255,223,0,0.08)'  },
  confirmado: { label: 'Confirmado',  color: GREEN,     icon: <CheckCircle2 size={13} />, bg: `rgba(0,156,59,0.08)`   },
  cancelado:  { label: 'Cancelada',   color: '#6b7280', icon: <X size={13} />,            bg: 'rgba(255,255,255,0.04)' },
  recusado:   { label: 'Recusada',    color: '#ef4444', icon: <XCircle size={13} />,      bg: 'rgba(239,68,68,0.06)'  },
};

const FILTERS = ['todas', 'pendente', 'confirmado', 'cancelado'];

export default function ReservasAdminView() {
  const { reservas, confirmarReserva, recusarReserva } = useReservas();
  const { removeSticker, addStickers } = useCollection();
  const [filter, setFilter] = useState('todas');

  const filtered = reservas
    .filter(r => filter === 'todas' || r.status === filter)
    .sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0));

  const pendingCount = reservas.filter(r => r.status === 'pendente').length;

  const handleConfirmar = (r) => {
    confirmarReserva(r.id);
    removeSticker(r.querCode);
    addStickers(r.ofereceCode);
  };

  return (
    <div className="pb-6 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5"
        style={{ background: 'linear-gradient(135deg, #0d1b2a, #1a2d00)', border: `1px solid ${GREEN}44` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${GREEN}25` }}>📋</div>
          <div>
            <h1 className="text-xl font-black text-white">Reservas de Troca</h1>
            <p className="text-xs text-white/40">Confirme ou recuse pedidos</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="text-2xl font-black" style={{ color: YELLOW }}>{pendingCount}</p>
            <p className="text-[10px] text-white/40 uppercase">pendentes</p>
          </div>
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="text-2xl font-black" style={{ color: GREEN }}>{reservas.filter(r => r.status === 'confirmado').length}</p>
            <p className="text-[10px] text-white/40 uppercase">confirmadas</p>
          </div>
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="text-2xl font-black text-white/50">{reservas.length}</p>
            <p className="text-[10px] text-white/40 uppercase">total</p>
          </div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(f => {
          const count = f === 'todas' ? reservas.length : reservas.filter(r => r.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold capitalize"
              style={{
                background: filter === f ? GREEN : 'rgba(255,255,255,0.06)',
                color: filter === f ? 'white' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${filter === f ? GREEN : 'rgba(255,255,255,0.08)'}`,
              }}>
              {f === 'todas' ? 'Todas' : STATUS_INFO[f]?.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-white/50 text-sm">Nenhuma reserva{filter !== 'todas' ? ` ${STATUS_INFO[filter]?.label.toLowerCase()}` : ''}</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(r => {
            const catInfo = CATEGORY_INFO[r.categoria] || CATEGORY_INFO.normal;
            const statusInfo = STATUS_INFO[r.status] || STATUS_INFO.pendente;
            const querTeam = TEAMS[r.querCode?.match(/^[A-Z]+/)?.[0]] || {};
            const deuTeam = TEAMS[r.ofereceCode?.match(/^[A-Z]+/)?.[0]] || {};

            return (
              <motion.div key={r.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl p-4 space-y-3"
                style={{ background: statusInfo.bg, border: `1px solid ${statusInfo.color}44` }}>
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: statusInfo.color }}>
                    {statusInfo.icon} {statusInfo.label}
                  </div>
                  <span className="text-[10px] text-white/30">
                    {new Date(r.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Name */}
                <p className="font-black text-white text-sm">👤 {r.nome}</p>

                {/* Trade */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-xl p-2.5 text-center"
                    style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}33` }}>
                    <p className="text-[9px] text-white/40 uppercase mb-0.5">Quer receber</p>
                    <p className="text-base">{querTeam.flag}</p>
                    <p className="font-black text-white text-sm">{r.querCode}</p>
                    <p className="text-[9px] text-white/40">{querTeam.name}</p>
                  </div>
                  <div className="text-white/30 font-black text-lg">↔</div>
                  <div className="flex-1 rounded-xl p-2.5 text-center"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <p className="text-[9px] text-white/40 uppercase mb-0.5">Vai dar</p>
                    <p className="text-base">{deuTeam.flag}</p>
                    <p className="font-black text-white text-sm">{r.ofereceCode}</p>
                    <p className="text-[9px] text-white/40">{deuTeam.name}</p>
                  </div>
                </div>

                {/* Category */}
                <p className="text-[10px] font-bold" style={{ color: catInfo.color }}>{catInfo.label}</p>

                {/* Actions */}
                {r.status === 'pendente' && (
                  <div className="flex gap-2 pt-1">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => recusarReserva(r.id)}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                      <XCircle size={14} /> Recusar
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleConfirmar(r)}
                      className="flex-1 py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-1"
                      style={{ background: `linear-gradient(135deg, #005c27, ${GREEN})`, color: 'white' }}>
                      <CheckCircle2 size={14} /> Confirmar
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
