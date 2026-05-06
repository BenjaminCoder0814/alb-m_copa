import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { STICKER_MAP, ALL_STICKERS, GROUPS, TEAMS } from '../data/stickers';

const STORAGE_KEY = 'copa_collection';

const CollectionContext = createContext(null);

function loadCollection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCollection(col) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(col));
}

export function CollectionProvider({ children }) {
  const [collection, setCollection] = useState(loadCollection);
  const [lastResult, setLastResult] = useState(null); // {type, codes}

  useEffect(() => {
    saveCollection(collection);
  }, [collection]);

  // Parse raw input like "BRA1 BRA2, ARG5 fra10"
  const parseInput = useCallback((raw) => {
    return raw
      .toUpperCase()
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, []);

  const addStickers = useCallback((raw) => {
    const codes = parseInput(raw);
    const results = { new: [], duplicate: [], invalid: [] };

    setCollection((prev) => {
      const next = { ...prev };
      for (const code of codes) {
        if (!STICKER_MAP[code]) {
          results.invalid.push(code);
          continue;
        }
        if (!next[code]) {
          next[code] = 1;
          results.new.push(code);
        } else {
          next[code] += 1;
          results.duplicate.push(code);
        }
      }
      return next;
    });

    setLastResult(results);
    return results;
  }, [parseInput]);

  const removeSticker = useCallback((code) => {
    setCollection((prev) => {
      const next = { ...prev };
      if (!next[code]) return prev;
      if (next[code] === 1) delete next[code];
      else next[code] -= 1;
      return next;
    });
  }, []);

  const removeStickerCompletely = useCallback((code) => {
    setCollection((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  }, []);

  const markTraded = useCallback((code) => {
    setCollection((prev) => {
      const next = { ...prev };
      if (!next[code] || next[code] <= 1) return prev;
      next[code] -= 1;
      return next;
    });
  }, []);

  const getMissingStickers = useCallback(() => {
    return ALL_STICKERS.filter((s) => !collection[s.code]);
  }, [collection]);

  const getDuplicateStickers = useCallback(() => {
    return ALL_STICKERS.filter((s) => collection[s.code] > 1).map((s) => ({
      ...s,
      quantity: collection[s.code],
    }));
  }, [collection]);

  const getOwnedCount = useCallback(() => {
    return Object.keys(collection).length;
  }, [collection]);

  const getTotalDuplicates = useCallback(() => {
    return Object.values(collection).reduce((acc, qty) => acc + Math.max(0, qty - 1), 0);
  }, [collection]);

  const calculateProgress = useCallback(() => {
    const owned = getOwnedCount();
    return ((owned / ALL_STICKERS.length) * 100).toFixed(1);
  }, [getOwnedCount]);

  const getGroupProgress = useCallback(() => {
    const result = {};
    for (const [group, teams] of Object.entries(GROUPS)) {
      let total = 0, owned = 0;
      for (const t of teams) {
        const count = TEAMS[t]?.count || 20;
        total += count;
        for (let i = 1; i <= count; i++) {
          if (collection[`${t}${i}`]) owned++;
        }
      }
      result[group] = { total, owned, pct: total ? ((owned / total) * 100).toFixed(1) : 0 };
    }
    return result;
  }, [collection]);

  const getCountryProgress = useCallback((countryCode) => {
    const count = TEAMS[countryCode]?.count || 20;
    let owned = 0;
    for (let i = 1; i <= count; i++) {
      if (collection[`${countryCode}${i}`]) owned++;
    }
    return { total: count, owned, pct: ((owned / count) * 100).toFixed(1) };
  }, [collection]);

  const exportCollection = useCallback(() => {
    const data = JSON.stringify(collection, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minha-colecao-copa.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [collection]);

  const importCollection = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setCollection(data);
      } catch {
        alert('Arquivo inválido');
      }
    };
    reader.readAsText(file);
  }, []);

  const resetCollection = useCallback(() => {
    setCollection({});
  }, []);

  return (
    <CollectionContext.Provider value={{
      collection,
      lastResult,
      addStickers,
      removeSticker,
      removeStickerCompletely,
      markTraded,
      getMissingStickers,
      getDuplicateStickers,
      getOwnedCount,
      getTotalDuplicates,
      calculateProgress,
      getGroupProgress,
      getCountryProgress,
      exportCollection,
      importCollection,
      resetCollection,
    }}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection must be inside CollectionProvider');
  return ctx;
}
