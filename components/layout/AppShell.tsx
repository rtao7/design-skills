import { getAllCategories } from '@/lib/skills';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DetailPanelProvider } from '@/components/overlays/DetailPanelContext';
import { DetailPanel } from '@/components/overlays/DetailPanel';
import { MainContent } from '@/components/overlays/MainContent';
import { CommandPaletteProvider } from '@/components/overlays/CommandPaletteContext';
import { CommandPalette } from '@/components/overlays/CommandPalette';

const sidebarTokens = {
  '--sidebar':                   'var(--color-bg-surface)',
  '--sidebar-foreground':        'var(--color-text-primary)',
  '--sidebar-accent':            'var(--color-bg-elevated)',
  '--sidebar-accent-foreground': 'var(--color-text-primary)',
  '--sidebar-border':            'var(--color-border-subtle)',
} as React.CSSProperties;

export async function AppShell({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories();
  const allSkills = categories.flatMap((cat) => [
    ...cat.skills,
    ...cat.folders.flatMap((f) => f.skills),
  ]);

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
      <TooltipProvider>
        <CommandPaletteProvider>
          <DetailPanelProvider>
            <TopBar />
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
            <CommandPalette allSkills={allSkills} />
          </DetailPanelProvider>
          <BottomNav />
        </CommandPaletteProvider>
      </TooltipProvider>
    </div>
  );
}
