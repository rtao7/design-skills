'use client';

import { useState } from 'react';
import { ChevronUp } from 'lucide-react';

type UpvoteButtonProps = {
  postId: string;
  initialCount: number;
  initialVoted?: boolean;
};

const STORAGE_KEY = 'dskill:upvotes';

function getStoredVotes(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function setStoredVote(postId: string, voted: boolean) {
  const votes = getStoredVotes();
  if (voted) {
    votes[postId] = true;
  } else {
    delete votes[postId];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
}

export function UpvoteButton({ postId, initialCount, initialVoted = false }: UpvoteButtonProps) {
  const [voted, setVoted] = useState(() => {
    // Hydrate from localStorage on first render
    if (typeof window !== 'undefined') {
      return getStoredVotes()[postId] ?? initialVoted;
    }
    return initialVoted;
  });
  const [count, setCount] = useState(initialCount);
  const [hovered, setHovered] = useState(false);

  function handleClick() {
    const next = !voted;
    setVoted(next);
    setCount((c) => c + (next ? 1 : -1));
    setStoredVote(postId, next);
  }

  const isAmber = voted || hovered;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={voted ? 'Remove upvote' : 'Upvote'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 10px',
        borderRadius: 'var(--radius-md)',
        background: voted
          ? 'rgba(245,158,11,0.15)'
          : hovered
          ? 'rgba(245,158,11,0.08)'
          : 'transparent',
        border: '1px solid',
        borderColor: voted
          ? 'rgba(245,158,11,0.35)'
          : hovered
          ? 'rgba(245,158,11,0.2)'
          : 'var(--color-border-subtle)',
        color: isAmber ? 'var(--color-accent-warm)' : 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: voted ? 500 : 400,
        cursor: 'pointer',
        transition:
          'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <ChevronUp
        size={13}
        style={{
          transform: voted ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform var(--transition-fast)',
        }}
      />
      <span>{count}</span>
    </button>
  );
}
