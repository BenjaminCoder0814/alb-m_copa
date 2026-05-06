import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import tributeImg from '../imagens/images.jpg';
import tributeAudio from '../imagens/Paródia Espera eu chegar.mp4';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';
const BLUE = '#002776';

export default function TributeModal({ open, onClose }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.currentTime = audioRef.current.currentTime || 0;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    onClose();
  };

  return (
    <>
      <audio ref={audioRef} src={tributeAudio} loop={false} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-5"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
              className="relative w-full max-w-sm rounded-[32px] overflow-hidden text-white"
              style={{
                background: 'linear-gradient(160deg, #003d1a 0%, #011a07 60%, #001c3d 100%)',
                border: `1.5px solid ${GREEN}66`,
                boxShadow: `0 0 80px ${GREEN}44, 0 0 160px ${YELLOW}18`,
              }}
            >
              {/* Topo tricolor */}
              <div
                className="h-2 w-full"
                style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }}
              />

              {/* Estrelas decorativas */}
              <div className="absolute top-4 right-5 text-2xl opacity-30 select-none">⭐</div>
              <div className="absolute top-8 left-5 text-base opacity-20 select-none">★</div>

              {/* Foto */}
              <div className="flex justify-center pt-6 px-6">
                <div
                  className="relative"
                  style={{
                    borderRadius: 24,
                    padding: 4,
                    background: `linear-gradient(135deg, ${YELLOW}, ${GREEN}, ${BLUE})`,
                    boxShadow: `0 8px 40px ${GREEN}55, 0 0 0 1px ${YELLOW}44`,
                  }}
                >
                  <img
                    src={tributeImg}
                    alt="Homenagem"
                    className="rounded-[18px] w-full object-cover"
                    style={{ maxHeight: 280, width: '100%', display: 'block' }}
                  />
                  {/* Badge ídolo */}
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase whitespace-nowrap"
                    style={{
                      background: `linear-gradient(90deg, ${GREEN}, #005c27)`,
                      border: `1.5px solid ${YELLOW}88`,
                      boxShadow: `0 4px 16px ${GREEN}66`,
                      color: YELLOW,
                    }}
                  >
                    🌟 Ídolo Eterno 🌟
                  </div>
                </div>
              </div>

              {/* Texto homenagem */}
              <div className="px-6 pt-8 pb-2 text-center space-y-3">
                <h2
                  className="text-2xl font-black leading-tight"
                  style={{ color: YELLOW, textShadow: `0 0 20px ${YELLOW}88` }}
                >
                  Sentimos a sua falta
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  Tentaram tirar você do álbum,<br />
                  mas do <span style={{ color: GREEN, fontWeight: 900 }}>meu álbum</span> você não sai.
                </p>
                <p
                  className="text-sm font-bold italic"
                  style={{ color: `${GREEN}cc` }}
                >
                  "Sempre no coração da torcida" 🇧🇷
                </p>

                {/* Botão play / pause */}
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={handlePlay}
                  className="mx-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-black text-sm"
                  style={{
                    background: playing
                      ? `rgba(255,223,0,0.15)`
                      : `linear-gradient(135deg, #004d20, ${GREEN})`,
                    border: `2px solid ${playing ? YELLOW + '88' : GREEN + '88'}`,
                    color: playing ? YELLOW : 'white',
                    boxShadow: playing
                      ? `0 0 20px ${YELLOW}44`
                      : `0 4px 20px ${GREEN}55`,
                  }}
                >
                  {playing ? '⏸' : '▶'}&nbsp;
                  {playing ? 'Pausar música' : '🎵 Tocar música'}
                </motion.button>

                {/* Ondas animadas só quando tocando */}
                {playing && (
                  <div className="flex items-center justify-center gap-1 py-1">
                    {[12, 20, 14, 24, 10, 18, 22, 10, 16, 20].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [h * 0.5, h, h * 0.5] }}
                        transition={{ duration: 0.8 + i * 0.07, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                        style={{
                          width: 3,
                          borderRadius: 4,
                          background: `linear-gradient(to top, ${GREEN}, ${YELLOW})`,
                        }}
                      />
                    ))}
                    <span className="ml-2 text-[10px] font-bold" style={{ color: `${YELLOW}88` }}>♪ tocando</span>
                  </div>
                )}
              </div>

              {/* Botão fechar */}
              <div className="px-6 pb-6 pt-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="w-full py-4 rounded-2xl font-black text-base tracking-wide"
                  style={{
                    background: `linear-gradient(135deg, #005c27, ${GREEN})`,
                    color: 'white',
                    border: `1px solid ${GREEN}88`,
                    boxShadow: `0 6px 24px ${GREEN}55`,
                  }}
                >
                  🇧🇷 Fechar Homenagem
                </motion.button>
              </div>

              {/* Rodapé tricolor */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${BLUE}, ${GREEN}, ${YELLOW}, ${GREEN}, ${BLUE})` }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
