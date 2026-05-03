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
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
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

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 56;

export function Sidebar() {
  const pathname = usePathname();
  const bp = useBreakpoint();
  const { open, toggleSidebar } = useSidebar();
  const isCollapsed = !open;

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

  return (
    <aside
      aria-label="Sidebar navigation"
      style={{
        width: isCollapsed ? `${COLLAPSED_WIDTH}px` : `${EXPANDED_WIDTH}px`,
        minWidth: isCollapsed ? `${COLLAPSED_WIDTH}px` : `${EXPANDED_WIDTH}px`,
        height: '100%',
        background: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'width var(--transition-slow), min-width var(--transition-slow)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: '12px 10px 8px',
          minHeight: '52px',
          gap: '8px',
        }}
      >
        {!isCollapsed && (
          <span
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '12px',
              fontWeight: 600,
              paddingLeft: '4px',
            }}
          >
            Navigation
          </span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={open}
              onClick={toggleSidebar}
              style={{
                width: '36px',
                height: '36px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-elevated)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </TooltipContent>
        </Tooltip>
      </div>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: isCollapsed ? '0 10px 12px' : '0 8px 12px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <NavLink
            href="/"
            label="Home"
            Icon={House}
            active={isActive('/news')}
            collapsed={isCollapsed}
          />
        </div>

        <NavSection label="Discover" collapsed={isCollapsed}>
          {NAV_DISCOVER.map((item) => {
            const Icon = ICON_MAP[item.href] ?? Zap;
            return (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                Icon={Icon}
                active={isActive(item.href)}
                collapsed={isCollapsed}
                comingSoon={item.status === 'coming-soon'}
              />
            );
          })}
        </NavSection>

        <NavSection label="Library" collapsed={isCollapsed}>
          {NAV_LIBRARY.map((item) => {
            const Icon = ICON_MAP[item.href] ?? Star;
            return (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                Icon={Icon}
                active={isActive(item.href)}
                collapsed={isCollapsed}
              />
            );
          })}
        </NavSection>
      </nav>
    </aside>
  );
}

function NavSection({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {!collapsed && (
        <div
          style={{
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            color: 'var(--color-text-muted)',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      )}
      {children}
    </section>
  );
}

function NavLink({
  href,
  label,
  Icon,
  active,
  collapsed,
  comingSoon = false,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  comingSoon?: boolean;
}) {
  const content = (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '8px',
        width: collapsed ? '36px' : '100%',
        height: '36px',
        padding: collapsed ? 0 : '0 12px',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--color-bg-elevated)' : 'transparent',
        border: active ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
        color: comingSoon
          ? 'var(--color-text-muted)'
          : active
            ? 'var(--color-text-primary)'
            : 'var(--color-text-secondary)',
        opacity: comingSoon ? 0.58 : 1,
        cursor: comingSoon ? 'default' : 'pointer',
        transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
      }}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      {!collapsed && (
        <span
          style={{
            minWidth: 0,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '14px',
            fontWeight: active ? 500 : 400,
          }}
        >
          {label}
        </span>
      )}
      {!collapsed && comingSoon && (
        <span
          style={{
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            background: 'var(--color-bg-elevated)',
            borderRadius: 'var(--radius-pill)',
            padding: '2px 5px',
            flexShrink: 0,
          }}
        >
          Soon
        </span>
      )}
    </span>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {comingSoon ? (
          <div aria-label={`${label} — coming soon`}>{content}</div>
        ) : (
          <Link
            href={href}
            aria-label={label}
            style={{
              textDecoration: 'none',
              display: 'flex',
            }}
          >
            {content}
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent side="right" hidden={!collapsed}>
        {label}{comingSoon ? ' (coming soon)' : ''}
      </TooltipContent>
    </Tooltip>
  );
}
