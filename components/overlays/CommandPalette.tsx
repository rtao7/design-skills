'use client';

import { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { Zap, Search, Clock } from 'lucide-react';
import type { Skill } from '@/lib/skills';
import { useCommandPalette } from './CommandPaletteContext';
import { useDetailPanel } from './DetailPanelContext';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

const RECENT_KEY = 'dskill:recent';
const RECENT_MAX = 3;

function toDisplayCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function pushRecent(id: string) {
  const prev = getRecent().filter((r) => r !== id);
  localStorage.setItem(RECENT_KEY, JSON.stringify([id, ...prev].slice(0, RECENT_MAX)));
}

type CommandPaletteProps = {
  allSkills: Skill[];
};

export function CommandPalette({ allSkills }: CommandPaletteProps) {
  const { isOpen, closePalette, openPalette } = useCommandPalette();
  const { openPanel } = useDetailPanel();
  const [query, setQuery] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? closePalette() : openPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, openPalette, closePalette]);

  // Load recents when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setRecentIds(getRecent());
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (skill: Skill) => {
      pushRecent(`${skill.category}/${skill.slug}`);
      closePalette();
      openPanel(skill);
    },
    [closePalette, openPanel],
  );

  const recentSkills = recentIds
    .map((id) => allSkills.find((s) => `${s.category}/${s.slug}` === id))
    .filter(Boolean) as Skill[];

  const showRecent = query.trim() === '' && recentSkills.length > 0;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '16vh',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closePalette}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--color-bg-overlay)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '520px',
          margin: '0 16px',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
        }}
      >
        <Command loop shouldFilter={!showRecent}>
          {/* Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 16px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <Search size={15} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search everything..."
              style={{
                flex: 1,
                padding: '14px 0',
                fontSize: '14px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text-primary)',
              }}
            />
            <kbd
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-muted)',
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              Esc
            </kbd>
          </div>

          {/* Results */}
          <Command.List
            style={{
              maxHeight: '360px',
              overflowY: 'auto',
              padding: '8px',
            }}
          >
            <Command.Empty
              style={{
                padding: '40px 16px',
                textAlign: 'center',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </Command.Empty>

            {/* Recent — shown only when no query */}
            {showRecent && (
              <Command.Group
                heading="Recent"
                style={{ '--cmdk-group-heading-color': 'var(--color-text-muted)' } as React.CSSProperties}
              >
                {recentSkills.map((skill) => (
                  <SkillItem
                    key={`recent-${skill.category}/${skill.slug}`}
                    skill={skill}
                    icon={<Clock size={13} style={{ color: 'var(--color-text-muted)' }} />}
                    onSelect={handleSelect}
                    filterValue={`${skill.slug} ${skill.title} ${skill.description} ${skill.tags.join(' ')}`}
                  />
                ))}
              </Command.Group>
            )}

            {/* Skills */}
            <Command.Group heading="Skills">
              {allSkills.map((skill) => (
                <SkillItem
                  key={`${skill.category}/${skill.slug}`}
                  skill={skill}
                  icon={<Zap size={13} style={{ color: 'var(--color-accent-primary)' }} />}
                  onSelect={handleSelect}
                  filterValue={`${skill.slug} ${skill.title} ${skill.description} ${skill.tags.join(' ')}`}
                />
              ))}
            </Command.Group>

            {/* Coming soon sections */}
            <ComingSoonGroup label="Resources" />
            <ComingSoonGroup label="News" />
          </Command.List>

          {/* Footer hint */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '8px 16px',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
            }}
          >
            <span><kbd style={kbdStyle}>↑↓</kbd> navigate</span>
            <span><kbd style={kbdStyle}>↵</kbd> open</span>
            <span><kbd style={kbdStyle}>Esc</kbd> close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function SkillItem({
  skill,
  icon,
  onSelect,
  filterValue,
}: {
  skill: Skill;
  icon: React.ReactNode;
  onSelect: (skill: Skill) => void;
  filterValue: string;
}) {
  return (
    <Command.Item
      value={filterValue}
      onSelect={() => onSelect(skill)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontSize: '13px',
        color: 'var(--color-text-primary)',
      }}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: '13px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {skill.slug}
      </span>
      <CategoryBadge category={toDisplayCategory(skill.category)} />
    </Command.Item>
  );
}

function ComingSoonGroup({ label }: { label: string }) {
  return (
    <Command.Group heading={label}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px 8px',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          No content yet
        </span>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 500,
            padding: '2px 6px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Coming soon
        </span>
      </div>
    </Command.Group>
  );
}

const kbdStyle: React.CSSProperties = {
  padding: '1px 5px',
  background: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border-subtle)',
  borderRadius: '3px',
  fontFamily: 'inherit',
  fontSize: '10px',
  marginRight: '3px',
};
