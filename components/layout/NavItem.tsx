'use client';

import Link from 'next/link';
import { useState } from 'react';

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  isComingSoon?: boolean;
  count?: number;
};

export function NavItem({ href, icon, label, isActive, isComingSoon, count }: NavItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '7px 12px',
    borderRadius: 'var(--radius-md)',
    fontSize: '13px',
    fontWeight: isActive ? 500 : 400,
    cursor: isComingSoon ? 'default' : 'pointer',
    transition: 'background var(--transition-fast)',
    position: 'relative',
    textDecoration: 'none',
    color: isComingSoon
      ? 'var(--color-text-muted)'
      : isActive
      ? 'var(--color-text-primary)'
      : 'var(--color-text-secondary)',
    background: isActive ? 'var(--color-bg-elevated)' : 'transparent',
    borderLeft: isActive
      ? '2px solid var(--color-accent-primary)'
      : '2px solid transparent',
    marginLeft: '-2px',
  };

  if (isComingSoon) {
    return (
      <div style={{ position: 'relative' }}>
        <div
          style={baseStyle}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span style={{ fontSize: '14px', lineHeight: 1, opacity: 0.5 }}>{icon}</span>
          <span style={{ flex: 1 }}>{label}</span>
          <span
            style={{
              fontSize: '9px',
              fontWeight: 500,
              padding: '2px 5px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Soon
          </span>
        </div>
        {showTooltip && (
          <div
            style={{
              position: 'absolute',
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              marginLeft: '8px',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 10px',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
              zIndex: 50,
              pointerEvents: 'none',
            }}
          >
            Coming soon
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={href} style={baseStyle}>
      <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
