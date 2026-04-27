import { ComingSoonState } from '@/components/ui/ComingSoonState';

export const metadata = {
  title: 'News — dskill',
  description: 'Design news and trends from the best publications.',
};

export default function NewsPage() {
  return (
    <ComingSoonState
      icon="📰"
      heading="Design news is on its way"
      body="Curated picks + RSS feeds from the best design publications."
      ctaLabel="Notify me →"
      ctaHref="#"
      backLabel="← Back to Skills"
      backHref="/skills"
    />
  );
}
