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
import { NAV_DISCOVER, NAV_LIBRARY, CATEGORY_COLORS } from '@/lib/constants';

const ICON_MAP: Record<string, LucideIcon> = {
  '/':          House,
  '/skills':    Zap,
  '/resources': FolderOpen,
  '/news':      Newspaper,
  '/community': Flame,
  '/saved':     Star,
};

const SKILL_CATEGORIES = [
  { name: 'Product' },
  { name: 'Design' },
  { name: 'Handoff' },
  { name: 'Presentation' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/skills') {
      return pathname === '/' || pathname === '/skills' || pathname.startsWith('/skills/');
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isFilterable =
    pathname === '/' || pathname === '/skills' || pathname.startsWith('/skills/');

  return (
    <SidebarRoot
      collapsible="none"
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
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                className="data-[active=true]:border-l-2 data-[active=true]:border-[#7B61FF] data-[active=true]:rounded-l-none"
              >
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
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="data-[active=true]:border-l-2 data-[active=true]:border-[#7B61FF] data-[active=true]:rounded-l-none"
                    >
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
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="data-[active=true]:border-l-2 data-[active=true]:border-[#7B61FF] data-[active=true]:rounded-l-none"
                    >
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

        {/* Filter — only on skill pages */}
        {isFilterable && (
          <SidebarGroup>
            <SidebarGroupLabel>Filter</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SKILL_CATEGORIES.map((cat) => {
                  const colors = CATEGORY_COLORS[cat.name];
                  return (
                    <SidebarMenuItem key={cat.name}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 12px',
                          fontSize: '13px',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: colors.dot,
                            flexShrink: 0,
                          }}
                        />
                        <span>{cat.name}</span>
                      </div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>
    </SidebarRoot>
  );
}
