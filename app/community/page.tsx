import { ComingSoonState } from '@/components/ui/ComingSoonState';

export const metadata = {
  title: 'Community — dskill',
  description: 'Designer picks, upvoted by the community.',
};

export default function CommunityPage() {
  return (
    <ComingSoonState
      icon="🔥"
      heading="Community launches soon"
      body="Designer picks, upvoted by the community."
      ctaLabel="Notify me →"
      ctaHref="#"
      backLabel="← Back to Skills"
      backHref="/skills"
    />
  );
}
