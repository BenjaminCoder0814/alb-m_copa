import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CollectionProvider } from './store/CollectionContext';
import TributeModal from './components/TributeModal';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import StickerInput from './pages/StickerInput';
import AlbumView from './pages/AlbumView';
import DuplicateList from './pages/DuplicateList';
import MissingList from './pages/MissingList';
import Reports from './pages/Reports';

const PAGES = {
  dashboard: Dashboard,
  input: StickerInput,
  album: AlbumView,
  duplicates: DuplicateList,
  missing: MissingList,
  reports: Reports,
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

function App() {
  const [tab, setTab] = useState('dashboard');
  const [showTribute, setShowTribute] = useState(true);
  const Page = PAGES[tab];

  return (
    <CollectionProvider>
      <div className="min-h-screen" style={{ background: '#011a07' }}>
        <main className="max-w-lg mx-auto pb-24">
          <AnimatePresence mode="wait">
            <PageWrapper key={tab}>
              <Page />
            </PageWrapper>
          </AnimatePresence>
        </main>
        <TributeModal open={showTribute} onClose={() => setShowTribute(false)} />
        <BottomNav active={tab} onNavigate={setTab} />
      </div>
    </CollectionProvider>
  );
}

export default App;
