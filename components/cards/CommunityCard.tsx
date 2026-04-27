'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { CommunityPost } from '@/lib/types';
import { TagBadge } from '@/components/ui/TagBadge';
import { UpvoteButton } from '@/components/ui/UpvoteButton';
import { SaveButton } from '@/components/ui/SaveButton';
import { ActionButton } from '@/components/ui/ActionButton';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function CommunityCard({ post }: { post: CommunityPost }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-surface)',
        border: '1px solid',
        borderColor: hovered ? 'var(--color-accent-primary)' : 'var(--color-border-subtle)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-card-hover)' : 'none',
        transition:
          'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)',
        cursor: 'default',
      }}
    >
      {/* Author row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt={post.author}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--color-accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 600,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {getInitials(post.author)}
            </div>
          )}
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
            }}
          >
            {post.author}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          {formatDate(post.publishedAt)}
        </span>
      </div>

      {/* Title / description */}
      <p
        style={{
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: 1.5,
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.title}
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {post.tags.slice(0, 4).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <UpvoteButton
          postId={post.id}
          initialCount={post.upvotes}
          initialVoted={post.userHasUpvoted}
        />
        {post.url && (
          <ActionButton
            icon={<ExternalLink size={13} />}
            label="View"
            href={post.url}
            title="Open link"
          />
        )}
        <SaveButton itemId={`community:${post.id}`} />
      </div>
    </div>
  );
}
