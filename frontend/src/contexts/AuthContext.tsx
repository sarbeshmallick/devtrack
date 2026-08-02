import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'; import { api } from '../services/api'; import type { User } from '../types';
type AuthContextValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (name: string, email: string, password: string) => Promise<void>; logout: () => void; setUser: (user: User) => void };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) { const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { const token = localStorage.getItem('devtrack_token'); if (!token) { setLoading(false); return; } api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => localStorage.removeItem('devtrack_token')).finally(() => setLoading(false)); }, []);
  const saveSession = (data: { user: User; token: string }) => { localStorage.setItem('devtrack_token', data.token); setUser(data.user); };
  return <AuthContext.Provider value={{ user, loading, login: async (email, password) => saveSession((await api.post('/auth/login', { email, password })).data), register: async (name, email, password) => saveSession((await api.post('/auth/register', { name, email, password })).data), logout: () => { localStorage.removeItem('devtrack_token'); setUser(null); }, setUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; };
