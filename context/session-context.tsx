/* eslint-disable react-hooks/set-state-in-effect */
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
  mounted: boolean;
  setDraftLci: (lci: LCIMatrix | null) => void;
  setDraftUev: (uev: UEVTable | null) => void;
  saveSession: (session: CalculationSession) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [draftLci, setDraftLci] = useState<LCIMatrix | null>(null);
  const [draftUev, setDraftUev] = useState<UEVTable | null>(null);
  const [session, setSession] = useState<CalculationSession | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as CalculationSession);
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session, mounted]);

  const saveSession = useCallback((next: CalculationSession) => {
    setSession(next);
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      draftLci,
      draftUev,
      mounted,
      setDraftLci,
      setDraftUev,
      saveSession,
      clearSession,
    }),
    [session, draftLci, draftUev, mounted, saveSession, clearSession],
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