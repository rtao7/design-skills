'use client';

import { useState } from 'react';
import { ExternalLink, Download, Eye } from 'lucide-react';
import type { Skill } from '@/lib/skills';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { TagBadge } from '@/components/ui/TagBadge';
import { CopyButton } from '@/components/ui/CopyButton';
import { ActionButton } from '@/components/ui/ActionButton';
import { useDetailPanel } from '@/components/overlays/DetailPanelContext';
import { SaveButton } from '@/components/ui/SaveButton';

type SkillCardProps = {
  skill: Skill;
};

function toDisplayCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

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
  const displayCategory = toDisplayCategory(skill.category);
  const skillUrl = `/skills/${skill.category}/${skill.slug}`;

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
        transition: 'transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base)',
        cursor: 'default',
      }}
    >
      {/* Top row: category badge + open link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <CategoryBadge category={displayCategory} />
        <ActionButton
          icon={<ExternalLink size={13} />}
          href={skillUrl}
          title="Open skill"
        />
      </div>

      {/* Skill name — monospace */}
      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: '8px',
          letterSpacing: '-0.01em',
        }}
      >
        {skill.slug}
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

      {/* Tags */}
      {skill.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            marginBottom: '12px',
          }}
        >
          {skill.tags.slice(0, 4).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
