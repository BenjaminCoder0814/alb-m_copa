import { motion } from 'framer-motion';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE = '#002776';

export default function SplashScreen({ onEnter }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #003d1a 0%, #011a07 55%, #001c3d 100%)' }}
    >
      {/* Faixa topo */}
      <div className="absolute top-0 left-0 right-0 h-2" style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }} />

      {/* Estrelas de fundo */}
      {[...Array(14)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300 select-none pointer-events-none"
          style={{
            left: `${(i * 37 + 5) % 95}%`,
            top: `${(i * 53 + 8) % 88}%`,
            fontSize: i % 3 === 0 ? 22 : i % 3 === 1 ? 14 : 10,
            opacity: 0.12 + (i % 4) * 0.05,
          }}
          animate={{ opacity: [0.08, 0.22, 0.08], y: [0, -6, 0] }}
          transition={{ duration: 2.5 + (i % 5) * 0.4, repeat: Infinity, delay: i * 0.18 }}
        >
          ★
        </motion.div>
      ))}

      {/* Conteúdo central */}
      <div className="flex flex-col items-center gap-6 px-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 }}
          className="text-7xl"
        >
          🇧🇷
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-1"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: `${YELLOW}99` }}>
            Copa do Mundo
          </p>
          <h1
            className="text-4xl font-black leading-none"
            style={{ color: YELLOW, textShadow: `0 0 30px ${YELLOW}66` }}
          >
            Meu Álbum
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: `${GREEN}cc` }}>
            2026
          </p>
        </motion.div>

        {/* Botão toque para entrar */}
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          whileTap={{ scale: 0.94 }}
          onClick={onEnter}
          className="mt-4 px-10 py-5 rounded-3xl font-black text-lg tracking-wide relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #005c27, ${GREEN})`,
            color: 'white',
            border: `2px solid ${YELLOW}66`,
            boxShadow: `0 0 40px ${GREEN}55, 0 0 80px ${GREEN}22`,
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{ background: YELLOW }}
          />
          <span className="relative">🎵 Toque para entrar</span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-xs"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          A música vai tocar automaticamente
        </motion.p>
      </div>

      {/* Faixa base */}
      <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }} />
    </motion.div>
  );
}
