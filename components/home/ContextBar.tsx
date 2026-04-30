import { Bookmark } from 'lucide-react';

type ContextBarProps = {
  newsCount: number;
  skillCount: number;
};

function getGreeting(): string {
  return 'Explore a curated list of amazing design resources and beautiful digital artwork';
}

function getDateLabel(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function ContextBar({ newsCount, skillCount }: ContextBarProps) {
  return (
    <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Row 1 — greeting + count chips */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.35 }}>
            {getGreeting()}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0, marginTop: '3px' }}>
            {getDateLabel()}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {[`${newsCount} stories`, `${skillCount} skills`].map((label) => (
            <span
              key={label}
              style={{
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(123,97,255,0.2)',
                background: 'rgba(123,97,255,0.08)',
                color: 'var(--color-accent-primary)',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — login CTA banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid rgba(123,97,255,0.15)',
          background: 'linear-gradient(135deg, rgba(123,97,255,0.06), rgba(61,214,140,0.04))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bookmark size={14} color="var(--color-accent-primary)" />
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Save skills, news &amp; inspirations you love — sign in to build your personal library.
          </span>
        </div>

        <button
          style={{
            fontSize: '11px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-accent-primary)',
            color: 'var(--color-accent-primary)',
            background: 'transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Sign in
        </button>
      </div>

    </div>
  );
}
