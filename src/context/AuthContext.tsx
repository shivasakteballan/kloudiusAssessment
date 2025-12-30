import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type StoredUser = AuthUser & { password: string };

type AuthContextValue = {
  user: AuthUser | null;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AUTH_USER_KEY = '@auth/currentUser';
const USERS_KEY = '@auth/users';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase().includes('@');
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

async function readUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  const parsed = safeJsonParse<StoredUser[]>(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function writeCurrentUser(user: AuthUser | null) {
  if (!user) {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
    return;
  }
  await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const raw = await AsyncStorage.getItem(AUTH_USER_KEY);
      const parsed = safeJsonParse<AuthUser>(raw);
      if (isMounted) setUser(parsed);
      if (isMounted) setIsHydrating(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (email.length === 0) throw new Error('Email is required');
    const normalized = normalizeEmail(email);
    if (!normalized) throw new Error('Invalid email');
    if (!password) throw new Error('Password is required');

    const users = await readUsers();
    const found = users.find(u => normalizeEmail(u.email) === normalized);
    if (!found) throw new Error('User not found');
    if (found.password !== password) throw new Error('Incorrect password');

    const nextUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
    };
    setUser(nextUser);
    await writeCurrentUser(nextUser);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const trimmedName = name.trim();
      const normalized = normalizeEmail(email);

      if (!trimmedName) throw new Error('Name is required');
      if (!normalized) throw new Error('Email is required');
      if (!password || password.length < 6)
        throw new Error('Password must be at least 6 characters');

      const users = await readUsers();
      const exists = users.some(u => normalizeEmail(u.email) === normalized);
      if (exists) throw new Error('An account with this email already exists');

      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const stored: StoredUser = { id, name: trimmedName, email, password };
      await writeUsers([stored, ...users]);

      const nextUser: AuthUser = {
        id: stored.id,
        name: stored.name,
        email: stored.email,
      };
      setUser(nextUser);
      await writeCurrentUser(nextUser);
    },
    [],
  );

  const logout = useCallback(async () => {
    setUser(null);
    await writeCurrentUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isHydrating, login, signup, logout }),
    [user, isHydrating, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
