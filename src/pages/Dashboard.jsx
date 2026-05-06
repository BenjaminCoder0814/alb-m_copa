import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { GROUPS, TEAMS } from '../data/stickers';
import { Trophy, Star, Copy, BookOpen } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE = '#002776';

function StatCard({ icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background: `linear-gradient(135deg, ${color}15, rgba(0,0,0,0.3))`, border: `1px solid ${color}30` }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
      </div>
    </motion.div>
  );
}

function CircleProgress({ pct }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" stroke="rgba(255,255,255,0.08)" />
        <circle
          cx="60" cy="60" r={r} fill="none" strokeWidth="8"
          stroke="url(#circleGrad)"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="circleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={BLUE} />
            <stop offset="50%" stopColor={GREEN} />
            <stop offset="100%" stopColor={YELLOW} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-black text-white">{pct}%</p>
        <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>completo</p>
      </div>
    </div>
  );
}

function GroupBar({ group, teams }) {
  const { getGroupProgress } = useCollection();
  const allGroups = getGroupProgress();
  const { owned, total, pct } = allGroups[group] || { owned: 0, total: 0, pct: 0 };
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black" style={{ background: `linear-gradient(135deg, #005c27, ${GREEN})`, color: YELLOW }}>
            {group}
          </div>
          <span className="text-xs font-bold text-white/60">Grupo {group}</span>
        </div>
        <span className="text-xs font-bold" style={{ color: GREEN }}>{owned}/{total}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${GREEN}88, ${GREEN})` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { calculateProgress, getDuplicateStickers, getMissingStickers, getTotalDuplicates, recoverFromFirebase, recoverFromUID, importCollection, exportCollection } = useCollection();
  const { owned, total, percentage: pct } = calculateProgress();
  const dupes = getDuplicateStickers().length;
  const missing = getMissingStickers().length;
  const extraCopies = getTotalDuplicates();
  const [recovering, setRecovering] = useState(false);
  const [recoverMsg, setRecoverMsg] = useState(null);
  const [oldUid, setOldUid] = useState('');

  return (
    <div className="pb-6 space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #003d1a 0%, #005c27 50%, #004d20 100%)',
          border: `1px solid ${GREEN}55`,
          boxShadow: `0 0 50px ${GREEN}33`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }} />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl" style={{ background: YELLOW }} />
        <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ background: BLUE }} />

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🇧🇷</span>
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: YELLOW }}>Copa do Mundo 2026</span>
            </div>
            <h1 className="text-3xl font-black leading-tight">Meu Album</h1>
            <p className="text-white/50 text-sm mt-0.5">{owned} de {total} figurinhas</p>
          </div>
          <CircleProgress pct={pct} />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Trophy size={18} color={YELLOW} />} label="Figurinhas" value={owned} color={GREEN} delay={0.1} />
        <StatCard icon={<BookOpen size={18} color={GREEN} />} label="Faltam" value={missing} color="#2563eb" delay={0.15} />
        <StatCard icon={<Copy size={18} color={YELLOW} />} label="Tipos repet." value={dupes} color={YELLOW} delay={0.2} />
        <StatCard icon={<Star size={18} color="#f97316" />} label="Copias extras" value={extraCopies} color="#f97316" delay={0.25} />
      </div>

      {/* Banner de recuperação — aparece só quando coleção está vazia */}
      {owned === 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 space-y-3"
          style={{ background: 'rgba(255,223,0,0.08)', border: '1px solid rgba(255,223,0,0.3)' }}>
          <p className="text-xs font-bold" style={{ color: '#FFDF00' }}>⚠️ Coleção vazia — recuperar backup?</p>

          {/* Recuperar do UID atual */}
          <button
            onClick={async () => {
              setRecovering(true);
              const count = await recoverFromFirebase();
              setRecovering(false);
              setRecoverMsg(count ? `✅ ${count} figurinhas recuperadas!` : '❌ Nada no UID atual.');
              setTimeout(() => setRecoverMsg(null), 4000);
            }}
            disabled={recovering}
            className="w-full py-2 rounded-xl text-xs font-black"
            style={{ background: 'rgba(255,223,0,0.2)', color: '#FFDF00', border: '1px solid rgba(255,223,0,0.4)' }}>
            {recovering ? 'Buscando...' : '☁️ Recuperar do Firebase (UID atual)'}
          </button>

          {/* Recuperar de UID antigo */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <p className="text-[11px] text-white/50">Ou cole o UID antigo do Firebase:</p>
            <input
              value={oldUid}
              onChange={(e) => setOldUid(e.target.value)}
              placeholder="Ex: NE9RqaFYPFfkZ0P484AkMo0tmfv1"
              className="w-full px-3 py-2 rounded-lg text-xs font-mono outline-none"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            />
            <button
              onClick={async () => {
                if (!oldUid.trim()) return;
                setRecovering(true);
                const count = await recoverFromUID(oldUid);
                setRecovering(false);
                setRecoverMsg(count ? `✅ ${count} figurinhas recuperadas do UID antigo!` : '❌ UID inválido ou vazio.');
                setTimeout(() => setRecoverMsg(null), 4000);
              }}
              disabled={recovering || !oldUid.trim()}
              className="w-full py-2 rounded-xl text-xs font-black"
              style={{ background: oldUid.trim() ? '#009C3B' : 'rgba(255,255,255,0.05)', color: oldUid.trim() ? 'white' : 'rgba(255,255,255,0.3)' }}>
              {recovering ? 'Buscando...' : '🔑 Recuperar deste UID'}
            </button>
          </div>

          {/* Importar arquivo JSON */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <p className="text-[11px] text-white/50">Ou importe um arquivo JSON:</p>
            <label className="block w-full py-2 rounded-xl text-xs font-black text-center cursor-pointer"
              style={{ background: 'rgba(0,39,118,0.4)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              📁 Escolher arquivo JSON
              <input type="file" accept=".json,application/json" className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    importCollection(f);
                    setRecoverMsg('✅ Importando...');
                    setTimeout(() => setRecoverMsg(null), 3000);
                  }
                }} />
            </label>
          </div>

          {recoverMsg && <p className="text-xs font-bold text-center" style={{ color: recoverMsg.startsWith('✅') ? '#009C3B' : '#ef4444' }}>{recoverMsg}</p>}
        </motion.div>
      )}

      {/* Progress por grupo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl p-5 space-y-3.5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-black text-white text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${GREEN}25`, border: `1px solid ${GREEN}55` }}>📊</span>
          Progresso por Grupo
        </p>
        {Object.entries(GROUPS).map(([g, teams]) => (
          <GroupBar key={g} group={g} teams={teams} />
        ))}
      </motion.div>

      {/* Paises do Brasil pra animar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="font-black text-white text-sm mb-3 flex items-center gap-2">
          <span>⭐</span> Selecoes Favoritas
        </p>
        <div className="flex flex-wrap gap-2">
          {['BRA', 'ARG', 'FRA', 'GER', 'ENG', 'POR', 'ESP', 'NED', 'BEL', 'MEX', 'COL', 'URU'].filter(code => TEAMS[code]).map((code) => {
            const t = TEAMS[code];
            return (
              <div key={code} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: `${t.color || GREEN}18`, border: `1px solid ${t.color || GREEN}33` }}>
                <span className="text-sm">{t.flag}</span>
                <span className="text-xs font-bold text-white/60">{t.name}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
