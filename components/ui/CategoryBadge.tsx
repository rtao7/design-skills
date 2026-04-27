import { CATEGORY_COLORS } from '@/lib/constants';

type CategoryBadgeProps = {
  category: string;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const key = category as keyof typeof CATEGORY_COLORS;
  const colors = CATEGORY_COLORS[key] ?? {
    bg: 'rgba(139,144,160,0.10)',
    text: '#8B90A0',
    dot: '#8B90A0',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        borderRadius: 'var(--radius-pill)',
        background: colors.bg,
        color: colors.text,
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: colors.dot,
          flexShrink: 0,
        }}
      />
      {category}
    </span>
  );
}
