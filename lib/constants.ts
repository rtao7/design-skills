export const CATEGORY_COLORS = {
  Product:      { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', dot: '#F59E0B' },
  Design:       { bg: 'rgba(56,189,248,0.12)',  text: '#38BDF8', dot: '#38BDF8' },
  Handoff:      { bg: 'rgba(248,113,113,0.12)', text: '#F87171', dot: '#F87171' },
  Presentation: { bg: 'rgba(139,144,160,0.10)', text: '#8B90A0', dot: '#8B90A0' },
  Tool:         { bg: 'rgba(245,158,11,0.12)',  text: '#F59E0B', dot: '#F59E0B' },
  Article:      { bg: 'rgba(56,189,248,0.12)',  text: '#38BDF8', dot: '#38BDF8' },
  Plugin:       { bg: 'rgba(45,212,191,0.12)',  text: '#2DD4BF', dot: '#2DD4BF' },
  Inspiration:  { bg: 'rgba(244,114,182,0.12)', text: '#F472B6', dot: '#F472B6' },
} as const;

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  status: 'live' | 'coming-soon';
};

export const NAV_DISCOVER: NavItem[] = [
  { label: 'Skills',     href: '/skills',     icon: '⚡', status: 'live' },
  { label: 'Resources',  href: '/resources',  icon: '🗂️', status: 'coming-soon' },
  { label: 'Community',  href: '/community',  icon: '🔥', status: 'coming-soon' },
  { label: 'Agents',     href: '/agents',     icon: '🤖', status: 'coming-soon' },
  { label: 'Jobs',       href: '/jobs',       icon: '💼', status: 'coming-soon' },
];

export const NAV_LIBRARY: NavItem[] = [
  { label: 'Saved',      href: '/saved',      icon: '⭐', status: 'live' },
];
