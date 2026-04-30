'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  Zap,
  FolderOpen,
  Newspaper,
  Flame,
  Star,
  Bot,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NAV_DISCOVER, NAV_LIBRARY } from '@/lib/constants';
import { useBreakpoint } from '@/hooks/use-breakpoint';

const ICON_MAP: Record<string, LucideIcon> = {
  '/':          House,
  '/skills':    Zap,
  '/resources': FolderOpen,
  '/news':      Newspaper,
  '/community': Flame,
  '/agents':    Bot,
  '/jobs':      Briefcase,
  '/saved':     Star,
};

const ACTIVE_CLASS =
  'data-[active=true]:border-l-2 data-[active=true]:border-[#7B61FF] data-[active=true]:rounded-l-none';

export function Sidebar() {
  const pathname = usePathname();
  const bp = useBreakpoint();

  const isActive = (href: string) => {
    if (href === '/skills') {
      return pathname === '/skills' || pathname.startsWith('/skills/');
    }
    if (href === '/news') {
      return pathname === '/news' || pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Mobile: sidebar hidden, BottomNav takes over
  if (bp === 'mobile') return null;

  // Tablet: icon-only sidebar (56px)
  if (bp === 'tablet') {
    const allNavItems = [
      { href: '/', label: 'Home', Icon: House, comingSoon: false },
      ...NAV_DISCOVER.map((item) => ({
        href: item.href,
        label: item.label,
        Icon: ICON_MAP[item.href] ?? Zap,
        comingSoon: item.status === 'coming-soon',
      })),
      ...NAV_LIBRARY.map((item) => ({
        href: item.href,
        label: item.label,
        Icon: ICON_MAP[item.href] ?? Star,
        comingSoon: false,
      })),
    ];

    return (
      <aside
        aria-label="Sidebar navigation"
        style={{
          width: '56px',
          minWidth: '56px',
          height: '100%',
          background: 'var(--color-bg-surface)',
          borderRight: '1px solid var(--color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0',
          gap: '4px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {allNavItems.map(({ href, label, Icon, comingSoon }) => {
          const active = isActive(href);
          return (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                {comingSoon ? (
                  <div
                    aria-label={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--color-text-muted)',
                      cursor: 'default',
                      opacity: 0.5,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                ) : (
                  <Link
                    href={href}
                    aria-label={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: active ? 'var(--color-bg-elevated)' : 'transparent',
                      color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      borderLeft: active ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
                      transition: 'background var(--transition-fast), color var(--transition-fast)',
                      textDecoration: 'none',
                    }}
                  >
                    <Icon size={18} />
                  </Link>
                )}
              </TooltipTrigger>
              <TooltipContent side="right">
                {label}{comingSoon ? ' (coming soon)' : ''}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </aside>
    );
  }

  // Desktop: full 240px sidebar
  return (
    <SidebarRoot
      collapsible="none"
      aria-label="Sidebar navigation"
      style={{
        borderRight: '1px solid var(--color-border-subtle)',
        height: '100%',
      }}
    >
      <SidebarContent style={{ paddingTop: '8px' }}>

        {/* Home */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/news')} className={ACTIVE_CLASS}>
                <Link href="/">
                  <House />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Discover */}
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_DISCOVER.map((item) => {
                const Icon = ICON_MAP[item.href] ?? Zap;
                const active = isActive(item.href);
                const comingSoon = item.status === 'coming-soon';

                if (comingSoon) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        aria-disabled
                        aria-label={`${item.label} — coming soon`}
                        style={{ color: 'var(--color-text-muted)', cursor: 'default' }}
                      >
                        <Icon style={{ opacity: 0.5 }} />
                        <span>{item.label}</span>
                        <SidebarMenuBadge
                          style={{
                            fontSize: '9px',
                            fontWeight: 500,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            color: 'var(--color-text-muted)',
                            background: 'var(--color-bg-elevated)',
                            borderRadius: 'var(--radius-pill)',
                            padding: '2px 5px',
                            position: 'static',
                            height: 'auto',
                            minWidth: 'auto',
                          }}
                        >
                          Soon
                        </SidebarMenuBadge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} className={ACTIVE_CLASS}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Library */}
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_LIBRARY.map((item) => {
                const Icon = ICON_MAP[item.href] ?? Star;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)} className={ACTIVE_CLASS}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>
    </SidebarRoot>
  );
}
