import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { db } from '../firebase';

const ReservasContext = createContext(null);

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

export function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, 'reservas'), (snap) => {
      const data = snap.val() || {};
      setReservas(Object.entries(data).map(([id, v]) => ({ id, ...v })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const criarReserva = useCallback(({ nome, senha, querCode, ofereceCode, categoria }) =>
    push(ref(db, 'reservas'), {
      nome: nome.trim(),
      senhaHash: simpleHash(senha.trim()),
      querCode,
      ofereceCode,
      categoria,
      status: 'pendente',
      criadoEm: Date.now(),
    }), []);

  const cancelarReserva = useCallback((id, senha) => {
    const r = reservas.find(r => r.id === id);
    if (!r || r.senhaHash !== simpleHash(senha.trim())) return false;
    update(ref(db, `reservas/${id}`), { status: 'cancelado' });
    return true;
  }, [reservas]);

  const confirmarReserva = useCallback((id) =>
    update(ref(db, `reservas/${id}`), { status: 'confirmado' }), []);

  const recusarReserva = useCallback((id) =>
    update(ref(db, `reservas/${id}`), { status: 'recusado' }), []);

  const getReservedCount = useCallback((code) =>
    reservas.filter(r => r.querCode === code && r.status === 'pendente').length, [reservas]);

  return (
    <ReservasContext.Provider value={{
      reservas, loading,
      criarReserva, cancelarReserva,
      confirmarReserva, recusarReserva,
      getReservedCount,
    }}>
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  return useContext(ReservasContext);
}
