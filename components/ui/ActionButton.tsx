'use client';

import { type ReactNode, useState } from 'react';

type ActionButtonProps = {
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
  href?: string;
  title?: string;
};

export function ActionButton({ icon, label, onClick, href, title }: ActionButtonProps) {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: label ? '5px 10px' : '5px 8px',
    borderRadius: 'var(--radius-md)',
    background: hovered ? 'var(--color-bg-elevated)' : 'transparent',
    border: '1px solid',
    borderColor: hovered ? 'var(--color-border-default)' : 'var(--color-border-subtle)',
    color: hovered ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    fontSize: '12px',
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        title={title}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {icon}
        {label && <span>{label}</span>}
      </a>
    );
  }

  return (
    <button
      style={style}
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
