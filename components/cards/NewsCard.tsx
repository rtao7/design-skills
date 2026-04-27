'use client';

import { NewsItem } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { SaveButton } from '@/components/ui/SaveButton';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <article
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
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
      {/* Source row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {item.sourceFavicon && (
          <img
            src={item.sourceFavicon}
            alt=""
            width={14}
            height={14}
            style={{ borderRadius: '2px', flexShrink: 0 }}
          />
        )}
        <span
          style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.02em',
          }}
        >
          {item.source}
        </span>
        <span style={{ color: 'var(--color-border-default)', fontSize: '11px' }}>·</span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          {timeAgo(item.publishedAt)}
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
            lineHeight: 1.5,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
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
          {item.tags.map((tag) => (
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
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
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-subtle)',
            transition: 'color var(--transition-fast), border-color var(--transition-fast)',
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
        <SaveButton itemId={`news:${item.id}`} />
      </div>
    </article>
  );
}
