'use client';

import { useState } from 'react';
import type { Category } from '@/lib/skills';
import { SkillCard } from './SkillCard';

type SkillsFeedProps = {
  categories: Category[];
  totalCount: number;
};

const ALL_TAB = 'All';

function toDisplayName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function SkillsFeed({ categories, totalCount }: SkillsFeedProps) {
  const [activeTab, setActiveTab] = useState(ALL_TAB);

  // Flatten all skills from categories + their subfolders
  const allSkills = categories.flatMap((cat) => [
    ...cat.skills,
    ...cat.folders.flatMap((f) => f.skills),
  ]);

  const tabs = [
    ALL_TAB,
    ...categories.map((c) => toDisplayName(c.name)),
  ];

  const filtered =
    activeTab === ALL_TAB
      ? allSkills
      : allSkills.filter(
          (s) => toDisplayName(s.category) === activeTab,
        );

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            AI Skills for Designers
          </h1>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(123,97,255,0.12)',
              color: 'var(--color-accent-primary)',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid rgba(123,97,255,0.2)',
            }}
          >
            {totalCount} skills
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          Curated prompts and workflows to level up your design process.
        </p>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--color-border-subtle)',
          paddingBottom: '0',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '7px 14px',
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: isActive
                  ? '2px solid var(--color-accent-primary)'
                  : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color var(--transition-fast), border-color var(--transition-fast)',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Responsive grid: 1-col mobile → 2-col tablet+ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {filtered.map((skill) => (
          <SkillCard key={`${skill.category}-${skill.slug}`} skill={skill} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            padding: '64px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
          }}
        >
          No skills in this category yet.
        </div>
      )}
    </div>
  );
}
