import { motion } from 'framer-motion';
import { Home, PlusCircle, BookOpen, Copy, Search, BarChart2 } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'input', label: 'Adicionar', icon: PlusCircle },
  { id: 'album', label: 'Álbum', icon: BookOpen },
  { id: 'duplicates', label: 'Repetidas', icon: Copy },
  { id: 'missing', label: 'Faltando', icon: Search },
  { id: 'reports', label: 'Dados', icon: BarChart2 },
];

export default function BottomNav({ active, onSelect }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10, 15, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 pb-safe pt-1">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          const isInput = id === 'input';
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="flex-1 flex flex-col items-center py-2 gap-0.5 relative transition-all duration-200"
            >
              {isInput ? (
                /* Destaque especial para o botão Adicionar */
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #FFD700, #C9A84C)'
                        : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                      boxShadow: isActive
                        ? '0 4px 20px rgba(255,215,0,0.4)'
                        : '0 4px 20px rgba(59,130,246,0.4)',
                    }}
                  >
                    <Icon size={22} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: isActive ? '#FFD700' : 'rgba(255,255,255,0.5)' }}>
                    {label}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="flex flex-col items-center gap-0.5 w-full"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: '#FFD700' }}
                    />
                  )}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(255,215,0,0.15)' : 'transparent',
                    }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      color={isActive ? '#FFD700' : 'rgba(255,255,255,0.4)'}
                    />
                  </div>
                  <span
                    className="text-[9px] font-bold"
                    style={{ color: isActive ? '#FFD700' : 'rgba(255,255,255,0.35)' }}
                  >
                    {label}
                  </span>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
