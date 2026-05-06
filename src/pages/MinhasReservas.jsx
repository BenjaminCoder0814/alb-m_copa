import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReservas } from '../store/ReservasContext';
import { TEAMS } from '../data/stickers';
import { CATEGORY_INFO } from '../utils/categories';
import { Eye, EyeOff, Search, X, CheckCircle2, XCircle, Clock } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';

const STATUS_INFO = {
  pendente:    { label: 'Pendente',    color: YELLOW,    icon: <Clock size={13} /> },
  confirmado:  { label: 'Confirmado!', color: GREEN,     icon: <CheckCircle2 size={13} /> },
  cancelado:   { label: 'Cancelada',   color: '#6b7280', icon: <X size={13} /> },
  recusado:    { label: 'Recusada',    color: '#ef4444', icon: <XCircle size={13} /> },
};

export default function MinhasReservas() {
  const { reservas, cancelarReserva } = useReservas();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelError, setCancelError] = useState({});
  const [cancelSuccess, setCancelSuccess] = useState({});

  const minhas = searched
    ? reservas.filter(r => r.nome?.toLowerCase() === nome.trim().toLowerCase())
    : [];

  const handleCancel = (id) => {
    const ok = cancelarReserva(id, senha);
    if (ok) {
      setCancelSuccess(p => ({ ...p, [id]: true }));
    } else {
      setCancelError(p => ({ ...p, [id]: 'Senha incorreta' }));
      setTimeout(() => setCancelError(p => ({ ...p, [id]: undefined })), 2000);
    }
  };

  return (
    <div className="pb-6 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5"
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #0d1b2a)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(255,255,255,0.08)' }}>📋</div>
          <div>
            <h1 className="text-xl font-black text-white">Minhas Reservas</h1>
            <p className="text-xs text-white/40">Veja e cancele suas reservas</p>
          </div>
        </div>
      </motion.div>

      {/* Busca */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs font-bold text-white/60">Digite seu nome e senha para ver suas reservas:</p>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Seu nome"
          className="w-full rounded-xl px-4 py-3 text-sm font-bold outline-none"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: 'white' }}
        />
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && nome.trim() && setSearched(true)}
            placeholder="Sua senha de reserva"
            className="w-full rounded-xl px-4 py-3 pr-11 text-sm font-bold outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: 'white' }}
          />
          <button onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40">
            {showPass ? <EyeOff size={15} color="white" /> : <Eye size={15} color="white" />}
          </button>
        </div>
        <motion.button whileTap={{ scale: 0.96 }}
          onClick={() => { if (nome.trim()) setSearched(true); }}
          disabled={!nome.trim()}
          className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2"
          style={{
            background: nome.trim() ? `linear-gradient(135deg, #005c27, ${GREEN})` : 'rgba(255,255,255,0.05)',
            color: nome.trim() ? 'white' : 'rgba(255,255,255,0.2)',
          }}>
          <Search size={15} /> Buscar minhas reservas
        </motion.button>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-3">
          {minhas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-white/50 text-sm">Nenhuma reserva encontrada para <strong className="text-white">{nome}</strong></p>
            </div>
          ) : (
            <>
              <p className="text-xs px-1 text-white/40">{minhas.length} reserva{minhas.length > 1 ? 's' : ''} encontrada{minhas.length > 1 ? 's' : ''} para <strong className="text-white">{nome}</strong></p>
              {minhas.map(r => {
                const catInfo = CATEGORY_INFO[r.categoria] || CATEGORY_INFO.normal;
                const statusInfo = STATUS_INFO[r.status] || STATUS_INFO.pendente;
                const querTeam = TEAMS[r.querCode?.match(/^[A-Z]+/)?.[0]] || {};
                const deuTeam = TEAMS[r.ofereceCode?.match(/^[A-Z]+/)?.[0]] || {};
                const isCanceled = cancelSuccess[r.id] || r.status === 'cancelado' || r.status === 'recusado';

                return (
                  <motion.div key={r.id} layout
                    className="rounded-2xl p-4 space-y-3"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${statusInfo.color}44`,
                      opacity: isCanceled ? 0.5 : 1,
                    }}>
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold" style={{ color: statusInfo.color }}>
                        {statusInfo.icon} {statusInfo.label}
                      </div>
                      <span className="text-[10px] text-white/25">
                        {new Date(r.criadoEm).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {/* Trade summary */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex-1 rounded-xl p-2 text-center" style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}33` }}>
                        <p className="text-[9px] text-white/40 uppercase">Você quer</p>
                        <p className="font-black text-white">{querTeam.flag} {r.querCode}</p>
                      </div>
                      <span className="text-white/30">↔</span>
                      <div className="flex-1 rounded-xl p-2 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        <p className="text-[9px] text-white/40 uppercase">Você dá</p>
                        <p className="font-black text-white">{deuTeam.flag} {r.ofereceCode}</p>
                      </div>
                    </div>
                    {/* Category */}
                    <p className="text-[10px]" style={{ color: catInfo.color }}>{catInfo.label}</p>
                    {/* Cancel button */}
                    {r.status === 'pendente' && !cancelSuccess[r.id] && (
                      <div>
                        <button onClick={() => handleCancel(r.id)}
                          className="w-full py-2 rounded-xl text-xs font-bold"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                          Cancelar esta reserva
                        </button>
                        <AnimatePresence>
                          {cancelError[r.id] && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="text-xs text-center mt-1 font-bold" style={{ color: '#f87171' }}>
                              {cancelError[r.id]}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                    {cancelSuccess[r.id] && (
                      <p className="text-xs text-center text-white/40">Reserva cancelada.</p>
                    )}
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
