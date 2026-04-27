'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, FolderOpen, Newspaper, Flame } from 'lucide-react';
import { useBreakpoint } from '@/hooks/use-breakpoint';

const NAV_ITEMS = [
  { href: '/news',      label: 'News',      Icon: Newspaper,  comingSoon: false },
  { href: '/skills',    label: 'Skills',    Icon: Zap,        comingSoon: false },
  { href: '/resources', label: 'Resources', Icon: FolderOpen, comingSoon: true  },
  { href: '/community', label: 'Community', Icon: Flame,      comingSoon: true  },
];

export function BottomNav() {
  const pathname = usePathname();
  const bp = useBreakpoint();

  if (bp !== 'mobile') return null;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      aria-label="Bottom navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 40,
      }}
    >
      {NAV_ITEMS.map(({ href, label, Icon, comingSoon }) => {
        const active = isActive(href);

        if (comingSoon) {
          return (
            <div
              key={href}
              aria-label={`${label} — coming soon`}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                opacity: 0.35,
                cursor: 'default',
              }}
            >
              <Icon size={20} color="var(--color-text-muted)" />
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.01em',
                }}
              >
                {label}
              </span>
            </div>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              textDecoration: 'none',
              color: active ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              position: 'relative',
            }}
          >
            {/* Active indicator dot */}
            {active && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--color-accent-primary)',
                }}
              />
            )}
            <Icon size={20} />
            <span
              style={{
                fontSize: '10px',
                fontWeight: active ? 500 : 400,
                letterSpacing: '0.01em',
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
