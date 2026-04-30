export function NewsCardSkeleton() {
  return (
    <div
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflow: 'hidden',
      }}
    >
      {/* Thumbnail skeleton */}
      <div
        className="skeleton-pulse"
        style={{
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 0,
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          background: 'var(--color-bg-elevated)',
        }}
      />

      {/* Body */}
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Source row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div className="skeleton-pulse" style={{ width: '14px', height: '14px', borderRadius: '2px' }} />
        <div className="skeleton-pulse" style={{ width: '80px', height: '11px', borderRadius: '4px' }} />
      </div>

      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="skeleton-pulse" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton-pulse" style={{ width: '75%', height: '14px', borderRadius: '4px' }} />
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="skeleton-pulse" style={{ width: '100%', height: '12px', borderRadius: '4px' }} />
        <div className="skeleton-pulse" style={{ width: '100%', height: '12px', borderRadius: '4px' }} />
        <div className="skeleton-pulse" style={{ width: '55%', height: '12px', borderRadius: '4px' }} />
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <div className="skeleton-pulse" style={{ width: '44px', height: '18px', borderRadius: '99px' }} />
        <div className="skeleton-pulse" style={{ width: '60px', height: '18px', borderRadius: '99px' }} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '4px' }}>
        <div className="skeleton-pulse" style={{ width: '56px', height: '26px', borderRadius: 'var(--radius-sm)' }} />
        <div className="skeleton-pulse" style={{ width: '52px', height: '26px', borderRadius: 'var(--radius-sm)' }} />
        <div className="skeleton-pulse" style={{ width: '64px', height: '26px', borderRadius: 'var(--radius-sm)' }} />
        <div style={{ marginLeft: 'auto' }}>
          <div className="skeleton-pulse" style={{ width: '26px', height: '26px', borderRadius: 'var(--radius-sm)' }} />
        </div>
      </div>

      </div>
    </div>
  );
}
