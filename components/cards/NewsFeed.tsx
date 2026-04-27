'use client';

import { useState } from 'react';
import { NewsItem } from '@/lib/types';
import { NewsCard } from './NewsCard';

const ALL = 'All';

interface NewsFeedProps {
  items: NewsItem[];
}

export function NewsFeed({ items }: NewsFeedProps) {
  const sources = [ALL, ...Array.from(new Set(items.map((i) => i.source)))];
  const [active, setActive] = useState(ALL);

  const filtered = active === ALL ? items : items.filter((i) => i.source === active);

  return (
    <div>
      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        {sources.map((source) => {
          const isActive = source === active;
          return (
            <button
              key={source}
              onClick={() => setActive(source)}
              style={{
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                border: `1px solid ${isActive ? 'var(--color-accent-primary)' : 'var(--color-border-subtle)'}`,
                background: isActive ? 'rgba(123,97,255,0.12)' : 'transparent',
                color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {source}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 0',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
          }}
        >
          No stories yet.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px',
          }}
        >
          {filtered.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
