export function SkillCardSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        gap: '10px',
      }}
    >
      {/* Badge + action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Bone width="64px" height="20px" radius="var(--radius-pill)" />
        <Bone width="24px" height="20px" radius="var(--radius-sm)" />
      </div>

      {/* Skill name */}
      <Bone width="65%" height="14px" />

      {/* Description */}
      <Bone width="100%" height="11px" />
      <Bone width="78%" height="11px" />

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', margin: '2px 0' }} />

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <Bone width="50px" height="18px" radius="var(--radius-pill)" />
        <Bone width="42px" height="18px" radius="var(--radius-pill)" />
        <Bone width="58px" height="18px" radius="var(--radius-pill)" />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
        <Bone width="62px" height="26px" radius="var(--radius-md)" />
        <Bone width="80px" height="26px" radius="var(--radius-md)" />
        <Bone width="68px" height="26px" radius="var(--radius-md)" />
      </div>
    </div>
  );
}

function Bone({
  width,
  height,
  radius = 'var(--radius-sm)',
}: {
  width: string;
  height: string;
  radius?: string;
}) {
  return (
    <div
      className="skeleton-pulse"
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'var(--color-bg-elevated)',
        flexShrink: 0,
      }}
    />
  );
}
