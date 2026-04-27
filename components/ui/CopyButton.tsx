'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 10px',
        borderRadius: 'var(--radius-md)',
        background: copied ? 'rgba(61,214,140,0.12)' : 'transparent',
        border: '1px solid',
        borderColor: copied ? 'rgba(61,214,140,0.3)' : 'var(--color-border-subtle)',
        color: copied ? 'var(--color-accent-secondary)' : 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: 400,
        cursor: 'pointer',
        transition: 'background var(--transition-base), border-color var(--transition-base), color var(--transition-base)',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}
