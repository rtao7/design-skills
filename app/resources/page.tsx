import { ComingSoonState } from '@/components/ui/ComingSoonState';

export const metadata = {
  title: 'Resources — dskill',
  description: 'Design tools, articles, Figma plugins, and UI inspiration.',
};

export default function ResourcesPage() {
  return (
    <ComingSoonState
      icon="🗂️"
      heading="Resources are coming"
      body="Tools, articles, Figma plugins, and UI inspiration — all in one place."
      ctaLabel="Notify me →"
      ctaHref="#"
      backLabel="← Back to Skills"
      backHref="/skills"
    />
  );
}
