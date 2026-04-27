'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDetailPanel } from './DetailPanelContext';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { CopyButton } from '@/components/ui/CopyButton';
import { ActionButton } from '@/components/ui/ActionButton';
import { Download } from 'lucide-react';

function toDisplayCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function handleDownload(slug: string, raw: string) {
  const blob = new Blob([raw], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DetailPanel() {
  const { isOpen, skill, closePanel } = useDetailPanel();

  // Esc key handler
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closePanel]);

  return (
    <div
      aria-hidden={!isOpen}
      style={{
        position: 'fixed',
        top: 'var(--topbar-height)',
        right: 0,
        bottom: 0,
        width: '480px',
        background: 'var(--color-bg-surface)',
        borderLeft: '1px solid var(--color-border-default)',
        boxShadow: 'var(--shadow-panel)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 30,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform var(--transition-slow)',
        overflowY: 'auto',
      }}
    >
      {skill && (
        <>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '20px 20px 16px',
              borderBottom: '1px solid var(--color-border-subtle)',
              position: 'sticky',
              top: 0,
              background: 'var(--color-bg-surface)',
              zIndex: 1,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: '8px' }}>
                <CategoryBadge category={toDisplayCategory(skill.category)} />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono), monospace',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                }}
              >
                {skill.slug}
              </div>
            </div>

            <button
              onClick={closePanel}
              aria-label="Close panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                flexShrink: 0,
                marginLeft: '12px',
                transition: 'background var(--transition-fast), color var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-elevated)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '14px 20px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <CopyButton content={skill.body} />
            <ActionButton
              icon={<Download size={13} />}
              label="Download"
              onClick={() => handleDownload(skill.slug, skill.raw)}
              title="Download as .md"
            />
          </div>

          {/* Markdown content */}
          <div style={{ padding: '20px', flex: 1 }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginTop: '24px',
                    marginBottom: '8px',
                    lineHeight: 1.4,
                  }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: '20px',
                    marginBottom: '8px',
                  }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginTop: '16px',
                    marginBottom: '6px',
                  }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p style={{
                    fontSize: '13px',
                    lineHeight: 1.65,
                    color: 'var(--color-text-secondary)',
                    marginBottom: '12px',
                  }}>
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul style={{
                    paddingLeft: '18px',
                    marginBottom: '12px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '13px',
                  }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol style={{
                    paddingLeft: '18px',
                    marginBottom: '12px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '13px',
                  }}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: '4px', lineHeight: 1.55 }}>{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: '2px solid var(--color-accent-primary)',
                    paddingLeft: '12px',
                    margin: '12px 0',
                    color: 'var(--color-text-muted)',
                    fontStyle: 'italic',
                    fontSize: '13px',
                  }}>
                    {children}
                  </blockquote>
                ),
                pre: ({ children }) => (
                  <pre style={{
                    background: 'var(--color-bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    overflowX: 'auto',
                    margin: '12px 0',
                    fontSize: '12px',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    lineHeight: 1.6,
                    border: '1px solid var(--color-border-subtle)',
                  }}>
                    {children}
                  </pre>
                ),
                code: ({ className, children }) => {
                  const isBlock = !!className;
                  return isBlock ? (
                    <code style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>{children}</code>
                  ) : (
                    <code style={{
                      background: 'var(--color-bg-elevated)',
                      padding: '2px 5px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      color: 'var(--color-accent-blue)',
                    }}>
                      {children}
                    </code>
                  );
                },
                hr: () => (
                  <hr style={{
                    border: 'none',
                    borderTop: '1px solid var(--color-border-subtle)',
                    margin: '20px 0',
                  }} />
                ),
                strong: ({ children }) => (
                  <strong style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {children}
                  </strong>
                ),
              }}
            >
              {skill.body}
            </ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}
