import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

const GREEN = '#009C3B';
const YELLOW = '#FFDF00';

const ADMIN_TABS = [
  { id: 'dashboard', label: 'Inicio',    icon: '🏠' },
  { id: 'input',     label: 'Adicionar', icon: '➕' },
  { id: 'album',     label: 'Album',     icon: '📗' },
  { id: 'dupes',     label: 'Repetidas', icon: '🔄' },
  { id: 'missing',   label: 'Faltando',  icon: '🔍' },
  { id: 'reports',   label: 'Stats',     icon: '📊' },
  { id: 'reservas',  label: 'Reservas',  icon: '📋' },
];

const GUEST_TABS = [
  { id: 'album',    label: 'Álbum',    icon: '📗' },
  { id: 'trocar',   label: 'Trocar',   icon: '🔄' },
  { id: 'reservas', label: 'Reservas', icon: '📋' },
];

export default function BottomNav({ active, onNavigate, role, onLogout }) {
  const TABS = role === 'trocar' ? GUEST_TABS : ADMIN_TABS;
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{
        background: 'linear-gradient(to top, #011a07f5, #011a07ee)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${GREEN}33`,
        boxShadow: `0 -4px 30px rgba(0,0,0,0.6)`,
      }}
    >
      <div className="flex justify-around items-center h-16 px-1">
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${GREEN}, ${YELLOW})` }}
                />
              )}
              <span
                className="text-lg leading-none transition-all duration-200"
                style={{
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(255,223,0,0.6))' : 'none',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[9px] font-bold tracking-tight transition-all duration-200"
                style={{ color: isActive ? YELLOW : 'rgba(255,255,255,0.3)' }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
        {/* Logout button */}
        <motion.button
          onClick={onLogout}
          whileTap={{ scale: 0.85 }}
          className="flex flex-col items-center justify-center flex-1 h-full gap-0.5"
        >
          <LogOut size={16} color="rgba(255,255,255,0.25)" />
          <span className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>Sair</span>
        </motion.button>
      </div>
    </nav>
  );
}
