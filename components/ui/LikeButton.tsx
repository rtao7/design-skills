'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

type LikeButtonProps = {
  newsId: string;
  initialCount: number;
};

const STORAGE_KEY = 'dskill:news-likes';

function getLikedItems(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); }
  catch { return {}; }
}

function setLikedItem(newsId: string, liked: boolean) {
  const items = getLikedItems();
  if (liked) items[newsId] = true;
  else delete items[newsId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function LikeButton({ newsId, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(() => getLikedItems()[newsId] ?? false);
  const [count, setCount] = useState(initialCount);

  async function handleClick() {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    setLikedItem(newsId, next);

    try {
      const method = next ? 'POST' : 'DELETE';
      const res = await fetch(`/api/news/${newsId}/like`, { method });
      if (!res.ok) throw new Error();
      const { likes } = await res.json();
      setCount(likes);
    } catch {
      setLiked(!next);
      setCount((c) => c + (next ? -1 : 1));
      setLikedItem(newsId, !next);
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={liked ? 'Unlike' : 'Like'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 10px',
        borderRadius: 'var(--radius-md)',
        background: liked ? 'rgba(248,113,113,0.12)' : 'transparent',
        border: '1px solid',
        borderColor: liked ? 'rgba(248,113,113,0.35)' : 'var(--color-border-subtle)',
        color: liked ? 'var(--color-accent-red)' : 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: liked ? 500 : 400,
        cursor: 'pointer',
        transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <Heart
        size={13}
        fill={liked ? 'currentColor' : 'none'}
        style={{ transition: 'transform var(--transition-fast)', transform: liked ? 'scale(1.15)' : 'scale(1)' }}
      />
      <span>{count}</span>
    </button>
  );
}
