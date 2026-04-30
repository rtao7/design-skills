'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

type ShareButtonProps = {
  url: string;
  title: string;
};

export function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available — silently fail
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '5px 10px',
        borderRadius: 'var(--radius-md)',
        background: 'transparent',
        border: '1px solid var(--color-border-subtle)',
        color: 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: 400,
        cursor: 'pointer',
        transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      <span>{copied ? 'Copied!' : 'Share'}</span>
    </button>
  );
}
