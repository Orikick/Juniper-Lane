import { createContext, useCallback, useContext, useMemo } from 'react';
import * as api from '../api/fakeApi';
import { useLocalStorage } from '../hooks/useLocalStorage';

const USER_KEY = 'jl:user';

const AuthContext = createContext(null);

const toUser = (profile) => ({
  name: profile.name,
  email: profile.email,
  jobTitle: profile.jobTitle,
});

// Mock authentication. Signing in stores a user in localStorage; nothing is sent anywhere.
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(USER_KEY, null);

  const signIn = useCallback(
    async (credentials) => {
      const profile = await api.signIn(credentials);
      setUser(toUser(profile));
    },
    [setUser],
  );

  const signOut = useCallback(() => setUser(null), [setUser]);

  // Keeps the user menu in step after the profile form is saved.
  const updateUser = useCallback((profile) => setUser(toUser(profile)), [setUser]);

  const value = useMemo(
    () => ({ user, signIn, signOut, updateUser }),
    [user, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
