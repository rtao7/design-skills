'use client';

import Link from 'next/link';

type ComingSoonStateProps = {
  icon: string;
  heading: string;
  body: string;
  ghostCardCount?: number;
  ctaLabel?: string;
  ctaHref?: string;
  backLabel?: string;
  backHref?: string;
};

function GhostCard() {
  return (
    <div
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '180px',
      }}
    >
      {/* Badge row */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '64px', height: '20px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-elevated)' }} />
        <div style={{ width: '24px', height: '20px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-elevated)' }} />
      </div>
      {/* Name */}
      <div style={{ width: '70%', height: '14px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-elevated)' }} />
      {/* Description lines */}
      <div style={{ width: '100%', height: '11px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-elevated)' }} />
      <div style={{ width: '80%', height: '11px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-elevated)' }} />
      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: '2px 0' }} />
      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <div style={{ width: '48px', height: '18px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-elevated)' }} />
        <div style={{ width: '40px', height: '18px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-elevated)' }} />
        <div style={{ width: '56px', height: '18px', borderRadius: 'var(--radius-pill)', background: 'var(--color-bg-elevated)' }} />
      </div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
        <div style={{ width: '60px', height: '26px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-elevated)' }} />
        <div style={{ width: '76px', height: '26px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-elevated)' }} />
        <div style={{ width: '64px', height: '26px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-elevated)' }} />
      </div>
    </div>
  );
}

export function ComingSoonState({
  icon,
  heading,
  body,
  ghostCardCount = 4,
  ctaLabel = 'Notify me →',
  ctaHref = '#',
  backLabel,
  backHref,
}: ComingSoonStateProps) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '40px 32px',
      }}
    >
      {/* Ghost card grid — behind */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          padding: '40px 32px',
          opacity: 0.15,
          filter: 'blur(2px)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {Array.from({ length: ghostCardCount }).map((_, i) => (
          <GhostCard key={i} />
        ))}
      </div>

      {/* Gradient overlay — fades ghost cards toward center */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 55% at 50% 50%, var(--color-bg-base) 30%, transparent 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Message card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '40px', lineHeight: 1 }}>{icon}</div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {heading}
        </h1>

        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
            maxWidth: '300px',
          }}
        >
          {body}
        </p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href={ctaHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 18px',
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
          </a>

          {backLabel && backHref && (
            <Link
              href={backHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--color-border-default)',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                fontWeight: 400,
                textDecoration: 'none',
                transition: 'border-color var(--transition-fast), color var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-focus)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-default)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-secondary)';
              }}
            >
              {backLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
