import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../store/CollectionContext';
import { useReservas } from '../store/ReservasContext';
import { TEAMS, STICKER_MAP, albumStructure } from '../data/stickers';
import { getStickerCategory, CATEGORY_INFO } from '../utils/categories';
import { ArrowLeftRight, X, Eye, EyeOff, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';

// ─── ReservaModal ────────────────────────────────────────────────────────────
function ReservaModal({ sticker, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [ofereceCode, setOfereceCode] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { collection } = useCollection();
  const { criarReserva } = useReservas();

  const catInfo = CATEGORY_INFO[getStickerCategory(sticker.code)] || CATEGORY_INFO.normal;
  const teamInfo = TEAMS[sticker.country] || {};

  const normalizedOffer = ofereceCode.trim().toUpperCase();
  const offerInfo = STICKER_MAP[normalizedOffer];
  const offerCat = normalizedOffer ? getStickerCategory(normalizedOffer) : null;
  const stickCat = getStickerCategory(sticker.code);

  const offerErrors = [];
  if (normalizedOffer && !offerInfo) offerErrors.push('Figurinha não existe no álbum');
  else if (normalizedOffer && offerInfo && (collection[normalizedOffer] || 0) >= 1)
    offerErrors.push('Eu já tenho essa! Escolha outra que eu não tenha');
  else if (normalizedOffer && offerInfo && offerCat !== stickCat)
    offerErrors.push(`Precisa ser da mesma categoria: ${catInfo.label}`);
  const offerValid = normalizedOffer.length > 0 && offerErrors.length === 0 && !!offerInfo;

  const handleSubmit = async () => {
    if (!offerValid || !nome.trim() || !senha.trim()) return;
    setSubmitting(true);
    await criarReserva({
      nome,
      senha,
      querCode: sticker.code,
      ofereceCode: normalizedOffer,
      categoria: stickCat,
    });
    setSubmitting(false);
    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl p-5 space-y-4"
        style={{ background: '#0d2d18', border: `1px solid ${GREEN}44` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[1,2,3].map(s => (
              <div key={s} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: step >= s ? GREEN : 'rgba(255,255,255,0.08)', color: step >= s ? '#000' : 'rgba(255,255,255,0.3)' }}>
                {s}
              </div>
            ))}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <X size={15} color="white" />
          </button>
        </div>

        {/* Step 1: Confirmar o que quer */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="font-black text-white text-base">Você quer reservar:</h2>
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${catInfo.color}44` }}>
              <span className="text-3xl">{teamInfo.flag}</span>
              <div className="flex-1">
                <p className="font-black text-white text-lg">{sticker.code}</p>
                <p className="text-xs text-white/50">{teamInfo.name}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background: `${catInfo.color}25`, color: catInfo.color }}>
                  {catInfo.label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40">disponível</p>
                <p className="font-black text-xl" style={{ color: YELLOW }}>{sticker.avail}x</p>
              </div>
            </div>
            <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(255,223,0,0.07)', border: '1px solid rgba(255,223,0,0.2)', color: 'rgba(255,255,255,0.5)' }}>
              ⚠️ Regra: você só pode dar uma figurinha da mesma categoria: <strong style={{ color: catInfo.color }}>{catInfo.label}</strong>
            </div>
            <button onClick={() => setStep(2)}
              className="w-full py-3 rounded-2xl font-black text-black"
              style={{ background: `linear-gradient(135deg, ${YELLOW}, #ffa500)` }}>
              Próximo →
            </button>
          </motion.div>
        )}

        {/* Step 2: O que vai dar */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <h2 className="font-black text-white text-base">🔴 Você vai DAR:</h2>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Deve ser da categoria <strong style={{ color: catInfo.color }}>{catInfo.label}</strong> e uma que eu ainda não tenho.
            </p>
            <input
              value={ofereceCode}
              onChange={(e) => setOfereceCode(e.target.value.toUpperCase())}
              placeholder="Código da figurinha (ex: BRA5)"
              autoFocus
              className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none tracking-widest"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: `2px solid ${offerValid ? GREEN + '77' : offerErrors.length ? '#ef444477' : 'rgba(255,255,255,0.12)'}`,
                color: 'white', caretColor: YELLOW,
              }}
            />
            {offerErrors.map((e, i) => (
              <p key={i} className="text-xs font-bold" style={{ color: '#f87171' }}>✗ {e}</p>
            ))}
            {offerValid && (
              <p className="text-xs font-bold" style={{ color: GREEN }}>
                ✓ {TEAMS[offerInfo?.country]?.flag} {offerInfo?.countryName} · #{offerInfo?.number}
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                ← Voltar
              </button>
              <button onClick={() => setStep(3)} disabled={!offerValid}
                className="flex-1 py-3 rounded-2xl font-black text-sm"
                style={{ background: offerValid ? `linear-gradient(135deg, #005c27, ${GREEN})` : 'rgba(255,255,255,0.05)', color: offerValid ? 'white' : 'rgba(255,255,255,0.2)' }}>
                Próximo →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Identificação */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <h2 className="font-black text-white text-base">👤 Quem é você?</h2>
            {/* Resumo */}
            <div className="rounded-xl p-3 text-xs space-y-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p><span style={{ color: GREEN }}>Quer:</span> <strong className="text-white">{sticker.code}</strong> ({teamInfo.name})</p>
              <p><span style={{ color: '#ef4444' }}>Dá:</span> <strong className="text-white">{normalizedOffer}</strong> ({TEAMS[offerInfo?.country]?.name})</p>
            </div>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full rounded-2xl px-4 py-3 text-sm font-bold outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.12)', color: 'white' }}
            />
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Crie uma senha (protege sua reserva)"
                className="w-full rounded-2xl px-4 py-3 pr-11 text-sm font-bold outline-none"
                style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.12)', color: 'white' }}
              />
              <button onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40">
                {showPass ? <EyeOff size={15} color="white" /> : <Eye size={15} color="white" />}
              </button>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-2xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                ← Voltar
              </button>
              <button onClick={handleSubmit} disabled={!nome.trim() || !senha.trim() || submitting}
                className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                style={{
                  background: (nome.trim() && senha.trim()) ? `linear-gradient(135deg, #005c27, ${GREEN})` : 'rgba(255,255,255,0.05)',
                  color: (nome.trim() && senha.trim()) ? 'white' : 'rgba(255,255,255,0.2)',
                }}>
                <ArrowLeftRight size={14} />
                {submitting ? 'Reservando...' : 'Confirmar'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── TrocarView ──────────────────────────────────────────────────────────────
export default function TrocarView() {
  const { collection } = useCollection();
  const { getReservedCount, reservas } = useReservas();
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expanded, setExpanded] = useState({});

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  // Build available duplicates per section/country
  const sections = useMemo(() => {
    const result = [];
    albumStructure.forEach(section => {
      if (section.type === 'initial') {
        const items = [];
        section.stickers.forEach(s => {
          if (s.displayOnly) return;
          s.numbers.forEach(n => {
            const code = `${s.code}${n}`;
            const qty = collection[code] || 0;
            if (qty <= 1) return;
            const extras = qty - 1;
            const reserved = getReservedCount(code);
            const avail = Math.max(0, extras - reserved);
            items.push({ code, name: s.name, flag: s.flag, country: s.code, qty, extras, reserved, avail });
          });
        });
        if (items.length > 0)
          result.push({ key: section.section, label: section.section, type: 'initial', color: '#C9A84C', items });
      } else {
        const countries = [];
        section.countries.forEach(c => {
          const stickers = [];
          for (let i = 1; i <= c.stickers; i++) {
            const code = `${c.code}${i}`;
            const qty = collection[code] || 0;
            if (qty <= 1) continue;
            const extras = qty - 1;
            const reserved = getReservedCount(code);
            const avail = Math.max(0, extras - reserved);
            stickers.push({ code, num: i, country: c.code, name: c.name, flag: c.flag, qty, extras, reserved, avail });
          }
          if (stickers.length > 0) countries.push({ ...c, stickers });
        });
        if (countries.length > 0)
          result.push({ key: section.groupCode, label: section.group, type: 'group', color: section.color, countries });
      }
    });
    return result;
  }, [collection, reservas]);

  const totalAvail = sections.reduce((sum, s) => {
    if (s.type === 'initial') return sum + s.items.reduce((a, i) => a + i.avail, 0);
    return sum + s.countries.reduce((a, c) => a + c.stickers.reduce((b, st) => b + st.avail, 0), 0);
  }, 0);

  const pendingCount = reservas.filter(r => r.status === 'pendente').length;

  return (
    <div className="pb-6 space-y-3">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5"
        style={{ background: 'linear-gradient(135deg, #1a2d00, #2d4a00)', border: `1px solid ${GREEN}44` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${GREEN}25`, border: `1px solid ${GREEN}44` }}>🔄</div>
          <div>
            <h1 className="text-xl font-black text-white">Trocar Figurinhas</h1>
            <p className="text-xs text-white/40">Reserve e combinamos a troca</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="text-2xl font-black" style={{ color: GREEN }}>{totalAvail}</p>
            <p className="text-[10px] text-white/40 uppercase">disponíveis</p>
          </div>
          <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <p className="text-2xl font-black" style={{ color: YELLOW }}>{pendingCount}</p>
            <p className="text-[10px] text-white/40 uppercase">reservadas</p>
          </div>
        </div>
      </motion.div>

      {/* Regras */}
      <div className="rounded-2xl p-3 text-[10px] space-y-1" style={{ background: 'rgba(255,223,0,0.06)', border: '1px solid rgba(255,223,0,0.2)', color: 'rgba(255,255,255,0.45)' }}>
        <p className="font-black text-white/70 text-xs mb-1">📋 Regras de troca</p>
        <p>🥤 Coca-Cola → só por Coca-Cola</p>
        <p>🏆 FWC Histórica → só por FWC Histórica</p>
        <p>🏆 FWC Inicial → só por FWC Inicial</p>
        <p>⭐ Dourada (#1) → só por Dourada (#1)</p>
        <p>✨ Especial (#13) → só por Especial (#13)</p>
        <p>⚽ Normal → por qualquer Normal</p>
      </div>

      {/* Empty */}
      {sections.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🎴</p>
          <p className="font-bold text-white/60">Nenhuma repetida disponível ainda</p>
        </div>
      )}

      {/* Sections */}
      {sections.map(section => (
        <div key={section.key} className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${section.color}33` }}>
          {/* Section header */}
          <button onClick={() => toggle(section.key)}
            className="w-full flex items-center justify-between px-4 py-3"
            style={{ background: `linear-gradient(135deg, ${section.color}18, rgba(0,0,0,0.2))` }}>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm">{section.label}</span>
            </div>
            {expanded[section.key] ? <ChevronDown size={15} className="text-white/40" /> : <ChevronRight size={15} className="text-white/40" />}
          </button>

          {/* Content */}
          <AnimatePresence initial={false}>
            {expanded[section.key] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {section.type === 'initial' ? (
                  <div className="p-3 space-y-2">
                    {section.items.map(st => (
                      <StickerRow key={st.code} sticker={st} onSelect={setSelectedSticker} />
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {section.countries.map(c => (
                      <div key={c.code} className="px-3 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base">{c.flag}</span>
                          <span className="text-xs font-black text-white/80">{c.name}</span>
                          <span className="text-[10px] text-white/30">({c.stickers.length} repetida{c.stickers.length > 1 ? 's' : ''})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {c.stickers.map(st => (
                            <StickerChip key={st.code} sticker={st} onSelect={setSelectedSticker} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Modal */}
      <AnimatePresence>
        {selectedSticker && !success && (
          <ReservaModal
            sticker={selectedSticker}
            onClose={() => setSelectedSticker(null)}
            onSuccess={() => { setSuccess(selectedSticker); setSelectedSticker(null); }}
          />
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.8)' }}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="w-full max-w-xs rounded-3xl p-8 text-center space-y-4"
              style={{ background: '#0d2d18', border: `1px solid ${GREEN}55` }}
            >
              <div className="text-5xl">🎉</div>
              <div>
                <p className="font-black text-white text-xl">Reservado!</p>
                <p className="text-sm text-white/50 mt-1">
                  {success.code} reservado com sucesso. Entraremos em contato!
                </p>
              </div>
              <button onClick={() => setSuccess(null)}
                className="w-full py-3 rounded-2xl font-black text-black"
                style={{ background: `linear-gradient(135deg, ${YELLOW}, #ffa500)` }}>
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── StickerRow (initial sections) ──────────────────────────────────────────
function StickerRow({ sticker, onSelect }) {
  const catInfo = CATEGORY_INFO[getStickerCategory(sticker.code)] || CATEGORY_INFO.normal;
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={() => sticker.avail > 0 && onSelect(sticker)}
      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5"
      style={{
        background: sticker.avail > 0 ? `${catInfo.color}15` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${sticker.avail > 0 ? catInfo.color + '44' : 'rgba(255,255,255,0.08)'}`,
        opacity: sticker.avail === 0 ? 0.5 : 1,
      }}>
      <span className="text-2xl">{sticker.flag}</span>
      <div className="flex-1 text-left">
        <p className="font-black text-white text-sm">{sticker.code}</p>
        <p className="text-[10px]" style={{ color: catInfo.color }}>{catInfo.label}</p>
      </div>
      <div className="text-right">
        {sticker.avail > 0 ? (
          <span className="text-sm font-black" style={{ color: GREEN }}>{sticker.avail}x livre</span>
        ) : (
          <span className="text-xs font-bold text-white/30">Reservada</span>
        )}
      </div>
    </motion.button>
  );
}

// ─── StickerChip (group country stickers) ───────────────────────────────────
function StickerChip({ sticker, onSelect }) {
  const catInfo = CATEGORY_INFO[getStickerCategory(sticker.code)] || CATEGORY_INFO.normal;
  const available = sticker.avail > 0;
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={() => available && onSelect(sticker)}
      className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 min-w-[48px]"
      style={{
        background: available ? `${catInfo.color}20` : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${available ? catInfo.color + '55' : 'rgba(255,255,255,0.08)'}`,
        opacity: available ? 1 : 0.45,
      }}>
      <span className="text-[9px] text-white/30">{catInfo.label.split(' ')[0]}</span>
      <span className="font-black text-white text-xs">{sticker.num}</span>
      {available ? (
        <span className="text-[8px] font-bold" style={{ color: catInfo.color }}>{sticker.avail}x</span>
      ) : (
        <span className="text-[8px] text-white/25">Res.</span>
      )}
    </motion.button>
  );
}
