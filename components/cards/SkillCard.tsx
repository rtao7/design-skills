'use client';

import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import type { Skill } from '@/lib/skills';
import { CopyButton } from '@/components/ui/CopyButton';
import { ActionButton } from '@/components/ui/ActionButton';
import { useDetailPanel } from '@/components/overlays/DetailPanelContext';
import { SaveButton } from '@/components/ui/SaveButton';

type SkillCardProps = {
  skill: Skill;
};

function handleDownload(skill: Skill) {
  const blob = new Blob([skill.raw], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${skill.slug}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SkillCard({ skill }: SkillCardProps) {
  const [hovered, setHovered] = useState(false);
  const { openPanel } = useDetailPanel();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openPanel(skill)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openPanel(skill);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Preview ${skill.title}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-surface)',
        border: '1px solid',
        borderColor: hovered ? 'var(--color-accent-primary)' : 'var(--color-border-default)',
        borderRadius: 'var(--radius-card)',
        padding: '16px',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? 'var(--shadow-card-hover)' : '0 1px 0 rgba(255,255,255,0.03)',
        transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)',
        cursor: 'pointer',
      }}
    >
      {/* Skill title */}
      <div
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: '4px',
          letterSpacing: '-0.01em',
          lineHeight: 1.35,
        }}
      >
        {skill.title}
      </div>

      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          marginBottom: '10px',
        }}
      >
        {skill.slug}
      </div>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            flexShrink: 0,
          }}
        >
          A
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Author</span>
      </div>

      {/* Description — 2-line clamp */}
      <p
        style={{
          fontSize: '13px',
          lineHeight: 1.55,
          color: 'var(--color-text-secondary)',
          marginBottom: '14px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {skill.description}
      </p>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: 'var(--color-border-subtle)',
          marginBottom: '12px',
        }}
      />

      {/* Actions */}
      <div
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}
      >
        <CopyButton content={skill.body} />
        <ActionButton
          icon={<Download size={13} />}
          label="Download"
          onClick={() => handleDownload(skill)}
          title="Download as .md"
        />
        <ActionButton
          icon={<Eye size={13} />}
          label="Preview"
          onClick={() => openPanel(skill)}
          title="Preview skill"
        />
        <SaveButton itemId={`skill:${skill.category}/${skill.slug}`} />
      </div>
    </div>
  );
}
