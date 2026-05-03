'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

type SaveButtonProps = {
  itemId: string;    // e.g. "skill:product/feature-story-writer"
  initialSaved?: boolean;
};

const STORAGE_KEY = 'dskill:saves';

function getSavedItems(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function toggleSavedItem(itemId: string, save: boolean) {
  const saved = getSavedItems();
  const next = save
    ? [...new Set([...saved, itemId])]
    : saved.filter((id) => id !== itemId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function SaveButton({ itemId, initialSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(() => {
    if (typeof window !== 'undefined') {
      return getSavedItems().includes(itemId);
    }
    return initialSaved;
  });
  const [hovered, setHovered] = useState(false);

  function handleClick() {
    const next = !saved;
    setSaved(next);
    toggleSavedItem(itemId, next);
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={saved ? 'Remove from saved' : 'Save'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 10px',
        borderRadius: 'var(--radius-md)',
        background: saved
          ? 'rgba(123,97,255,0.12)'
          : hovered
          ? 'var(--color-bg-elevated)'
          : 'rgba(255,255,255,0.03)',
        border: '1px solid',
        borderColor: saved
          ? 'rgba(123,97,255,0.3)'
          : hovered
          ? 'var(--color-border-default)'
          : 'var(--color-border-subtle)',
        color: saved
          ? 'var(--color-accent-primary)'
          : hovered
          ? 'var(--color-text-primary)'
          : 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        transition:
          'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
        whiteSpace: 'nowrap',
      }}
    >
      {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
