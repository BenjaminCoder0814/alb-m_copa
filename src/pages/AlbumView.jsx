import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { GROUPS, TEAMS } from '../data/stickers';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE = '#002776';

// Legenda de cores
function Legend() {
  return (
    <div className="flex items-center gap-3 text-[10px] flex-wrap">
      <span className="flex items-center gap-1">
        <span className="w-4 h-4 rounded" style={{ background: `${GREEN}cc` }} />
        <span style={{ color: 'rgba(255,255,255,0.45)' }}>Tenho</span>
      </span>
      <span className="flex items-center gap-1">
        <span className="w-4 h-4 rounded" style={{ background: YELLOW }} />
        <span style={{ color: 'rgba(255,255,255,0.45)' }}>Repetida</span>
      </span>
      <span className="flex items-center gap-1">
        <span className="w-4 h-4 rounded" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }} />
        <span style={{ color: 'rgba(255,255,255,0.45)' }}>Falta</span>
      </span>
    </div>
  );
}

// Uma célula do grid
function Cell({ code, qty }) {
  const missing = qty === 0;
  const duplicate = qty > 1;
  return (
    <div
      className="flex items-center justify-center font-black text-[9px] select-none"
      style={{
        width: 30,
        height: 22,
        borderRadius: 4,
        background: missing
          ? 'rgba(255,255,255,0.05)'
          : duplicate
          ? YELLOW
          : `${GREEN}cc`,
        color: missing
          ? 'rgba(255,255,255,0.18)'
          : duplicate
          ? '#000'
          : 'rgba(255,255,255,0.9)',
        border: missing
          ? '1px solid rgba(255,255,255,0.07)'
          : duplicate
          ? `1px solid ${YELLOW}`
          : `1px solid ${GREEN}99`,
      }}
    >
      {duplicate ? `${qty}x` : missing ? '–' : '✓'}
    </div>
  );
}

// Tabela de um grupo
function GroupTable({ group, teams }) {
  const { collection, getCountryProgress } = useCollection();
  const [collapsed, setCollapsed] = useState(false);

  // max stickers per team (all 20)
  const ROWS = 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid rgba(255,255,255,0.08)`, background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Cabeçalho do grupo */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5"
        style={{ background: `linear-gradient(90deg, #005c2799, #003d1a88)`, borderBottom: `1px solid rgba(255,255,255,0.07)` }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm shrink-0"
          style={{ background: `linear-gradient(135deg, #005c27, ${GREEN})`, color: YELLOW, boxShadow: `0 2px 8px ${GREEN}44` }}
        >
          {group}
        </div>
        <span className="font-black text-white/70 text-xs">Grupo {group}</span>
        <div className="ml-auto flex gap-2">
          {teams.map(tc => {
            const { owned, total } = getCountryProgress(tc);
            return (
              <span key={tc} className="text-[9px] font-bold" style={{ color: `${GREEN}cc` }}>
                {owned}/{total}
              </span>
            );
          })}
          <span className="text-white/30 text-xs">{collapsed ? '▶' : '▼'}</span>
        </div>
      </button>

      {!collapsed && (
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: 'separate', borderSpacing: '2px 2px', padding: '6px' }}>
            {/* Cabeçalho das seleções */}
            <thead>
              <tr>
                {/* coluna # */}
                <th style={{ width: 20, paddingRight: 4 }} />
                {teams.map(tc => {
                  const team = TEAMS[tc];
                  return (
                    <th key={tc} style={{ width: 30, paddingBottom: 4, textAlign: 'center' }}>
                      <div className="flex flex-col items-center gap-0.5">
                        <span style={{ fontSize: 16 }}>{team.flag}</span>
                        <span
                          className="font-black text-[8px] px-1 py-0.5 rounded"
                          style={{ background: `${team.color || GREEN}33`, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}
                        >
                          {tc}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            {/* Linhas 1–20 */}
            <tbody>
              {Array.from({ length: ROWS }, (_, i) => i + 1).map(num => (
                <tr key={num}>
                  <td
                    className="font-bold text-center"
                    style={{ width: 20, paddingRight: 4, color: 'rgba(255,255,255,0.3)', fontSize: 9, verticalAlign: 'middle' }}
                  >
                    {num}
                  </td>
                  {teams.map(tc => {
                    const code = `${tc}${num}`;
                    const qty = collection[code] || 0;
                    return (
                      <td key={tc} style={{ verticalAlign: 'middle' }}>
                        <Cell code={code} qty={qty} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default function AlbumView() {
  const { calculateProgress } = useCollection();
  const { owned, total, percentage } = calculateProgress();

  return (
    <div className="pb-6 space-y-3">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 text-white"
        style={{
          background: 'linear-gradient(135deg, #003d1a, #005c27, #003d1a)',
          border: `1px solid ${GREEN}44`,
          boxShadow: `0 0 40px ${GREEN}22`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📗</span>
            <div>
              <h1 className="text-lg font-black">Álbum Completo</h1>
              <p className="text-white/40 text-xs">{owned}/{total} figurinhas · {percentage}% completo</p>
            </div>
          </div>
          {/* Mini barra de progresso */}
          <div className="w-20">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${GREEN}, ${YELLOW})` }} />
            </div>
            <p className="text-[10px] text-right mt-0.5 font-bold" style={{ color: YELLOW }}>{percentage}%</p>
          </div>
        </div>

        <div className="mt-3">
          <Legend />
        </div>
      </motion.div>

      {/* Uma tabela por grupo */}
      {Object.entries(GROUPS).map(([group, teams]) => (
        <GroupTable key={group} group={group} teams={teams} />
      ))}
    </div>
  );
}
