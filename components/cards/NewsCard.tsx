'use client';

import { useState } from 'react';
import { NewsItem } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { SaveButton } from '@/components/ui/SaveButton';
import { LikeButton } from '@/components/ui/LikeButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { ThumbnailPlaceholder } from '@/components/ui/ThumbnailPlaceholder';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
}

function getTypePill(tags: string[]): { label: string; color: string } {
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.some((t) => ['launch', 'product launch', 'new product'].includes(t)))
    return { label: 'Launch', color: 'var(--color-accent-secondary)' };
  if (lower.some((t) => ['tool', 'plugin', 'figma plugin'].includes(t)))
    return { label: 'Tool', color: 'var(--color-accent-blue)' };
  if (lower.some((t) => ['video'].includes(t)))
    return { label: 'Video', color: 'var(--color-accent-red)' };
  return { label: 'Article', color: 'var(--color-text-muted)' };
}

export function NewsCard({ item }: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const pill = getTypePill(item.tags);
  const showPlaceholder = !item.thumbnail || imgError;

  return (
    <article
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-card)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color var(--transition-fast), background var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-default)';
        (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-elevated)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-subtle)';
        (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-surface)';
      }}
    >
      {/* Thumbnail — real image, placeholder, or error fallback */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {!showPlaceholder ? (
          <img
            src={item.thumbnail}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <ThumbnailPlaceholder source={item.source} sourceFavicon={item.sourceFavicon} />
        )}
        {/* Source badge — only on real image; placeholder renders its own */}
        {!showPlaceholder && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-pill)',
              padding: '3px 10px 3px 7px',
            }}
          >
            {item.sourceFavicon && (
              <img
                src={item.sourceFavicon}
                alt=""
                width={14}
                height={14}
                style={{ borderRadius: '3px', flexShrink: 0 }}
              />
            )}
            <span style={{ fontSize: '11px', color: '#fff', whiteSpace: 'nowrap' }}>
              {item.source}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>·</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>
              {timeAgo(item.publishedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {/* Type pill */}
        <div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              color: pill.color,
              background: `color-mix(in srgb, ${pill.color} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${pill.color} 30%, transparent)`,
            }}
          >
            {pill.label}
          </span>
        </div>

        {/* Title */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.4,
            textDecoration: 'none',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </a>

        {/* Description */}
        {item.description && (
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.55,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.description}
          </p>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '2px 6px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '4px' }}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              transition: 'color var(--transition-fast), border-color var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-default)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-secondary)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-subtle)';
            }}
          >
            <ExternalLink size={11} />
            Read
          </a>
          <LikeButton newsId={item.id} initialCount={item.likes} />
          <ShareButton url={item.url} title={item.title} />
          <div style={{ marginLeft: 'auto' }}>
            <SaveButton itemId={`news:${item.id}`} />
          </div>
        </div>
      </div>
    </article>
  );
}
