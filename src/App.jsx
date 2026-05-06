import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CollectionProvider } from './store/CollectionContext';
import { AuthProvider, useAuth } from './store/AuthContext';
import { ReservasProvider } from './store/ReservasContext';
import TributeModal from './components/TributeModal';
import SplashScreen from './components/SplashScreen';
import tributeAudio from './imagens/Paródia Espera eu chegar.mp4';
import BottomNav from './components/BottomNav';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StickerInput from './pages/StickerInput';
import AlbumView from './pages/AlbumView';
import DuplicateList from './pages/DuplicateList';
import MissingList from './pages/MissingList';
import Reports from './pages/Reports';
import TrocarView from './pages/TrocarView';
import MinhasReservas from './pages/MinhasReservas';
import ReservasAdminView from './pages/ReservasAdminView';

const ADMIN_PAGES = {
  dashboard: Dashboard,
  input: StickerInput,
  album: AlbumView,
  dupes: DuplicateList,
  missing: MissingList,
  reports: Reports,
  reservas: ReservasAdminView,
};

const GUEST_PAGES = {
  album: () => <AlbumView readOnly />,
  trocar: TrocarView,
  reservas: MinhasReservas,
};

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="px-4 pt-4"
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const { role, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [showTribute, setShowTribute] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setTab(role === 'trocar' ? 'album' : 'dashboard');
  }, [role]);

  if (!role) return <LoginPage />;

  const PAGES = role === 'admin' ? ADMIN_PAGES : GUEST_PAGES;
  const defaultTab = role === 'admin' ? 'dashboard' : 'album';
  const Page = PAGES[tab] || PAGES[defaultTab];

  const handleEnter = () => {
    if (audioRef.current) audioRef.current.play().catch(() => {});
    setShowSplash(false);
    setShowTribute(true);
  };

  return (
    <>
      <audio ref={audioRef} src={tributeAudio} loop={false} preload="auto" />
      <div className="min-h-screen" style={{ background: '#011a07' }}>
        <AnimatePresence>
          {showSplash && <SplashScreen onEnter={handleEnter} />}
        </AnimatePresence>
        <main className="max-w-lg mx-auto pb-24">
          <AnimatePresence mode="wait">
            <PageWrapper key={tab}>
              <Page />
            </PageWrapper>
          </AnimatePresence>
        </main>
        <TributeModal open={showTribute} onClose={() => setShowTribute(false)} audioRef={audioRef} />
        <BottomNav active={tab} onNavigate={setTab} role={role} onLogout={logout} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CollectionProvider>
        <ReservasProvider>
          <AppContent />
        </ReservasProvider>
      </CollectionProvider>
    </AuthProvider>
  );
}
