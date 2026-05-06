import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';

export default function LoginPage() {
  const { login } = useAuth();
  const [selected, setSelected] = useState(null);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!password) return;
    const ok = login(selected, password);
    if (!ok) {
      setError('Senha incorreta!');
      setTimeout(() => setError(''), 2000);
    }
  };

  const profiles = [
    { id: 'admin',  label: 'Meninos Maciel', icon: '👑', desc: 'Acesso completo ao álbum',           color: YELLOW },
    { id: 'trocar', label: 'Trocar',          icon: '🔄', desc: 'Ver álbum e reservar figurinhas',    color: GREEN  },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#011a07' }}>
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="mb-8 text-center"
      >
        <div className="text-6xl mb-3">🏆</div>
        <h1 className="text-3xl font-black text-white">Copa 2026</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Álbum Panini — Selecione o perfil</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-3">
        {profiles.map(({ id, label, icon, desc, color }) => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setSelected(id); setPassword(''); setError(''); }}
            className="w-full rounded-2xl p-4 text-left flex items-center gap-4"
            style={{
              background: selected === id ? `${color}18` : 'rgba(255,255,255,0.05)',
              border: `2px solid ${selected === id ? color : 'rgba(255,255,255,0.1)'}`,
              transition: 'all 0.15s',
            }}
          >
            <span className="text-3xl">{icon}</span>
            <div>
              <p className="font-black text-white">{label}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-sm mt-5 space-y-3"
          >
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Digite a senha..."
                autoFocus
                className="w-full rounded-2xl px-4 py-3.5 text-sm font-bold outline-none pr-12"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: `2px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
                  color: 'white',
                }}
              />
              <button
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40"
              >
                {showPass ? <EyeOff size={16} color="white" /> : <Eye size={16} color="white" />}
              </button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-center font-bold"
                  style={{ color: '#f87171' }}
                >{error}</motion.p>
              )}
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleLogin}
              disabled={!password}
              className="w-full py-3.5 rounded-2xl font-black flex items-center justify-center gap-2"
              style={{
                background: password ? `linear-gradient(135deg, #005c27, ${GREEN})` : 'rgba(255,255,255,0.05)',
                color: password ? 'white' : 'rgba(255,255,255,0.2)',
              }}
            >
              <LogIn size={18} />
              Entrar
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
