'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Download, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDetailPanel } from './DetailPanelContext';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import type { Skill } from '@/lib/skills';

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

const SKILL_SUMMARIES: Record<string, { summary: string; items: string[] }> = {
  'pm-thinking-coach': {
    summary:
      'This skill acts like a PM thought partner for early, ambiguous product work. It helps a designer move from a loose idea to a clearer problem, audience, opportunity, and direction.',
    items: [
      'Asks focused PM-style questions about users, outcomes, constraints, and assumptions',
      'Maps opportunities before jumping into feature ideas',
      'Produces a session brief the designer can use for validation, stories, or planning',
    ],
  },
  'idea-validator': {
    summary:
      'This skill pressure-tests a rough product idea before design starts. It checks whether the user, job-to-be-done, proposed direction, and differentiation actually hold together.',
    items: [
      'Tests user-direction fit and whether the idea solves the right problem',
      'Identifies the riskiest assumptions and the cheapest way to test them',
      'Ends with a clear verdict: proceed, proceed with conditions, or rethink the direction',
    ],
  },
  'feature-story-writer': {
    summary:
      'This skill turns a validated product direction into plain-language user stories a designer can actually design from.',
    items: [
      'Breaks an epic into scoped story titles before writing details',
      'Writes persona-based stories with JTBD, acceptance criteria, and assumptions',
      'Keeps the output readable for non-technical stakeholders and design handoff',
    ],
  },
  'story-to-prd': {
    summary:
      'This skill converts validated stories and product context into a structured PRD that engineers, stakeholders, or coding agents can pick up.',
    items: [
      'Synthesizes stories, validation notes, personas, goals, and scope boundaries',
      'Defines requirements, success metrics, edge cases, and acceptance criteria',
      'Creates a clean product document without inventing new decisions',
    ],
  },
  'product-design-critiquer': {
    summary:
      'This skill gives senior product design critique for screenshots, wireframes, or described flows, grounded in user goals rather than personal taste.',
    items: [
      'Reviews clarity, usability, hierarchy, consistency, and edge states',
      'Explains what is not working, why it matters, and how to improve it',
      'Prioritizes the top fixes and calls out what is already working well',
    ],
  },
};

function getExampleOutput(skill: Skill) {
  const category = toDisplayCategory(skill.category);
  const primaryTag = skill.tags[0] ?? category.toLowerCase();
  const description = skill.description.replace(/\s+/g, ' ').trim();
  const mapped = SKILL_SUMMARIES[skill.slug];

  if (mapped) return mapped;

  if (skill.category === 'product') {
    return {
      summary: description || `This skill helps turn product context into a practical ${primaryTag} workflow.`,
      items: [
        'Clarifies the user problem, audience, and decision context',
        'Shapes messy product thinking into design-ready structure',
        'Surfaces assumptions, next steps, and concrete outputs to work from',
      ],
    };
  }

  if (skill.category === 'design') {
    return {
      summary: description || `This skill helps evaluate and improve design work with concrete ${primaryTag} guidance.`,
      items: [
        'Reviews the design through a focused product-design lens',
        'Turns critique into specific layout, hierarchy, or interaction guidance',
        'Highlights the most useful improvement to try next',
      ],
    };
  }

  return {
    summary: description || `This skill helps with ${category.toLowerCase()} work by structuring the response into a useful output.`,
    items: [
      `Applies the ${primaryTag} workflow to the user's context`,
      'Organizes the response into clear, reusable sections',
      'Ends with practical next steps',
    ],
  };
}

function ExampleOutput({ skill }: { skill: Skill }) {
  const example = getExampleOutput(skill);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(skill.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      const el = document.createElement('textarea');
      el.value = skill.body;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <section
      aria-label="Example output simulation"
      style={{
        padding: '16px',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-card)',
        background: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div
          className="detail-chat-bubble detail-chat-bubble-user"
          style={{
            alignSelf: 'flex-end',
            maxWidth: '76%',
            padding: '9px 12px',
            borderRadius: '14px 14px 4px 14px',
            background: 'var(--color-accent-primary)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: 1.45,
          }}
        >
          What does this do?
        </div>
        <div
          className="detail-chat-bubble detail-chat-bubble-ai"
          style={{
            alignSelf: 'flex-start',
            maxWidth: '92%',
            padding: '12px',
            borderRadius: '14px 14px 14px 4px',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-secondary)',
            fontSize: '12px',
            lineHeight: 1.6,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(123,97,255,0.16)',
                border: '1px solid rgba(123,97,255,0.32)',
                color: 'var(--color-accent-primary)',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              AI
            </span>
            <span
              style={{
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              AI Agent
            </span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            {example.summary}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {example.items.map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--color-accent-primary)',
                    marginTop: '8px',
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="detail-chat-bubble detail-chat-bubble-ai"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            animationDelay: '1040ms',
          }}
        >
          <SuggestedPromptButton
            icon={copied ? <Check size={13} /> : <Copy size={13} />}
            label={copied ? 'Copied skill prompt' : 'Copy skill prompt'}
            onClick={handleCopy}
          />
          <SuggestedPromptButton
            icon={<Download size={13} />}
            label="Download markdown"
            onClick={() => handleDownload(skill.slug, skill.raw)}
          />
        </div>
      </div>
    </section>
  );
}

function SuggestedPromptButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 10px',
        borderRadius: 'var(--radius-pill)',
        background: hovered ? 'var(--color-bg-elevated)' : 'rgba(255,255,255,0.03)',
        border: '1px solid',
        borderColor: hovered ? 'var(--color-border-default)' : 'var(--color-border-subtle)',
        color: hovered ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
      }}
    >
      {icon}
      {label}
    </button>
  );
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

          <div style={{ padding: '16px 20px 0' }}>
            <ExampleOutput skill={skill} />
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
