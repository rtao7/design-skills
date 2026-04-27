import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DetailPanelProvider } from '@/components/overlays/DetailPanelContext';
import { DetailPanel } from '@/components/overlays/DetailPanel';
import { MainContent } from '@/components/overlays/MainContent';

const sidebarTokens = {
  '--sidebar':                   'var(--color-bg-surface)',
  '--sidebar-foreground':        'var(--color-text-primary)',
  '--sidebar-accent':            'var(--color-bg-elevated)',
  '--sidebar-accent-foreground': 'var(--color-text-primary)',
  '--sidebar-border':            'var(--color-border-subtle)',
} as React.CSSProperties;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
      }}
    >
      <TopBar />
      <TooltipProvider>
        <DetailPanelProvider>
          <SidebarProvider
            defaultOpen={true}
            style={{
              flex: 1,
              overflow: 'hidden',
              ...sidebarTokens,
            } as React.CSSProperties}
          >
            <Sidebar />
            <MainContent>{children}</MainContent>
          </SidebarProvider>
          <DetailPanel />
        </DetailPanelProvider>
      </TooltipProvider>
    </div>
  );
}
