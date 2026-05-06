import { createContext, useContext, useState } from 'react';

// Senhas armazenadas no cliente — uso pessoal/hobby app
const CREDS = { admin: 'd17m0299', trocar: 'exchange123' };

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('copa_role') || null);

  const login = (profile, password) => {
    if (CREDS[profile] === password) {
      setRole(profile);
      localStorage.setItem('copa_role', profile);
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('copa_role');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
