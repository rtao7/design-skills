'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Skill } from '@/lib/skills';

type DetailPanelState = {
  isOpen: boolean;
  skill: Skill | null;
  openPanel: (skill: Skill) => void;
  closePanel: () => void;
};

const DetailPanelContext = createContext<DetailPanelState | null>(null);

export function useDetailPanel() {
  const ctx = useContext(DetailPanelContext);
  if (!ctx) throw new Error('useDetailPanel must be used within DetailPanelProvider');
  return ctx;
}

export function DetailPanelProvider({ children }: { children: React.ReactNode }) {
  const [skill, setSkill] = useState<Skill | null>(null);

  const openPanel = useCallback((s: Skill) => setSkill(s), []);
  const closePanel = useCallback(() => setSkill(null), []);

  return (
    <DetailPanelContext.Provider
      value={{ isOpen: skill !== null, skill, openPanel, closePanel }}
    >
      {children}
    </DetailPanelContext.Provider>
  );
}
