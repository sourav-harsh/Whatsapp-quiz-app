import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getUserById } from "./db.js";
import { STORAGE_KEYS, local } from "./storage.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedId = local.get(STORAGE_KEYS.authUser, null);
    if (storedId) {
      const found = getUserById(storedId);
      if (found) setUser(found);
    }
    setReady(true);
  }, []);

  const login = useCallback((selectedUser) => {
    setUser(selectedUser);
    local.set(STORAGE_KEYS.authUser, selectedUser._id);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    local.remove(STORAGE_KEYS.authUser);
  }, []);

  const value = useMemo(
    () => ({ user, ready, isAuthenticated: Boolean(user), login, logout }),
    [user, ready, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
