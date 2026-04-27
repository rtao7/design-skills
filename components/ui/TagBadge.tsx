export function TagBadge({ tag }: { tag: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(255,255,255,0.05)',
        color: 'var(--color-text-muted)',
        fontSize: '11px',
        fontWeight: 400,
        whiteSpace: 'nowrap',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      {tag}
    </span>
  );
}
