'use client';

import Link from 'next/link';

type EmptyStateProps = {
  icon: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export function EmptyState({ icon, heading, body, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
        padding: '40px 32px',
        gap: '12px',
      }}
    >
      <div style={{ fontSize: '40px', lineHeight: 1 }}>{icon}</div>

      <h1
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          marginTop: '4px',
        }}
      >
        {heading}
      </h1>

      <p
        style={{
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'var(--color-text-secondary)',
          maxWidth: '280px',
        }}
      >
        {body}
      </p>

      <Link
        href={ctaHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 18px',
          marginTop: '8px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-accent-primary)',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 500,
          textDecoration: 'none',
          transition: 'opacity var(--transition-fast)',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
