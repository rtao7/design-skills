'use client';

import Link from 'next/link';
import { useCommandPalette } from '@/components/overlays/CommandPaletteContext';

export function TopBar() {
  const { openPalette } = useCommandPalette();

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            background: 'var(--color-accent-primary)',
            borderRadius: '6px',
            fontSize: '12px',
          }}
        >
          ⚡
        </span>
        dskill
      </Link>

      {/* Search trigger */}
      <button
        onClick={openPalette}
        style={{
          flex: 1,
          maxWidth: '360px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 12px',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-muted)',
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'border-color var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-default)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-subtle)';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left' }}>Search everything...</span>
        <kbd
          style={{
            fontSize: '11px',
            padding: '1px 5px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '4px',
            color: 'var(--color-text-muted)',
            fontFamily: 'inherit',
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Right slot */}
      <div style={{ marginLeft: 'auto' }}>
        <button
          style={{
            padding: '6px 14px',
            background: 'var(--color-accent-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'opacity var(--transition-fast)',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          Sign in
        </button>
      </div>
    </header>
  );
}
