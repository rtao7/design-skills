'use client';

import { type ReactNode, useState } from 'react';

type ActionButtonProps = {
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
  href?: string;
  title?: string;
  disabled?: boolean;
};

export function ActionButton({ icon, label, onClick, href, title, disabled }: ActionButtonProps) {
  const [hovered, setHovered] = useState(false);
  const isExternal = href ? /^https?:\/\//.test(href) : false;

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: label ? '5px 10px' : '5px 8px',
    borderRadius: 'var(--radius-md)',
    background: !disabled && hovered ? 'var(--color-bg-elevated)' : 'rgba(255,255,255,0.03)',
    border: '1px solid',
    borderColor: !disabled && hovered ? 'var(--color-border-default)' : 'var(--color-border-subtle)',
    color: !disabled && hovered ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
    fontSize: '12px',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  if (href && !disabled) {
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
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
      onClick={disabled ? undefined : onClick}
      title={title}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}
