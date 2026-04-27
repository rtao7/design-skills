import { NewsCardSkeleton } from '@/components/cards/NewsCardSkeleton';

export default function Loading() {
  return (
    <main style={{ padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <div className="skeleton-pulse" style={{ width: '120px', height: '20px', borderRadius: '4px' }} />
        <div className="skeleton-pulse" style={{ width: '80px', height: '13px', borderRadius: '4px', marginTop: '6px' }} />
      </div>

      {/* Filter tab skeletons */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[64, 48, 80, 96, 110, 80].map((w, i) => (
          <div
            key={i}
            className="skeleton-pulse"
            style={{ width: `${w}px`, height: '26px', borderRadius: '99px' }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '12px',
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
