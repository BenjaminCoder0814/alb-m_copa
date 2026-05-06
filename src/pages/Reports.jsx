import { motion } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { GROUPS, TEAMS } from '../data/stickers';
import { BarChart3, Download, RefreshCw } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE = '#002776';

function CountryBar({ teamCode }) {
  const { getCountryProgress } = useCollection();
  const team = TEAMS[teamCode];
  const { owned, total, pct } = getCountryProgress(teamCode);
  const color = team?.color || GREEN;
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-base w-6 text-center">{team?.flag}</span>
      <div className="flex-1">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
          />
        </div>
      </div>
      <span className="text-[10px] font-bold w-10 text-right" style={{ color: `${color}cc` }}>{owned}/{total}</span>
    </div>
  );
}

export default function Reports() {
  const { calculateProgress, getDuplicateStickers, getMissingStickers, getTotalDuplicates, exportCollection, resetCollection } = useCollection();
  const { owned, total, percentage: pct } = calculateProgress();
  const dupes = getDuplicateStickers().length;
  const missing = getMissingStickers().length;
  const extras = getTotalDuplicates();

  const handleExport = () => {
    const data = exportCollection();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `album-copa-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-6 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #003d1a, #005c27, #003d1a)',
          border: `1px solid ${GREEN}55`,
          boxShadow: `0 0 40px ${GREEN}22`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }} />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${GREEN}30`, border: `1px solid ${GREEN}55` }}>
            <BarChart3 size={20} color={GREEN} />
          </div>
          <div>
            <h1 className="text-xl font-black">Estatisticas</h1>
            <p className="text-white/40 text-xs">Sua colecao em detalhes</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Figurinhas', value: owned, color: GREEN },
            { label: 'Faltando', value: missing, color: BLUE },
            { label: 'Tipos repet.', value: dupes, color: YELLOW },
            { label: 'Copias extras', value: extras, color: '#f97316' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <p className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress by Group */}
      {Object.entries(GROUPS).map(([group, teams]) => (
        <motion.div
          key={group}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 space-y-2.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: `linear-gradient(135deg, #005c27, ${GREEN})`, color: YELLOW }}>
              {group}
            </div>
            <span className="font-bold text-white/60 text-sm">Grupo {group}</span>
          </div>
          {teams.map((t) => <CountryBar key={t} teamCode={t} />)}
        </motion.div>
      ))}

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm"
          style={{
            background: `linear-gradient(135deg, #005c27, ${GREEN})`,
            color: 'white',
            border: `1px solid ${GREEN}55`,
            boxShadow: `0 4px 16px ${GREEN}33`,
          }}
        >
          <Download size={16} />
          Exportar JSON
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            if (confirm('Resetar toda a colecao? Esta acao nao pode ser desfeita.')) resetCollection();
          }}
          className="px-5 py-3.5 rounded-2xl font-bold text-sm"
          style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <RefreshCw size={16} />
        </motion.button>
      </div>
    </div>
  );
}
