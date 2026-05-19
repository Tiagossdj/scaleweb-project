"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CalculationSession, LCIMatrix, UEVTable } from "@/types/emergy";

const STORAGE_KEY = "scale-web-session";

interface SessionContextValue {
  session: CalculationSession | null;
  draftLci: LCIMatrix | null;
  draftUev: UEVTable | null;
  setDraftLci: (lci: LCIMatrix | null) => void;
  setDraftUev: (uev: UEVTable | null) => void;
  saveSession: (session: CalculationSession) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CalculationSession | null>(null);
  const [draftLci, setDraftLci] = useState<LCIMatrix | null>(null);
  const [draftUev, setDraftUev] = useState<UEVTable | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as CalculationSession);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const saveSession = useCallback((next: CalculationSession) => {
    setSession(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      session: hydrated ? session : null,
      draftLci,
      draftUev,
      setDraftLci,
      setDraftUev,
      saveSession,
      clearSession,
    }),
    [hydrated, session, draftLci, draftUev, saveSession, clearSession]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
