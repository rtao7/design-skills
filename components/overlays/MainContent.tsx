'use client';

import { useDetailPanel } from './DetailPanelContext';

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useDetailPanel();

  return (
    <main
      style={{
        flex: 1,
        overflowY: 'auto',
        background: 'var(--color-bg-base)',
        opacity: isOpen ? 0.4 : 1,
        transition: 'opacity var(--transition-slow)',
        pointerEvents: isOpen ? 'none' : 'auto',
      }}
    >
      {children}
    </main>
  );
}
