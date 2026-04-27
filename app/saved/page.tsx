import { EmptyState } from '@/components/ui/EmptyState';

export const metadata = {
  title: 'Saved — dskill',
  description: 'Your saved skills and resources.',
};

export default function SavedPage() {
  return (
    <EmptyState
      icon="⭐"
      heading="Nothing saved yet"
      body="Browse skills and save what you'll want to come back to."
      ctaLabel="Browse Skills →"
      ctaHref="/skills"
    />
  );
}
