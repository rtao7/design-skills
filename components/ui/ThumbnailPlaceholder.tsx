'use client';

type ThumbnailPlaceholderProps = {
  source: string;
  sourceFavicon?: string;
};

function hashSource(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getInitials(source: string): string {
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

const PALETTES = [
  {
    gradient: 'linear-gradient(135deg, #1a1730, #2d2550, #1e1b3a)',
    glow: 'rgba(139,92,246,0.15)',
    ringBorder: 'rgba(139,92,246,0.2)',
    ringText: 'rgba(167,139,250,0.8)',
  },
  {
    gradient: 'linear-gradient(135deg, #0d1f1f, #0f3030, #0d2020)',
    glow: 'rgba(45,212,191,0.12)',
    ringBorder: 'rgba(45,212,191,0.2)',
    ringText: 'rgba(94,234,212,0.8)',
  },
  {
    gradient: 'linear-gradient(135deg, #1f1508, #2e1f0a, #1a1005)',
    glow: 'rgba(245,158,11,0.12)',
    ringBorder: 'rgba(245,158,11,0.2)',
    ringText: 'rgba(252,211,77,0.8)',
  },
  {
    gradient: 'linear-gradient(135deg, #080f1f, #0f1e3a, #080e1c)',
    glow: 'rgba(59,130,246,0.12)',
    ringBorder: 'rgba(59,130,246,0.2)',
    ringText: 'rgba(96,165,250,0.8)',
  },
  {
    gradient: 'linear-gradient(135deg, #1f0812, #2e0f1c, #1a0810)',
    glow: 'rgba(244,63,94,0.12)',
    ringBorder: 'rgba(244,63,94,0.2)',
    ringText: 'rgba(251,113,133,0.8)',
  },
  {
    gradient: 'linear-gradient(135deg, #071410, #0d2018, #081412)',
    glow: 'rgba(52,211,153,0.12)',
    ringBorder: 'rgba(52,211,153,0.2)',
    ringText: 'rgba(110,231,183,0.8)',
  },
];

const PATTERNS = [
  {
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  },
  {
    backgroundImage:
      'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
    backgroundSize: '18px 18px',
  },
  {
    backgroundImage:
      'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255,255,255,0.025) 12px, rgba(255,255,255,0.025) 13px)',
    backgroundSize: undefined,
  },
];

export function ThumbnailPlaceholder({ source, sourceFavicon }: ThumbnailPlaceholderProps) {
  const idx = hashSource(source) % 6;
  const palette = PALETTES[idx];
  const pattern = PATTERNS[idx % 3];
  const initials = getInitials(source);
  const label = source.length > 20 ? source.slice(0, 20) + '…' : source;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
        background: palette.gradient,
      }}
    >
      {/* Pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: pattern.backgroundImage,
          backgroundSize: pattern.backgroundSize,
        }}
      />

      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 40%, ${palette.glow}, transparent 70%)`,
        }}
      />

      {/* Centre content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          height: '100%',
        }}
      >
        {/* Initials circle */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: `1px solid ${palette.ringBorder}`,
            color: palette.ringText,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        {/* Source name */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
      </div>

      {/* Source badge — bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          borderRadius: 'var(--radius-pill)',
          padding: '3px 10px 3px 7px',
        }}
      >
        {sourceFavicon ? (
          <img
            src={sourceFavicon}
            alt=""
            width={14}
            height={14}
            style={{ borderRadius: '3px', flexShrink: 0 }}
          />
        ) : (
          <span
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              background: palette.ringBorder,
              color: palette.ringText,
              fontSize: '9px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {initials[0]}
          </span>
        )}
        <span style={{ fontSize: '10px', color: '#fff', whiteSpace: 'nowrap' }}>
          {source}
        </span>
      </div>
    </div>
  );
}
