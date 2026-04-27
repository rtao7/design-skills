import type { FeedItem } from '@/lib/types';
import { CommunityCard } from './CommunityCard';

/**
 * Unified renderer — dispatches to the correct card by item.type.
 * ResourceCard and NewsCard will be added in Phase 5+ once those
 * content types are live.
 */
export function FeedCard({ item }: { item: FeedItem }) {
  switch (item.type) {
    case 'community':
      return <CommunityCard post={item} />;
    default:
      return null;
  }
}
