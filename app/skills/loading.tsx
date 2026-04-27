import { SkillCardSkeleton } from '@/components/cards/SkillCardSkeleton';

export default function SkillsLoading() {
  return (
    <div style={{ padding: '36px 32px', maxWidth: '900px' }}>
      {/* Hero skeleton */}
      <div style={{ marginBottom: '28px' }}>
        <div
          className="skeleton-pulse"
          style={{
            width: '260px',
            height: '28px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg-elevated)',
            marginBottom: '10px',
          }}
        />
        <div
          className="skeleton-pulse"
          style={{
            width: '340px',
            height: '14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg-elevated)',
          }}
        />
      </div>

      {/* Tab skeleton */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--color-border-subtle)',
          paddingBottom: '8px',
        }}
      >
        {[80, 68, 60].map((w, i) => (
          <div
            key={i}
            className="skeleton-pulse"
            style={{
              width: `${w}px`,
              height: '22px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg-elevated)',
            }}
          />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <SkillCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
